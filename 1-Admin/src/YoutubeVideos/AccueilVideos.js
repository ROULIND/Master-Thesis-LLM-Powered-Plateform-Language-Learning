import React from 'react';
import CardDisplay from '../components/CardDisplay';

function Home() {
    const cardData = [
        {
            id: 2,
            title: 'Edit the videos in the database',
            description: 'Add / Edit / Test models',
            image: 'Edit.png',
            link: "/youtube-videos/edit",
        },
        {
            id: 3,
            title: 'Add videos by Channel ID and search',
            description: 'Add / Edit / Test models',
            image: 'Search.png',
            link: "/youtube-videos/add",
        },
        {
            id: 3,
            title: 'Add video by videoID',
            description: 'Add / Edit / Test models',
            image: 'videoId.png',
            link: "/youtube-videos/add-video-id",
        },
    ];


    return (
        <div style={{paddingTop:'30px',padding:'20px',}}>
                <div style={{ paddingTop: '16px', paddingLeft: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#edf3fc', boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ width: '24px' }} />
                </div>
                <CardDisplay cardData={cardData} />
        </div>
    );
}

export default Home;