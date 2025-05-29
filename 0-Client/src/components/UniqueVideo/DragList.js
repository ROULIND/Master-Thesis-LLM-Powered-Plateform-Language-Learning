import React, { useRef, useState } from 'react';
import { useDrag } from 'react-use-gesture';

const DragList = ({ videoDifficulties, selectedDifficulty, setSelectedDifficulty }) => {
  const [filter, setFilter] = useState(null);
  const containerRef = useRef(null);
  const bind = useDrag(({ down, delta: [xDelta] }) => {
    if (down) {
      containerRef.current.scrollLeft -= xDelta;
    }
  });

  const handleFilterClick = (difficulty) => {
    if (difficulty === filter) {
      setFilter(null);
      setSelectedDifficulty(null);
      console.log(selectedDifficulty);
      return;
    }
    setFilter(difficulty);
    setSelectedDifficulty(difficulty);
    console.log(selectedDifficulty);
  };

  return (
    <div
      ref={containerRef}
      {...bind()}
      style={{
        maxWidth: '500px',
        height: '40px',
        overflowX: 'hidden',
        padding: '10px',
        whiteSpace: 'nowrap',
        cursor: 'grab',
        overflowY: 'hidden',
        textAlign: 'left',
        paddingLeft: '20px',
        userSelect: 'none',
      }}
    >
      {[...videoDifficulties].map(difficulty => (
        <div
          key={difficulty}
          style={{
            display: 'inline-block',
            textAlign: 'center',
            padding: '10px',
            width: '40px',
            borderRadius: '10px',
            background: filter === difficulty ? '#1a1211' : '#00000005',
            color: filter === difficulty ? 'white' : 'black',
            fontWeight: filter === difficulty ? '700' : '400',
            cursor: 'pointer',
            marginRight: '10px',
            userSelect: 'none',
            border: 'none',
          }}
          onClick={() => handleFilterClick(difficulty)}
        >
          {difficulty}
        </div>
      ))}
    </div>
  );
};

export default DragList;
