import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { Menu, MenuItem, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const UserMenu = ({ user }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        auth.signOut();
        handleMenuClose();
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', marginRight: '10px' }}>
            {/* User Icon Button */}
            <IconButton onClick={handleMenuOpen} style={{ color: '#e38940' }}>
                <AccountCircleIcon fontSize="large" />
            </IconButton>

            {/* Dropdown Menu */}
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                {user ? (
                    <MenuItem onClick={handleLogout}>
                        <LogoutIcon style={{ marginRight: 10 }} />
                        Logout
                    </MenuItem>
                ) : (
                    <>
                        <MenuItem component={Link} to="/users/login" onClick={handleMenuClose}>
                            <LoginIcon style={{ marginRight: 10 }} />
                            Login
                        </MenuItem>
                        <MenuItem component={Link} to="/users/register" onClick={handleMenuClose}>
                            <PersonAddIcon style={{ marginRight: 10 }} />
                            Register
                        </MenuItem>
                    </>
                )}
            </Menu>
        </div>
    );
};

export default UserMenu;
