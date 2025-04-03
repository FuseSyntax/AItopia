import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Github, Sparkles, Rocket, Fingerprint } from 'lucide-react';

const Login = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [hoverEffect, setHoverEffect] = useState(false);

  return (
    <div className="min-h-screen bg-custom-black relative overflow-hidden">
      {/* Animated background elements */}
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

          {/* Animated Tabs */}
          <div className="flex gap-4 justify-center my-8 relative">
            <div className="absolute inset-0 flex justify-center">
              <motion.div
                className="bg-orange/20 absolute -z-10 top-1/2 -translate-y-1/2 h-12 rounded-xl"
                style={{ width: '110%' }}
                animate={{
                  opacity: hoverEffect ? 0.3 : 0.1,
                  scale: hoverEffect ? 1.05 : 1
                }}
                transition={{ type: 'spring' }}
              />
            </div>
            
            {['login', 'signup'].map((tab) => (
              <motion.button
                key={tab}
                onHoverStart={() => setHoverEffect(true)}
                onHoverEnd={() => setHoverEffect(false)}
                onClick={() => setActiveTab(tab as 'login' | 'signup')}
                className={`px-8 py-3 rounded-xl font-loos-wide relative overflow-hidden ${
                  activeTab === tab
                    ? 'bg-gradient-to-br from-orange to-amber-500 text-black'
                    : 'bg-transparent hover:bg-white/5'
                }`}
              >
                {tab === 'login' ? 'Secure Login' : 'Power Signup'}
                {activeTab === tab && (
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Form */}
          <motion.form 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence mode='wait'>
              {activeTab === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="font-aeroport text-white/80 ml-1">Full Name</label>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4"
                  >
                    <User className="w-5 h-5 text-orange" />
                    <input
                      type="text"
                      placeholder="Elon Musk"
                      className="w-full bg-transparent focus:outline-none placeholder-white/30"
                    />
                    <Sparkles className="w-5 h-5 text-orange/50" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="font-aeroport text-white/80 ml-1">Email</label>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <Mail className="w-5 h-5 text-orange" />
                <input
                  type="email"
                  placeholder="commander@progressors.space"
                  className="w-full bg-transparent focus:outline-none placeholder-white/30"
                />
                <Fingerprint className="w-5 h-5 text-orange/50" />
              </motion.div>
            </div>

            <div className="space-y-2">
              <label className="font-aeroport text-white/80 ml-1">Password</label>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <Lock className="w-5 h-5 text-orange" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent focus:outline-none placeholder-white/30"
                />
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-1 h-3 bg-orange/50 rounded-full" />
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-br from-orange to-amber-500 text-black font-loos-wide py-4 rounded-xl relative overflow-hidden group"
            >
              <span className="relative z-10">
                {activeTab === 'login' ? 'Quantum Sign In' : 'Create Warp Drive'}
              </span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white/5 text-sm text-white/60 font-aeroport">
                  Hyper-Speed Access
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {['Github', 'Google'].map((provider, i) => (
                <motion.button
                  key={provider}
                  whileHover={{ y: -2 }}
                  className="flex items-center justify-center gap-3 bg-white/5 py-3 rounded-xl hover:bg-white/10 transition-all"
                >
                  {i === 0 ? (
                    <Github className="w-5 h-5" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.545 6.477 2.545 12s4.476 10 10 10c5.523 0 10-4.477 10-10a9.982 9.982 0 00-2.167-6.275l-3.061 2.367z"
                      />
                    </svg>
                  )}
                  <span className="font-loos-wide">{provider}</span>
                </motion.button>
              ))}
            </div>
          </motion.form>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;