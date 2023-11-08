import React from "react";
import Header from "../components/Header";


function Developers() {
    return (
        <div className="min-w-screen min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 relative">
                <img
                    src="backgroundCamera.jpg"
                    alt="Background"
                    className="fixed inset-0 object-cover w-full h-full"
                />
                <div className="bg-black bg-opacity-60 absolute inset-0"></div>
                <div className="relative pt-24 text-white text-[36px] font-aenonikbold text-center">
                    <p className="my-12 max-w-fit mx-auto">
                        Elbert Chailes
                        <a href="https://github.com/ChaiGans" target="_blank" rel="noreferrer">
                            <img
                                src="apin.jpg"
                                alt="Foto profil Elbert Chailes"
                                className="max-w-lg mx-auto my-10 transition ease-in-out delay-150
                                hover:-translate-y-1 hover:scale-110 duration-300"
                            />
                        </a>
                        Mahasiswa IF'22 ITB 
                    </p>
                    <p className="my-32 max-w-fit mx-auto">
                        Farel Winalda
                        <a href="https://github.com/Farel" target="_blank" rel="noreferrer">
                            <img
                                src="farel.jpg"
                                alt="Foto profil Farel Winalda"
                                className="max-w-lg mx-auto my-10 transition ease-in-out delay-150
                                hover:-translate-y-1 hover:scale-110 duration-300"
                            />
                        </a>
                        Mahasiswa IF'22 ITB 
                    </p>
                    <p className="my-32 max-w-fit mx-auto">
                        Ivan Hendrawan Tan
                        <a href="https://github.com/Bodleh" target="_blank" rel="noreferrer">
                            <img
                                src="ivan.jpg"
                                alt="Foto profil Ivan Hendrawan Tan"
                                className="max-w-lg mx-auto my-10 transition ease-in-out delay-150
                                hover:-translate-y-1 hover:scale-110 duration-300"
                            />
                        </a>
                        Mahasiswa IF'22 ITB 
                    </p>
                </div>
            </main>
        </div>
    );
}

export default Developers;