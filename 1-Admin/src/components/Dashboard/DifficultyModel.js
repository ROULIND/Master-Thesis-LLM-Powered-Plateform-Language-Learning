// Checked
import React, { useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { CheckCircleOutline, DoNotDisturb } from '@mui/icons-material';
const difficulty = process.env.REACT_APP_API_URL_2;
const TestModel = () => {
    const [statusMessages, setStatusMessages] = useState([]);
    const [isTesting, setIsTesting] = useState(false);

    const testAnotherRequest = async (searchTerm) => {
        try {
            const start = performance.now();
            // const anotherResponse = await axios.get(`${difficulty}/${searchTerm}`);
            const anotherResponse = await axios.get(`https://difficultymodel-fnbsdypmya-oa.a.run.app/model/api/predict/bonjour`);

            const { predicted_label } = anotherResponse.data;
            const end = performance.now();
            const timeTaken = ((end - start) / 1000).toFixed(2);
            const message = {
                query: `GET api/predict`,
                result: 'Request Successful',
                timeTaken: `${timeTaken} seconds`,
                difficultyLevel: predicted_label,
            };
            setStatusMessages(prev => [...prev, message]);
        } catch (error) {
            const message = {
                query: `GET api/predict`,
                result: `Error: ${error.message}`,
                timeTaken: '',
                difficultyLevel: '',
            };
            setStatusMessages(prev => [...prev, message]);
        }
    };

    const startTests = async () => {
        if (!isTesting) {
            setIsTesting(true);
            setStatusMessages([]);
            try {
                await testAnotherRequest('Ceci est un exemple de phrase'); // Assuming `searchTerm` is defined
            } finally {
                setIsTesting(false);
            }
        }
    };

    const runAgain = () => {
        setStatusMessages([]);
    };

    return (
        <div>
            <div className="dashboard-box">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div onClick={startTests} style={{ fontWeight: '600', fontSize: '17px', color: '#555' }} disabled={isTesting}>
                        NLP Difficulty Model - Query Test
                    </div>
                    <div></div>
                </div>
                <div style={{ height: '20px' }}></div>
                <div onClick={startTests} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: '600', fontSize: '17px', color: 'black' }} disabled={isTesting}>
                        Start Query Test
                    </div>
                    {isTesting && <div className="loading-icon"><CircularProgress style={{ marginLeft: '10px', fontSize: '15px' }} /></div>}
                </div>

                <div style={{ height: '20px' }}></div>

                <div className="box-content">
                    {statusMessages.map((message, index) => (
                        <div key={index} className="query-result">
                            <div className="status" style={{ display: 'flex' }}>
                                <div className="status-text" style={{ marginRight: '20px' }}>{message.result}</div>
                                {message.result === 'Request Successful' ? (
                                    <CheckCircleOutline style={{ color: 'green' }} className="status-icon" />
                                ) : (
                                    <DoNotDisturb style={{ color: 'red' }} />
                                )}
                            </div>

                            <div className="query-details">
                                <div className="query-text" style={{ fontStyle: 'italic', fontWeight: '450' }}>{message.query}</div>
                                <div className="time-taken">
                                    <span style={{ fontWeight: 'bold' }}>Time Taken:</span> {message.timeTaken}
                                </div>
                                <div>
                                    <span style={{ fontWeight: 'bold' }}>Difficulty Level:</span> {message.difficultyLevel}
                                </div>
                            </div>
                            <div style={{ height: '10px', width: '180px', borderBottom: '1px solid grey' }}></div>
                            <div style={{ height: '10px' }}></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestModel;
