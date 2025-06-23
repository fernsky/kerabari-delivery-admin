import React from "react";

const InteractiveMap = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Interactive Map
        </h2>
        <div className="w-full h-[500px] bg-gray-200 rounded-lg shadow-md">
          {/* Placeholder for the map */}
          <p className="text-center text-gray-600 pt-20">Map will be here</p>
        </div>
      </div>
    </section>
  );
};

export default InteractiveMap;
