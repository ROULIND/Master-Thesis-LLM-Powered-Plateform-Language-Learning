import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios'; // Import axios to handle API requests

const autocompleteURL = process.env.REACT_APP_AUTOCOMPLETE_URL;

const DialogComponent = ({
  isDialogOpen,
  handleDialogClose,
  editedVideo,
  handleAddVideo,
  handleUpdateVideo,
  videoTitle,
  setVideoTitle,
  category,
  setCategory,
  videoDifficulty,
  setVideoDifficulty,
  videoDescription,
  setVideoDescription,
  videoTranscript,
  setVideoTranscript,
  searchQuery,
  videoId,
  thumbnail,
  publishTime,
  channelId,
  channelTitle,
  categories,
  videoKeywords, 
  setVideoKeywords // Add setVideoKeywords as a prop to update keywords
}) => {
  
  const [isGenerating, setIsGenerating] = useState(false); // State for handling button disable state
  const [isUpdating, setIsUpdating] = useState(false); // State for disabling Edit button during update

  // Function to fetch new keywords based on the video ID
  const generateNewKeywords = async () => {
    setIsGenerating(true); // Disable button while generating
    try {
      const response = await axios.get(`${autocompleteURL}/get-video-keywords?videoId=${videoId}`);
      setVideoKeywords(response.data); // Update the videoKeywords with the new data
      console.log('auto complete url:', autocompleteURL);
      console.log('New keywords:', response.data);
    } catch (error) {
      console.error('Error fetching keywords:', error);
    } finally {
      setIsGenerating(false); // Re-enable button after completion
    }
  };


  // Function to handle the Edit action
  const handleEditAndUpdateElasticsearch = async () => {
    setIsUpdating(true); // Disable button while updating
    try {
      // Step 1: Call the handleUpdateVideo function to update the video details
      if (editedVideo) {
        await handleUpdateVideo();
      }
      
    } catch (error) {
      console.error('Error during the Edit process:', error);
    } finally {
      setIsUpdating(false); // Re-enable button after completion
    }
  };

  return (
    <Dialog open={isDialogOpen} onClose={handleDialogClose}>
      <DialogTitle style={{ textAlign: 'center' }}>{editedVideo ? 'Edit a video' : 'Add a video'}</DialogTitle>
      <DialogContent>
        <div style={{ paddingTop: '15px' }}>
          <TextField
            label="Video Title"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            fullWidth
            required
            style={{ marginBottom: '15px' }}
            helperText="Enter the title of the video."
          />
          <FormControl fullWidth required style={{ marginBottom: '15px' }}>
            <InputLabel htmlFor="category-select">Category</InputLabel>
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              inputProps={{
                name: 'category',
                id: 'category-select',
              }}
            >
              {categories.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Video Difficulty"
            value={videoDifficulty}
            onChange={(e) => setVideoDifficulty(e.target.value)}
            fullWidth
            required
            style={{ marginBottom: '15px' }}
            helperText="Enter the difficulty of the video"
          />
          <TextField
            label="Video Description"
            value={videoDescription}
            onChange={(e) => setVideoDescription(e.target.value)}
            multiline
            rows={4}
            fullWidth
            required
            style={{ marginBottom: '15px' }}
            helperText="Enter the description of the video"
          />
          <TextField
            label="Video Transcript"
            value={videoTranscript}
            onChange={(e) => setVideoTranscript(e.target.value)}
            multiline
            rows={4}
            fullWidth
            required
            style={{ marginBottom: '15px' }}
            helperText="Enter the transcript of the video"
          />
          <TextField
            label="Search Query"
            value={searchQuery}
            InputProps={{
              readOnly: true,
              style: {
                background: '#f3f3f3', 
              },
            }}
            fullWidth
            required
            style={{ marginBottom: '15px' }}
          />
          <TextField
            label="Video ID"
            value={videoId}
            InputProps={{
              readOnly: true,
              style: {
                background: '#f3f3f3',
              },
            }}
            fullWidth
            required
            style={{ marginBottom: '15px' }}
          />
          <TextField
            label="Thumbnail"
            value={thumbnail}
            InputProps={{
              readOnly: true,
              style: {
                background: '#f3f3f3', 
              },
            }}
            fullWidth
            required
            style={{ marginBottom: '15px' }}
          />
          <TextField
            label="Channel ID"
            value={
              publishTime && !isNaN(Date.parse(publishTime))
                ? new Date(publishTime).toISOString().split('T')[0]
                : "Invalid Date"
            }
            InputProps={{
              readOnly: true,
              style: {
                background: '#f3f3f3',
              },
            }}
            fullWidth
            required
            style={{ marginBottom: '15px' }}
          />
          <TextField
            label="Channel Title"
            value={channelTitle}
            InputProps={{
              readOnly: true,
              style: {
                background: '#f3f3f3', 
              },
            }}
            fullWidth
            required
            style={{ marginBottom: '15px' }}
          />

          {/* Read-only fields for videoKeywords */}
          <TextField
            label="Topics"
            value={
              Array.isArray(videoKeywords?.videoTopics)
                ? videoKeywords.videoTopics.join(', ')
                : videoKeywords?.videoTopics || 'No Topics'
            }
            InputProps={{
              readOnly: true,
              style: {
                background: '#f3f3f3',
              },
            }}
            fullWidth
            required
            style={{ marginBottom: '15px' }}
          />

          <TextField
            label="Subtopics"
            value={
              Array.isArray(videoKeywords?.videoSubtopics)
                ? videoKeywords.videoSubtopics.join(', ')
                : videoKeywords?.videoSubtopics || 'No Subtopics'
            }
            InputProps={{
              readOnly: true,
              style: {
                background: '#f3f3f3',
              },
            }}
            fullWidth
            required
            style={{ marginBottom: '15px' }}
          />

          <TextField
            label="Entities"
            value={
              Array.isArray(videoKeywords?.videoEntities)
                ? videoKeywords.videoEntities.join(', ')
                : videoKeywords?.videoEntities || 'No Entities'
            }
            InputProps={{
              readOnly: true,
              style: {
                background: '#f3f3f3',
              },
            }}
            fullWidth
            required
            style={{ marginBottom: '15px' }}
          />

          {/* Button to generate new keywords */}
          <Button
            onClick={generateNewKeywords}
            color="primary"
            variant="contained"
            style={{ marginTop: '15px', backgroundColor: '#1d2a40', color: 'white' }}
            disabled={isGenerating} // Disable button while fetching
          >
            {isGenerating ? 'Generating...' : 'Generate New Keywords'}
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color="primary">
          Back
        </Button>
        <Button
          onClick={handleEditAndUpdateElasticsearch} // Call the combined function here
          color="primary"
          variant="contained"
          style={{ backgroundColor: '#1d2a40', color: 'white' }}
          disabled={isUpdating} // Disable button while updating
        >
          {isUpdating ? 'Updating...' : editedVideo ? 'Edit' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogComponent;
