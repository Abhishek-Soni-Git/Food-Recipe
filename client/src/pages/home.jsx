import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { FaRegSave, FaSave } from "react-icons/fa";
import { Link } from "react-router-dom";
import Slider from "../components/Slider";
// import Slider from "./pages/Slider";



export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [recipeCategorywise, setRecipeCategorywise] = useState(null);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [query, setQuery] = useState("");

  const userID = useGetUserID();

  const fetchRecipes = async () => {
    try {
      const response = await axios.get("http://localhost:3001/recipes");
      const response2 = await axios.get("http://localhost:3001/recipes/categorieswise");
      setRecipes(response.data);
      setRecipeCategorywise(response2.data);
      console.log(response2.data.categories)
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipes();
    fetchSavedRecipes();
  }, []);

  //more details button
  useEffect(() => {
    fetchRecipes();
  }, []);

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put("http://localhost:3001/recipes/", {
        recipeID,
        userID,
      });
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleLike = async (recipeID) => {
    try {
      await axios.put("http://localhost:3001/recipes/toggleLike", {
        recipeID,
        userID,
      });

      fetchRecipes();
    } catch (err) {
      console.log(err);
    }
  };
  const toggleDisLike = async (recipeID) => {
    try {
      await axios.put("http://localhost:3001/recipes/toggleDisLike", {
        recipeID,
        userID,
      });

      fetchRecipes();
    } catch (err) {
      console.log(err);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  const searchRecipes = (e) => {
    e.preventDefault();
    const filtered = recipes.filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(query.toLowerCase()) ||
        recipe.category?.toLowerCase().includes(query.toLowerCase())
    );
    console.log(filtered);
    setFilteredRecipes(filtered);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className="h-[90%] px-[20%]">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Recipes</h1>

        <div className="flex border-[1px] rounded-[10px] overflow-hidden">
          <input
            type="search"
            className="p-1 bg-gray-50"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="bg-white p-1 px-2" onClick={searchRecipes}>
            search
          </button>
        </div>
      </div>

      {/* <div className="home-page">
      <h1 className="text-center text-3xl font-bold my-5">Welcome to Food Recipes</h1>
      <Slider />
    </div> */}
      <Slider />
      <div className="p-4">
        <div className="flex flex-col gap-4">
          {recipeCategorywise != null ? recipeCategorywise.categories.map((data, idx) => (<div key={idx} className="flex flex-col gap-4">
            <div className="font-bold text-2xl bg-black text-white">{data.name}</div>
            <div className="flex gap-4 overflow-auto">{data.data.map(rcp => (
              <div
                className="w-[300px] flex-none h-fit bg-white rounded-[10px] overflow-hidden"
                key={rcp._id}
              >
                <div>
                  <img src={import.meta.env.VITE_BACKEND_URL + rcp.imageUrl} alt={rcp.name} className="aspect-square object-cover" />
                  <h2 className="p-2 font-bold text-lg">{rcp.name}</h2>
                  <div className="flex justify-between gap-2 p-2">
                    <div className="flex gap-2">
                      <button className="flex gap-2 p-2 bg-gray-200 rounded-[10px] justify-center items-center" onClick={() => toggleLike(rcp._id)}>
                        {rcp ? rcp.likes.length : 0}
                        {rcp && rcp.likes.includes(userID) ? (
                          <BiSolidLike />
                        ) : (
                          <BiLike />
                        )}
                      </button>
                      <button className="flex gap-2 p-2 px-4 bg-gray-200 rounded-[10px] justify-center items-center" onClick={() => toggleDisLike(rcp._id)}>
                        {rcp ? rcp.dislikes.length : 0}
                        {rcp && rcp.dislikes.includes(userID) ? (
                          <BiSolidDislike />
                        ) : (
                          <BiDislike />
                        )}
                      </button>
                    </div>
                    <button
                      onClick={() => saveRecipe(rcp._id)}
                      disabled={isRecipeSaved(rcp._id)}
                      className="flex p-2 aspect-square bg-gray-200 rounded-[10px] justify-center items-center"
                    >
                      {isRecipeSaved(rcp._id) ? <FaSave /> : <FaRegSave />}
                    </button>
                  </div>
                </div>
                <div className="instructions">
                  <p>{rcp.instructions}</p>
                </div>


                <p>Cooking Time: {rcp.cookingTime} minutes</p>
                <Link className="p-2 text-blue-600 text-sm font-bold mb-2" to={`/recipe/${rcp._id}`}>
                  <button>More Details</button>
                </Link>
              </div>
            ))}</div>
          </div>)
          ) : "No recipe"
          }
        </div>
        {/* <ul className="flex flex-wrap gap-4">
          {query != "" && filteredRecipes.length > 0
            ? filteredRecipes.map((recipe) => (
                <li
                  className="w-[300px] h-fit bg-white rounded-[10px] overflow-hidden"
                  key={recipe._id}
                >
                  <div>
                    <img src={recipe.imageUrl} alt={recipe.name} />
                    <h2 className="p-2 font-bold text-lg">{recipe.name}</h2>
                    <div className="flex justify-between gap-2 p-2">
                      <div className="flex gap-2">
                        <button className="flex gap-2 p-2 bg-gray-200 rounded-[10px] justify-center items-center" onClick={() => toggleLike(recipe._id)}>
                          {recipe ? recipe.likes.length : 0}
                          {recipe && recipe.likes.includes(userID) ? (
                            <BiSolidLike />
                          ) : (
                            <BiLike />
                          )}
                        </button>
                        <button className="flex gap-2 p-2 px-4 bg-gray-200 rounded-[10px] justify-center items-center" onClick={() => toggleDisLike(recipe._id)}>
                          {recipe ? recipe.dislikes.length : 0}
                          {recipe && recipe.dislikes.includes(userID) ? (
                            <BiSolidDislike />
                          ) : (
                            <BiDislike />
                          )}
                        </button>
                      </div>
                      <button
                        onClick={() => saveRecipe(recipe._id)}
                        disabled={isRecipeSaved(recipe._id)}
                        className="flex p-2 aspect-square bg-gray-200 rounded-[10px] justify-center items-center"
                      >
                        {isRecipeSaved(recipe._id) ? <FaSave /> : <FaRegSave />}
                      </button>
                    </div>
                  </div>
                  {/* <div className="instructions">
                <p>{recipe.instructions}</p>
              </div>
              
              
              <p>Cooking Time: {recipe.cookingTime} minutes</p> 
                  <Link className="p-2 text-blue-600 text-sm font-bold mb-2" to={`/recipe/${recipe._id}`}>
                    <button>More Details</button>
                  </Link>
                </li>
              ))
            : recipes.map((recipe) => (
                <li
                  className="w-[300px] h-fit bg-white rounded-[10px] overflow-hidden"
                  key={recipe._id}
                >
                  <div>
                    <img src={recipe.imageUrl} alt={recipe.name} className="w-full aspect-video" />
                    <h2 className="p-2 font-bold text-lg">{recipe.name}</h2>
                    <div className="flex justify-between gap-2 p-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleLike(recipe._id)}
                          className="flex gap-2 p-2 px-4 bg-gray-200 rounded-[10px] justify-center items-center"
                        >
                          {recipe ? recipe.likes.length : 0}
                          {recipe && recipe.likes.includes(userID) ? (
                            <BiSolidLike />
                          ) : (
                            <BiLike />
                          )}
                        </button>
                        <button
                          onClick={() => toggleDisLike(recipe._id)}
                          className="flex gap-2 p-2 px-4 bg-gray-200 rounded-[10px] justify-center items-center"
                        >
                          {recipe ? recipe.dislikes.length : 0}
                          {recipe && recipe.dislikes.includes(userID) ? (
                            <BiSolidDislike />
                          ) : (
                            <BiDislike />
                          )}
                        </button>
                      </div>
                      <button
                        onClick={() => saveRecipe(recipe._id)}
                        disabled={isRecipeSaved(recipe._id)}
                        className="flex p-2 px-4 aspect-square bg-gray-200 rounded-[10px] justify-center items-center"
                      >
                        {isRecipeSaved(recipe._id) ? <FaSave /> : <FaRegSave />}
                      </button>
                    </div>
                  </div>
                  {/* <div className="instructions">
                <p>{recipe.instructions}</p>
              </div>
              
              
              <p>Cooking Time: {recipe.cookingTime} minutes</p> 
                  <Link
                    to={`/recipe/${recipe._id}`}
                    className="p-2 text-blue-600 text-sm font-bold mb-2"
                  >
                    <button>More Details</button>
                  </Link>
                </li>
              ))}
        </ul> */}
      </div>
    </div>
  );
};
