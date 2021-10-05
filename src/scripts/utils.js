/* Video Player Utility Functions */

export function playPause(video) {
  if (video.paused || video.ended) {
    video.play();
  } else {
    video.pause();
  }
}

export function displayTime(timeDiv, video) {
  let cur = formatTime(video.currentTime);
  let dur = formatTime(video.duration);
  timeDiv.innerHTML = cur.min + ":" + cur.sec + " / " + dur.min + ":" + dur.sec;
}

function formatTime(time) {
  let min = Math.floor(time / 60) || 0;
  let sec = Math.floor(time - min * 60) || 0;
  return {
    min: min < 10 ? "0" + min : min,
    sec: sec < 10 ? "0" + sec : sec,
  };
}

export function changeDuration(e, video) {
  let currentTime = document.getElementById("currentTime");
  let videoPlayerContainer = document.getElementById("video-player-container");

  let ddX = e.pageX - (videoPlayerContainer.offsetLeft + this.offsetLeft);
  currentTime.style.width = ddX + "px";

  let updatedTime = (video.duration * ddX) / this.clientWidth;
  video.currentTime = updatedTime;
}

export function skipDuration(video, currentTime, direction) {
  if (direction === "left") video.currentTime -= video.playbackRate;
  else video.currentTime += video.playbackRate;
  currentTime.style.width = (video.currentTime / video.duration) * 100 + "%";
}
