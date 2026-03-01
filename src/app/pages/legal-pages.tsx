import { ArrowLeft } from 'lucide-react';
import logo from '../../assets/kubiceng-logo.png';

interface LegalPageProps {
  onBack: () => void;
}

function LegalHeader({ title, subtitle, onBack }: { title: string; subtitle: string; onBack: () => void }) {
  return (
    <>
      <header className="fixed top-0 w-full bg-[#04111e]/95 backdrop-blur-md border-b border-white/5 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <img src={logo} alt="KubicEng" className="h-6 w-auto" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-white">Kubic</span><span className="text-blue-400">Eng</span>
            </span>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>
      </header>

      <div className="pt-32 pb-6 px-6 border-b border-white/5">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
      </div>
    </>
  );
}

// ============================================================
// TERMOS DE USO
// ============================================================
export function TermosDeUsoPage({ onBack }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-[#04111e] text-gray-300">
      <LegalHeader title="Termos de Uso" subtitle="Última atualização: 1 de março de 2026" onBack={onBack} />
      <div className="container mx-auto max-w-3xl px-6 py-12 space-y-10 text-sm leading-relaxed">

        <section>
          <h2 className="text-white text-lg font-semibold mb-3">1. Aceitação dos Termos</h2>
          <p>Ao acessar ou utilizar a plataforma KubicEng, desenvolvida e mantida pela <strong className="text-white">Synapse Code Dev</strong>, você concorda com estes Termos de Uso. Caso não concorde, não utilize a plataforma.</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-semibold mb-3">2. Descrição do Serviço</h2>
          <p>O KubicEng é um sistema de gestão para construtoras que oferece módulos de Engenharia, Execução, Financeiro, Pessoas, Suprimentos e Comercial. O acesso é fornecido mediante assinatura de um dos planos disponíveis (Start, Pro, Business ou Personalizado).</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-semibold mb-3">3. Cadastro e Conta</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>O usuário deve fornecer informações verdadeiras e atualizadas no cadastro.</li>
            <li>É responsabilidade do usuário manter a confidencialidade de suas credenciais de acesso.</li>
            <li>Uma conta não pode ser compartilhada com terceiros sem autorização expressa.</li>
            <li>O uso do plano Pro com período de teste gratuito é limitado a 1 (um) uso por CPF ou CNPJ.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white text-lg font-semibold mb-3">4. Uso Permitido</h2>
          <p className="mb-2">Você concorda em utilizar a plataforma exclusivamente para fins lícitos e relacionados à gestão de obras e construtoras. É proibido:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>Realizar engenharia reversa ou tentar extrair o código-fonte da plataforma.</li>
            <li>Utilizar a plataforma para fins ilegais, fraudulentos ou que violem direitos de terceiros.</li>
            <li>Inserir dados falsos, maliciosos ou que prejudiquem a integridade do sistema.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white text-lg font-semibold mb-3">5. Pagamento e Cancelamento</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>As assinaturas são cobradas mensalmente ou anualmente, conforme o plano escolhido.</li>
            <li>O cancelamento pode ser feito a qualquer momento, sem multa, com efeito ao final do período pago.</li>
            <li>Não há reembolso de valores já cobrados, exceto em casos previstos em lei.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white text-lg font-semibold mb-3">6. Propriedade Intelectual</h2>
          <p>Todo o conteúdo, código, marcas e design da plataforma KubicEng são propriedade da Synapse Code Dev. É vedada qualquer reprodução sem autorização prévia por escrito.</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-semibold mb-3">7. Limitação de Responsabilidade</h2>
          <p>A Synapse Code Dev não se responsabiliza por danos indiretos, incidentais ou consequentes decorrentes do uso ou incapacidade de uso da plataforma, incluindo perda de dados ou lucros cessantes.</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-semibold mb-3">8. Alterações nos Termos</h2>
          <p>Reservamos o direito de modificar estes Termos a qualquer momento. Alterações significativas serão comunicadas por e-mail com antecedência mínima de 10 dias.</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-semibold mb-3">9. Contato</h2>
          <p>Para dúvidas sobre estes Termos, entre em contato pelo e-mail <span className="text-blue-400">contato.synapsecode@gmail.com</span> ou pelo WhatsApp <span className="text-blue-400">(11) 94248-8814</span>.</p>
        </section>
      </div>
    </div>
  );
}

