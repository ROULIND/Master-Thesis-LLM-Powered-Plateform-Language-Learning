import React from 'react';
import Skeleton from 'react-loading-skeleton';

const SkeletonCard = () => {
  return (
    <div style={{ marginBottom: '20px', paddingTop: '20px', borderRadius: '10px' }}>
      <Skeleton variant="rect" width={350} height={150} style={{ borderRadius: '10px' }} />
      <Skeleton variant="text" width="300px" style={{ marginTop: '10px', background: '#D2DBE2', borderRadius: '7px', minHeight: '10px' }} />
      <Skeleton variant="text" width="300px" style={{ marginTop: '10px', background: '#D2DBE2', borderRadius: '7px', minHeight: '10px' }} />
    </div>
  );
};

export default SkeletonCard;
