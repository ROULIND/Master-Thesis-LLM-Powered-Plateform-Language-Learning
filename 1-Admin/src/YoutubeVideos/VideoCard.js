import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// VideoCard component
const VideoCard = ({ videoTitle }) => {
    return (
      <Card style={{ borderRadius: '15px', marginLeft: '10px', backgroundColor:'red', marginRight: '10px' }}>
     {videoTitle} 
   
      </Card>
    );
  };

export default VideoCard;


/*
    <Link to={videoId ? `/video/${videoId}` : '/video/cV2gBU6hKfY'}>
          <img src={thumbnail } alt={videoTitle} 
            
          />
               <CardContent sx={{ backgroundColor: '#1E1E1E', height: '106px' }}>
          <Link to={`/video/${videoId}` }>
            <Typography variant="subtitle1" fontWeight="bold" color="#FFF">
              {videoTitle.slice(0, 60) }
            </Typography>
          </Link>
          <Typography variant="subtitle2" color="gray">
            {videoDifficulty}
            <CheckCircleIcon sx={{ fontSize: '12px', color: 'gray', ml: '5px' }} />
          </Typography>
        </CardContent>
        </Link>
         */