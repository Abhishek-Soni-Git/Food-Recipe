import axios from "axios";
import { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaRegSave,
  FaSave,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import FollowButton from "./FollowButton";
import { Link, useParams } from "react-router-dom";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
// import { useCookies } from 'react-cookie';

function UserProfile() {
  const { uid } = useParams();
  const currentID = useGetUserID();
  const id = uid ? uid : currentID;
  const [isCurrentUser, setisCurrentUser] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [userRecipePost, setUserRecipePost] = useState(null);
  const [preview, setPreview] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const userID = useGetUserID();

  // const [profilePicture, setProfilePicture] = useState("");
  // const [imageFile, setImageFile] = useState(null);
  const [socialMediaLinks, setSocialMediaLinks] = useState({
    twitter: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
  });

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

      fetchUser();
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

      fetchUser();
    } catch (err) {
      console.log(err);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/auth/users/${id}`
      );
      const post = await axios.get(
        `http://localhost:3001/recipes/recipes/${id}`
      );
      setUser(response.data);
      setUserRecipePost(post.data);
      console.log(response.data);
      console.log(post.data);
      if (response.data.followers.includes(currentID)) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
      setSocialMediaLinks(response.data.socialMediaLinks)
      // setProfilePicture(response.data.profilePicture || "");
    } catch (error) {
      console.error("Error fetching user details", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);

    // Generate image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      //console.log(reader.result)
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleProfileSubmit = async () => {
    const formData = new FormData();
    formData.append('userId', id);
    if (profilePicture) {
      formData.append('image', profilePicture);
    }

    try {
      const response = await axios.put('http://localhost:3001/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Profile updated:', response.data);
      setProfilePicture(null);
      setPreview(null);
      setUser(response.data.user)
      // Optionally, update UI to show success message
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  useEffect(() => {
    if (id && id != currentID) {
      setisCurrentUser(false);
    } else {
      setisCurrentUser(true);
    }
    fetchUser();
  }, [id]);

  // Handle file input for profile picture
  //  const handleFileChange = (e) => {
  //   setImageFile(e.target.files[0]);
  // };

  // // Upload profile picture
  // const handleUploadPicture = async () => {
  //   const formData = new FormData();
  //   formData.append("profilePic", imageFile);
  //   formData.append("userId", id);

  //   try {
  //     const response = await axios.post("http://localhost:3001/auth/upload-profile-picture", formData);
  //     alert("Profile picture uploaded successfully!");
  //     setProfilePicture(response.data.profilePicture); // Update the state with new image
  //   } catch (error) {
  //     console.error("Error uploading profile picture", error);
  //   }
  // };

  // // Remove profile picture
  // const handleRemovePicture = async () => {
  //   try {
  //     await axios.post(`http://localhost:3001/auth/remove-profile-picture`, { userId: id });
  //     alert("Profile picture removed successfully!");
  //     setProfilePicture(""); // Clear the profile picture from the state
  //   } catch (error) {
  //     console.error("Error removing profile picture", error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3001/auth/social-links/${id}`,
        socialMediaLinks
      );
      alert("Social media links updated successfully!");
      fetchUser();
    } catch (error) {
      console.error("Error updating social media links", error);
    }
  };

  const handleInputChange = (e) => {
    setSocialMediaLinks({
      ...socialMediaLinks,
      [e.target.name]: e.target.value,
    });
  };

  const handleFollow = async () => {
    try {
      await axios.post(`http://localhost:3001/auth/follow/${id}`, { id: currentID });
      setIsFollowing(true);
      fetchUser();
    } catch (error) {
      console.error('Error following user', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axios.post(`http://localhost:3001/auth/unfollow/${id}`, { id: currentID });
      setIsFollowing(false)
      fetchUser();
    } catch (error) {
      console.error('Error unfollowing user', error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <div className="p-4">
        <h2 className="text-2xl font-bold">User Profile</h2>
      </div>
      <div className="flex justify-between gap-4 px-4">
        <div className="bg-white p-2 flex flex-col gap-2 rounded-[10px] w-full">
          <div className="flex justify-between items-center gap-4">
            <div className="flex gap-2">
              <div className="flex flex-col">
                {preview ? <label for="profileimg" className="rounded-full p-1 border-2 border-[#ff2e2e]" ><img src={preview} className="w-20 object-cover rounded-full aspect-square" /></label> : <label for="profileimg"><img src={import.meta.env.VITE_BACKEND_URL + user.profilePicture} className="w-20 object-cover rounded-full aspect-square" /></label>}

                <input
                  hidden
                  id="profileimg"
                  type="file"
                  onChange={handleFileChange}
                />
                <h1 className="text-xl font-bold">{user.username}</h1>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2">
                  <div className="flex flex-col items-center">
                    <span className="font-bold">{user.followers.length}</span>
                    <span>Followers</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold">{user.following.length}</span>
                    <span>Following</span>
                  </div>
                </div>
                {isCurrentUser ? "" : !isFollowing ? (
                  <button className='bg-blue-500 rounded-[10px] px-2 py-1 text-white' onClick={handleFollow}>Follow</button>
                ) : (
                  <button className='bg-blue-500 rounded-[10px] px-2 py-1 text-white' onClick={handleUnfollow}>Unfollow</button>
                )}
              </div>
            </div>
            {preview ? <div className="flex gap-2"><button onClick={() => handleProfileSubmit()} className="border-2 rounded-[20px] px-4 py-2">Save Profile</button><button onClick={() => setPreview(null)} className="border-2 rounded-[20px] px-4 py-2">Cancel</button></div> : isCurrentUser ? <label for="profileimg"><span className="border-2 rounded-[20px] px-4 py-2 bg-zinc-800 text-white">Edit Profile</span></label> : ""}

          </div>

          <textarea disabled={!isEditing}>{user.bio}</textarea>

          <div className="">
            <div className="my-4 font-bold text-3xl border-b-2 pb-2">My Post</div>
            <div className="flex gap-4 flex-wrap">
              {userRecipePost != null ? userRecipePost.map(rcp => (
                <div
            className="w-[300px] h-fit bg-white rounded-[10px] shadow-lg overflow-hidden"
            key={rcp._id}
          >
            <div>
              <img src={import.meta.env.VITE_BACKEND_URL +rcp.imageUrl} alt={rcp.name} className="aspect-square object-cover w-[200px] flex flex-wrap" />
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
              )) : "No Post Yet"}
            </div>
          </div>

          {/* Profile Picture */}
          {/* <div>
        <h3>Profile Picture</h3>
        {profilePicture ? (
          <div>
            <img src={`http://localhost:3001/${profilePicture}`} alt="Profile" style={{ width: '150px', borderRadius: '50%' }} />
            <button onClick={handleRemovePicture}>Remove Picture</button>
          </div>
        ) : (
          <div>
            <p>No profile picture uploaded yet.</p>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUploadPicture}>Upload Picture</button>
          </div>
        )}
      </div> */}

          <div className="flex text-2xl gap-2">
            {user.socialMediaLinks.twitter != "" ? (
              <a href={user.socialMediaLinks.twitter} className="rounded-full p-2 bg-gray-100" target="_blank">
                <FaTwitter color="black" />
              </a>
            ) : (
              ""
            )}
            {user.socialMediaLinks.facebook != "" ? (
              <a href={user.socialMediaLinks.facebook} className="rounded-full p-2 bg-gray-100" target="_blank">
                <FaFacebook color="blue" />
              </a>
            ) : (
              ""
            )}
            {user.socialMediaLinks.instagram != "" ? (
              <a href={user.socialMediaLinks.instagram} className="rounded-full p-2 bg-gray-100" target="_blank">
                <FaInstagram color="pink" />
              </a>
            ) : (
              ""
            )}
            {user.socialMediaLinks.linkedin != "" ? (
              <a href={user.socialMediaLinks.linkedin} className="rounded-full p-2 bg-gray-100" target="_blank">
                <FaLinkedin color="blue" />
              </a>
            ) : (
              ""
            )}
            {user.socialMediaLinks.youtube != "" ? (
              <a href={user.socialMediaLinks.youtube} className="rounded-full p-2 bg-gray-100" target="_blank">
                <FaYoutube color="red" />
              </a>
            ) : (
              ""
            )}
          </div>
        </div>
        {isCurrentUser ? (
          <div className="w-[400px] bg-white p-2 flex flex-col gap-2 rounded-[10px]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <h3 className="font-bold text-lg">Update Social Media Links</h3>
              <div className="flex justify-between items-center">
                <label>Twitter:</label>
                <input
                  type="text"
                  name="twitter"
                  value={socialMediaLinks.twitter || ""}
                  className="p-1 px-2 bg-gray-100 rounded-[5px]"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex justify-between items-center">
                <label>Facebook:</label>
                <input
                  type="text"
                  name="facebook"
                  value={socialMediaLinks.facebook || ""}
                  className="p-1 px-2 bg-gray-100 rounded-[5px]"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex justify-between items-center">
                <label>Instagram:</label>
                <input
                  type="text"
                  name="instagram"
                  value={socialMediaLinks.instagram || ""}
                  className="p-1 px-2 bg-gray-100 rounded-[5px]"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex justify-between items-center">
                <label>LinkedIn:</label>
                <input
                  type="text"
                  name="linkedin"
                  className="p-1 px-2 bg-gray-100 rounded-[5px]"
                  value={socialMediaLinks.linkedin || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex justify-between items-center">
                <label>YouTube:</label>
                <input
                  type="text"
                  name="youtube"
                  value={socialMediaLinks.youtube || ""}
                  className="p-1 px-2 bg-gray-100 rounded-[5px]"
                  onChange={handleInputChange}
                />
              </div>
              <button className="px-4 py-1 bg-black rounded-[5px] text-white font-bold" type="submit">Update Social Media Links</button>
            </form>
          </div>
        ) : (
          ""
        )}

      </div>
    </div>
  );
}

export default UserProfile;
