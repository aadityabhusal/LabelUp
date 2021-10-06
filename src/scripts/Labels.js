import { Label } from "./Label.js";
import { changeDuration } from "./utils.js";

const durationDiv = document.getElementById("duration");
const video = document.getElementById("video");
const loadingMask = document.getElementById("loading-mask");
export let labels = [];

const deleteLabels = (id) => {
  labels = labels.filter((item) => item.labelInfo.id !== id);
};

const getLabelFromId = (id) => {
  return labels.filter((item) => item.labelInfo.id === id)[0];
};

document.getElementById("add-label-btn").addEventListener("click", (e) => {
  let label = new Label(deleteLabels);
  labels.push(label);
});

/* 
  Event Listeners for Dragging Label Boxes
*/

let xOffset = 0;
let yOffset = 0;
let targetLabelBox = null;
let targetLabel = null;
let isResized = false;

let isDurationClick = false;
let wasPlaying = false;

let isButtonClicked = false;

document.addEventListener("mousedown", (e) => {
  if (e.target.classList.contains("label")) {
    targetLabel = getLabelFromId(e.target.id);
    targetLabelBox = targetLabel.label;
    video.pause();
    if (
      e.offsetX < targetLabelBox.clientWidth - 10 &&
      e.offsetY < targetLabelBox.clientHeight - 10
    ) {
      xOffset = e.clientX - targetLabelBox.offsetLeft;
      yOffset = e.clientY - targetLabelBox.offsetTop;
    } else {
      isResized = true;
    }
  } else if (durationDiv.contains(e.target)) {
    isDurationClick = true;
    if (!video.paused) {
      wasPlaying = true;
      video.pause();
    }
  } else {
    return;
  }
});

document.addEventListener("mousemove", (e) => {
  if (targetLabelBox && !isResized) {
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
  } else if (durationDiv.contains(e.target)) {
    document.getElementById("duration-line").style.left = e.clientX + "px";
    if (isDurationClick) {
      changeDuration.call(durationDiv, e, video);
    }
  }
});

document.addEventListener("mouseup", () => {
  if (targetLabelBox) {
    targetLabel.dimension = {
      w: targetLabelBox.clientWidth / (window.scale || 1),
      h: targetLabelBox.clientHeight / (window.scale || 1),
    };
    targetLabel.position = {
      x: targetLabelBox.offsetLeft / (window.scale || 1),
      y: targetLabelBox.offsetTop / (window.scale || 1),
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
  } else if (isDurationClick) {
    if (wasPlaying) {
      video.play();
      wasPlaying = false;
    }
    isDurationClick = false;
  }
});

/* 
  Importing and Exporting Data and Images Section
*/

document.getElementById("import-data").addEventListener("change", (e) => {
  if (isButtonClicked) return;
  isButtonClicked = true;
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
  isButtonClicked = false;
});

document
  .getElementById("export-data-btn")
  .addEventListener("click", function () {
    if (isButtonClicked) return;
    isButtonClicked = true;
    let labelsData = JSON.stringify(labels.map((item) => item.labelInfo));
    let labelsDataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(labelsData);
    this.setAttribute("href", labelsDataUri);
    this.setAttribute("download", `dataset.json`);
    isButtonClicked = false;
  });

document
  .getElementById("export-images-btn")
  .addEventListener("click", async () => {
    if (isButtonClicked) return;
    isButtonClicked = true;
    loadingMask.style.display = "flex";
    const exportImages = document.getElementById("export-images");

    let imagesData = [];
    for (let i = 0; i < labels.length; i++) {
      let images = await labels[i].cropImages();
      let { id, name, color } = labels[i].labelInfo;
      imagesData[i] = {
        info: { id, name, color },
        images,
      };
    }
    let imagesDataJSON = JSON.stringify(imagesData);
    let imagesDataUri =
      "data:application/json;charset=utf-8," +
      encodeURIComponent(imagesDataJSON);
    exportImages.setAttribute("href", imagesDataUri);
    exportImages.setAttribute("download", `images.json`);
    exportImages.click();

    isButtonClicked = false;
    loadingMask.style.display = "none";
  });
