import {
  playPause,
  updateCurrentTime,
  displayTime,
  getRates,
} from "./VPFunctions.js";

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
    let fullTimeStamps = {};
    let sortedTimeStamps = Object.entries(item.labelInfo.timeStamps).sort(
      (a, b) => a[0] - b[0]
    );

    // DO this when adding a new timestamp inside label class
    sortedTimeStamps.forEach((item, index, array) => {
      let first = array[index];
      let second = array[index + 1];
      if (second) {
        let { rx, ry, rw, rh, t } = getRates(first, second);
        let { x, y } = first[1].position;
        let { w, h } = first[1].dimension;
        console.log({ rx, ry, rw, rh, t });
        for (
          let i = Number(first[0]);
          i < Number(second[0]);
          i = (Number(i) + 0.1).toFixed(1)
        ) {
          x = rx == 0 ? (x - rx).toFixed(2) : x;
          y = ry == 0 ? (y - ry).toFixed(2) : y;
          w = rw == 0 ? (w - rw).toFixed(2) : h;
          h = rh == 0 ? (h - rh).toFixed(2) : w;
          fullTimeStamps[i] = { position: { x, y }, dimension: { w, h } };
        }
        console.log(fullTimeStamps);
      }
    });

    let time = Math.round(video.currentTime * 10) / 10;
    // let timeStamps = item.labelInfo.timeStamps;
    if (fullTimeStamps.hasOwnProperty(time)) {
      let { x, y } = fullTimeStamps[time].position;
      let { w, h } = fullTimeStamps[time].dimension;
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
