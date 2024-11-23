import React, { useEffect, useState } from "react";
import axios from "axios";

export const AdminRecipeList = () => {
  const [recipes, setRecipes] = useState([]);

  // Fetch all recipes
  const fetchRecipes = async () => {
    try {
      const response = await axios.get("http://localhost:3001/recipes");
      setRecipes(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete a recipe
  const deleteRecipe = async (id) => {
    if(confirm("Are you sure?")){
      try {
        await axios.delete(`http://localhost:3001/recipes/${id}`);
        setRecipes(recipes.filter((recipe) => recipe._id !== id));
      } catch (err) {
        console.error(err);
      }
    } 
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className="admin-recipe-list" style={{backgroundColor:'white', padding:'10px'}}>
      <h1>Admin Recipe List</h1>
      <table  border='1' style={{textAlign:'center'}}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Cooking Time (minutes)</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe) => (
            <tr key={recipe._id}>
              <td>{recipe.name}</td>
              <td>{recipe.description}</td>
              <td>{recipe.cookingTime}</td>
              <td>
                <img src={recipe.imageUrl} alt={recipe.name} style={{ width: "50px", height: "50px" }} />
              </td>
              <td>
                <button onClick={() => deleteRecipe(recipe._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
