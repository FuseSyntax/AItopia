// pages/index.tsx
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import ToolCard from '../components/ToolCard'

const Home = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const cards = [
    {
      title: 'BG Remover',
      description: 'Automatically remove backgrounds from images with AI precision',
      link: '/tools/bg-remove'
    },
    {
      title: 'Subtitle Generator',
      description: 'Create accurate video subtitles in multiple languages',
      link: '/tools/add-subtitle'
    }
  ]

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
      })
      
      gsap.from('.featured-tool', {
        scrollTrigger: {
          trigger: '.featured-tools',
          start: 'top center'
        },
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 0.8
      })
    })
    
    return () => ctx.revert()
  }, [])

  return (
    <div className="space-y-20">
      <div ref={heroRef} className="text-center py-32">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Welcome to AItopia
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Unleash creativity with our cutting-edge AI tools powered by next-generation intelligence
        </p>
      </div>

      <div className="featured-tools container mx-auto px-4 grid md:grid-cols-2 gap-8">
        {cards.map((card, index) => (
          <ToolCard
            key={card.title}
            title={card.title}
            description={card.description}
            link={card.link}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}

export default Home