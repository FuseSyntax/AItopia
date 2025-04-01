import { useState } from 'react';
import { Video, Languages, Captions, Download, ArrowLeft, Settings, Clock } from 'lucide-react';
import Link from 'next/link';

const LingoSync = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [subtitles, setSubtitles] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [fontSize, setFontSize] = useState(24);
  const [showTranslation, setShowTranslation] = useState(true);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      setIsProcessing(true);
      // Simulate processing
      setTimeout(() => {
        setIsProcessing(false);
        setSubtitles(`1\n00:00:00,000 --> 00:00:05,000\nTranslated subtitle text here`);
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
            <Languages className="w-12 h-12 text-orange" />
            <h1 className="uppercase font-loos-wide text-4xl md:text-6xl font-bold text-orange">
              LingoSync Pro
            </h1>
          </div>
          <p className="font-aeroport text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            AI-powered multilingual subtitle generation with real-time translation and styling
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
                    <Video className="w-16 h-16 mx-auto text-orange" />
                    <div className="space-y-2">
                      <h3 className="font-loos-wide text-2xl text-white">
                        {videoFile ? 'Video Ready' : 'Upload Video'}
                      </h3>
                      <p className="font-aeroport text-white/80">
                        {videoFile ? 'Click to change file' : 'MP4, MOV, AVI (max 500MB)'}
                      </p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </div>
              </label>
            </div>

            {/* Language Settings */}
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
              <h2 className="font-loos-wide text-2xl text-orange">Language Settings</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-aeroport text-white/80">Source Language</label>
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-orange"
                    defaultValue="auto"
                  >
                    <option value="auto">Auto-detect</option>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-aeroport text-white/80">Target Language</label>
                  <select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-orange"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="show-translation"
                  checked={showTranslation}
                  onChange={(e) => setShowTranslation(e.target.checked)}
                  className="w-5 h-5 text-orange rounded focus:ring-orange"
                />
                <label htmlFor="show-translation" className="font-aeroport text-white/80">
                  Show translated subtitles
                </label>
              </div>
            </div>

            {/* Subtitle Customization */}
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
              <h2 className="font-loos-wide text-2xl text-orange">Subtitle Styling</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-aeroport text-white/80">Font Size</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="16"
                      max="48"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full range-orange"
                    />
                    <span className="font-loos-wide">{fontSize}px</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-aeroport text-white/80">Text Color</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      defaultValue="#ffffff"
                      className="w-12 h-12 rounded-lg cursor-pointer bg-white/5 border border-white/10"
                    />
                    <span className="font-aeroport text-white/80">White</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8">
            {isProcessing ? (
              <div className="h-full flex flex-col items-center justify-center space-y-6">
                <Settings className="w-16 h-16 animate-spin text-orange" />
                <p className="font-loos-wide text-2xl text-white">Generating Subtitles...</p>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-orange h-2 rounded-full animate-progress" />
                </div>
              </div>
            ) : (
              <>
                <div className="aspect-video bg-white/5 border border-white/10 rounded-2xl overflow-hidden relative">
                  {videoFile && (
                    <video 
                      src={URL.createObjectURL(videoFile)} 
                      className="w-full h-full object-contain"
                      controls
                    />
                  )}
                  {/* Subtitle Preview */}
                  <div 
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
                    style={{
                      fontSize: `${fontSize}px`,
                      textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                    }}
                  >
                    <span className="bg-black/50 px-4 py-2 rounded-lg border border-orange/30">
                      Preview subtitle text
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-loos-wide text-xl text-orange">Generated Subtitles</h3>
                    <button className="text-orange hover:text-orange/80 flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Download SRT
                    </button>
                  </div>
                  <textarea
                    value={subtitles}
                    onChange={(e) => setSubtitles(e.target.value)}
                    className="w-full h-64 bg-white/5 border border-white/10 rounded-xl p-6 text-white/80 font-mono text-sm focus:outline-none focus:border-orange resize-none"
                    placeholder="Subtitles will appear here..."
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
          <h2 className="font-loos-wide text-3xl text-orange">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureStep
              icon={<Languages className="w-8 h-8" />}
              title="30+ Languages"
              description="Support for major global languages and dialects"
            />
            <FeatureStep
              icon={<Captions className="w-8 h-8" />}
              title="Smart Timing"
              description="Automatic speech detection and time syncing"
            />
            <FeatureStep
              icon={<Clock className="w-8 h-8" />}
              title="Real-time Preview"
              description="Instant preview with style adjustments"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

const FeatureStep = ({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="group backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-orange/20 rounded-lg text-orange">{icon}</div>
      <div>
        <h3 className="font-loos-wide text-xl text-white">{title}</h3>
        <p className="font-aeroport text-white/80">{description}</p>
      </div>
    </div>
  </div>
);

export default LingoSync;