import { Label } from "./Label.js";
const addLabelBtn = document.getElementById("add-label-btn");
const exportDataBtn = document.getElementById("export-data-btn");
const exportImagesBtn = document.getElementById("export-images-btn");
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
  let imagesData = JSON.stringify(labels.map((item) => item.images));
  let labelsDataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(labelsData);
  let imagesDataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(imagesData);
  exportDataBtn.setAttribute("href", labelsDataUri);
  exportDataBtn.setAttribute("download", `dataset.json`);
  exportImagesBtn.setAttribute("href", imagesDataUri);
  exportImagesBtn.setAttribute("download", `images.json`);
  exportImagesBtn.click();
});
