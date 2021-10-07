let video = document.getElementById("video");
const videoUpload = document.getElementById("video-upload");

videoUpload.addEventListener("change", uploadVideo);

function uploadVideo() {
  let file = new FileReader();
  file.readAsDataURL(videoUpload.files[0]);
  file.onload = () => {
    video.setAttribute("src", file.result);
    video.addEventListener("loadedmetadata", function (e) {
      window.resolution = video.videoWidth * video.videoHeight;
      if (window.resolution > 2073600) return;
      video.style.width = video.videoWidth + "px";
      video.style.height = video.videoHeight + "px";
      window.videoWidth = video.videoWidth;
      window.videoHeight = video.videoHeight;
      document.getElementById("container").style.display = "flex";
      console.log(window.resolution);
      document.getElementById("upload-container").style.display = "none";
    });
  };
}
