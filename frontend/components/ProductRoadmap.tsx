import { motion } from 'framer-motion';
import { Globe, Clock, Zap, Server, Users, Rocket, Code, Shield, Bell, Sparkles } from 'lucide-react';

const ProductRoadmap = () => {
  const phases = [
    {
      title: "Core Infrastructure",
      status: "completed",
      features: [
        { icon: <Server />, title: "Cloud Architecture", progress: 100 },
        { icon: <Shield />, title: "Security Framework", progress: 100 },
        { icon: <Code />, title: "API Foundation", progress: 100 }
      ],
      year: "2022"
    },
    {
      title: "AI Integration",
      status: "current",
      features: [
        { icon: <Sparkles />, title: "Smart Automation", progress: 80 },
        { icon: <Users />, title: "Team Learning", progress: 65 },
        { icon: <Zap />, title: "Real-Time Processing", progress: 90 }
      ],
      year: "2023"
    },
    {
      title: "Global Expansion",
      status: "upcoming",
      features: [
        { icon: <Globe />, title: "Multi-Region Support", progress: 30 },
        { icon: <Clock />, title: "24/7 Operations", progress: 15 },
        { icon: <Bell />, title: "Localized Notifications", progress: 10 }
      ],
      year: "2024"
    }
  ];

  return (
    <div className="relative overflow-hidden py-28">
      {/* Animated background elements */}
      <motion.div 
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute -left-[300px] top-1/3 w-[800px] h-[800px] bg-gradient-to-r from-orange/10 to-amber-500/10 blur-3xl rounded-full"
      />
      
      <div className="relative z-10 md:w-[80vw] mx-auto">
        {/* Header */}
        <div className="text-center mb-20 px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-loos-wide text-6xl md:text-8xl bg-gradient-to-r from-orange to-amber-500 bg-clip-text text-transparent mb-6"
          >
            Evolution Timeline
          </motion.h2>
          <p className="font-aeroport text-xl text-white/80 max-w-2xl mx-auto">
            Witness our {`product's`} journey from foundational architecture to global AI-powered platform
          </p>
        </div>

        {/* Timeline */}
        <div className="flex flex-col md:flex-row gap-12 px-8">
          {phases.map((phase, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.3 }}
              className="flex-1 group"
            >
              <div className="relative h-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-[40px] p-8 pb-16 hover:border-orange/30 transition-all">
                {/* Year Marker */}
                <div className={`absolute -top-5 left-8 px-6 py-2 rounded-full ${
                  phase.status === 'completed' ? 'bg-green-400/20 text-green-400' :
                  phase.status === 'current' ? 'bg-orange/20 text-orange' :
                  'bg-white/10 text-white/60'
                }`}>
                  <span className="font-loos-wide">{phase.year}</span>
                </div>

                {/* Phase Title */}
                <h3 className="font-loos-wide text-3xl mb-8 flex items-center gap-4">
                  {phase.status === 'current' && (
                    <motion.span 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-3 h-3 bg-orange rounded-full"
                    />
                  )}
                  {phase.title}
                </h3>

                {/* Features */}
                <div className="space-y-6">
                  {phase.features.map((feature, fIndex) => (
                    <div key={fIndex} className="p-6 bg-white/5 rounded-2xl">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-orange/20 rounded-xl text-orange">
                          {feature.icon}
                        </div>
                        <span className="font-loos-wide">{feature.title}</span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${feature.progress}%` }}
                          transition={{ duration: 1.5 }}
                          className="h-full bg-orange rounded-full"
                        />
                      </div>
                      <div className="flex justify-between mt-2 font-aeroport text-sm text-white/60">
                        <span>{phase.status === 'completed' ? "Completed" : "Progress"}</span>
                        <span>{feature.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status Ribbon */}
                {phase.status === 'current' && (
                  <motion.div
                    initial={{ rotate: -45, opacity: 0 }}
                    whileInView={{ rotate: -45, opacity: 1 }}
                    className="absolute -right-20 -top-8 bg-orange text-black px-20 py-2 font-loos-wide"
                    style={{ transformOrigin: '50% 50%' }}
                  >
                    Active Development
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating CTA */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          className="text-center mt-20"
        >
          <button className="bg-orange text-black font-loos-wide px-12 py-4 rounded-2xl hover:bg-orange/90 transition-all flex items-center gap-4 mx-auto">
            <Rocket className="w-6 h-6" />
            Join the Journey
            <Sparkles className="w-6 h-6" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductRoadmap;