import { Rocket, Mail, Twitter, Github } from 'lucide-react';

const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-custom-black">
      
      <main className="px-4 sm:px-0 sm:w-[90vw] md:w-[80vw] xl:w-[70vw] mx-auto py-20 text-center">
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 md:p-16 space-y-12">
          {/* Animated Icon */}
          <div className="animate-float mx-auto">
            <Rocket className="w-24 h-24 text-orange mx-auto" />
          </div>

          <h1 className="uppercase font-loos-wide text-4xl md:text-6xl text-orange">
            Launching Soon
          </h1>
          
          <p className="font-aeroport text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
            We're cooking up something extraordinary! Be the first to experience our next-generation AI tools.
          </p>

          {/* Countdown Timer */}
          <div className="flex justify-center gap-4">
            <TimeBlock value="14" label="Days" />
            <TimeBlock value="08" label="Hours" />
            <TimeBlock value="32" label="Minutes" />
          </div>

          {/* Newsletter Form */}
          <div className="max-w-xl mx-auto space-y-6">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-orange"
              />
              <button className="bg-orange text-black font-loos-wide px-8 py-4 rounded-xl hover:bg-orange/80 transition-all">
                Notify Me
              </button>
            </div>
            
            <div className="flex justify-center gap-6">
              <SocialIcon icon={<Twitter className="w-6 h-6" />} />
              <SocialIcon icon={<Github className="w-6 h-6" />} />
              <SocialIcon icon={<Mail className="w-6 h-6" />} />
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

const TimeBlock = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center">
    <div className="font-loos-wide text-4xl md:text-5xl text-white bg-white/5 p-6 rounded-xl">
      {value}
    </div>
    <span className="font-aeroport text-white/60 mt-2 block">{label}</span>
  </div>
);

const SocialIcon = ({ icon }: { icon: React.ReactNode }) => (
  <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-orange hover:border-orange/20 transition-all">
    {icon}
  </button>
);

export default ComingSoon;