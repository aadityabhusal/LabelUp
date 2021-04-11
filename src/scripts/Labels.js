import { Label } from "./Label.js";
const addLabelBtn = document.getElementById("add-label-btn");
const exportDataBtn = document.getElementById("export-data-btn");
const video = document.getElementById("video");
export let labels = [];

addLabelBtn.addEventListener("click", (e) => {
  let label = new Label(deleteLabels);
  labels.push(label);
});

const deleteLabels = (id) => {
  labels = labels.filter((item) => item.labelInfo.id !== id);
};

exportDataBtn.addEventListener("click", () => {
  let labelsData = JSON.stringify(labels.map((item) => item.labelInfo));
  let dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(labelsData);
  let fileName = video.currentSrc.split("/").pop().split(".").shift();
  exportDataBtn.setAttribute("href", dataUri);
  exportDataBtn.setAttribute("download", `${fileName}.json`);
  console.log(labelsData);
});

/* 
  Also there is no concept of duration of a label in the Label class
  Possible Solution: When the video is being played, check all the labels and their time. If the position of the labels is not changing then add the result of (currentTime - label's startTime) 
*/
