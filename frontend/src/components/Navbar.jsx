import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [profileId, setProfileId] = useState("");
  const [searchedProfile, setSearchedProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followingList, setFollowingList] = useState([]);
  const [followersList, setFollowersList] = useState([]);  // New state for followers
  const [showFollowingList, setShowFollowingList] = useState(false);
  const [showFollowersList, setShowFollowersList] = useState(false);  // State to toggle followers list

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const loggedInUser = localStorage.getItem('loggedInUser');
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const currentUser = users.find(user => user.username === loggedInUser);
  const userLeetcodeProfile = currentUser ? currentUser.leetcodeProfile : null;

  useEffect(() => {
    const storedFollowingList = JSON.parse(localStorage.getItem('followingList')) || [];
    const storedFollowersList = JSON.parse(localStorage.getItem('followersList')) || []; // Get followers list
    setFollowingList(storedFollowingList);
    setFollowersList(storedFollowersList);  // Set followers list
  }, []);

  const handleProfileSearch = (e) => {
    e.preventDefault();
    if (profileId.trim()) {
      setSearchedProfile(profileId.trim());
      setProfileId("");
      checkIfFollowing(profileId.trim());
    }
  };

  const checkIfFollowing = (profileId) => {
    setIsFollowing(followingList.includes(profileId));
  };

  const handleFollow = () => {
    if (!followingList.includes(searchedProfile)) {
      const updatedFollowingList = [...followingList, searchedProfile];
      setFollowingList(updatedFollowingList);
      localStorage.setItem('followingList', JSON.stringify(updatedFollowingList));
      setIsFollowing(true);
    }
  };

  const handleUnfollow = () => {
    const updatedFollowingList = followingList.filter(followedProfile => followedProfile !== searchedProfile);
    setFollowingList(updatedFollowingList);
    localStorage.setItem('followingList', JSON.stringify(updatedFollowingList));
    setIsFollowing(false);
  };

  const toggleFollowingList = () => {
    setShowFollowingList(prev => !prev);
  };

  const toggleFollowersList = () => {
    setShowFollowersList(prev => !prev);  // Toggle followers list
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="title">LeetCode Community</div>
        <div className="search-box">
          <form onSubmit={handleProfileSearch}>
            <input
              type="text"
              value={profileId}
              onChange={e => setProfileId(e.target.value)}
              placeholder="Enter LeetCode profile ID"
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search Profile
            </button>
          </form>
        </div>

        {searchedProfile && (
          <div className="search-result">
            <h3>Profile: {searchedProfile}</h3>
            <div className="profile-actions">
              <a
                href={`https://leetcode.com/u/${searchedProfile}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="view-profile-button"
              >
                View Profile
              </a>
              {!isFollowing ? (
                <button onClick={handleFollow} className="follow-button">
                  Follow
                </button>
              ) : (
                <button onClick={handleUnfollow} className="follow-button">
                  Unfollow
                </button>
              )}
            </div>
          </div>
        )}

        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>

          <div className="dropdown">
            <a className="nav-link" onClick={toggleFollowingList}>
              Following
            </a>
            {showFollowingList && (
              <div className="dropdown-content">
                {followingList.length > 0 ? (
                  followingList.map((followedProfile, index) => (
                    <div key={index} className="dropdown-item">
                      <a
                        href={`https://leetcode.com/u/${followedProfile}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="following-profile-link"
                      >
                        {followedProfile}
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item">No profiles followed yet</div>
                )}
              </div>
            )}
          </div>

          {/* Followers dropdown */}
          <div className="dropdown">
            <a className="nav-link" onClick={toggleFollowersList}>
              Followers
            </a>
            {showFollowersList && (
              <div className="dropdown-content">
                {followersList.length > 0 ? (
                  followersList.map((followerProfile, index) => (
                    <div key={index} className="dropdown-item">
                      <a
                        href={`https://leetcode.com/u/${followerProfile}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="following-profile-link"
                      >
                        {followerProfile}
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item">No followers yet</div>
                )}
              </div>
            )}
          </div>

          {isLoggedIn ? (
            <Link to="/myprofile" className="nav-link">
              My Profile
            </Link>
          ) : (
            <Link to="/login" className="nav-link">Login/Signup</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
