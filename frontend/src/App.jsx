import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Login from './components/Login.jsx'; // Import Login
import Signup from './components/signup2.jsx'; // Import SignUp
import MyProfile from './components/MyProfile.jsx';
import Home from './components/Home.jsx';

function App() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';       

    return (
        <Router>
            <div>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} /> {/* Use Login component */}
                    <Route path="/signup" element={<Signup />} /> {/* Use SignUp component */}
                    <Route path="/myprofile" element={isLoggedIn ? <MyProfile /> : <Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;