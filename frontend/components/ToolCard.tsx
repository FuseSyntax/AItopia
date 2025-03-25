// components/ToolCard.tsx
import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import Link from 'next/link'

interface ToolCardProps {
  title: string
  description: string
  link: string
  index: number
}

const ToolCard = ({ title, description, link, index }: ToolCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    gsap.from(cardRef.current, {
      opacity: 0,
      y: 50,
      delay: index * 0.1,
      duration: 0.8,
      ease: 'power3.out'
    })
  }, [index])

  return (
    <div 
      ref={cardRef}
      className="group relative bg-gray-900/50 rounded-xl p-6 border border-cyan-500/20 hover:border-cyan-500/40 transition-all hover:shadow-2xl hover:shadow-cyan-500/10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"/>
      
      <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3">
        {title}
      </h2>
      <p className="text-gray-400 mb-6">{description}</p>
      
      <Link href={link} className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors">
        <span>Explore Tool</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </Link>
      
      <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 blur-lg"/>
      </div>
    </div>
  )
}

export default ToolCard