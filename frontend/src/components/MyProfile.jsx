import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyProfile = () => {
  const loggedInUser = localStorage.getItem('loggedInUser');
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`http://localhost:3001/getuserprofile?username=${loggedInUser}`);
        setUserProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Error loading profile.");
      } finally {
        setLoading(false);
      }
    };

    if (loggedInUser) {
      fetchUserProfile();
    } else {
      setLoading(false);
      setError("User not logged in.");
    }
  }, [loggedInUser]);

  const handleFollow = async (targetUser) => {
    if (userProfile.following.includes(targetUser)) {
      setError(`You are already following ${targetUser}.`);
      return;
    }

    try {
      await axios.post('http://localhost:3001/follow', {
        loggedInUser,
        targetUser
      });

      setUserProfile((prevState) => ({
        ...prevState,
        following: [...prevState.following, targetUser]
      }));
    } catch (err) {
      console.error("Error following user:", err);
      setError("Error following user.");
    }
  };

  const handleUnfollow = async (targetUser) => {
    try {
      await axios.post('http://localhost:3001/unfollow', {
        loggedInUser,
        targetUser
      });

      setUserProfile((prevState) => ({
        ...prevState,
        following: prevState.following.filter(user => user !== targetUser)
      }));
    } catch (err) {
      console.error("Error unfollowing user:", err);
      setError("Error unfollowing user.");
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>{error}</div>;
  if (!userProfile) return <div>No profile information available.</div>;

  return (
    <div className="my-profile-container">
      <h2>My Profile</h2>
      <div>
        <p><strong>Full Name:</strong> {userProfile.fullName}</p>
        <p><strong>Username:</strong> {userProfile.username}</p>
        <p><strong>LeetCode Profile:</strong> <a href={userProfile.leetcodeProfile} target="_blank" rel="noopener noreferrer">{userProfile.leetcodeProfile}</a></p>

        <div>
          <h3>Following</h3>
          <ul>
            {userProfile.following.map(followingUser => (
              <li key={followingUser}>
                {followingUser}
                <button onClick={() => handleUnfollow(followingUser)}>Unfollow</button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Followers</h3>
          <ul>
            {userProfile.followers.map(follower => (
              <li key={follower}>
                {follower}
                {!userProfile.following.includes(follower) && (
                  <button onClick={() => handleFollow(follower)}>Follow</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
