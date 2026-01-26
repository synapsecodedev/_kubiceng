# Integração de Pagamentos - ASAAS

Este documento descreve o plano técnico para integração do gateway de pagamentos ASAAS no KubicEng. A integração permitirá a assinatura automatizada dos planos (Start, Pro, Business).

## 1. Visão Geral

Utilizaremos a API v3 do ASAAS para gerenciar assinaturas recorrentes via Cartão de Crédito e PIX.

-   **Ambiente de Homologação**: `https://sandbox.asaas.com/api/v3`
-   **Ambiente de Produção**: `https://www.asaas.com/api/v3`
-   **Autenticação**: API Key enviada no header `access_token`.

## 2. Fluxo de Contratação (Frontend)

1.  **Seleção do Plano**: Usuário escolhe Start, Pro ou Business na Landing Page.
2.  **Cadastro/Login**: Usuário cria conta ou faz login.
3.  **Checkout**:
    -   Se for **Plano Personalizado**: Redireciona para contato comercial (WhatsApp/Email).
    -   Se for **Outros Planos**: Abre modal de pagamento.
4.  **Pagamento**:
    -   Usuário informa dados do Cartão ou gera QR Code PIX.
    -   Frontend envia dados para nosso Backend (NUNCA envie direto para o ASAAS do front para não expor chaves, exceto se usar tokenização do front).
    -   *Recomendação*: Coletar dados no front, enviar para nosso Backend, e nosso Backend comunica com ASAAS.

## 3. Arquitetura Backend (Node.js/Fastify)

### 3.1. Novos Endpoints

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `POST` | `/api/payment/subscribe` | Cria um novo cliente e uma assinatura no ASAAS. |
| `GET` | `/api/payment/status` | Verifica o status da assinatura do usuário logado. |
| `POST` | `/api/payment/webhook` | Recebe notificações do ASAAS (pagamento confirmado, falha, etc.). |

### 3.2. Modelo de Dados (Sugestão Prisma)

Adicionar tabela `Subscription`:

```prisma
model Subscription {
  id             String   @id @default(uuid())
  userId         String
  user           User     @relation(fields: [userId], references: [id])
  asaasCustomerId String? // ID do cliente no ASAAS
  asaasSubscriptionId String? // ID da assinatura no ASAAS
  status         String   // ACTIVE, PENDING, OVERDUE, CANCELED
  plan           String   // START, PRO, BUSINESS
  cycle          String   // MONTHLY, YEARLY
  nextDueDate    DateTime?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

### 3.3. Implementação da Rota `/subscribe`

```typescript
// Exemplo conceitual
fastify.post('/payment/subscribe', async (request, reply) => {
  const { plan, billingCycle, creditCardInfo, billingInfo } = request.body;
  const user = request.user; // Do middleware de auth

  // 1. Criar/Recuperar Cliente no ASAAS
  let customerId = user.asaasCustomerId;
  if (!customerId) {
    const asaasCustomer = await asaasApi.post('/customers', {
      name: user.name,
      cpfCnpj: user.document,
      email: user.email
    });
    customerId = asaasCustomer.id;
    // Atualizar user no banco local
  }

  // 2. Criar Assinatura
  const subscription = await asaasApi.post('/subscriptions', {
    customer: customerId,
    billingType: creditCardInfo ? 'CREDIT_CARD' : 'PIX',
    value: getPlanPrice(plan, billingCycle),
    nextDueDate: new Date(), // Cobrar agora
    cycle: billingCycle === 'annual' ? 'YEARLY' : 'MONTHLY',
    creditCard: creditCardInfo // Se for cartão
  });

  // 3. Salvar referência local
  await prisma.subscription.create({ ... });
  
  return subscription;
});
```

## 4. Webhooks (Fundamental)

O ASAAS notificará nosso sistema quando um pagamento ocorrer. Isso garante que a conta seja ativada mesmo se o usuário fechar a tela.

**Configuração no Painel ASAAS**:
-   URL: `https://api.kubiceng.com.br/api/payment/webhook`
-   Eventos: `PAYMENT_CONFIRMED`, `PAYMENT_OVERDUE`, `SUBSCRIPTION_DELETED`.

**Tratamento no Backend**:

```typescript
fastify.post('/payment/webhook', async (request, reply) => {
  const { event, payment } = request.body;

  /* Validar token de autenticação do webhook para segurança */

  if (event === 'PAYMENT_CONFIRMED') {
    // Buscar usuário pelo asaasCustomerId e ativar assinatura
    await prisma.subscription.update({
      where: { asaasSubscriptionId: payment.subscription },
      data: { status: 'ACTIVE' }
    });
  } else if (event === 'PAYMENT_OVERDUE') {
    // Bloquear acesso ou notificar
  }

  return { received: true };
});
```

## 5. Segurança

1.  **Chave de API**: Armazenar em varável de ambiente `ASAAS_API_KEY`. Nunca comitar no Git.
2.  **Dados de Cartão**: O ASAAS recomenda tokenização, mas se trafegar dados, garantir SSL/TLS ponta a ponta.
3.  **Idempotência**: O webhook pode enviar o mesmo evento duas vezes. O backend deve estar preparado para não duplicar ações.

## 6. Próximos Passos para Implantação

1.  [ ] Criar conta no ASAAS Sandbox.
2.  [ ] Implementar model `Subscription` no Prisma.
3.  [ ] Desenvolver serviços de integração (`src/services/asaas.ts`).
4.  [ ] Criar tela de Checkout no Frontend.
5.  [ ] Testar fluxo completo no Sandbox.
6.  [ ] Virar chave para Produção.
