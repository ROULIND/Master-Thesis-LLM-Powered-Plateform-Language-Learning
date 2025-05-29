import React, { useRef, useState } from 'react';
import { useDrag } from 'react-use-gesture';
import './GetVideos.css'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const FilterDialog = ({ isOpen, handleClose }) => {
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>More Filters</DialogTitle>
      <DialogContent>
        {/* Add your additional filters or content here */}
      </DialogContent>
      <DialogActions>
      <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const DragList = ({ videoDifficulties, selectedDifficulty, width, handleCategoryChange, setSelectedDifficulty }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [filter, setFilter] = useState('');
  const containerRef = useRef(null);
  const bind = useDrag(({ down, delta: [xDelta], direction: [xDir] }) => {
    if (down) {
      containerRef.current.scrollLeft -= xDelta * 2;
    }
  });

  const handleFilterClick = (difficulty) => {
    setFilter(difficulty);
    handleCategoryChange(difficulty);
    setSelectedDifficulty(difficulty);
  };

  const handleFilterClicks = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  return (
    <div
      ref={containerRef}
      {...bind()}
      className='videos'
      style={{
        position: 'relative',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        overflowX: 'hidden',
        whiteSpace: 'nowrap',
        cursor: 'grab',
        overflowY: 'hidden',
        textAlign: 'left',
        paddingLeft: '20px',
      }}
    >

<div
        onClick={() => handleFilterClick(null)}
        style={{
          display: 'inline-block', 
          textAlign: 'center',
          padding: '10px',
          fontSize:'14px',
          fontFamily:'Helvetica',
          borderRadius: '10px', 
          background: filter === null ? '#1a1211' : '#00000005',
          color: filter === null ? 'white' : 'black',
          fontWeight: filter === null ? '700' : '400',
          cursor: 'grab', 
          marginRight: '10px', 
          border: 'none',
          userSelect: 'none', // Disable text selection
        }}
      >
        All
      </div>
      {[...videoDifficulties].map(category => (
        <div
          key={category}
          style={{ 
            display: 'inline-block', 
            textAlign: 'center',
            padding: '10px',
            fontFamily:'Helvetica',

            fontSize:'14px',
            borderRadius: '10px', 
            background: filter === category ? '#1a1211' : '#00000005',
            color: filter === category ? 'white' : 'black',
            fontWeight: filter === category ? '700' : '400',
            cursor: 'grab', 
            marginRight: '10px', 
            flexBasis: `${(category.length + 2) * 10}px`,
            border: 'none',
            userSelect: 'none', 
          }}
          onClick={() => handleFilterClick(category)}
        >
          {category}
        </div>
      ))}
   
    </div>
  );
};

export default DragList;