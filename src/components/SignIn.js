import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import googleLogo from '../assets/google-logo-png-google-icon-logo-png-transparent-svg-vector-bie-supply-14.png';
import { auth, provider } from './firebase'; // Ensure correct import
import './SignIn.css';

const SignIn = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch {
      setError('Invalid Credentials. Please try again.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (name) {
        await updateProfile(user, { displayName: name });
      }
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Sorry, these credentials are already taken.');
      } else {
        setError(err.message);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch {
      setError('Google Sign-In failed. Please try again.');
    }
  };

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
    setEmail('');
    setPassword('');
    setName('');
    setError('');
  };

  return (
    <div className="auth-container">
      <div className={`auth-card ${!isSignIn ? "active" : ""}`}>
        <div className="form-container sign-in">
          <div className="auth-form-container">
            <h1>Sign In</h1>
            <p className="divider">Use your email and password</p>
            <form onSubmit={handleSignIn}>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              {error && isSignIn && <p className="error-message">{error}</p>}
              <button type="submit" className="submit-btn">SIGN IN</button>
            </form>
            <button className="google-signin-btn" onClick={handleGoogleSignIn}>
              <img src={googleLogo} alt="Google Logo" className="google-icon" />
              Sign in with Google
            </button>
          </div>
        </div>

        <div className="form-container sign-up">
          <div className="auth-form-container">
            <h1>Create Account</h1>
            <p className="divider">Use your email and password</p>
            <form onSubmit={handleRegister}>
              <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              {error && !isSignIn && <p className="error-message">{error}</p>}
              <button type="submit" className="submit-btn">SIGN UP</button>
            </form>
            <button className="google-signin-btn" onClick={handleGoogleSignIn}>
              <img src={googleLogo} alt="Google Logo" className="google-icon" />
              Sign up with Google
            </button>
          </div>
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h2>Welcome Back!</h2>
              <p>Already have an account? Sign in by clicking below</p>
              <button className="switch-btn" onClick={toggleForm}>SIGN IN</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h2>Join Us!</h2>
              <p>Don't have an account? Create one by clicking below</p>
              <button className="switch-btn" onClick={toggleForm}>SIGN UP</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