// ============================================================
// POLÍTICA DE PRIVACIDADE
// ============================================================
export function PoliticaPrivacidadePage({ onBack }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-[#04111e] text-gray-300">
      <LegalHeader title="Política de Privacidade" subtitle="Última atualização: 1 de março de 2026" onBack={onBack} />
      <div className="container mx-auto max-w-3xl px-6 py-12 space-y-10 text-sm leading-relaxed">

        <section>
          <h2 className="text-white text-lg font-semibold mb-3">1. Controlador de Dados</h2>
          <p>A <strong className="text-white">Synapse Code Dev</strong> atua como controladora dos dados pessoais coletados na plataforma KubicEng, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-semibold mb-3">2. Dados Coletados</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li><strong className="text-gray-300">Dados de cadastro:</strong> nome, e-mail, CPF/CNPJ, telefone.</li>
            <li><strong className="text-gray-300">Dados de uso:</strong> logs de acesso, módulos utilizados, dados inseridos na plataforma (projetos, funcionários, financeiro, etc.).</li>
            <li><strong className="text-gray-300">Dados técnicos:</strong> endereço IP, tipo de navegador, sistema operacional.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white text-lg font-semibold mb-3">3. Finalidade do Tratamento</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>Provisão e melhoria dos serviços da plataforma.</li>
            <li>Comunicação sobre atualizações, cobranças e suporte.</li>
            <li>Cumprimento de obrigações legais e regulatórias.</li>
            <li>Análise de uso para aprimoramento da experiência do usuário.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white text-lg font-semibold mb-3">4. Compartilhamento de Dados</h2>
          <p className="mb-2">Seus dados não são vendidos a terceiros. Podemos compartilhá-los com:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>Processadores de pagamento (para fins de cobrança).</li>
            <li>Infraestrutura de hospedagem (Vercel, Neon) — sujeitos a contratos de processamento de dados.</li>
            <li>Autoridades públicas, quando exigido por lei.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white text-lg font-semibold mb-3">5. Segurança</h2>
          <p>Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados, incluindo criptografia em trânsito (HTTPS/TLS), banco de dados com acesso restrito e backups automáticos.</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-semibold mb-3">6. Direitos do Titular</h2>
          <p className="mb-2">Nos termos da LGPD, você tem direito a:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>Confirmar a existência de tratamento dos seus dados.</li>
            <li>Acessar, corrigir ou solicitar a portabilidade dos seus dados.</li>
            <li>Solicitar a eliminação de dados desnecessários.</li>
            <li>Revogar o consentimento a qualquer momento.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white text-lg font-semibold mb-3">7. Retenção de Dados</h2>
          <p>Os dados são mantidos pelo período de vigência do contrato e pelo prazo legal aplicável (em geral, 5 anos após o encerramento da conta).</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-semibold mb-3">8. Contato do DPO</h2>
          <p>Solicitações relacionadas à privacidade podem ser enviadas para <span className="text-blue-400">contato.synapsecode@gmail.com</span> com o assunto "Privacidade de Dados".</p>
        </section>
      </div>
    </div>
  );
}

// ============================================================
// LGPD
// ============================================================
export function LgpdPage({ onBack }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-[#04111e] text-gray-300">
      <LegalHeader title="LGPD — Lei Geral de Proteção de Dados" subtitle="Como o KubicEng se adequa à Lei nº 13.709/2018" onBack={onBack} />
      <div className="container mx-auto max-w-3xl px-6 py-12 space-y-10 text-sm leading-relaxed">

        <section>
          <h2 className="text-white text-lg font-semibold mb-3">O que é a LGPD?</h2>
          <p>A Lei Geral de Proteção de Dados (Lei nº 13.709/2018) é a legislação brasileira que regula o tratamento de dados pessoais por pessoas físicas ou jurídicas, em meios digitais ou físicos. Ela estabelece direitos para os titulares de dados e deveres para as organizações que os tratam.</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-semibold mb-3">Como o KubicEng trata seus dados</h2>
          <div className="grid grid-cols-1 gap-4">
            {[
              { titulo: 'Finalidade', desc: 'Coletamos apenas os dados necessários para a prestação dos serviços de gestão de obras.' },
              { titulo: 'Necessidade', desc: 'O tratamento é limitado ao mínimo necessário para atingir as finalidades informadas.' },
              { titulo: 'Transparência', desc: 'Informamos de forma clara quais dados são coletados e como são utilizados.' },
              { titulo: 'Segurança', desc: 'Adotamos medidas técnicas e administrativas para proteger seus dados de acessos não autorizados.' },
              { titulo: 'Consentimento', desc: 'O tratamento de dados está baseado no consentimento e na execução contratual.' },
              { titulo: 'Responsabilização', desc: 'Mantemos registros de tratamento e estamos preparados para demonstrar conformidade com a LGPD.' },
            ].map(item => (
              <div key={item.titulo} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                <h3 className="text-white font-medium mb-1">{item.titulo}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-white text-lg font-semibold mb-3">Bases Legais Utilizadas</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li><strong className="text-gray-300">Consentimento (Art. 7º, I):</strong> para comunicações de marketing.</li>
            <li><strong className="text-gray-300">Execução de contrato (Art. 7º, V):</strong> para provisão do serviço contratado.</li>
            <li><strong className="text-gray-300">Obrigação legal (Art. 7º, II):</strong> para cumprimento de requisitos fiscais e regulatórios.</li>
            <li><strong className="text-gray-300">Legítimo interesse (Art. 7º, IX):</strong> para análise de uso e segurança da plataforma.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white text-lg font-semibold mb-3">Seus Direitos como Titular</h2>
          <div className="space-y-3">
            {[
              ['Acesso', 'Solicitar cópia dos dados que temos sobre você.'],
              ['Correção', 'Solicitar a correção de dados incompletos ou desatualizados.'],
              ['Eliminação', 'Solicitar a exclusão de dados desnecessários ou tratados em desconformidade.'],
              ['Portabilidade', 'Receber seus dados em formato legível por máquina.'],
              ['Revogação', 'Revogar o consentimento dado para o tratamento de dados.'],
              ['Oposição', 'Opor-se ao tratamento de dados realizado com base em legítimo interesse.'],
            ].map(([titulo, desc]) => (
              <div key={titulo} className="flex gap-3">
                <span className="text-blue-400 font-semibold w-28 shrink-0">{titulo}</span>
                <span className="text-gray-500">{desc}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-white text-lg font-semibold mb-3">Como Exercer seus Direitos</h2>
          <p>Envie um e-mail para <span className="text-blue-400">contato.synapsecode@gmail.com</span> com o assunto <strong className="text-white">"Direitos LGPD"</strong> identificando o direito que deseja exercer. Responderemos em até 15 dias úteis.</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-semibold mb-3">Autoridade Nacional</h2>
          <p>Caso entenda que seus direitos foram violados, você pode registrar uma reclamação na <strong className="text-white">Autoridade Nacional de Proteção de Dados (ANPD)</strong> em <span className="text-blue-400">www.gov.br/anpd</span>.</p>
        </section>
      </div>
    </div>
  );
}
