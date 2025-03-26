// components/Footer.tsx

import Link from "next/link"

const Footer = () => {
  return (
    <footer className="w-[70vw] text-center text-xl font-aeroport mt-10 mb-5 mx-auto">
      <p className="">
        © {new Date().getFullYear()} all rights reserved made by {" "}
        <Link href="https://portfolio-flax-eight-40.vercel.app/" target="_blank">
          Nitin
        </Link>
      </p>
    </footer>
  )
}

export default Footer