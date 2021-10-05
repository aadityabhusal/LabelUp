import { playPause, displayTime, changeDuration } from "./utils.js";
import { labels } from "./Labels.js";

const videoOverlay = document.getElementById("video-overlay");
const video = document.getElementById("video");
const durationDiv = document.getElementById("duration");
const play = document.getElementById("play");

play.addEventListener("click", (e) => {
  playPause(video, play);
});

document.getElementById("rewind").addEventListener("click", function (e) {
  video.currentTime -= video.playbackRate;
});

document.getElementById("forward").addEventListener("click", function (e) {
  video.currentTime += video.playbackRate;
});

video.addEventListener("play", () => {
  play.innerHTML =
    '<svg height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
  play.title = "Pause";
});

video.addEventListener("pause", () => {
  play.innerHTML =
    '<svg height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0z" fill="none"/><path d="M8 5v14l11-7z"/></svg>';
  play.title = "Play";
});

video.addEventListener("timeupdate", () => {
  displayTime(document.getElementById("time"), video);

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

durationDiv.addEventListener("click", function (e) {
  changeDuration.call(this, e, video);
});

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
    playPause(video, play);
  }

  if (e.keyCode == 37) {
    video.currentTime -= video.playbackRate;
  }

  if (e.keyCode == 39) {
    video.currentTime += video.playbackRate;
  }
});
