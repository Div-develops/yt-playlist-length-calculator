const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");

require("dotenv").config();
app.use(express.json());
// app.use(cors({
//   origin: 'https://ytplaylist-length-calculator.netlify.app',
// }));


const { extractPlaylistIdFromUrl, parseISO8601ToSeconds, formatSecondsToTime } = require('./utils/functions')
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const port = 4000;

let youtubeLink = null;
let playlistId = null;

/* getData returns a pending promise that the caller can resolve.
Response will contains playlist data like videoIDs */
function getData(id, pageToken = null) {
  const maxResults = 150;
  try {
    return axios.get("https://youtube.googleapis.com/youtube/v3/playlistItems", {
      params: {
        part: "contentDetails",
        maxResults: maxResults,
        pageToken: pageToken,
        playlistId: id,
        key: YOUTUBE_API_KEY,
      },
      headers: {
        Accept: "application/json",
      },
    });
  }
  
  
  /* !!!Still to add in frontend*/
  catch {
    console.error("Error in getting video Id's")
    return "Enter valid playlist URL"
  }

}

/*getVideoDetails takes a video ID, uses the YouTube API to fetch metadata, extracts the duration, converts it to seconds, and returns the total length of that video in seconds. This allows the calling code to sum up durations across multiple videos to calculate total playlist time.*/
async function getVideoDetails(videoId) {
  try {
    const videoResponse = await axios.get(
      "https://youtube.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "snippet,contentDetails",
          id: videoId,
          key: YOUTUBE_API_KEY,
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    const videoItem = videoResponse.data.items[0];
    const contentDetails = videoItem.contentDetails;
    const duration = contentDetails.duration; // This is in ISO 8601 format
    const formattedDuration = parseISO8601ToSeconds(duration);
    console.log("Video duration for videoId", videoId, ":", formattedDuration);

    return formattedDuration;

  } catch (error) {
    console.error("Error fetching video details for videoId", videoId, ":", error);
    throw error; 
  }
}


/* gets playlist link from frontend and store it in a global variable */
app.post('/store-link', async (req, res) => {
  const { link } = req.body;
  youtubeLink = link;
  res.status(200).json({ message: "Link stored successfully" });

})

/*The code first extracts the playlist ID from the youtubeLink variable, which contains a full YouTube playlist URL that was previously stored.

It then calls the getVideoIds function, passing in the playlist ID. This asynchronously fetches all the video IDs in the playlist.

Next, it calls getPlaylistTotalDuration, passing the array of video IDs. This sums up the individual durations of each video to get the total playlist duration.

The total duration is formatted into a human readable time string using formatSecondsToTime.

Finally, the formatted duration string is returned in the JSON response to the original request.*/
app.get("/playlist-length", async (req, res) => {
  try {
    playlistId = extractPlaylistIdFromUrl(youtubeLink);
    const videoIds = await getVideoIds(playlistId);

    const totalPlaylistTime = await getPlaylistTotalDuration(videoIds);
    const formattedDuration = formatSecondsToTime(totalPlaylistTime)
    console.log(formattedDuration,"----->")
    res.json({ formattedDuration});
  } catch (error) {
    console.error("Error fetching playlist items:", error);
    res.status(error.response?.status || 500).json({ error: "An error occurred" });
  }
});

async function getVideoIds(playlistId) {
  const videoIds = [];
  let nextPageToken = null;

  do {
    const response = await getData(playlistId, nextPageToken);
    const responseData = response.data;

    responseData.items.forEach((item) => {
      const videoId = item.contentDetails.videoId;
      const publishedAt = item.contentDetails.videoPublishedAt;

      // Check if video is hidden by checking for invalid or placeholder dates
      const isHidden = !publishedAt || publishedAt.startsWith('0000') || publishedAt.startsWith('1900') || publishedAt === '1970-01-01T00:00:00Z';
      if (!isHidden) {
        videoIds.push(videoId);
      }
    });

    nextPageToken = responseData.nextPageToken;
  } while (nextPageToken);

  return videoIds;
}


async function getPlaylistTotalDuration(videoIds) {

  let totalDurationInSeconds = 0;

  await Promise.all(
    videoIds.map(async (videoId) => {

      const videoDuration = await getVideoDetails(videoId);

      totalDurationInSeconds += videoDuration;
    })
  );

  console.log("Total duration:", totalDurationInSeconds);

  return totalDurationInSeconds;
}


app.listen(port, () => {
  console.log("Server listening on port ");
});
