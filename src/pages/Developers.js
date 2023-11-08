import React from "react";

function Developers() {
    return (
        <div className="min-w-screen min-h-screen flex flex-col">
            <main className="flex-1 relative">
                <img
                    src="backgroundCamera.jpg"
                    alt="Background"
                    className="fixed inset-0 object-cover w-full h-full"
                />
                <div className="bg-black bg-opacity-60 absolute inset-0"></div>
                <p className="relative font-aenonikbold text-white text-center text-5xl mt-52">Meet our Developers</p>
                <div className="relative pt-24 text-white text-xl font-aenonikbold text-center">
                    <div className="grid grid-cols-3 gap-12 mx-64 -mt-10">
                    <p className="mx-auto max-h-fit">
                            <a href="https://github.com/ChaiGans" target="_blank" rel="noreferrer" className="block rounded-full">
                                <img
                                    src="apin.jpg"
                                    alt="Foto profil Elbert Chailes"
                                    className="max-w-xs mx-auto mt-auto mb-6 transition ease-in-out delay-150
                                    hover:-translate-y-1 hover:scale-110 duration-300 rounded-full ring-8"
                                />
                            </a>
                            Elbert Chailes
                        </p>
                        <p className="mx-auto max-h-fit">
                            <a href="https://github.com/Farel" target="_blank" rel="noreferrer" className="block rounded-full">
                                <img
                                    src="farel.jpg"
                                    alt="Foto profil Farel Winalda"
                                    className="max-w-xs mx-auto mt-auto mb-6 transition ease-in-out delay-150
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
                                    className="max-w-xs mx-auto mt-auto mb-6 transition ease-in-out delay-150
                                    hover:-translate-y-1 hover:scale-110 duration-300 rounded-full ring-8"
                                />
                            </a>
                            Ivan Hendrawan Tan
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Developers;