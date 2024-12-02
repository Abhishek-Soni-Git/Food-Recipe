import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//import "./App.css";
import Navbar from "./components/navbar";
import { Auth } from "./pages/auth";
import { CreateRecipe } from "./pages/create-recipe";
import { Home } from "./pages/home";
import { SavedRecipes } from "./pages/saved-recipes";
import AdminPage from "./pages/AdminPage"; // Import AdminPage
import UserPage from "./pages/UserPage";
import { AdminRecipeList } from "./pages/AdminRecipeList";
import { RecipeDetails } from "./pages/RecipeDetails"; 
import UserProfile from "./pages/UserProfile";
import FoodNews from "./pages/FoodNews";
import Slider from "./components/Slider";

function App() {
  return (
    <div className="App h-screen bg-gray-200">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create-recipe" element={<CreateRecipe />} />
          <Route path="/saved-recipes" element={<SavedRecipes />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/adminhome" element={<AdminPage />} /> {/* Admin Route */}
          <Route path="/adminrecipe" element={<AdminRecipeList />} /> 
          <Route path="/user" element={<UserPage />} /> {/* User Route */}
          <Route path="/userprofile" element={<UserProfile />} /> {/* User Route */}
          <Route path="/userprofile/:uid" element={<UserProfile />} /> {/* User Route */}
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/food-news" element={<FoodNews />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
