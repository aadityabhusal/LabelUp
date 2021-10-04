import { playPause, updateCurrentTime, displayTime } from "./VPFunctions.js";
import { labels } from "./Labels.js";

const videoPlayerContainer = document.getElementById("video-player-container");
const videoOverlay = document.getElementById("video-overlay");
const video = document.getElementById("video");
const durationDiv = document.getElementById("duration");
const play = document.getElementById("play");

play.addEventListener("click", (e) => {
  playPause(video);
});

document.getElementById("rewind").addEventListener("click", function (e) {
  video.currentTime -= video.playbackRate;
});

document.getElementById("forward").addEventListener("click", function (e) {
  video.currentTime += video.playbackRate;
});

video.addEventListener("timeupdate", (event) => {
  updateCurrentTime(document.getElementById("currentTime"));

  displayTime(document.getElementById("time"), video);

  if (video.paused || video.ended) {
    play.innerHTML =
      '<svg height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M10 8.64L15.27 12 10 15.36V8.64M8 5v14l11-7L8 5z"/></svg>';
    play.title = "Play";
  } else {
    play.innerHTML =
      '<svg height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    play.title = "Pause";
  }

  /* Make this based on timestamps instead of label */

  labels.forEach((item) => {
    let time = video.currentTime.toFixed(1);
    let timeStamps = item.labelInfo.timeStamps;
    let checkPoints = item.labelInfo.checkPoints;
    let sorted = item.labelInfo.sortedCheckPoints;
    if (
      timeStamps.hasOwnProperty(time) &&
      Number(time) >= Number(sorted[0][0]) &&
      Number(time) <= Number(sorted[sorted.length - 1][0])
    ) {
      let { x, y } = timeStamps[time].position;
      let { w, h } = timeStamps[time].dimension;
      item.labelElement.style.visibility = "visible";
      item.labelElement = { x, y, w, h };

      if (checkPoints.hasOwnProperty(time)) {
        item.removeBox.style.display = "block";
      } else {
        item.removeBox.style.display = "none";
      }
    } else {
      if (Object.keys(item.labelInfo.checkPoints).length > 1)
        item.labelElement.style.visibility = "hidden";
    }
  });
});

videoOverlay.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  return false;
});

export function changeDuration(e) {
  let ddX =
    e.pageX - (videoPlayerContainer.offsetLeft + durationDiv.offsetLeft);
  let updatedTime = (video.duration * ddX) / durationDiv.clientWidth;
  video.currentTime = updatedTime;
}

durationDiv.addEventListener("click", changeDuration);

document.getElementById("volume").addEventListener("input", function (e) {
  e.preventDefault();
  video.volume = this.value;
  this.title = this.value * 100 + "%";
  document.getElementById("volume-value").innerHTML = this.title;
});

document.getElementById("speed").addEventListener("input", function (e) {
  e.preventDefault();
  video.playbackRate = this.value;
  this.title = this.value + "x";
  document.getElementById("speed-value").innerHTML = this.title;
});

document.getElementById("zoom").addEventListener("input", function (e) {
  e.preventDefault();
  window.scale = this.value;
  video.style.width = window.videoWidth * this.value + "px";
  video.style.height = window.videoHeight * this.value + "px";
  this.title = this.value + "x";
  document.getElementById("zoom-value").innerHTML = this.title;
});

document.addEventListener("keydown", (e) => {
  if (e.keyCode == 32) {
    e.preventDefault();
    playPause(video);
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
