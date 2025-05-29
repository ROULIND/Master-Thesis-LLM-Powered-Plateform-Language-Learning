// Checked
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Components
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const apiUrl = process.env.REACT_APP_API_URL; // API URL
const TopCategoriesChart = () => {
    const [videos, setVideos] = useState([]);
    // Fetch videos
    useEffect(() => {
        axios.get(`${apiUrl}/storage/videos/`)
            .then(response => {
                setVideos(response.data);
            })
            .catch(error => {
                console.error('Error fetching videos:', error);
            });
    }, []);

    // Calculate the number of video per Category
    const calculateCategoryCounts = () => {
        const categoryCounts = {};
        videos.forEach(video => {
            const category = video.category;
            if (category) {
                if (categoryCounts[category]) {
                    categoryCounts[category]++;
                } else {
                    categoryCounts[category] = 1;
                }
            }
        });
        return categoryCounts;
    };

    const getCategoryPieData = () => {
        const categoryCounts = calculateCategoryCounts();
        const sortedCategories = Object.keys(categoryCounts).sort(
            (a, b) => categoryCounts[b] - categoryCounts[a]
        );
        const topCategories = sortedCategories.slice(0, 3);
        const pieData = topCategories.map(category => ({
            name: category,
            value: categoryCounts[category]
        }));
        return pieData;
    };

    const pieData = getCategoryPieData();

    const COLORS = ['#F4845F', '#F27059', '#F25C54'];

    return (
        <div className="dashboard-box">
            <div className="box-content2">
                <div className="typo-box"/>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, value }) => `${name} (${value})`} // Show category name and count as label
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TopCategoriesChart;
