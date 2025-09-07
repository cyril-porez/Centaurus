import { render, screen } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom"; 
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

test("affiche la page de connexion par défaut", () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <AuthProvider>      
        <App />
      </AuthProvider>
    </MemoryRouter>

  );

  expect(screen.getByRole('heading', { level: 1, name: /connexion/i })).toBeInTheDocument();

});

