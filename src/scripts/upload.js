const container = document.getElementById("container");
const uploadContainer = document.getElementById("upload-container");
let video = document.getElementById("video");
const videoUpload = document.getElementById("video-upload");

videoUpload.addEventListener("change", uploadVideo);

function uploadVideo() {
  let file = new FileReader();
  file.readAsDataURL(videoUpload.files[0]);
  file.onload = () => {
    video.setAttribute("src", file.result);
    container.style.display = "flex";
    uploadContainer.style.display = "none";
  };
}
