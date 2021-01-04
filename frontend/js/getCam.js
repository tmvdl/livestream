var streaming = null
var width = 320;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream
  
const camElem = document.getElementById("getCam");

navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(function(stream) {
        camElem.srcObject = stream;
        camElem.play();
    })
    .catch(function(err) {
        console.log("An error occurred: " + err);
    });

camElem.addEventListener('canplay', function(ev){
    if (!streaming) {
        height = camElem.videoHeight / (camElem.videoWidth/width);
        camElem.setAttribute('width', width);
        camElem.setAttribute('height', height);
        streaming = true;
    }
    }, false);