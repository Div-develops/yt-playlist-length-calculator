function extractPlaylistIdFromUrl(ytlink) {
    const regExp =
        /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/playlist\?list=([a-zA-Z0-9_-]{34})/;
    const match = ytlink.match(regExp);
    return match ? match[1] : null;
}

function parseISO8601ToSeconds(duration) {
    const durationComponents = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = parseInt(durationComponents[1]) || 0;
    const minutes = parseInt(durationComponents[2]) || 0;
    const seconds = parseInt(durationComponents[3]) || 0;

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    return totalSeconds;
}

function formatSecondsToTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours} hr ${minutes.toString().padStart(2, '0')} min ${remainingSeconds.toString().padStart(2, '0')} secs `;
}

module.exports = {
    extractPlaylistIdFromUrl,
    parseISO8601ToSeconds,
    formatSecondsToTime
}




