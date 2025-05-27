import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@mui/material';
import './VideoCard.css'


const VideoCard = ({ video }) => {
    return (
        <div className="main-div" >
            <Card className="card-parent" style={{ boxShadow: 'none' }} >
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
                            {video.channelImage && (
                                <img className="channel-image" src={video.channelImage} alt={""} />
                            )}
                        </div>
                        <div className="video-title" >
                            {video.videoTitle.length > 50 ? `${video.videoTitle.slice(0, 50)}...` : video.videoTitle}
                            <div className="video-date"  >
                                {(video?.videoStatistics?.viewCount)} de vues

                                <div style={{ marginLeft: '4px' }}>•</div>
                                <div style={{ marginLeft: '5px' }}>
                                    Il y a  {(video.relativeDate)}
                                </div>
                            </div>

                        </div>
                    </div>

            </Card>
        </div>
    );
}

export default VideoCard;