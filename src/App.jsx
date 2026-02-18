import AuthScreen from './features/auth/AuthScreen';
import Dashboard from './features/dashboard/Dashboard';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f23] p-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 mb-6"></div>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-10">Conectando con el servidor...</p>

        <div className="pt-10 border-t border-white/5">
          <p className="text-slate-600 text-xs mb-4">¿Llevas mucho tiempo esperando?</p>
          <button
            onClick={() => window.location.reload(true)}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-indigo-400 text-xs font-bold hover:bg-white/10 transition-all"
          >
            🔄 Forzar Reinicio
          </button>
        </div>
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
