import React from 'react';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const TableComponent = ({ videos, handleDeleteVideo, handleEditVideo }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow style={{ background: '#f5f5f5' }}>
            <TableCell style={{ fontWeight: 'bold', fontSize: '15px' }}>Thumbnail</TableCell>
            <TableCell style={{ fontWeight: 'bold', fontSize: '15px' }}>Video ID</TableCell>
            <TableCell style={{ fontWeight: 'bold', fontSize: '15px' }}>Title</TableCell>
            <TableCell style={{ fontWeight: 'bold', fontSize: '15px' }}>Publish Date</TableCell>
            <TableCell style={{ fontWeight: 'bold', fontSize: '15px' }}>Duration</TableCell>
            <TableCell style={{ fontWeight: 'bold', fontSize: '15px' }}>Category</TableCell>
            <TableCell style={{ fontWeight: 'bold', fontSize: '15px' }}>Difficulty</TableCell>
            <TableCell style={{ fontWeight: 'bold', fontSize: '15px' }}>Video Transcript</TableCell>
            <TableCell style={{ fontWeight: 'bold', fontSize: '15px' }}>Channel Image</TableCell>
            <TableCell style={{ fontWeight: 'bold', fontSize: '15px' }}>Topics</TableCell> {/* Topics column */}
            <TableCell style={{ fontWeight: 'bold', fontSize: '15px' }}>Subtopics</TableCell> {/* Subtopics column */}
            <TableCell style={{ fontWeight: 'bold', fontSize: '15px' }}>Entities</TableCell> {/* Entities column */}
            <TableCell style={{ fontWeight: 'bold', fontSize: '15px' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {videos.map((video, index) => (
            <React.Fragment key={video._id}>
              <TableRow>
                <TableCell style={{ textAlign: 'justify', padding: '8px', width: '10%' }}>
                  <img src={video.thumbnail} alt={video.videoTitle} style={{height:'100px'}}  />
                </TableCell>
                <TableCell style={{ textAlign: 'justify', padding: '8px', width: '7%', color: 'grey' }}>{video.videoId}</TableCell>
                <TableCell style={{ textAlign: 'justify', padding: '8px', width: '20%' }}>{video.videoTitle}</TableCell>
                <TableCell style={{ textAlign: 'justify', padding: '8px', width: '10%', color: 'grey' }}>
                  {video.publishTime && !isNaN(Date.parse(video.publishTime)) ? (
                    <div>{new Date(video.publishTime).toISOString().split('T')[0]}</div>
                  ) : (
                    <div>Invalid Date</div>
                  )}
                </TableCell>
                <TableCell style={{ textAlign: 'justify', padding: '8px', width: '7%', color: 'grey' }}>{video.videoDuration}</TableCell>
                <TableCell style={{ textAlign: 'justify', padding: '8px', width: '7%' }}>{video.category}</TableCell>
                <TableCell style={{ textAlign: 'justify', padding: '8px', width: '7%' }}>{video.videoDifficulty}</TableCell>
                <TableCell style={{ textAlign: 'justify', padding: '8px', width: '25%', maxWidth: '300px', overflowX: 'auto', maxHeight: '150px' }}>
                  {video.videoTranscript.length > 150 ? (
                    <div style={{ maxHeight: '100px', overflowY: 'scroll' }}>
                      {video.videoTranscript}
                    </div>
                  ) : (
                    video.videoTranscript
                  )}
                </TableCell>
                <TableCell style={{ textAlign: 'justify', padding: '8px', width: '6%' }}>
                  <img src={{maxHeight:"100px",width:'40px'}} alt={video.videoTitle} className="custom-image" />
                </TableCell>
                {/* Topics Column */}
                <TableCell style={{ textAlign: 'justify', padding: '8px', width: '10%', maxWidth: '300px', overflowX: 'auto', maxHeight: '150px' }}>
                  {Array.isArray(video.videoKeywords?.videoTopics) ? (
                    video.videoKeywords.videoTopics.join(', ').length > 150 ? (
                      <div style={{ maxHeight: '100px', overflowY: 'scroll' }}>
                        {video.videoKeywords.videoTopics.join(', ')}
                      </div>
                    ) : (
                      video.videoKeywords.videoTopics.join(', ')
                    )
                  ) : typeof video.videoKeywords?.videoTopics === 'string' && video.videoKeywords.videoTopics.length > 0 ? (
                    video.videoKeywords.videoTopics.length > 150 ? (
                      <div style={{ maxHeight: '100px', overflowY: 'scroll' }}>
                        {video.videoKeywords.videoTopics}
                      </div>
                    ) : (
                      video.videoKeywords.videoTopics
                    )
                  ) : (
                    'No Topics'
                  )}
                </TableCell>

                {/* Subtopics Column */}
                <TableCell style={{ textAlign: 'justify', padding: '8px', width: '10%', maxWidth: '300px', overflowX: 'auto', maxHeight: '150px' }}>
                  {Array.isArray(video.videoKeywords?.videoSubtopics) ? (
                    video.videoKeywords.videoSubtopics.join(', ').length > 150 ? (
                      <div style={{ maxHeight: '100px', overflowY: 'scroll' }}>
                        {video.videoKeywords.videoSubtopics.join(', ')}
                      </div>
                    ) : (
                      video.videoKeywords.videoSubtopics.join(', ')
                    )
                  ) : typeof video.videoKeywords?.videoSubtopics === 'string' && video.videoKeywords.videoSubtopics.length > 0 ? (
                    video.videoKeywords.videoSubtopics.length > 150 ? (
                      <div style={{ maxHeight: '100px', overflowY: 'scroll' }}>
                        {video.videoKeywords.videoSubtopics}
                      </div>
                    ) : (
                      video.videoKeywords.videoSubtopics
                    )
                  ) : (
                    'No Subtopics'
                  )}
                </TableCell>

                {/* Entities Column */}
                <TableCell style={{ textAlign: 'justify', padding: '8px', width: '10%', maxWidth: '300px', overflowX: 'auto', maxHeight: '150px' }}>
                  {Array.isArray(video.videoKeywords?.videoEntities) ? (
                    video.videoKeywords.videoEntities.join(', ').length > 150 ? (
                      <div style={{ maxHeight: '100px', overflowY: 'scroll' }}>
                        {video.videoKeywords.videoEntities.join(', ')}
                      </div>
                    ) : (
                      video.videoKeywords.videoEntities.join(', ')
                    )
                  ) : typeof video.videoKeywords?.videoEntities === 'string' && video.videoKeywords.videoEntities.length > 0 ? (
                    video.videoKeywords.videoEntities.length > 150 ? (
                      <div style={{ maxHeight: '100px', overflowY: 'scroll' }}>
                        {video.videoKeywords.videoEntities}
                      </div>
                    ) : (
                      video.videoKeywords.videoEntities
                    )
                  ) : (
                    'No Entities'
                  )}
                </TableCell>


                <TableCell>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDeleteVideo(video)}
                  >
                    <DeleteIcon />
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditVideo(video)}
                  >
                    <EditIcon />
                  </Button>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
