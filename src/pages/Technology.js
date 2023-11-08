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
                <div className="bg-black bg-opacity-60 absolute inset-0"></div>
                <div className="grid grid-cols-2 mt-48 lg:mx-48 gap-8 ">
                    <div className="relative text-white text-3xl font-aenonikbold text-center">
                        Front-end
                        <div className="flex">
                            <img 
                                src="tailwind.png"
                                alt="tailwind logo"    
                                className="w-3/6 h-3/6"                  
                            />
                            <img 
                                src="react.png"
                                alt="react logo"
                                className="w-5/12 h-5/12"
                            />
                        </div>
                    </div>
                    <p className="relative text-white text-3xl font-aenonikbold text-center">
                        Back-end
                    </p>
                </div>
            </main>
        </div>
    );
}

export default Technology;