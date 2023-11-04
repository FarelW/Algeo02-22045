import Form from "../components/Form";
import Header from "../components/Header";

function Home() {
  return (
    <div className="min-w-screen min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative">
        <img
          src="backgroundCamera.jpg"
          alt="Background"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="bg-black bg-opacity-60 absolute inset-0"></div>
        <div className="relative z-[2] pt-44 flex justify-end">
          <div className="overflow-hidden border-r-2 h-full w-[45%] text-[30px] text-white font-aenonikregular">
            <div className="whitespace-nowrap animate-typing">
              This text will have a typing effect!
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
