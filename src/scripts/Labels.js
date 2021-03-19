import { Label } from "./Label.js";
const addLabelBtn = document.getElementById("add-label-btn");
const exportDataBtn = document.getElementById("export-data-btn");

export let labels = [];

addLabelBtn.addEventListener("click", (e) => {
  let label = new Label(deleteLabels);
  labels.push(label);
});

const deleteLabels = (id) => {
  labels = labels.filter((item) => item.labelInfo.id !== id);
};

exportDataBtn.addEventListener("click", () => {
  console.log(labels.map((item) => item.labelInfo));
});
