import { playPause, updateCurrentTime, displayTime } from "./VPFunctions.js";
import { labels } from "./Labels.js";

const videoPlayerContainer = document.getElementById("video-player-container");
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

durationDiv.addEventListener("click", (e) => {
  let ddX =
    e.pageX - (videoPlayerContainer.offsetLeft + durationDiv.offsetLeft);
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
