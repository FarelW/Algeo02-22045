import React from "react";

function Technology() {
    return (
        <div className="min-w-screen min-h-screen flex flex-col">
            <main className="flex-1 relative">
                <img
                    src="backgroundCamera.jpg"
                    alt="Background"
                    className="fixed inset-0 object-cover w-full h-full"
                />
                <div className="bg-black bg-opacity-60 absolute inset-0"></div>
            </main>
        </div>
    );
}

export default Technology;