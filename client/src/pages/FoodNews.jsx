import React, { useEffect, useState } from "react";
import axios from "axios";

const FoodNews = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  // const [loading, setLoading] = useState(true);
  const apikey = '5cb9d24e6dc64742a39d5d952cbd1a26';
  const fetchFoodNews = async () => {
    try {
      const response = await axios.get("https://newsapi.org/v2/everything?q=food&from=2024-10-11&sortBy=publishedAt&apiKey=5cb9d24e6dc64742a39d5d952cbd1a26");
      console.log(response.data)
      setNewsArticles(response.data);
    } catch (error) {
      console.error("Error fetching food news:", error);
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodNews();
  }, []);

  if (!newsArticles) return <div>Loading...</div>;

  return (
    <div className="food-news-section">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Food News</h1>
      </div>
      <div className="px-4 flex flex-wrap gap-4">
      {/* <div>{newsArticles.length != 0 ? newsArticles : ""}</div> */}
      {newsArticles.length === 0 ? (
        <p>No news articles available.</p>
      ) : (
        newsArticles.articles.map((article, index) => {
          if (article.title != "[Removed]") {
            return (
              <div key={index} className="flex flex-col w-[300px] rounded-[10px] overflow-hidden bg-white">
                <img src={article.urlToImage} className="aspect-video object-cover" />
                <h3 className="p-2">
                  <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#333" }}>
                    {article.title}
                  </a>
                </h3>
                <p className="p-2 text-xs">{article.description}</p>
                <small className="p-2">Source: {article.source.name}</small>
                <small className="p-2">{new Date(article.publishedAt).toLocaleString()}</small>
              </div>
            )
          }
        })
      )}
      </div>
    </div>
  );
};

export default FoodNews;
