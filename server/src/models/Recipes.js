import mongoose from "mongoose";

const recipeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: ""
  },
  ingredients: [
    {
      type: String,
      required: true,
    },
  ],
  instructions: {
    type: String,
    required: true,
  },

  imageUrl: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  cookingTime: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true
  },
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
});

export const RecipesModel = mongoose.model("Recipes", recipeSchema);
