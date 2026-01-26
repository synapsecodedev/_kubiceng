import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

// Mock scrollIntoView since jsdom doesn't support it
window.HTMLElement.prototype.scrollIntoView = function() {};

describe('System Navigation Flow', () => {
  test('Starts on Landing Page and navigates to Dashboard then Logout', async () => {
    render(<App />);

    // 1. Check if Landing Page is visible
    expect(screen.getByText(/Transforme a Gestão da sua Construtora/i)).toBeInTheDocument();
    expect(screen.getByText(/Entrar/i)).toBeInTheDocument();

    // 2. Perform Login (Simulate clicking "Entrar" opens modal)
    const loginButtons = screen.getAllByText(/^Entrar$/i);
    fireEvent.click(loginButtons[0]);

    // Check if Login Modal opened
    expect(await screen.findByText(/Acesse sua Conta/i)).toBeInTheDocument();

    // Fill credentials (mock)
    const accessPanelButton = screen.getByText(/Acessar Painel/i);
    fireEvent.click(accessPanelButton);
    
    // 3. Verify Dashboard is visible
    // We look for Sidebar elements like "Dashboard" or "Engenharia"
    const dashboardElements = await screen.findAllByText(/Visão Geral/i);
    expect(dashboardElements[0]).toBeInTheDocument();
    
    // 4. Perform Logout
    const logoutButton = screen.getByText(/Sair do Sistema/i);
    fireEvent.click(logoutButton);

    // 5. Verify back to Landing Page
    expect(await screen.findByText(/Transforme a Gestão da sua Construtora/i)).toBeInTheDocument();
  });

  test('Registration Modal opens', async () => {
    render(<App />);
    
    // Click the header button specifically (it's usually the second one after "Entrar", or we can look for specific hierarchy)
    // The Header "Criar Conta" button triggers handleRegister('Cadastro Geral')
    // We can target specific text or better yet, use the class or position if simple text fails.
    // In Landing Page, "Criar Conta" is in the header nav.
    
    // Let's filter by button that actually has onClick handler relevant, or easiest: just try the loop or exact match.
    // Header button is "Criar Conta".
    // Hero button is "Teste Grátis por 7 Dias".
    // But there is another "Criar Conta" inside the Login Modal text "Criar conta agora" (lowercase).
    // The regex /Criar Conta/i matches "Criar conta agora".
    
    // Let's look for the button with precise text "Criar Conta"
    const createAccountButtons = screen.getAllByText(/^Criar Conta$/);
    fireEvent.click(createAccountButtons[0]);

    // Check if modal appears
    expect(await screen.findByText(/Preencha seus dados para acessar a plataforma/i)).toBeInTheDocument();
    
    // Check default state (CPF)
    expect(screen.getByLabelText(/CPF/i)).toBeInTheDocument();

    // Switch to CNPJ
    const cnpjRadio = screen.getByLabelText(/CNPJ/i);
    fireEvent.click(cnpjRadio);

    // Verify label change
    expect(await screen.findByLabelText(/CNPJ \(Somente números\)/i)).toBeInTheDocument();
  });
});
