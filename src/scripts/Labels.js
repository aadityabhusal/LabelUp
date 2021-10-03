import { Label } from "./Label.js";
const addLabelBtn = document.getElementById("add-label-btn");
const importData = document.getElementById("import-data");
const exportDataBtn = document.getElementById("export-data-btn");
const exportImages = document.getElementById("export-images");
const exportImagesBtn = document.getElementById("export-images-btn");
const video = document.getElementById("video");
export let labels = [];

const deleteLabels = (id) => {
  labels = labels.filter((item) => item.labelInfo.id !== id);
};

const getLabelFromId = (id) => {
  return labels.filter((item) => item.labelInfo.id === id)[0];
};

addLabelBtn.addEventListener("click", (e) => {
  let label = new Label(deleteLabels);
  labels.push(label);
});

/* 
  Event Listeners for Dragging Label Boxes
*/

let xOffset,
  yOffset = 0;
let targetLabelBox = null;
let targetLabel = null;
let isResized = false;

document.addEventListener("mousedown", (e) => {
  if (!e.target.classList.contains("label")) return;
  targetLabel = getLabelFromId(e.target.id);
  targetLabelBox = targetLabel.label;
  video.pause();
  if (
    e.clientX < targetLabelBox.offsetLeft + targetLabelBox.clientWidth - 10 &&
    e.clientY < targetLabelBox.offsetTop + targetLabelBox.clientHeight - 10
  ) {
    xOffset = e.clientX - targetLabelBox.offsetLeft;
    yOffset = e.clientY - targetLabelBox.offsetTop;
  } else {
    isResized = true;
  }
});

document.addEventListener("mousemove", (e) => {
  if (!targetLabelBox || isResized) return;
  targetLabelBox.style.left = e.clientX - xOffset + "px";
  targetLabelBox.style.top = e.clientY - yOffset + "px";
  let parentRect = targetLabelBox.parentElement.getBoundingClientRect();
  let targetRect = targetLabelBox.getBoundingClientRect();

  if (targetRect.left < parentRect.left) targetLabelBox.style.left = 0;
  if (targetRect.top < parentRect.top) targetLabelBox.style.top = 0;
  if (targetRect.right > parentRect.right)
    targetLabelBox.style.left = parentRect.width - targetRect.width + "px";
  if (targetRect.bottom > parentRect.bottom)
    targetLabelBox.style.top = parentRect.height - targetRect.height + "px";
});

document.addEventListener("mouseup", () => {
  if (!targetLabelBox) return;
  targetLabel.dimension = {
    w: targetLabelBox.clientWidth,
    h: targetLabelBox.clientHeight,
  };
  targetLabel.position = {
    x: targetLabelBox.offsetLeft,
    y: targetLabelBox.offsetTop,
  };
  let currentTime = video.currentTime.toFixed(1);
  // Adds Checkpoints
  targetLabel.checkPoints[currentTime] = {
    position: targetLabel.position,
    dimension: targetLabel.dimension,
  };
  targetLabel.timeStamps = targetLabel.addTimeStamps();

  targetLabelBox = null;
  isResized = false;
});

/* 
  Importing and Exporting Data and Images Section
*/

importData.addEventListener("change", (e) => {
  let file = e.target.files[0];
  let reader = new FileReader();
  reader.onload = (event) => {
    let importedLabels = JSON.parse(event.target.result);
    importedLabels.forEach((item) => {
      let newLabel = new Label(deleteLabels, item);
      labels.push(newLabel);
    });
  };
  reader.readAsText(file);
});

exportDataBtn.addEventListener("click", () => {
  let labelsData = JSON.stringify(labels.map((item) => item.labelInfo));
  let labelsDataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(labelsData);
  exportDataBtn.setAttribute("href", labelsDataUri);
  exportDataBtn.setAttribute("download", `dataset.json`);
});

exportImagesBtn.addEventListener("click", async () => {
  let imagesData = [];
  for (let i = 0; i < labels.length; i++) {
    imagesData[i] = await labels[i].cropImages();
  }
  let imagesDataJSON = JSON.stringify(imagesData);
  let imagesDataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(imagesDataJSON);
  exportImages.setAttribute("href", imagesDataUri);
  exportImages.setAttribute("download", `images.json`);
  exportImages.click();
});
