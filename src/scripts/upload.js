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
    video.addEventListener("loadedmetadata", function (e) {
      video.style.width = video.videoWidth + "px";
      video.style.height = video.videoHeight + "px";
      window.videoWidth = video.videoWidth;
      window.videoHeight = video.videoHeight;
      container.style.display = "flex";
      uploadContainer.style.display = "none";
    });
  };
}
