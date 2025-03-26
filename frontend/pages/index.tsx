import Link from 'next/link';
import dynamic from 'next/dynamic';
import GravityWords from '../components/GravityWords';
import Marquee from "react-fast-marquee";
import Image from 'next/image';
import gameImage from "../public/img/game.webp"

const Scene = dynamic(() => import('../components/Scene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" />
});

const Home = () => {

  const marqueeItems = Array(10).fill(
    <div className="bg-brown ml-5 flex gap-5 items-center px-8 py-2 rounded-3xl uppercase">
      <span className='font-loos-wide text-4xl'>Airbnb</span>
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="80" height="80" viewBox="0,0,255.99431,255.99431">
        <g fill="#ffffff" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10">
          <g transform="scale(5.12,5.12)">
            <path d="M25,3c-2.91024,0 -5.57383,1.62195 -6.89844,4.21094v0.00195c-0.00084,0.00165 -0.00311,0.00226 -0.00391,0.00391c-3.73548,7.25389 -6.9439,13.59017 -9.28516,18.32031c-1.17103,2.36588 -2.12548,4.32851 -2.82422,5.81445c-0.69874,1.48595 -1.10306,2.33849 -1.33984,3.09375l-0.00195,0.00586l-0.00195,0.00391c-0.25627,0.83158 -0.59375,1.94382 -0.59375,3.25586c-0.00001,5.1068 4.19565,9.28906 9.30859,9.28906c5.79593,0 9.77577,-4.62026 11.64063,-6.75391c1.86377,2.13253 5.84408,6.75391 11.64063,6.75391c5.11295,0 9.30859,-4.18296 9.30859,-9.28906c0,-1.31021 -0.33795,-2.42069 -0.5918,-3.24805l-0.00195,-0.00586l-0.00195,-0.00586c-0.23675,-0.75424 -0.64275,-1.60915 -1.3418,-3.0957c-0.69905,-1.48656 -1.65294,-3.45003 -2.82422,-5.81641c-2.34155,-4.73074 -5.55105,-11.06715 -9.28711,-18.32227l-0.00391,-0.00781c-1.32323,-2.58746 -3.98679,-4.20898 -6.89648,-4.20898zM25,7c1.50137,0 2.66373,0.71123 3.33789,2.0332l0.00195,0.00391l0.00195,0.00391c3.7309,7.24501 6.93182,13.56823 9.25977,18.27148c1.16398,2.35163 2.11113,4.30027 2.79102,5.74609c0.67841,1.44268 1.12606,2.53285 1.14258,2.58398c0.2312,0.7544 0.41406,1.50022 0.41406,2.06836c0,2.9299 -2.35954,5.28906 -5.30859,5.28906c-3.58223 ,0 -7.35202,-3.87492 -9.06641,-5.81836l-0.00391,-0.00391l-0.00586,-0.00586c1.84993,-2.30107 4.93555,-6.35681 4.93555,-10.88672c0,-4.04342 -3.42469,-7.28516 -7.5,-7.28516c-4.07531,0 -7.5,3.24174 -7.5,7.28516c0,4.53657 3.08571,8.58975 4.93359,10.88672l-0.00391,0.00391l-0.00391,0.00586c-1.71546,1.94448 -5.48418,5.81836 -9.06641,5.81836c-2.94905,0 -5.30859,-2.35789 -5.30859,-5.28906c0,-0.57127 0.1819,-1.31363 0.41406,-2.06836c0.01371,-0.04374 0.46496,-1.14271 1.14453,-2.58789c0.67957,-1.44518 1.62534,-3.39302 2.78906,-5.74414c2.32745,-4.70225 5.52791,-11.02457 9.25781,-18.26758l0.00195,-0.00391l0.00195,-0.00195c0.67642,-1.32528 1.83848,-2.03711 3.33984,-2.03711zM25,23c1.99069,0 3.5,1.49857 3.5,3.28516c0,2.13899 -1.9229,5.34522 -3.50195,7.51367c-1.57745,-2.16457 -3.49805,-5.36401 -3.49805,-7.51367c0,-1.78658 1.50931,-3.28516 3.5,-3.28516z"></path>
          </g>
        </g>
      </svg>
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative h-screen w-full">
        <div className="absolute inset-0 -z-10">
          <Scene />
        </div>
        <div className="relative overflow-x-hidden z-10 w-[70vw] text-center h-screen mx-auto flex flex-col items-center justify-center gap-7">
          <h1 className="uppercase text-8xl font-bold font-loos-wide">the progressors</h1>
          <p className="text-3xl font-aeroport text-gray-200">Upgrade yourself and everything around - be a trailblazer!</p>
          <Link className="bg-brown px-5 py-3 rounded-full w-44 hover:bg-opacity-90 transition-all" href="/tools">Try Now</Link>
        </div>
      </div>
      <div className="w-[70vw] mt-[200px] mx-auto">
        <p className='px-32 text-center text-5xl font-loos-wide'>The Progressors is your everything everywhere all at once: {`Future's`} Crew all-in-one hub for entertainment, right within the app</p>
        <div className="w-full h-[500px] relative overflow-hidden z-10 border rounded-2xl mt-20">
          <GravityWords />
        </div>
      </div>
      <div className="w-[70vw] mt-[200px] mx-auto mb-20">
        <p className='uppercase font-loos-wide text-6xl font-bold text-center px-60 text-orange'>pay for all services in one place</p>
        <p className='text-center text-xl font-aeroport mt-5'>Browse, manage, and settle your subscriptions through the Progressors app</p>
      </div>
      <div className="flex gap-5 flex-col">
        <Marquee>{marqueeItems}</Marquee>
        <Marquee direction="right">{marqueeItems}</Marquee>
        <Marquee>{marqueeItems}</Marquee>
      </div>
      <div className="w-[70vw] mt-[200px] mx-auto mb-20">
        <p className='uppercase font-loos-wide text-6xl font-bold text-center px-60 text-orange'>getting ready for release
        </p>

        <div className="flex h-[500px] gap-10 mt-20">
          <div className="w-full flex items-center justify-center backdrop-blur-lg bg-white/5 border border-white/10 flex-col rounded-3xl p-5">
            <Image src={gameImage} alt='Game Image' height={100} width={100} />
            <span>Quests and games</span>
            <span>Win and earn in-game currency — you can spend it on in-app subscriptions or character upgrades</span>
          </div>
          <div className="w-full flex items-center justify-center backdrop-blur-lg bg-white/5 border border-white/10 flex-col rounded-3xl p-5">
            <Image src={gameImage} alt='Game Image' height={100} width={100} />
            <span>Quests and games</span>
            <span>Win and earn in-game currency — you can spend it on in-app subscriptions or character upgrades</span>
          </div>
        </div>
      </div>



    </div>
  );
};

export default Home;