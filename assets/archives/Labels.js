import { checkBoundaries } from "./LabelFunctions.js";

const videoPlayerContainer = document.getElementById("video-player-container");
const currentLabel = document.getElementById("current-label");

let labelX = 0;
let labelY = 0;

currentLabel.addEventListener("dragstart", (e) => {
  labelX = e.pageX;
  labelY = e.pageY;
});

currentLabel.addEventListener("dragend", (e) => {
  currentLabel.style.left = currentLabel.offsetLeft - (labelX - e.pageX) + "px";
  currentLabel.style.top = currentLabel.offsetTop - (labelY - e.pageY) + "px";
  labelX = e.pageX;
  labelY = e.pageY;
  checkBoundaries(currentLabel, videoPlayerContainer);
});
