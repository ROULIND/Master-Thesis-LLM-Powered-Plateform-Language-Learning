import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { getDatabase, ref, set } from 'firebase/database';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { useNavigate } from 'react-router-dom';
import './PopupLogin.css';

const CreateNewAccount = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const createNewAccount = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store initial data in the realtime database
      const db = getDatabase();
      set(ref(db, 'users/' + user.uid), {
        email: user.email,
        languageLevel: null,  // Initialize languageLevel as null or empty
        categories: []        // Initialize categories as an empty array
      });

      // Redirect to the onboarding page after account creation
      navigate('/onboarding');
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div 
      className="popup" 
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div className="popup-content">
        <Container component="main" maxWidth="xs">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Monjoor Logo */}
            <img 
              src={process.env.PUBLIC_URL + '/Lingorank.png'} 
              alt="Monjoor Logo" 
              style={{ width: '250px', marginBottom: '20px' }} 
            />
            <Typography component="h1" variant="h5">
              Create New Account
            </Typography>
          </div>
          <form onSubmit={createNewAccount}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create Account
            </Button>
          </form>
          {/* Box to center links and place them in a column */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2 }}>
            <Link href="/users/login" variant="body2" sx={{ mb: 1 }}>
              Already have an account? Sign in
            </Link>
            <Link href="/" variant="body2">
              Back to Home Page
            </Link>
          </Box>
        </Container>
      </div>
    </div>
  );
};

export default CreateNewAccount;
