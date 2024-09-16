import React from "react";

const TutorialModal: React.FC = () => {
    return (
        <>
            <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <img
                    className="w-full h-48 object-cover object-center"
                    src="https://via.placeholder.com/400x300"
                    alt="Sample"
                />
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2 text-gray-800">Card Title</h2>
                    <p className="text-gray-600 mb-4">
                        This is a simple card component styled using Tailwind CSS. You can use Tailwind's utility classes to style your components and create responsive layouts.
                    </p>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Click Me
                    </button>
                </div>
            </div>
        </>
    );
}

export default TutorialModal