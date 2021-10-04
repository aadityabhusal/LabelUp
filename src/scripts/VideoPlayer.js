import { playPause, updateCurrentTime, displayTime } from "./VPFunctions.js";
import { labels } from "./Labels.js";

const videoPlayerContainer = document.getElementById("video-player-container");
const videoOverlay = document.getElementById("video-overlay");
const video = document.getElementById("video");
const play = document.getElementById("play");
const rewind = document.getElementById("rewind");
const forward = document.getElementById("forward");
const timeDiv = document.getElementById("time");
const durationDiv = document.getElementById("duration");
const currentTimeDiv = document.getElementById("currentTime");
const speed = document.getElementById("speed");
const zoom = document.getElementById("zoom");
const volume = document.getElementById("volume");

play.addEventListener("click", (e) => {
  playPause(video);
});

rewind.addEventListener("click", function (e) {
  video.currentTime -= video.playbackRate;
});

forward.addEventListener("click", function (e) {
  video.currentTime += video.playbackRate;
});

video.addEventListener("timeupdate", (event) => {
  updateCurrentTime(currentTimeDiv);

  displayTime(timeDiv, video);

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

volume.addEventListener("input", function (e) {
  e.preventDefault();
  video.volume = volume.value;
  volume.title = volume.value * 100 + "%";
});

speed.addEventListener("input", function (e) {
  e.preventDefault();
  video.playbackRate = speed.value;
  speed.title = speed.value + "x";
});

zoom.addEventListener("input", function (e) {
  e.preventDefault();
  window.scale = zoom.value;
  video.style.width = window.videoWidth * zoom.value + "px";
  video.style.height = window.videoHeight * zoom.value + "px";
  zoom.title = zoom.value + "x";
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
