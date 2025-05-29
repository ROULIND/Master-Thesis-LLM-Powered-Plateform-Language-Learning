function determineDifficultyColor(predicted_label) {
    const colors = {
        A2: '#57958D',
        B1: '#416E95',
        B2: '#094E9C',
        C1: '#983737',
        C2: '#A31616'
    };
    return colors[predicted_label] || '#f4845f';
}

function formatDuration(iso8601Duration) {
    const matches = iso8601Duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = parseInt(matches[1]) || 0;
    const minutes = parseInt(matches[2]) || 0;
    const seconds = parseInt(matches[3]) || 0;

    return hours > 0
        ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatViewCount(viewCount) {
    if (viewCount < 1000) return viewCount.toString();
    if (viewCount < 1000000) return `${Math.floor(viewCount / 1000)}k`;
    return `${Math.floor(viewCount / 1000000)}M`;
}

module.exports = { determineDifficultyColor, formatDuration, formatViewCount };
