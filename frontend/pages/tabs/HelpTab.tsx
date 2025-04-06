import React from 'react';
import { motion } from 'framer-motion';
import { LifeBuoy, Sparkles } from 'lucide-react';

const HelpTab: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <h2 className="font-loos-wide text-3xl text-orange">Support Center</h2>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-loos-wide text-xl mb-6">Quick Assistance</h3>
          <div className="space-y-6">
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <h4 className="font-loos-wide text-lg mb-4">Common Solutions</h4>
              <div className="space-y-3">
                {['Password Reset', 'Billing Issues', 'API Documentation', 'Service Status'].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer">
                    <LifeBuoy className="w-5 h-5 text-orange" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <h4 className="font-loos-wide text-lg mb-4">Live Support</h4>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-green-400/20 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div>
                  <p className="font-loos-wide">Support Team Available</p>
                  <p className="font-aeroport text-white/60">Average response time: 2 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-loos-wide text-xl mb-6">Contact Form</h3>
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Subject"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-orange"
            />
            <textarea
              placeholder="Describe your issue..."
              className="w-full h-48 bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-orange"
            />
            <motion.button whileHover={{ scale: 1.05 }} className="w-full py-4 bg-orange text-black rounded-xl font-loos-wide">
              Send Message
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HelpTab;