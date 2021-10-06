let images = [];

document
  .getElementById("import-images")
  .addEventListener("change", displayImages);
document
  .getElementById("export-images-label")
  .addEventListener("click", exportImages);

function displayImages(e) {
  images = [];
  let file = e.target.files[0];
  let reader = new FileReader();
  reader.onload = (event) => {
    let importedImages = JSON.parse(event.target.result);
    images = importedImages;
    importedImages.forEach((item, i) => {
      let imgSection = document.createElement("div");
      imgSection.classList.add("image-section");
      let imgSectionTitle = document.createElement("h3");
      imgSectionTitle.innerHTML = "Title";
      let imgSectionList = document.createElement("div");
      imgSectionList.classList.add("image-section-list");

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
            if (i === e.target.dataset.item) {
              delete image[e.target.dataset.timestamp];
            }
          });
        });
        img.src = image;
        imgBox.appendChild(img);
        imgBox.appendChild(removeIcon);
        imgSectionList.appendChild(imgBox);
      });
      imgSection.appendChild(imgSectionTitle);
      imgSection.appendChild(imgSectionList);
      document.getElementById("images-container").appendChild(imgSection);
    });
    if (images.length)
      document.getElementById("no-images").style.display = "none";
  };
  reader.readAsText(file);
  document.getElementById("export-images-label").style.display = "block";
  document.getElementById("export-message").style.display = "block";
}

function exportImages(e) {
  const exportImagesBtn = document.getElementById("export-images");
  let imagesDataJSON = JSON.stringify(images);
  let imagesDataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(imagesDataJSON);
  exportImagesBtn.setAttribute("href", imagesDataUri);
  exportImagesBtn.setAttribute("download", `images.json`);
  exportImagesBtn.click();
}
