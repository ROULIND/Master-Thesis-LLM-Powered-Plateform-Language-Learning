import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const FilterDialog = ({
    isOpen,
    handleApplyFilter,
    handleClose,
    videoDifficulties,
    selectedDifficulty,
    handleDifficultyChange,
    videoCategories,
    selectedDuration,
    handleVideoCategoryChange,
    handleDurationChange,
    selectedCategory,    // Add selectedCategory prop
    selectedPublishTime, // Add selectedPublishTime prop
    handlePublishTimeChange, // Add handlePublishTimeChange prop
}) => {
    videoDifficulties = ['A1','A2','B1','B2','C1','C2']
    return (
        <Dialog open={isOpen} onClose={handleClose} >
            <DialogTitle style={{ fontWeight: 'bold', fontSize: '20px' }}>Search Filter</DialogTitle>

            <DialogContent style={{ width: '300px' }}>


                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ flex: '1' }}>
                        Difficulty:
                    </div>
                    <div style={{ flex: '2' }}>
                        <Select
                            value={selectedDifficulty || 'All'}

                            onChange={handleDifficultyChange}
                            label="Difficulty"
                            fullWidth
                            margin="dense"
                        >
                            <MenuItem value="All">All</MenuItem>
                            {videoDifficulties.map((difficulty, index) => (
                                <MenuItem key={index} value={difficulty}>{difficulty}</MenuItem>
                            ))}
                        </Select>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ flex: '1' }}>
                        Duration:
                    </div>
                    <div style={{ flex: '2' }}>
                        <Select
                            value={selectedDuration || 'All'}
                            onChange={handleDurationChange}
                            label="Duration"
                            fullWidth
                            margin="dense"
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="1-2">1-2 minutes</MenuItem>
                            <MenuItem value="2-5">2-5 minutes</MenuItem>
                            <MenuItem value="5-10">5-10 minutes</MenuItem>
                            <MenuItem value="10+">10+ minutes</MenuItem>
                        </Select>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ flex: '1' }}>
                        Category:
                    </div>
                    <div style={{ flex: '2' }}>
                        <Select
                            value={selectedCategory || 'All'} // Use an empty string as a fallback when selectedCategory is null
                            onChange={handleVideoCategoryChange}
                            label="Category"
                            fullWidth
                            margin="dense"
                        >
                            <MenuItem value="All">All</MenuItem>
                            {videoCategories.map((difficulty, index) => (
                                <MenuItem key={index} value={difficulty}>{difficulty}</MenuItem>
                            ))}
                        </Select>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ flex: '1' }}>
                        Publish Time:
                    </div>
                    <div style={{ flex: '2' }}>
                        <Select
                            value={selectedPublishTime || "All"} // Set the default value to "All"
                            onChange={handlePublishTimeChange}
                            label="Publish Time"
                            fullWidth
                            margin="dense"
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="today">Today</MenuItem>
                            <MenuItem value="thisWeek">This week</MenuItem>
                            <MenuItem value="thisMonth">This month</MenuItem>
                            <MenuItem value="thisYear">This year</MenuItem>
                            <MenuItem value="moreThanYear">More than a year</MenuItem>
                        </Select>


                    </div>
                </div>

            </DialogContent>
            <DialogActions>
                <div style={{ display: 'flex', padding: '10px' }}>

                    <div variant="contained" onClick={handleClose} style={{ borderRadius: '10px', padding: '5px', background: '#FaFaFa', color: 'grey', display: 'flex', padding: '10px' }}>
                        Cancel
                    </div>
                    <div style={{ width: '10px' }}></div>
                    <div variant="contained" onClick={handleApplyFilter} style={{ borderRadius: '10px', padding: '5px', background: 'orange', color: 'white', display: 'flex', padding: '10px' }}>
                        Apply
                    </div>
                </div>

            </DialogActions>
        </Dialog>
    );
};

export default FilterDialog;
