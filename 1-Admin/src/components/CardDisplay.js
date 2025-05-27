import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const CardDisplay = ({ cardData }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [displayMode, setDisplayMode] = useState('cards');
    const [cardsPerRow, setCardsPerRow] = useState(3); // Default value

    const filteredCards = cardData.filter(card =>
        card.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        function updateCardsPerRow() {
            const screenWidth = window.innerWidth;
            if (displayMode === 'list' || screenWidth <= 500) {
                setCardsPerRow(1);
            } else if (screenWidth <= 800) {
                setCardsPerRow(2);
            } else {
                setCardsPerRow(3);
            }
        }

        updateCardsPerRow();
        window.addEventListener('resize', updateCardsPerRow);
        return () => {
            window.removeEventListener('resize', updateCardsPerRow);
        };
    }, [displayMode]);

    const handleDisplayModeChange = mode => {
        setDisplayMode(mode);
    };

    return (
        <div>
            <TextField
                label="Search"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ marginBottom: '16px' }}
            />
            <Button
                variant="outlined"
                onClick={() => handleDisplayModeChange('cards')}
                style={{ marginRight: '8px' }}
            >
                Cards
            </Button>
            <Button
                variant="outlined"
                onClick={() => handleDisplayModeChange('list')}
            >
                List
            </Button>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                    paddingBottom: '40px'
                }}
            >
                {filteredCards.map(card => (
                    <div
                        key={card.id}
                        style={{
                            width: `calc(${100 / cardsPerRow}% - 16px)`,
                            marginBottom: displayMode === 'cards' ? '16px' : '5px',
                        }}
                    >
                        <Card
                            style={{
                                height: '100%',
                                backgroundColor: '#edf3fc40',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <CardContent style={{ padding: 0 }}>
                                <img
                                    src={require(`../../public/static/${card.image}`)}
                                    alt={card.title}
                                    style={{
                                        width: '100%',
                                        height: displayMode === 'cards' ? '150px' : '100px',
                                        objectFit: 'cover'
                                    }}
                                />
                                <div style={{ padding: '10px' }}>
                                    <Typography
                                        variant="h6"
                                        style={{ fontSize: '17px', height: displayMode === 'cards' ? '50px' : 'auto' }}
                                    >
                                        {card.title}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        style={{ margin: '8px 0', fontSize: '14px' }}
                                    >
                                        {card.description}
                                    </Typography>
                                    <a href={card.link} style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold', fontSize: '14px' }}>
                                        Go to page
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CardDisplay;
