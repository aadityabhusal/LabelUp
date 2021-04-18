const fileUpload = document.getElementById("file");
let video = document.getElementById("video");
let playBtn = document.getElementById("playbtn");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

fileUpload.addEventListener("change", uploadVideo);

video.addEventListener("loadedmetadata", function () {
  canvas.width = this.videoWidth;
  canvas.height = this.videoHeight;
  // video.play();
  step();
});

playBtn.addEventListener("click", () => {
  video.play();
});

function step() {
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  console.log(canvas.width, canvas.height);
  setTimeout(step, 1000 / 30); // requestAnimationFrame(step);
}

function uploadVideo() {
  let file = new FileReader();
  file.readAsDataURL(fileUpload.files[0]);
  file.onload = () => {
    video.setAttribute("src", file.result);
  };
  fileUpload.style.display = "none";
}
