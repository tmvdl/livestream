const videoElem = document.getElementById("getScreen");
const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");

async function startCapture() {
    try {
      videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      dumpOptionsInfo();
    } catch(err) {
      console.error("Error: " + err);
    }
}

function dumpOptionsInfo() {
    const videoTrack = videoElem.srcObject.getVideoTracks()[0];
//     console.info("Track settings:");
//     console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
//     console.info("Track constraints:");
//     console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
}

function stopCapture(evt) {
    let tracks = videoElem.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    videoElem.srcObject = null;
}

// Options for getDisplayMedia()

var displayMediaOptions = {
  video: {
    cursor: "always"
  },
  audio: false
};

// Set event listeners for the start and stop buttons
startElem.addEventListener("click", function(evt) {
  startCapture();
}, false);

stopElem.addEventListener("click", function(evt) {
  stopCapture();
}, false);