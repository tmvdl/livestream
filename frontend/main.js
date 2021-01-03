"use strict";

/* globals MediaRecorder */

let mediaRecorder;
let recordedBlobs;

let gumVideo = document.querySelector("video#video");

const button = document.querySelector("button#button");
const err = document.querySelector("span#errorMsg");

const minVideo = Math.min(window.innerHeight, window.innerWidth);

const thewait = async (ms) => new Promise((s) => window.setTimeout(() => s(), ms));

function handleDataAvailable(event) {
  console.log("handleDataAvailable", event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function startRecording() {
  recordedBlobs = [];
  let options = { mimeType: "video/webm;codecs=vp9,opus" };
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error(`${options.mimeType} is not supported`);
    options = { mimeType: "video/webm;codecs=vp8,opus" };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not supported`);
      options = { mimeType: "video/webm" };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not supported`);
        options = { mimeType: "" };
      }
    }
  }

  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    console.error("Exception while creating MediaRecorder:", e);
    err.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(
      e
    )}`;
    return;
  }

  console.log("Created MediaRecorder", mediaRecorder, "with options", options);
  button.textContent = "Stop Recording";
  mediaRecorder.onstop = (event) => {
    console.log("Recorder stopped: ", event);
    console.log("Recorded Blobs: ", recordedBlobs);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log("MediaRecorder started", mediaRecorder);
}

function stopRecording() {
  mediaRecorder.stop();
}

function downloadVideo() {
  const blob = new Blob(recordedBlobs, { type: "video/webm" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = "video_" + Date.now() + ".webm";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}

async function getUserMedia() {
  return await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: { exact: true },
      autoGainControl: { exact: true },
      noiseSuppression: true,
    },
    video: {
      width: minVideo,
      height: minVideo,
      aspectRatio: 1,
    },
  });
}

async function init() {
  try {
    if (!window.stream) {
      const stream = await getUserMedia();
      console.log("getUserMedia() got stream:", stream);
      window.stream = stream;
    }

    gumVideo.srcObject = stream;
  } catch (e) {
    console.error("navigator.getUserMedia error:", e);
    err.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
  }
}

async function onOverButtonClick() {
  if (button.textContent === "Start Recording") {
    await init();
    startRecording();
  } else {
    stopRecording();
    await thewait(1000);
    downloadVideo();
    button.textContent = "Start Recording";
  }
}

button.addEventListener("click", onOverButtonClick);
