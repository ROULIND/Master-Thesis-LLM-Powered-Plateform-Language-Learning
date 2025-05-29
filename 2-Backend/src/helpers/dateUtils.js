const { formatDistanceToNow } = require('date-fns');
const { fr } = require('date-fns/locale');

function calculateRelativeDate(publishDate) {
    const currentDate = new Date();
    const yearDiff = currentDate.getFullYear() - publishDate.getFullYear();
    if (yearDiff >= 1) {
        return `${yearDiff} year${yearDiff > 1 ? 's' : ''} ago`;
    } else {
        return formatDistanceToNow(publishDate, { locale: fr });
    }
}

module.exports = { calculateRelativeDate };
