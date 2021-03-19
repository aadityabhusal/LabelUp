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
  exportDataBtn.setAttribute("download", `..\\exports\\${fileName}.json`);
  console.log(labelsData);
});
