import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Grid } from '@mui/material';
import './VideoCard.css';
import placeholderImage from './placeholder.jpg'; // Import the placeholder image
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS } from '../../../node_modules/date-fns/locale';

// Function to calculate relative date

// Function to calculate relative date
function calculateRelativeDate(publishTime) {
    const publishDate = new Date(publishTime);
    const currentDate = new Date();

    // Calculate the difference in months
    const totalMonthsDiff = (currentDate.getFullYear() - publishDate.getFullYear()) * 12 
                          + (currentDate.getMonth() - publishDate.getMonth());

    if (totalMonthsDiff >= 12) {
        const years = Math.floor(totalMonthsDiff / 12);
        return `${years} year${years > 1 ? 's' : ''} ago`;
    } else {
        return formatDistanceToNow(publishDate, { locale: enUS }) + " ago";
    }
}


const VideoCard = ({ video }) => {
    // Calculate relative date dynamically
    const relativeDate = calculateRelativeDate(video.publishTime);
    return (
        <Grid item xs={12} sm={6} md={4} lg={3} className="main-divs" >
            <div className="main-div" >
                <Card className="card-parent" style={{ boxShadow: 'none' }} >
                    <Link to={`/${video.videoId}`} style={{ textDecoration: 'none', }}>
                        <CardContent className="card-responsive">
                            <img src={video.thumbnail} alt={video.videoTitle} className="card-thumbnail" />
                            <div className="video-duration" >
                                {video.videoDuration}
                            </div>
                            <div className="video-difficulty" style={{ background: video.videoDifficultyColor }}>
                                {video.videoDifficulty}
                            </div>
                        </CardContent>
                        <div className="video-card-bottom">
                            <div className="video-card-bottom-left" >
                                <img
                                    className="channel-image"
                                    src={video?.channelImage || placeholderImage} // Use the placeholder image if channelImage is not available
                                />
                            </div>
                            <div className="video-title" >
                                {video.videoTitle.length > 50 ? `${video.videoTitle.slice(0, 50)}...` : video.videoTitle}
                                <div className="video-date"  >
                                    {(video.videoStatistics.viewCount)} views
                                    <div style={{ marginLeft: '4px' }}>•</div>
                                    <div style={{ marginLeft: '5px' }}>
                                         {relativeDate} {/* Use the dynamically calculated relative date */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </Card>
            </div>
        </Grid>
    );
}

export default VideoCard;
