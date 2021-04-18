const imagesContainer = document.getElementById("images-container");
const imporImagesLabel = document.getElementById("import-images-label");
const imporImages = document.getElementById("import-images");
let images = [];

imporImages.addEventListener("change", displayImages);

function displayImages(e) {
  let file = e.target.files[0];
  let reader = new FileReader();
  reader.onload = (event) => {
    let importedImages = JSON.parse(event.target.result);
    importedImages.forEach((item) => {
      Object.values(item).forEach((image) => {
        let imgBox = document.createElement("div");
        let img = document.createElement("img");
        img.src = image;
        imgBox.appendChild(img);
        imagesContainer.appendChild(imgBox);
      });
    });
  };
  reader.readAsText(file);
}
