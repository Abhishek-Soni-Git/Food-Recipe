// FollowButton.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FollowButton = ({ userId, targetUserId ,isFollowing}) => {
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    console.log("follow1" + isFollowing)
    setFollowing(isFollowing)
    console.log("follow2" + following)
  }, [])
  

  const handleFollow = async () => {
    try {
      await axios.post(`http://localhost:3001/auth/follow/${targetUserId}`,{id:userId});
      setFollowing(true);
    } catch (error) {
      console.error('Error following user', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axios.post(`http://localhost:3001/auth/unfollow/${targetUserId}`,{id:userId});
      setFollowing(false);
    } catch (error) {
      console.error('Error unfollowing user', error);
    }
  };

  return (
    <div>
      {!following ? (
        <button className='bg-blue-500 rounded-[10px] px-2 py-1 text-white' onClick={handleFollow}>Follow</button>
      ) : (
        <button className='bg-blue-500 rounded-[10px] px-2 py-1 text-white' onClick={handleUnfollow}>Unfollow</button>
      )}
    </div>
  );
};

export default FollowButton;
