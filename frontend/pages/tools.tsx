import { Paintbrush, Code2, BrainCircuit, Video, Music, BookText, Speech, Bot, Lock, ImageDown, Clapperboard } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const ToolsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const tools = [
    {
      name: 'RemoveBG',
      category: 'Image',
      icon: <ImageDown className="w-8 h-8" />,
      description: 'Instantly remove backgrounds from images',
      link: '/tools/removebg'
    },
    {
      name: 'LingoSync',
      category: 'Video',
      icon: <Clapperboard className="w-8 h-8" />,
      description: 'Add subtitle to the video',
      link: '/tools/lingosync'
    },
    {
      name: 'Artisan AI',
      category: 'Generative AI',
      icon: <Paintbrush className="w-8 h-8" />,
      description: 'Transform text prompts into stunning digital artwork',
      link: '/comingsoon'
    },
    {
      name: 'Code Pilot',
      category: 'Development',
      icon: <Code2 className="w-8 h-8" />,
      description: 'AI-powered code completion and debugging assistant',
      link: '/comingsoon'
    },
    {
      name: 'NeuroChat',
      category: 'Productivity',
      icon: <BrainCircuit className="w-8 h-8" />,
      description: 'Context-aware intelligent chatbot with memory',
      link: '/comingsoon'
    },
    {
      name: 'Motion Forge',
      category: 'Video',
      icon: <Video className="w-8 h-8" />,
      description: 'Automated video editing and scene generation',
      link: '/comingsoon'
    },
    {
      name: 'Symphony AI',
      category: 'Audio',
      icon: <Music className="w-8 h-8" />,
      description: 'AI music composition and sound design tool',
      link: '/comingsoon'
    },
    {
      name: 'Linguo',
      category: 'Writing',
      icon: <BookText className="w-8 h-8" />,
      description: 'Advanced content generation and rewriting',
      link: '/tools/linguo'
    },
    {
      name: 'VoiceCraft',
      category: 'Audio',
      icon: <Speech className="w-8 h-8" />,
      description: 'Real-time voice cloning and modulation',
      link: '/tools/voicecraft'
    },
    {
      name: 'PixelGen',
      category: 'Generative AI',
      icon: <ImageDown className="w-8 h-8" />,
      description: 'Text-to-image generation with style control',
      link: '/comingsoon'
    },
    {
      name: 'AutoBot',
      category: 'Automation',
      icon: <Bot className="w-8 h-8" />,
      description: 'Workflow automation with natural language',
      link: '/comingsoon'
    },
    {
      name: 'CipherGuard',
      category: 'Security',
      icon: <Lock className="w-8 h-8" />,
      description: 'AI-powered cybersecurity threat detection',
      link: '/comingsoon'
    }
  ];

  const categories = ['all', 'Generative AI', 'Development', 'Productivity', 'Image', 'Video', 'Audio', 'Writing', 'Security'];

  const filteredTools = selectedCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === selectedCategory);

  return (
    <div className="min-h-screen bg-custom-black">
      
      <main className="px-4 sm:px-0 sm:w-[90vw] md:w-[80vw] xl:w-[70vw] mx-auto py-20 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-8">
          <h1 className="uppercase font-loos-wide text-4xl md:text-6xl xl:text-7xl font-bold text-orange">
            AI Toolbox
          </h1>
          <p className="font-aeroport text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            Explore cutting-edge AI tools revolutionizing digital creation and productivity
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-xl font-loos-wide transition-all ${
                selectedCategory === category
                  ? 'bg-orange text-black'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredTools.map((tool, index) => (
            <div key={index} className="group backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-orange/20 rounded-xl text-orange">
                  {tool.icon}
                </div>
                <span className="font-aeroport text-sm text-white/60">{tool.category}</span>
              </div>
              <h3 className="font-loos-wide text-2xl text-white mb-3">{tool.name}</h3>
              <p className="font-aeroport text-white/80 mb-6">{tool.description}</p>
              <Link href={tool.link} className='flex items-center gap-3'>
                Try Now
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right">
                  <path d="M7 7h10v10"/>
                  <path d="M7 17 17 7"/>
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ToolsPage;
