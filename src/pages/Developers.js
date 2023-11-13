import React from "react";

function Developers() {
    return (
        <div className="min-w-min min-h-screen flex flex-col overflow-hidden">
            <main className="flex-1 relative">
                <img
                    src="backgroundCamera.jpg"
                    alt="Background"
                    className="fixed inset-0 object-cover w-full h-full"
                />
                <div className="">
                    <div className="bg-black bg-opacity-60 absolute inset-0"></div>
                    <p className="relative font-aenonikbold text-white text-center text-3xl sm:max-lg:text-4xl lg:text-5xl mt-52 w-max mx-auto border-[3px] border-white border-opacity-60 px-6 py-3 transition hover:bg-green-800 hover:bg-opacity-50 delay-75 rounded-full">
                        Meet Our Developers
                    </p>
                    <div className="relative pt-24 text-white text-xl font-aenonikbold text-center">
                        <div className="grid grid-cols-3 -mt-10 sm:max-lg:mx-40 lg:mx-48 gap-8">
                            <p className="mx-auto max-h-fit">
                                <a href="https://github.com/ChaiGans" target="_blank" rel="noreferrer" className="block rounded-full">
                                    <img
                                        src="apin.jpg"
                                        alt="Foto profil Elbert Chailes"
                                        title="Click for Github Link"
                                        className="w-full max-w-xs mx-auto mt-auto mb-6 transition ease-in-out delay-150
                                        hover:-translate-y-1 hover:scale-110 duration-300 rounded-full ring-8"
                                    />
                                </a>
                                Elbert Chailes
                            </p>
                            <p className="mx-auto max-h-fit">
                                <a href="https://github.com/FarelW/" target="_blank" rel="noreferrer" className="block rounded-full">
                                    <img
                                        src="farel.jpg"
                                        alt="Foto profil Farel Winalda"
                                        title="Click for Github Link"
                                        className="w-full max-w-xs mx-auto mt-auto mb-6 transition ease-in-out delay-150
                                        hover:-translate-y-1 hover:scale-110 duration-300 rounded-full ring-8"
                                    />
                                </a>
                                Farel Winalda
                            </p>
                            <p className="mx-auto max-h-fit">
                                <a href="https://github.com/Bodleh" target="_blank" rel="noreferrer" className="block rounded-full">
                                    <img
                                        src="ivan.jpg"
                                        alt="Foto profil Ivan Hendrawan Tan"
                                        title="Click for github link"
                                        className="w-full max-w-xs mx-auto mt-auto mb-6 transition ease-in-out delay-150
                                        hover:-translate-y-1 hover:scale-110 duration-300 rounded-full ring-8"
                                    />
                                </a>
                                Ivan Hendrawan Tan
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Developers;