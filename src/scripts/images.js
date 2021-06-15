const imagesContainer = document.getElementById("images-container");
const importImagesLabel = document.getElementById("import-images-label");
const importImages = document.getElementById("import-images");
const exportImagesLabel = document.getElementById("export-images-label");
const exportImagesBtn = document.getElementById("export-images");
let images = [];

importImages.addEventListener("change", displayImages);
exportImagesLabel.addEventListener("click", exportImages);

/* 
  Some parts of this code section were inspired by the following in-text citation
  
  (Uploading a JSON file and using it, 2016)
*/

function displayImages(e) {
  images = [];
  let file = e.target.files[0];
  let reader = new FileReader();
  reader.onload = (event) => {
    let importedImages = JSON.parse(event.target.result);
    images = importedImages;
    importedImages.forEach((item, i) => {
      Object.entries(item).forEach(([key, image]) => {
        let imgBox = document.createElement("div");
        let img = document.createElement("img");
        let removeIcon = document.createElement("div");
        removeIcon.dataset.item = i;
        removeIcon.dataset.timestamp = key;
        removeIcon.classList.add("remove-image");
        removeIcon.innerHTML = "&#x2716;";
        removeIcon.addEventListener("click", (e) => {
          e.target.parentElement.style.display = "none";
          images.forEach((image, i) => {
            if (i == e.target.dataset.item) {
              delete image[e.target.dataset.timestamp];
            }
          });
        });
        img.src = image;
        imgBox.appendChild(img);
        imgBox.appendChild(removeIcon);
        imagesContainer.appendChild(imgBox);
      });
    });
  };
  reader.readAsText(file);
  document.getElementById("export-images-label").style.display = "block";
}

function exportImages(e) {
  let imagesDataJSON = JSON.stringify(images);
  let imagesDataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(imagesDataJSON);
  exportImagesBtn.setAttribute("href", imagesDataUri);
  exportImagesBtn.setAttribute("download", `images.json`);
  exportImagesBtn.click();
}
