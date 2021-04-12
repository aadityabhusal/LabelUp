export function playPause(video, play) {
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

export const getRates = (first, second) => {
  let t = (Math.abs(Number(first[0]) - Number(second[0])) / 0.1).toFixed(2);
  let rx = ((first[1].position.x - second[1].position.x) / t).toFixed(2);
  let ry = ((first[1].position.y - second[1].position.y) / t).toFixed(2);
  let rw = ((first[1].dimension.w - second[1].dimension.w) / t).toFixed(2);
  let rh = ((first[1].dimension.h - second[1].dimension.h) / t).toFixed(2);

  return { rx, ry, rw, rh, t };
};
