import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './UniqueVideo.css';
import { Grid, Card, CardContent, Button, Typography } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import axios from 'axios'; // Import the axios library
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

const SkeletonCard = () => {
    return (

        <div style={{ width:'100%', marginRight:'20px',marginBottom: '20px', borderRadius: '10px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <Skeleton className="custom-card-skeleton" variant="rect" width={350} height={150} style={{ borderRadius: '10px' }} />
          <Skeleton variant="text" width="70%" style={{marginTop: '10px', background: '#D2DBE2', borderRadius: '7px', minHeight: '10px' }} />
          <Skeleton variant="text" width="40%" style={{  marginTop: '10px', background: '#D2DBE2', borderRadius: '7px', minHeight: '10px' }} />
        </div>

    );
  };

  export default SkeletonCard;