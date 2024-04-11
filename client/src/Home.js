import React, { useState } from "react";
import axios from "axios";
import './home.css'
import Loader from './loader/Spinner';
const LINK = "https://yt-playlist-length-calculator.onrender.com";
function Home() {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalDurations, setTotalDurations] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const handleSubmit = () => {
    setTotalDurations("");
    setLoading(true);
    axios
      .post(`${LINK}/store-link`, {
        link: youtubeLink,
      })
      .then(() => {
        return axios.get(`${LINK}/playlist-length`);
      })
      .then((response) => {
        setTotalDurations(response.data.formattedDuration);
        setLoading(false)
        console.log(response.data.formattedDuration);
      })
      .catch((error) => {
        console.log(error.message);
        setErrorMessage("Please enter a valid playlist link (they contain word the 'playlist')!");
        setLoading(false); // Stop the spinner

      });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="column left">
          <span className="dot" style={{background: "#ED594A" }}></span>
          <span className="dot" style={{background:"#FDD800"}}></span>
          <span className="dot" style={{background:"#5AC05A"}}></span>
        </div>
        <div className="column middle">
          <input type="text" className="link-input" placeholder='Please enter the playlist link and not the video link...Link should contain the word "playlist".' value={youtubeLink}
            onChange={(event) => setYoutubeLink(event.target.value)} />
        </div>

        <div className="column right">
          <div style={{ float: "right" }}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </div>

      <div className="content">
        <p className="head-font" style={{ margin: "0px" }}>Youtube Playlist</p>
        <p className="head-font" style = {{margin:"0px"}}>Length calculator</p>
        <div ontouchstart="">
          <div class="button">
            {loading ? <Loader /> : (youtubeLink === "" ? <button disabled>Analyse</button> :<button onClick={handleSubmit}>Analyse</button>)}
           
          </div>
          {errorMessage && <p className = "error-message">{errorMessage}</p>}

        </div>
        {totalDurations !== "" && (<p className="head-font" style={{ fontSize: "40px", fontFamily:"Ubuntu Mono"}}>Total duration: {totalDurations}</p> )}

      </div>
    </div>
  );
}

export default Home;
