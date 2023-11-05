import { Link } from "react-router-dom";
import {BiSearchAlt2} from "react-icons/bi";

function Home() {
  return (
    <div className="min-w-screen min-h-screen flex flex-col">
      <main className="flex-1 relative">
        <img
          src="backgroundCamera.jpg"
          alt="Background"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="bg-black bg-opacity-60 absolute inset-0"></div>
        <div className="relative z-[2] pt-32 flex items-end text-white flex-col px-12">
          <div className=" w-[50%]">
            <p className="text-[48px] font-aenonikbold">
              MatchLens is{" "}
              <div className="overflow-hidden h-[65px] w-fit">
                <span className="pr-4 animate-spin_words flex">ACCURATE.</span>
                <span className="pr-4 animate-spin_words flex">ELEGANT.</span>
                <span className="pr-4 animate-spin_words flex">INSTANT.</span>
                <span className="pr-4 animate-spin_words flex">SIMILAR.</span>
                <span className="pr-4 animate-spin_words flex">FREE.</span>
              </div>
            </p>
            <p className="text-[35px] font-aenoniklight underline underline-offset-4 mt-4">
              The Future of Image Matching
            </p>
            <p className="text-[14px] text-gray-300 font-aenonikregular text-justify">
              Discover the unseen with MatchLens: Your smart gateway to image
              discovery. Unleash the potential of precision-driven image
              matching and revolutionize the way you search, compare, and manage
              your digital imagery.
            </p>
            <br />
            <p className="text-[14px] text-gray-300 font-aenonikregular text-justify">
              Don’t let a world of images go unseen. Unleash the full potential
              of image matching with MatchLens.
            </p>
            <Link to="/application">
              <button className="hover:text-white hover:bg-black transition-all place-self-start flex flex-row gap-x-2 items-center mt-4 py-2 rounded-md bg-yellow-400 text-black px-3 font-aenonikregular">
                <BiSearchAlt2 className="hover:text-white"></BiSearchAlt2>
                Explore Your Visual Journey
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
