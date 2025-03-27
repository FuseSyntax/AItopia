
import React from 'react'
import fire from "../public/img/fire.webp"
import bread from "../public/img/bread.webp"
import Image from 'next/image'

const ScrollText = () => {
  return (
    <div className='uppercase font-loos-wide font-bold text-center px-60'>
      <div className="flex gap-3">
        <Image src={fire} alt='fire image' width={100} height={100} />
        <p className='text-9xl'>THE</p>
      </div>
        <p className='text-9xl'>COST</p>
        <div className="flex gap-3 items-baseline">
        <p className='text-9xl'>8$</p>
        <span className='text-3xl'>per month</span>
        <Image src={bread} alt='bread image' width={100} height={100} />
        </div>
    </div>
  )
}

export default ScrollText
