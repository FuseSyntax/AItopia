import React from 'react'
import BrandLogo from "../public/img/logo-white.png"
import Image from 'next/image'
import { Menu } from 'lucide-react';


const Navbar = () => {
  return (
    <div className='flex items-center mt-5  justify-between w-[70vw] bg-transparent mx-auto absolute z-10 left-0 right-0'>
      <div className="h-14">
      <Image src={BrandLogo} alt="Brand Logo" width={100} height={100} />
      </div>
      <div className="bg-custom-black text-white rounded-xl">
        <Menu className='p-2 size-14' />
      </div>
    </div>
  )
}

export default Navbar
