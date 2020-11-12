// Store the 3 buttons in some object (div handler)
var buttons = {
  play: document.getElementById("btn-play"),
  pause: document.getElementById("btn-pause"),
  stop: document.getElementById("btn-stop")
};
//Actual button
var btn = {
  play: document.getElementById("playBtn"),
  pause: document.getElementById("pauseBtn"),
  stop: document.getElementById("stopBtn")
};
// Create an instance of wave surfer with its configuration
var Spectrum = WaveSurfer.create({
  container: "#audio-spectrum",
  progressColor: "#0277bd  ",
  height: 60,
  color: "DeepSkyBlue"
});

// Handle Play button
buttons.play.addEventListener(
  "click",
  function() {
    Spectrum.play();

    // Enable/Disable respectively buttons
    buttons.stop.disabled = false;
    buttons.pause.disabled = false;
    buttons.play.disabled = true;
  },
  false
);

// Handle Pause button
buttons.pause.addEventListener(
  "click",
  function() {
    Spectrum.pause();

    // Enable/Disable respectively buttons
    buttons.pause.disabled = true;
    buttons.play.disabled = false;
  },
  false
);

// Handle Stop button
buttons.stop.addEventListener(
  "click",
  function() {
    Spectrum.stop();

    // Enable/Disable respectively buttons
    buttons.pause.disabled = true;
    buttons.play.disabled = false;
    buttons.stop.disabled = true;
  },
  false
);

// Add a listener to enable the play button once it's ready
Spectrum.on("ready", function() {
  console.log("ready");
  btn.play.disabled = false;
  btn.stop.classList.add("btn-secondary");
  btn.stop.classList.remove("btn-primary");
  btn.pause.classList.add("btn-secondary");
  btn.pause.classList.remove("btn-primary");
});

// If you want a responsive mode (so when the user resizes the window)
// the spectrum will be still playable
window.addEventListener(
  "resize",
  function() {
    // Get the current progress according to the cursor position
    var currentProgress = Spectrum.getCurrentTime() / Spectrum.getDuration();

    // Reset graph
    Spectrum.empty();
    Spectrum.drawBuffer();
    // Set original position
    Spectrum.seekTo(currentProgress);

    // Enable/Disable respectively buttons
    buttons.pause.disabled = true;

    buttons.play.disabled = false;
    buttons.stop.disabled = false;
  },

  false
);

// Load the audio file from your domain !
Spectrum.load("../audio/mySong.mp3");
