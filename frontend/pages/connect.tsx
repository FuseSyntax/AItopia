import { Mail, Globe, Phone } from 'lucide-react';

export default function Connect() {
  return (
    <div className="min-h-screen bg-custom-black">
      
      <main className="px-4 sm:px-0 sm:w-[90vw] md:w-[80vw] xl:w-[70vw] mx-auto py-20 space-y-16">
        <div className="text-center space-y-8">
          <h1 className="uppercase font-loos-wide text-4xl md:text-6xl xl:text-7xl font-bold text-orange">
            Connect With Us
          </h1>
          <p className="font-aeroport text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
            Get in touch with our AI experts and revolutionize your workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8">
            <form className="space-y-6">
              <InputField label="Name" type="text" />
              <InputField label="Email" type="email" />
              <InputField label="Message" type="textarea" />
              <button className="bg-orange text-black font-loos-wide px-8 py-3 rounded-xl hover:bg-orange/80 transition-all">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <ContactInfo
              icon={<Mail className="w-6 h-6" />}
              title="Email"
              value="support@example.ai"
            />
            <ContactInfo
              icon={<Globe className="w-6 h-6" />}
              title="Website"
              value="example.ai"
            />
            <ContactInfo
              icon={<Phone className="w-6 h-6" />}
              title="Phone"
              value="+1 (555) 123-4567"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

const InputField = ({ label, type }) => (
  <div className="space-y-2">
    <label className="font-aeroport text-white/80">{label}</label>
    {type === 'textarea' ? (
      <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-orange" />
    ) : (
      <input 
        type={type} 
        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-orange" 
      />
    )}
  </div>
);

const ContactInfo = ({ icon, title, value }) => (
  <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-6">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-orange/20 rounded-xl">{icon}</div>
      <div>
        <h3 className="font-loos-wide text-orange">{title}</h3>
        <p className="font-aeroport text-white/80">{value}</p>
      </div>
    </div>
  </div>
);