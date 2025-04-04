import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Github, Sparkles, Rocket, Fingerprint } from 'lucide-react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { login } = useAuth(); // Use login function from context
  const router = useRouter();
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Adjust the endpoint URL based on where your Express server is running.
    const endpoint = activeTab === 'login'
      ? 'http://localhost:5000/api/users/login'
      : 'http://localhost:5000/api/users/signup';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'An error occurred');
        return;
      }
      // Save token via AuthContext
      login(data.token);
      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-custom-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute w-96 h-96 bg-gradient-to-r from-orange/10 to-amber-500/10 blur-3xl -top-48 -left-48 rounded-full"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute w-64 h-64 bg-gradient-to-br from-orange/20 to-transparent blur-2xl top-1/2 right-0 rounded-full"
        />
      </div>

      <main className="px-4 sm:px-0 sm:w-[90vw] md:w-[80vw] xl:w-[70vw] mx-auto py-20 relative z-10">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-16 max-w-2xl mx-auto shadow-2xl shadow-orange/10"
        >
          <div className="text-center space-y-6 mb-12">
            <motion.div
              whileHover={{ rotate: -2, scale: 1.05 }}
              className="inline-block"
            >
              <Rocket className="w-16 h-16 text-orange mx-auto mb-4" />
            </motion.div>
            <h1 className="uppercase font-loos-wide text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange to-amber-500">
              {activeTab === 'login' ? 'Welcome Back' : 'Launch Forward'}
            </h1>
            <p className="font-aeroport text-xl text-white/80">
              {activeTab === 'login' 
                ? 'Ignite your AI journey with secure access'
                : 'Embark on your innovation adventure'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 justify-center my-8 relative">
            {['login', 'signup'].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab as 'login' | 'signup')}
                className={`px-8 py-3 rounded-xl font-loos-wide relative overflow-hidden ${
                  activeTab === tab
                    ? 'bg-gradient-to-br from-orange to-amber-500 text-black'
                    : 'bg-transparent hover:bg-white/5'
                }`}
              >
                {tab === 'login' ? 'Secure Login' : 'Power Signup'}
              </motion.button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === 'signup' && (
              <div className="space-y-2">
                <label className="font-aeroport text-white/80 ml-1">Full Name</label>
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                  <User className="w-5 h-5 text-orange" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Elon Musk"
                    className="w-full bg-transparent focus:outline-none placeholder-white/30"
                    onChange={handleChange}
                    value={form.name}
                  />
                  <Sparkles className="w-5 h-5 text-orange/50" />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="font-aeroport text-white/80 ml-1">Email</label>
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                <Mail className="w-5 h-5 text-orange" />
                <input
                  type="email"
                  name="email"
                  placeholder="commander@progressors.space"
                  className="w-full bg-transparent focus:outline-none placeholder-white/30"
                  onChange={handleChange}
                  value={form.email}
                />
                <Fingerprint className="w-5 h-5 text-orange/50" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-aeroport text-white/80 ml-1">Password</label>
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                <Lock className="w-5 h-5 text-orange" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent focus:outline-none placeholder-white/30"
                  onChange={handleChange}
                  value={form.password}
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-center">{error}</p>}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-br from-orange to-amber-500 text-black font-loos-wide py-4 rounded-xl relative overflow-hidden group"
            >
              <span className="relative z-10">
                {activeTab === 'login' ? 'Quantum Sign In' : 'Create Warp Drive'}
              </span>
            </motion.button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;
