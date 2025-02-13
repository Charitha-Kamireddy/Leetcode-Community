import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css'; // Assuming you'll include custom CSS

const SignUp = () => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [leetcodeProfile, setLeetcodeProfile] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            await axios.post('http://localhost:3001/signup', {
                fullName,
                username,
                password,
                leetcodeProfile,
            });
            navigate('/login');
        } catch (err) {
            console.log(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sign-up-container">
            <div className="sign-up-form-wrapper">
                <h2 className="sign-up-heading">Create an Account</h2>
                <form onSubmit={handleSubmit} className="sign-up-form">
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            placeholder="Enter Full Name"
                            className="form-input"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter Username"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter Password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            className="form-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="leetcodeProfile">LeetCode Profile</label>
                        <input
                            type="text"
                            id="leetcodeProfile"
                            name="leetcodeProfile"
                            placeholder="Enter LeetCode Profile"
                            className="form-input"
                            value={leetcodeProfile}
                            onChange={(e) => setLeetcodeProfile(e.target.value)}
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? <span className="loading-spinner"></span> : "Register"}
                    </button>
                </form>

                <p className="sign-up-footer">Already Have an Account?</p>
                <Link to="/login" className="login-link">Login</Link>
            </div>
        </div>
    );
};

export default SignUp;
