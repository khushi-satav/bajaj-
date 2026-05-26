import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import { useTickets } from './hooks/useTickets';

/**
 * App Root Component
 * Renders the app header, dashboard, and toast notifications.
 */
export default function App() {
  const { setShowCreateForm } = useTickets();

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="app-header__logo">
          <div className="app-header__icon">🎫</div>
          <div>
            <h1 className="app-header__title">DeskFlow</h1>
            <p className="app-header__subtitle">Support Ticket Triage Board</p>
          </div>
        </div>
        <div className="app-header__actions">
          <button
            className="btn btn--primary btn--lg"
            onClick={() => setShowCreateForm(true)}
            id="create-ticket-btn"
          >
            + New Ticket
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Dashboard />
      </main>

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          className: 'toast-custom',
          style: {
            background: '#1e2130',
            color: '#f0f0f5',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontFamily: "'Inter', sans-serif",
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#1e2130',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1e2130',
            },
          },
        }}
      />
    </div>
  );
}
