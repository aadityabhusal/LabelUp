import {
  playPause,
  openFullscreen,
  updateCurrentTime,
  closeFullscreen,
  displayTime,
} from "./VPFunctions.js";

const videoContainer = document.getElementById("video-container");
const videoOverlay = document.getElementById("video-overlay");
const video = document.getElementById("video");
const play = document.getElementById("play");
const timeDiv = document.getElementById("time");
const durationDiv = document.getElementById("duration");
const currentTimeDiv = document.getElementById("currentTime");
const speed = document.getElementById("speed");
const fullscreenVideo = document.getElementById("fullscreen");

let isFullscreen = false;

play.addEventListener("click", (e) => {
  playPause(video, play);
});

video.addEventListener("timeupdate", (event) => {
  updateCurrentTime(currentTimeDiv);

  displayTime(timeDiv, video);

  if (video.ended) {
    play.innerHTML = "&#x21BA;";
    play.title = "Replay";
  }
});

videoOverlay.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  return false;
});

durationDiv.addEventListener("click", (e) => {
  let ddX = e.pageX - (videoContainer.offsetLeft + durationDiv.offsetLeft);
  let updatedTime = (video.duration * ddX) / durationDiv.clientWidth;
  video.currentTime = updatedTime;
});

speed.addEventListener("change", function () {
  video.playbackRate = speed.value;
  speed.title = speed.value;
  // display.innerText = displayvalue(playbackrate.value);
});

fullscreenVideo.addEventListener("click", function () {
  if (isFullscreen) {
    closeFullscreen();
    isFullscreen = false;
  } else {
    openFullscreen(videoContainer);
    isFullscreen = true;
  }
  updateCurrentTime(currentTimeDiv);
});
