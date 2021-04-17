import { Label } from "./Label.js";
const addLabelBtn = document.getElementById("add-label-btn");
const importData = document.getElementById("import-data");
const exportDataBtn = document.getElementById("export-data-btn");
const exportImagesBtn = document.getElementById("export-images-btn");
export let labels = [];

addLabelBtn.addEventListener("click", (e) => {
  let label = new Label(deleteLabels);
  labels.push(label);
});

importData.addEventListener("change", (e) => {
  let file = e.target.files[0];
  let reader = new FileReader();
  reader.onload = (event) => {
    let importedLabels = JSON.parse(event.target.result);
    importedLabels.forEach((item) => {
      let newLabel = new Label(deleteLabels, item);
      labels.push(newLabel);
    });
    console.log();
  };
  reader.readAsText(file);
});

const deleteLabels = (id) => {
  labels = labels.filter((item) => item.labelInfo.id !== id);
};

exportDataBtn.addEventListener("click", () => {
  let labelsData = JSON.stringify(labels.map((item) => item.labelInfo));
  let labelsDataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(labelsData);
  exportDataBtn.setAttribute("href", labelsDataUri);
  exportDataBtn.setAttribute("download", `dataset.json`);
});

exportImagesBtn.addEventListener("click", () => {
  let imagesData = JSON.stringify(
    labels.map((item) => {
      item.cropImages();
      return item.images;
    })
  );
  let imagesDataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(imagesData);
  exportImagesBtn.setAttribute("href", imagesDataUri);
  exportImagesBtn.setAttribute("download", `images.json`);
});
