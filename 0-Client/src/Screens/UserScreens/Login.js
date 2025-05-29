import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from 'react-router-dom';
import Box from "@mui/material/Box";
import './PopupLogin.css';
import './Login.css';

const PopupLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);
      navigate('/');
    } catch (error) {
      setError(error.message);
      console.error('Error:', error);
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
          <Box
            sx={{  
              marginTop: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Monjoor Logo */}


            <img 
              src={process.env.PUBLIC_URL + '/Lingorank.png'}
              alt="Monjoor Logo" 
              style={{ width: '250px', marginBottom: '20px' }} 
            />
            <Typography component="h2" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
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
                Sign In
              </Button>
              {error && <Typography color="error">{error}</Typography>}
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2 }}>
              <Link href="/users/register" variant="body2">
                Don't have an account?
              </Link>
              <Link href="/" variant="body2">
                Back to Home Page
              </Link>
            </Box>
          </Box>
        </Container>
      </div>
    </div>
  );
};

export default PopupLogin;
