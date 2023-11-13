import React from "react";

function Technology() {
    return (
        <div className="min-w-screen min-h-screen flex flex-col">
            <main className="flex-1 relative">
                <img
                    src="backgroundCamera.jpg"
                    alt="Background"
                    className="fixed inset-0 object-cover w-full h-full "
                />
                <div className="bg-black bg-opacity-60 absolute inset-0" />
                <div className="grid grid-cols-2 mt-56 lg:mx-48 gap-8 animate-fade-down">
                    <div className="relative text-white font-aenonikbold text-center bg-green-800 bg-opacity-25 border-[5px] py-4 hover:bg-opacity-40 rounded-3xl">
                        <p className="text-4xl">Front-end</p>
                        <div className="flex justify-center mt-12 gap-8 mb-10">
                            <img 
                                src="tailwind.png"
                                alt="tailwind logo"    
                                className="w-5/12 h-5/12"               
                            />
                            <img 
                                src="react.png"
                                alt="react logo"
                                className="w-2/6 h-2/6"
                            />
                        </div>
                        <p className="text-3xl">
                            Tailwind + React
                        </p>
                    </div>
                    <p className="relative text-white text-3xl font-aenonikbold text-center bg-green-800 bg-opacity-25 border-[5px] py-4 hover:bg-opacity-40 rounded-3xl">
                        <p className="text-4xl">Back-end</p>
                        <div className="flex justify-center mt-12 mb-10">
                            <img 
                                src="Go-Logo_Blue.png"
                                alt="Golang logo"
                                className="w-4/6 h-4/6 lg:mr-10 sm:max-lg:mx-auto"
                            />
                        </div>
                        Golang
                    </p>
                </div>
            </main>
        </div>
    );
}

export default Technology;