import React from "react";

function Guides() {
    return (
        <div className="min-w-screen min-h-screen flex flex-col">
            <main className="flex-1 relative">
            <img
                src="backgroundCamera.jpg"
                alt="Background"
                className="fixed inset-0 object-cover w-full h-full "
            />
            <div className="bg-black bg-opacity-60 absolute inset-0" />
            <div className="mx-auto max-w-5xl relative font-aenonikbold text-white mt-44 mb-20">
                <p className="text-4xl underline underline-offset-[6px] text-center">
                    How to Use MatchLens.
                </p>
                <div className="mx-16 px-3 pb-4 bg-slate-500 bg-opacity-40">
                    <p className="text-3xl mt-20 font-black text-teal-600 tracking-wide ">
                        1. Upload Your Image Dataset
                    </p>
                    <p className="text-xl mt-2 font-thin opacity-[0.85] tracking-tight">
                        Image dataset is required to have a basis for comparison with image you want to search.
                    </p>
                    <p className="text-3xl mt-12 font-black text-teal-600 tracking-wide ">
                        2. Input Image You Want Search
                    </p>
                    <p className="text-xl mt-2 font-thin opacity-[0.85] tracking-tight">
                        User inputs an image to search similarity based on the dataset.
                    </p>
                    <p className="text-3xl mt-12 font-black text-teal-600 tracking-wide ">
                        3. Choose Search Mode
                    </p>
                    <p className="text-xl mt-2 font-thin opacity-[0.85] tracking-tight">
                        User can search similarity based on color or texture
                    </p>
                    <p className="text-3xl mt-12 font-black text-teal-600 tracking-wide ">
                        4. Start Searching
                    </p>
                    <p className="text-xl mt-2 font-thin opacity-[0.85] tracking-tight">
                        Press search button and wait for our program to process the similarity.
                    </p>
                    <p className="text-3xl mt-12 font-black text-teal-600 tracking-wide ">
                        5. Get the Result
                    </p>
                    <p className="text-xl mt-2 font-thin opacity-[0.85] tracking-tight">
                        The program will display all the similiar image on the dataset, sorted from the highest percent of similiar to the lowest.
                        Every image will be included with the similarity percentage.
                    </p>
                    <p className="text-3xl mt-12 font-black text-teal-600 tracking-wide ">
                        6. Download the Result
                    </p>
                    <p className="text-xl mt-2 font-thin opacity-[0.85] tracking-tight">
                        User can download a file that contain the input image, search type, and the similiar image based on searching before.
                    </p>
                </div>
            </div>
            </main>
        </div>
    );
}

export default Guides;