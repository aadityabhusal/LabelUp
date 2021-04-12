import { playPause, updateCurrentTime, displayTime } from "./VPFunctions.js";

import { labels } from "./Labels.js";

const videoContainer = document.getElementById("video-container");
const videoOverlay = document.getElementById("video-overlay");
const video = document.getElementById("video");
const play = document.getElementById("play");
const timeDiv = document.getElementById("time");
const durationDiv = document.getElementById("duration");
const currentTimeDiv = document.getElementById("currentTime");
const speed = document.getElementById("speed");

play.addEventListener("click", (e) => {
  playPause(video, play);
});

video.addEventListener("timeupdate", (event) => {
  updateCurrentTime(currentTimeDiv);

  displayTime(timeDiv, video);

  if (video.paused || video.ended) {
    play.innerHTML = "&#x25b6;";
    play.title = "Play";
  } else {
    play.innerHTML = "&#10074;&#10074;";
    play.title = "Pause";
  }

  labels.forEach((item) => {
    let time = video.currentTime.toFixed(2);
    let timeStamps = item.labelInfo.timeStamps;
    if (timeStamps.hasOwnProperty(time)) {
      let { x, y } = timeStamps[time].position;
      let { w, h } = timeStamps[time].dimension;
      item.labelElement = { x, y, w, h };
    }
  });
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

speed.addEventListener("input", function (e) {
  e.preventDefault();
  video.playbackRate = speed.value;
  speed.title = speed.value;
});

window.addEventListener("keydown", (e) => {
  if (e.keyCode == 32) {
    playPause(video, play);
  }
  // Left Arrow
  if (e.keyCode == 37) {
    video.currentTime -= video.playbackRate;
  }
  // Right Arrow
  if (e.keyCode == 39) {
    video.currentTime += video.playbackRate;
  }
});
