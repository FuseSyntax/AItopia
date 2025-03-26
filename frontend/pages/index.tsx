import Link from 'next/link';
import dynamic from 'next/dynamic';
import GravityWords from '../components/GravityWords';

const Scene = dynamic(() => import('../components/Scene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" />
});

const Home = () => {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Banner container with h-screen */}
      <div className="relative h-screen w-full">
        {/* Scene rendered as background */}
        <div className="absolute inset-0 -z-10">
          <Scene />
        </div>

        {/* Banner Content */}
        <div className="relative overflow-x-hidden z-10 w-[70vw] text-center h-screen mx-auto flex flex-col items-center justify-center gap-7">
          <h1 className="uppercase text-8xl font-bold font-loos-wide text-white">
            the progressors
          </h1>
          <p className="text-3xl font-aeroport text-gray-200">
            Upgrade yourself and everything around - be a trailblazer!
          </p>
          <Link
            className="bg-brown text-white px-5 py-3 rounded-full w-44 hover:bg-opacity-90 transition-all"
            href="/tools"
          >
            Try Now
          </Link>
        </div>
      </div>



      <div className="w-[70vw] mt-[200px] mx-auto">
        <p className='text-white px-32 text-center text-5xl font-loos-wide '>The Progressors is your everything everywhere all at once: {`Future's`} Crew all-in-one hub for entertainment, right within the app </p>

        <div className="w-full h-[500px] relative overflow-hidden z-10">
          <GravityWords />
        </div>
      </div>

    </div>
  );
};

export default Home;
