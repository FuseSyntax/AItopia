// pages/tools/voicecraft.tsx
import { useState } from 'react';
import { Mic, Volume2, Download, ArrowLeft, Play, User, Settings, Music2 } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const VoiceCraft = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [processedAudio, setProcessedAudio] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('default');
  const [pitch, setPitch] = useState(50);
  const [speed, setSpeed] = useState(75);

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFile(file);
      // Simulate processing
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setProcessedAudio(URL.createObjectURL(file));
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-custom-black">
      
      <main className="px-4 sm:px-0 sm:w-[90vw] md:w-[80vw] xl:w-[70vw] mx-auto py-20 space-y-16">
        {/* Navigation */}
        <Link href="/tools" className="flex items-center gap-2 text-orange hover:text-orange/80 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Tools
        </Link>

        {/* Hero Section */}
        <div className="text-center space-y-8">
          <div className="flex items-center justify-center gap-4">
            <Volume2 className="w-12 h-12 text-orange" />
            <h1 className="uppercase font-loos-wide text-4xl md:text-6xl font-bold text-orange">
              VoiceCraft AI
            </h1>
          </div>
          <p className="font-aeroport text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            Transform voices with real-time cloning and advanced modulation capabilities
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Input Section */}
          <div className="space-y-8">
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8">
              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-white/20 rounded-3xl p-8 text-center hover:border-orange transition-all group">
                  <div className="space-y-6">
                    <Mic className="w-16 h-16 mx-auto text-orange" />
                    <div className="space-y-2">
                      <h3 className="font-loos-wide text-2xl text-white">
                        {audioFile ? 'Audio Ready' : 'Upload Audio'}
                      </h3>
                      <p className="font-aeroport text-white/80">
                        {audioFile ? 'Click to change file' : 'MP3 or WAV (max 25MB)'}
                      </p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                  />
                </div>
              </label>
            </div>

            {/* Voice Parameters */}
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
              <h2 className="font-loos-wide text-2xl text-orange">Voice Settings</h2>
              
              <div className="space-y-4">
                <label className="font-aeroport text-white/80">
                  Voice Model
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 mt-2 focus:outline-none focus:border-orange"
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                  >
                    <option value="default">Default Voice</option>
                    <option value="professional">Professional</option>
                    <option value="cartoon">Cartoon Character</option>
                    <option value="celebrity">Celebrity Voice</option>
                  </select>
                </label>

                <label className="font-aeroport text-white/80">
                  Pitch Control
                  <div className="flex items-center gap-4 mt-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={pitch}
                      onChange={(e) => setPitch(Number(e.target.value))}
                      className="w-full range-orange"
                    />
                    <span className="font-loos-wide">{pitch}%</span>
                  </div>
                </label>

                <label className="font-aeroport text-white/80">
                  Speed Control
                  <div className="flex items-center gap-4 mt-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                      className="w-full range-orange"
                    />
                    <span className="font-loos-wide">{speed}%</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8">
            {isProcessing ? (
              <div className="h-full flex flex-col items-center justify-center space-y-6">
                <Settings className="w-16 h-16 animate-spin text-orange" />
                <p className="font-loos-wide text-2xl text-white">Crafting Your Voice...</p>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-orange h-2 rounded-full animate-progress" />
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {processedAudio ? (
                  <>
                    <div className="aspect-square bg-white/5 rounded-2xl flex items-center justify-center">
                      <button className="p-6 bg-orange/20 rounded-full text-orange hover:bg-orange/30 transition-all">
                        <Play className="w-12 h-12" />
                      </button>
                    </div>
                    <button className="w-full bg-orange text-black font-loos-wide py-4 rounded-xl hover:bg-orange/80 transition-all flex items-center justify-center gap-3">
                      <Download className="w-5 h-5" />
                      Download Modified Audio
                    </button>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-white/40">
                    <p className="font-aeroport">Processed audio will appear here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Demo Voices */}
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
          <h2 className="font-loos-wide text-3xl text-orange">Sample Voices</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <VoiceDemo
              title="Professional"
              description="Formal business presentation voice"
              icon={<User className="w-8 h-8" />}
            />
            <VoiceDemo
              title="Cartoon"
              description="Fun animated character voice"
              icon={<Music2 className="w-8 h-8" />}
            />
            <VoiceDemo
              title="Celebrity"
              description="Popular celebrity voice clone"
              icon={<Volume2 className="w-8 h-8" />}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

const VoiceDemo = ({ title, description, icon }: { 
  title: string;
  description: string;
  icon: React.ReactNode;
}) => (
  <div className="group backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-orange/20 rounded-lg text-orange">{icon}</div>
      <div>
        <h3 className="font-loos-wide text-xl text-white">{title}</h3>
        <p className="font-aeroport text-white/80">{description}</p>
      </div>
    </div>
    <button className="w-full mt-4 flex items-center justify-center gap-2 text-orange hover:text-orange/80 transition-colors">
      <Play className="w-4 h-4" />
      Play Sample
    </button>
  </div>
);

export default VoiceCraft;