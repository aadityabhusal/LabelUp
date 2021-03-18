import { Label } from "./Label.js";
const addLabelBtn = document.getElementById("add-label-btn");
const labelList = document.getElementById("label-list");

let labels = [];
let currentLabelBox = null;

addLabelBtn.addEventListener("click", (e) => {
  let label = new Label();
  console.log(label.labelElement.style);
  labels.push(label.labelInfo);
  addNewLabel(label.labelInfo);
});

const addNewLabel = (label) => {
  let labelBox = document.createElement("div");
  labelBox.classList.add("label-box");

  let labelInput = document.createElement("input");
  labelInput.classList.add("labelInput");
  labelInput.placeholder = "Enter label text";
  labelInput.style.border = `2px solid rgb(${label.color.r}, ${label.color.g},${label.color.b})`;
  labelInput.addEventListener("focus", () => selectLabel(label));
  labelInput.addEventListener("blur", () => highlightLabel(false));

  let removeLabel = document.createElement("div");
  removeLabel.classList.add("closeIcon");
  removeLabel.innerHTML = "&#x2716;";
  removeLabel.addEventListener("click", (e) => deleteLabel(e, label));

  labelBox.appendChild(labelInput);
  labelBox.appendChild(removeLabel);
  labelList.appendChild(labelBox);
};

const selectLabel = (label) => {
  if (currentLabelBox) {
    highlightLabel(false);
  }
  currentLabelBox = document.getElementById("label" + label.id);
  highlightLabel(true);
};

const highlightLabel = (state) => {
  let boxShadow = state ? "0px 0px 10px 5px #fff" : "none";
  let border = state ? "1px solid #222" : "none";
  let zIndex = state ? "2" : "";

  currentLabelBox.style.boxShadow = boxShadow;
  currentLabelBox.style.border = border;
  currentLabelBox.style.zIndex = zIndex;
};

const deleteLabel = (e, label) => {
  e.stopPropagation();
  let parent = e.target.parentElement;
  parent.parentElement.removeChild(parent);

  labels = labels.filter((item) => item.id !== label.id);

  let labelBox = document.getElementById("label" + label.id);
  labelBox.parentElement.removeChild(labelBox);
};
