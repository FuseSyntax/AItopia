// components/Footer.tsx
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    
    if (footerRef.current) {
      gsap.from(footerRef.current, {
        opacity: 0,
        y: 100,
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top bottom',
          toggleActions: 'play none none reverse'
        },
        duration: 1,
        ease: 'power3.out'
      })
    }
  }, [])

  return (
    <footer ref={footerRef} className="bg-gray-900/90 backdrop-blur-md border-t border-cyan-500/20">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            AItopia
          </h3>
          <p className="text-gray-400">Empowering creativity with AI</p>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-cyan-400">Quick Links</h4>
          <div className="flex flex-col space-y-2">
            <Link href="/about" className="text-gray-300 hover:text-cyan-400 transition-colors">About</Link>
            <Link href="/tools" className="text-gray-300 hover:text-cyan-400 transition-colors">Tools</Link>
            <Link href="/contact" className="text-gray-300 hover:text-cyan-400 transition-colors">Contact</Link>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-cyan-400">Stay Updated</h4>
          <form className="flex flex-col space-y-3">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="bg-gray-800/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      
      <div className="border-t border-cyan-500/20 mt-8 py-4 text-center text-gray-400">
        © {new Date().getFullYear()} AItopia. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer