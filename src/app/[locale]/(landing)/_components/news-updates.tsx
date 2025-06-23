import React from "react";

const NewsUpdates = () => {
  const news = [
    {
      title: "News Title 1",
      date: "2023-01-01",
      description: "Description for news 1",
    },
    {
      title: "News Title 2",
      date: "2023-02-01",
      description: "Description for news 2",
    },
    {
      title: "News Title 3",
      date: "2023-03-01",
      description: "Description for news 3",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          News & Updates
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-2">{item.date}</p>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsUpdates;
