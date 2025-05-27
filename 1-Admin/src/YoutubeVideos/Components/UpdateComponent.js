import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogActions, DialogContent, Button, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';

const UpdateTranscriptComponent = ({ onClose }) => {
    const [updateAll, setUpdateAll] = useState(false);
    const [videoIds, setVideoIds] = useState('');
    const [loading, setLoading] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const requestBody = updateAll
                ? { updateAll: true, fieldsToUpdate: ['transcript'] }
                : { videoIds: videoIds.split(','), fieldsToUpdate: ['transcript'] };

            console.log('Request body:', requestBody);
            await axios.put(`${apiUrl}/admin/update-videos`, requestBody);
            alert('Transcripts updated successfully!');
        } catch (error) {
            console.error('Error updating transcripts:', error);
            alert('Error updating transcripts.');
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <Dialog open onClose={onClose} fullWidth>
            <DialogTitle>Update Transcripts</DialogTitle>
            <DialogContent>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={updateAll}
                            onChange={(e) => setUpdateAll(e.target.checked)}
                        />
                    }
                    label="Update transcripts for all videos"
                />
                {!updateAll && (
                    <textarea
                        rows="4"
                        placeholder="Enter video IDs (comma-separated)..."
                        value={videoIds}
                        onChange={(e) => setVideoIds(e.target.value)}
                        style={{ width: '100%', marginTop: '1rem' }}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" disabled={loading}>
                    Cancel
                </Button>
                <Button onClick={handleUpdate} color="secondary" disabled={loading || (!updateAll && !videoIds)}>
                    {loading ? 'Updating...' : 'Update Transcripts'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateTranscriptComponent;
