import React from 'react';
import fire from "../public/img/fire.webp";
import bread from "../public/img/bread.webp";
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';

const ScrollText = () => {
  const [sectionRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  return (
    <div ref={sectionRef} className="relative uppercase font-loos-wide mt-16 font-bold text-center rounded-2xl py-10 px-60 overflow-hidden">
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-orange/20 to-transparent ${
        inView ? 'animate-gradient-flow' : ''
      }`}></div>

      {/* First line with fire icon */}
      <div className={`relative flex gap-4 transform ${
        inView ? 
        'opacity-100 translate-x-0 scale-100' : 
        'opacity-0 -translate-x-20 scale-90'
      } transition-all duration-700 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]`}>
        <Image 
          src={fire} 
          alt='fire' 
          width={100} 
          height={100}
          className={`transform transition-transform duration-500 ${
            inView ? 'rotate-0 scale-100' : 'rotate-45 scale-50'
          }`}
        />
        <p className="text-9xl bg-clip-text text-transparent bg-gradient-to-r from-gray-50 to-yellow-100">
          THE
        </p>
      </div>

      {/* Second line with dynamic scaling */}
      <div className={`mt-8 transform origin-left ${
        inView ?
        'opacity-100 scale-100 blur-none' :
        'opacity-0 scale-125 blur-lg'
      } transition-all duration-700 delay-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]`}>
        <p className="text-9xl bg-clip-text text-transparent bg-gradient-to-r from-gray-50 to-yellow-100 ">
          COST
        </p>
      </div>

      {/* Third line with bread icon */}
      <div className={`flex gap-4 items-baseline justify-center mt-8 ${
        inView ?
        'opacity-100 translate-y-0' :
        'opacity-0 translate-y-20'
      } transition-all duration-700 delay-500 ease-out`}>
        <p className="text-9xl bg-clip-text text-transparent bg-gradient-to-r from-gray-50 to-yellow-100">8$</p>
        <span className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-gray-50 to-yellow-100">per month</span>
        <Image 
          src={bread} 
          alt='bread' 
          width={100} 
          height={100}
          className={`transform transition-all duration-500 delay-700 ${
            inView ? 'rotate-0 scale-100' : 'rotate-[360deg] scale-0'
          }`}
        />
      </div>
    </div>
  );
};

export default ScrollText;