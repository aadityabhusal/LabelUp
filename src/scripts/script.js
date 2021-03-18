import { Label } from "./Label.js";

const labels = [];

const addLabelBtn = document.getElementById("add-label-btn");
const labelList = document.getElementById("label-list");

let currentLabel = null;
let currentLabelItem = null;
let currentLabelBox = null;

addLabelBtn.addEventListener("click", (e) => {
  let label = new Label();
  labels.push(label.labelInfo);
  addNewLabel(label.labelInfo);
});

const addNewLabel = (label) => {
  let labelItem = document.createElement("div");
  labelItem.id = "labelItem" + label.id;
  labelItem.classList.add("labelItem");
  labelItem.innerHTML = "Label #" + (label.id + 1);
  labelItem.style.background = `rgb(${label.color.r}, ${label.color.g},${label.color.b})`;
  labelItem.addEventListener("click", (e) => {
    selectLabel(e, label, labelItem);
    selectLabelBox(e, label);
    createCloseLabel(e, labelItem);
  });
  labelList.appendChild(labelItem);
};

const selectLabel = (e, label, labelItem) => {
  if (currentLabelItem) {
    currentLabelItem.removeChild(document.getElementById("closeIcon"));
  }
  currentLabelItem = labelItem;
};

const selectLabelBox = (e, label) => {
  if (currentLabelBox) {
    currentLabelBox.style.boxShadow = "none";
    currentLabelBox.style.zIndex = "auto";
  }
  currentLabelBox = document.getElementById("label" + label.id);
  currentLabelBox.style.boxShadow = "0px 0px 10px 5px #fff";
  currentLabelBox.style.zIndex = "2";
};

const createCloseLabel = (e, labelItem) => {
  let close = document.createElement("div");
  close.id = "closeIcon";
  close.innerHTML = "&#x2716;";
  close.addEventListener("click", (e) => {
    e.stopPropagation();
    currentLabelItem.removeChild(close);
    currentLabelBox.style.boxShadow = "none";
    currentLabelBox.style.zIndex = "auto";
    currentLabel = currentLabelItem = currentLabelBox = null;
  });
  labelItem.appendChild(close);
};
