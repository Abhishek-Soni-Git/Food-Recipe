import express from "express";
import mongoose from "mongoose";
import { RecipesModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./user.js";
import multer from "multer";
import path from 'path';

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/'); // Folder where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Define file naming convention
  },
});

// Set up Multer with storage and file filter for images only
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/; // Allowed image formats
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed!')); // Reject non-image files
    }
  },
});

router.get('/recipes/:id', async (req, res) => {
  try {
    // Assuming the user ID is in the JWT token payload
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: 'Invalid userId provided.' });
    }

    // Query recipes based on userOwner field
    const recipes = await RecipesModel.find({ userOwner: userId });

    // Return the list of recipes
    res.status(200).json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error occurred while fetching recipes.' });
  }
});

router.get('/categorieswise', async (req, res) => {
  console.log("called")
  try {
    // Step 1: Retrieve all unique categories from the Recipes model
    const categories = await RecipesModel.distinct('category');

    if (categories.length === 0) {
      return res.status(404).json({ message: 'No categories found' });
    }

    // Step 2: Fetch recipes for each category
    const recipesByCategory = [];

    // Loop through categories and fetch the associated recipes for each
    for (const category of categories) {
      const recipes = await RecipesModel.find({ category: category });
      let temp = {};
      temp.name = category;
      temp.data = recipes;
      recipesByCategory.push(temp);
    }

    // Send back the result with categories and their recipes
    return res.status(200).json({ categories: recipesByCategory });
  } catch (err) {
    console.error('Error fetching categories and recipes:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/latest-images', async (req, res) => {
  try {
    const recipes = await RecipesModel.find().sort({ createdAt: -1 }).limit(3);
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await RecipesModel.find({}).sort({ likes: -1 });
    result.sort((a, b) => b.likes.length - a.likes.length);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new recipe
router.post("/", verifyToken, upload.single('image'), async (req, res) => {
  console.log(req.file)
  const recipe = new RecipesModel({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    image: req.body.image,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    imageUrl: '/uploads/'+req.file.filename,
    cookingTime: req.body.cookingTime,
    category:req.body.category,
    userOwner: req.body.userOwner,
    description: req.body.description
  });
  console.log(recipe);

  try {
    const result = await recipe.save();
    res.status(201).json({
      createdRecipe: {
        name: result.name,
        image: result.image,
        ingredients: result.ingredients,
        instructions: result.instructions,
        category:result.category,
        _id: result._id,
      },
    });
  } catch (err) {
    // console.log(err);
    res.status(500).json(err);
  }
});

// Get a recipe by ID
router.get("/:recipeId", async (req, res) => {
  try {
    const result = await RecipesModel.findById(req.params.recipeId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Save a Recipe
router.put("/", async (req, res) => {
  const recipe = await RecipesModel.findById(req.body.recipeID);
  const user = await UserModel.findById(req.body.userID);
  try {
    user.savedRecipes.push(recipe);
    await user.save();
    res.status(201).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

// Get id of saved recipes
router.get("/savedRecipes/ids/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    res.status(201).json({ savedRecipes: user?.savedRecipes });
  } catch (err) {
    console.log("error"+err);
    res.status(500).json(err);
  }
});

// Get saved recipes
router.get("/savedRecipes/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const savedRecipes = await RecipesModel.find({
      _id: { $in: user.savedRecipes },
    });

    console.log(savedRecipes);
    res.status(201).json({ savedRecipes });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export { router as recipesRouter };

// Like a recipe
router.put("/toggleLike", async (req, res) => {
  const { recipeID, userID } = req.body;

  try {
    // Find the recipe by ID
    const recipe = await RecipesModel.findById(recipeID);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if the user has already liked the recipe
    const alreadyLiked = recipe.likes.includes(userID);

    if (alreadyLiked) {
      // Unlike: Remove the user's ID from the 'likes' array
      recipe.likes = recipe.likes.filter((id) => id.toString() !== userID);
      await recipe.save();

      return res.status(200).json({
        message: "Recipe unliked",
        likes: recipe.likes,
      });
    } else {
      // Like: Add the user's ID to the 'likes' array
      recipe.likes.push(userID);
      recipe.dislikes = recipe.dislikes.filter((id) => id.toString() !== userID);
      await recipe.save();

      return res.status(200).json({
        message: "Recipe liked",
        likes: recipe.likes,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err });
  }
});

router.put("/toggleDisLike", async (req, res) => {
  const { recipeID, userID } = req.body;

  try {
    // Find the recipe by ID
    const recipe = await RecipesModel.findById(recipeID);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if the user has already liked the recipe
    const alreadyDisLiked = recipe.dislikes.includes(userID);

    if (alreadyDisLiked) {
      // Unlike: Remove the user's ID from the 'dislikes' array
      recipe.dislikes = recipe.dislikes.filter((id) => id.toString() !== userID);
      await recipe.save();

      return res.status(200).json({
        message: "Recipe unliked",
        likes: recipe.dislikes,
      });
    } else {
      // Like: Add the user's ID to the 'likes' array
      recipe.dislikes.push(userID);
      recipe.likes = recipe.likes.filter((id) => id.toString() !== userID);
      await recipe.save();

      return res.status(200).json({
        message: "Recipe disliked",
        likes: recipe.dislikes,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const recipeId = req.params.id; // Get the recipe ID from the request parameters
    const deletedRecipe = await RecipesModel.findByIdAndDelete(recipeId); // Find and delete the recipe

    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" }); // Handle case where recipe is not found
    }

    res.status(204).send(); // Send a no content response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" }); // Handle server errors
  }
});




router.get("/:id", async (req, res) => {
  try {
    const recipe = await RecipesModel.findById(req.params.id).populate('userOwner');
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


