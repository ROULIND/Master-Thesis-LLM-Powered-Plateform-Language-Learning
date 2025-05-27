import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { addCategoryOfInterest, addLanguageLevel, addLearningLanguage } from '../../firebaseFunction';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import { Button } from '@mui/material';
import Slider from '@mui/material/Slider';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box';

const apiUrl = process.env.REACT_APP_API_URL;

const Onboarding = () => {
    const [step, setStep] = useState(0);
    const [categories, setCategories] = useState([]);
    const [languageLevel, setLanguageLevel] = useState('');
    const [sliderValue, setSliderValue] = useState(1);
    const [learningLanguage, setLearningLanguage] = useState('');
    const [videoCategories, setVideoCategories] = useState([]);
    const navigate = useNavigate();

    const languageLevels = {
        1: { level: 'A1', title: 'Beginner', description: 'Basic phrases and common expressions.' },
        2: { level: 'A2', title: 'Elementary', description: 'Simple communication in routine tasks.' },
        3: { level: 'B1', title: 'Intermediate', description: 'Conversational skills in everyday life.' },
        4: { level: 'B2', title: 'Upper Intermediate', description: 'Fluent conversations with native speakers.' },
        5: { level: 'C1', title: 'Advanced', description: 'Effective use in work and study contexts.' },
        6: { level: 'C2', title: 'Proficiency', description: 'Understand and express nearly anything.' },
    };

    const handleSliderChange = (event, newValue) => {
        setSliderValue(newValue);
        setLanguageLevel(languageLevels[newValue].level);
    };

    const handleCategorySelect = (category) => {
        setCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
    };

    const handleLanguageSelect = (language) => {
        setLearningLanguage(language);
    };

    const steps = [ 'Select Language', 'Select Your Language Level', 'Select Your Interests', 'Review Your Selections'];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            categories.forEach(category => addCategoryOfInterest(auth.currentUser.uid, category));
            addLanguageLevel(auth.currentUser.uid, languageLevel);
            addLearningLanguage(auth.currentUser.uid, learningLanguage);
            console.log("Saving data...");
            navigate('/');
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    useEffect(() => {
        axios.get(`${apiUrl}/storage/videos/`)
            .then(response => setVideoCategories([...new Set(response.data.map(video => video.category))]))
            .catch(error => console.error('Error fetching videos:', error));
    }, []);

    return (
        <div>
            <div 
                className="popup" 
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            ></div>
            
            {step === 0 && (
                <Container className='form-container' component="main" maxWidth="xs">
                    <h1>What language do you want to learn?</h1>
                    <br></br>
                        <br></br>
                    {/* Displaying language options with flags */}
                    <Box className="language-selection" sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 2 }}>
                        
                        <Chip 
                            label="🇫🇷 French" 
                            onClick={() => setLearningLanguage('fr')} 
                            variant={learningLanguage === 'fr' ? "outlined" : "default"} 
                            sx={{ 
                                padding: '10px', 
                                fontSize: '16px', 
                                cursor: 'pointer',
                                backgroundColor: categories.includes(learningLanguage) ? 'rgba(0, 0, 0, 0.1)' : 'inherit',
                                borderColor: categories.includes(learningLanguage) ? 'rgba(0, 0, 0, 0.3)' : 'inherit',
                                color: categories.includes(learningLanguage) ? 'black' : 'inherit',
                                fontWeight: categories.includes(learningLanguage) ? 'bold' : 'normal',
                            }} 
                        />
                        <Chip 
                            label="🇩🇪 German" 
                            onClick={() => setLearningLanguage('de')} 
                            variant={learningLanguage === 'de' ? "outlined" : "default"} 
                            sx={{ 
                                padding: '10px', 
                                fontSize: '16px', 
                                cursor: 'pointer',
                                backgroundColor: categories.includes(learningLanguage) ? 'rgba(0, 0, 0, 0.1)' : 'inherit',
                                borderColor: categories.includes(learningLanguage) ? 'rgba(0, 0, 0, 0.3)' : 'inherit',
                                color: categories.includes(learningLanguage) ? 'black' : 'inherit',
                                fontWeight: categories.includes(learningLanguage) ? 'bold' : 'normal',
                            }} 
                        />
                    </Box>
                
                    <br></br>
                    <br></br>
                
                    <Box className="nav-container">
                        <div className='nav-container-button'>
                            <Button variant="outlined" onClick={handleBack}>Back</Button>
                            <Button 
                                variant="contained" 
                                style={{ float: 'right' }} 
                                onClick={handleNext} 
                                disabled={!learningLanguage} // Disable if no language is selected
                            >
                                Next
                            </Button>
                        </div>
                        <br></br>
                        <br></br>
                        <Stepper activeStep={0} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                </Container>
            
            
            )}
            {step === 1 && (
                <div>
                    <Container className='form-container' component="main" maxWidth="xs">
                        
                        <h1>
                            What's your language proficiency in {learningLanguage === 'fr' ? 'French' : learningLanguage === 'de' ? 'German' : ''} ?
                        </h1>
                        <Box className="language-level-container">
                            <h2>{languageLevel || 'A1'}</h2>
                            <p><b>{languageLevels[sliderValue]?.title}</b> : {languageLevels[sliderValue]?.description}</p> {/* Displaying description */}
                            <br></br>
                            <Slider
                                aria-label="Language Level"
                                defaultValue={1}
                                step={1}
                                marks
                                min={1}
                                max={6}
                                value={sliderValue}
                                onChange={handleSliderChange}
                            />
                            <br></br>
                            <br></br>
                        </Box>
                        <br></br>
                        <br></br>
                        <Box className="nav-container">
                            <div className='nav-container-button'>
                                <Button variant="outlined" onClick={handleBack}>Back</Button>
                                <Button variant="contained" style={{ float: 'right' }} onClick={handleNext}>Next</Button>
                            </div>
                            <br></br>
                            <br></br>
                            <Stepper activeStep={1} alternativeLabel>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>
                    </Container>
                </div>
            )}
            {step === 2 && (
                <div>
                    <Container className='form-container' component="main" maxWidth="xs">
                        <h1>Select Your Interests</h1>
                        <Box className="topics-container">
                            {videoCategories.map((category) => (
                                <Chip
                                    key={category}
                                    label={category}
                                    onClick={() => handleCategorySelect(category)}
                                    variant={categories.includes(category) ? "outlined" : "default"}
                                    sx={{
                                    cursor: 'pointer',
                                    backgroundColor: categories.includes(category) ? 'rgba(0, 0, 0, 0.1)' : 'inherit',
                                    borderColor: categories.includes(category) ? 'rgba(0, 0, 0, 0.3)' : 'inherit',
                                    color: categories.includes(category) ? 'black' : 'inherit',
                                    fontWeight: categories.includes(category) ? 'bold' : 'normal',
                                    }}
                                />
                            ))}
                        </Box>

                        <br></br>
                        <br></br>
                        <Box className="nav-container">
                            <div className='nav-container-button'>
                                <Button variant="outlined" onClick={handleBack}>Back</Button>
                                <Button variant="contained" style={{ float: 'right' }} onClick={handleNext}>Next</Button>
                            </div>
                            <br></br>
                            <br></br>
                            <Stepper activeStep={2} alternativeLabel>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>
                    </Container>
                </div>
            )}
            {step === 3 && (
                <div>
                    <Container className='form-container' component="main" maxWidth="xs">
                        <h1>Review your selections</h1>
                        <Box className="topics-container-review">
                            <h3>{learningLanguage === 'fr' ? '🇫🇷 French' : '🇩🇪 German'}</h3>
                        </Box>

                        <div style={{textAlign: 'center'}}>
                            <h3>{languageLevel}</h3>
                            <p>({languageLevels[sliderValue]?.description})</p>
                        </div>
                        
                        <Box className="topics-container-review">
                            {categories.map((category) => (
                                <Chip
                                    key={category}
                                    label={category}
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                       
                        <br></br>
                        <br></br>
                        <Box className="nav-container">
                            <div className='nav-container-button'>
                                <Button variant="outlined" onClick={handleBack}>Back</Button>
                                <Button variant="contained" style={{ float: 'right' }} onClick={handleNext}>Register</Button>
                            </div>
                            <br></br>
                            <br></br>
                            <Stepper activeStep={3} alternativeLabel>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>
                    </Container>
                </div>
            )}
        </div>
    );
};

export default Onboarding;
