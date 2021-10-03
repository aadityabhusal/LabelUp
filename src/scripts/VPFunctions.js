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
  timeDiv.innerHTML = cur.min + ":" + cur.sec + "/" + dur.min + ":" + dur.sec;
}

function formatTime(time) {
  let min = Math.floor(time / 60) || 0;
  let sec = Math.floor(time - min * 60) || 0;
  return {
    min: min < 10 ? "0" + min : min,
    sec: sec < 10 ? "0" + sec : sec,
  };
}

export function updateCurrentTime(currentTimeDiv) {
  currentTimeDiv.style.width = (video.currentTime / video.duration) * 100 + "%";
}
