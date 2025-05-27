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
      <div style={{ paddingBottom: '20px', paddingRight: '20px' }}>
        <div style={{ padding: '10px', paddingTop:'50px', marginBottom: '20px', borderRadius: '10px' }}>
          <Skeleton className="custom-card" variant="rect" width={700} height={300} style={{ borderRadius: '10px' }} />
          <Skeleton variant="text" width="70%" style={{ marginTop: '10px', background: '#D2DBE2', borderRadius: '7px', minHeight: '10px' }} />
          <Skeleton variant="text" width="40%" style={{ marginTop: '10px', background: '#D2DBE2', borderRadius: '7px', minHeight: '10px' }} />
        <div style={{height:'40px'}}></div>
          <Skeleton variant="text" width="70%" style={{ marginTop: '10px', background: '#D2DBE2', borderRadius: '7px', minHeight: '10px' }} />
          <Skeleton variant="text" width="70%" style={{ marginTop: '10px', background: '#D2DBE2', borderRadius: '7px', minHeight: '10px' }} />
          <Skeleton variant="text" width="70%" style={{ marginTop: '10px', background: '#D2DBE2', borderRadius: '7px', minHeight: '10px' }} />
          <Skeleton variant="text" width="70%" style={{ marginTop: '10px', background: '#D2DBE2', borderRadius: '7px', minHeight: '10px' }} />
        </div>
      </div>
    );
  };

  export default SkeletonCard;