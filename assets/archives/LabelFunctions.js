export function checkBoundaries(currentLabel, videoContainer) {
  let x = currentLabel.offsetLeft + currentLabel.clientWidth;
  let y = currentLabel.offsetTop + currentLabel.clientHeight;
  let endX = videoContainer.clientWidth;
  let endY = videoContainer.clientHeight;

  if (x > endX) {
    currentLabel.style.left = endX - currentLabel.clientWidth + "px";
  } else if (currentLabel.offsetLeft < 0) {
    currentLabel.style.left = "0px";
  }

  if (y > endY) {
    currentLabel.style.top = endY - currentLabel.clientHeight + "px";
  } else if (currentLabel.offsetTop < 0) {
    currentLabel.style.top = "0px";
  }
}

export function generateRandomColor() {
  let r = Math.floor(Math.random() * 255);
  let g = Math.floor(Math.random() * 255);
  let b = Math.floor(Math.random() * 255);

  return { r, g, b };
}
