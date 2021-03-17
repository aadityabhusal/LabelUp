export function playPause(video, play) {
  if (video.paused || video.ended) {
    video.play();
    play.innerHTML = "&#10074;&#10074;";
    play.title = "Pause";
  } else {
    video.pause();
    play.innerHTML = "&#x25b6;";
    play.title = "Play";
  }
}

export function displayTime(timeDiv, video) {
  let cur = formatTime(video.currentTime);
  let dur = formatTime(video.duration);
  timeDiv.innerHTML = cur.min + ":" + cur.sec + "/" + dur.min + ":" + dur.sec;
}

function formatTime(time) {
  let min = Math.floor(time / 60);
  let sec = Math.floor(time - min * 60);
  return {
    min: min < 10 ? "0" + min : min,
    sec: sec < 10 ? "0" + sec : sec,
  };
}

export function updateCurrentTime(currentTimeDiv) {
  currentTimeDiv.style.width = (video.currentTime / video.duration) * 100 + "%";
}

/* View in fullscreen */
export function openFullscreen(videoContainer) {
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    /* Safari */
    videoContainer.webkitRequestFullscreen();
  } else if (videoContainer.msRequestFullscreen) {
    /* IE11 */
    videoContainer.msRequestFullscreen();
  }
}

/* Close fullscreen */
export function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
  }
}
