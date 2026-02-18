import AuthScreen from './features/auth/AuthScreen';
import Dashboard from './features/dashboard/Dashboard';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f23]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500 mb-4"></div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Iniciando sesión...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 bg-transparent relative">
      {user ? (
        <Dashboard user={user} onLogout={logout} />
      ) : (
        <AuthScreen />
      )}
    </div>
  );
}

export default App;
