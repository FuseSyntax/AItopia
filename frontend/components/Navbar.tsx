// components/Navbar.tsx
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (dropdownRef.current) {
      gsap.from(dropdownRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power3.out'
      })
    }
  }, [isOpen])

  return (
    <nav className="sticky top-0 bg-gray-900/80 backdrop-blur-md z-50 border-b border-cyan-500/20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent hover:scale-105 transition-transform">
          AItopia
        </Link>
        
        <div className="hidden md:flex space-x-8 items-center">
          <div className="relative group"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <button className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-colors">
              <span>Tools</span>
              <svg className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} width="16" height="16" viewBox="0 0 16 16">
                <path fill="currentColor" d="M8 11L3 6l.7-.7L8 9.6l4.3-4.3.7.7z"/>
              </svg>
            </button>
            
            {isOpen && (
              <div ref={dropdownRef} className="absolute top-full mt-2 py-2 w-48 bg-gray-900/95 rounded-lg shadow-xl border border-cyan-500/20">
                <Link 
                  href="/tools/bg-remove" 
                  className="block px-4 py-3 hover:bg-cyan-500/10 group transition-colors"
                >
                  <span className="text-cyan-400 group-hover:text-cyan-300">BG Remove</span>
                  <p className="text-sm text-gray-400 mt-1">Remove background instantly</p>
                </Link>
                <Link 
                  href="/tools/add-subtitle" 
                  className="block px-4 py-3 hover:bg-cyan-500/10 group transition-colors"
                >
                  <span className="text-cyan-400 group-hover:text-cyan-300">Add Subtitle</span>
                  <p className="text-sm text-gray-400 mt-1">Auto-generate video subtitles</p>
                </Link>
              </div>
            )}
          </div>
          
          <Link href="/about" className="text-gray-300 hover:text-cyan-400 transition-colors">
            About
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar