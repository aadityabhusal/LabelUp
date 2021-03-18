export class Label {
  constructor() {
    this.video = document.getElementById("video-container");
    this.overlay = document.getElementById("video-overlay");
    this.label = null;
    this.labelX = 0;
    this.labelY = 0;
  }

  listeners = () => {
    this.label.addEventListener("dragstart", (e) => {
      this.labelX = e.pageX;
      this.labelY = e.pageY;
    });

    this.label.addEventListener("dragend", (e) => {
      this.label.style.left =
        this.label.offsetLeft - (this.labelX - e.pageX) + "px";
      this.label.style.top =
        this.label.offsetTop - (this.labelY - e.pageY) + "px";
      this.labelX = e.pageX;
      this.labelY = e.pageY;
      this.checkBoundaries();
    });
  };

  create = () => {
    this.label = document.createElement("div");
    this.label.id = "label" + this.overlay.children.length;
    this.label.classList.add("label");
    this.label.draggable = true;
    let color = this.generateRandomColor();
    this.label.style.background = `rgb(${color.r}, ${color.g},${color.b})`;
    this.overlay.appendChild(this.label);
    this.listeners();
  };

  checkBoundaries = () => {
    let x = this.label.offsetLeft + this.label.clientWidth;
    let y = this.label.offsetTop + this.label.clientHeight;
    let endX = this.video.clientWidth;
    let endY = this.video.clientHeight;

    if (x > endX) {
      this.label.style.left = endX - this.label.clientWidth + "px";
    } else if (this.label.offsetLeft < 0) {
      this.label.style.left = "0px";
    }

    if (y > endY) {
      this.label.style.top = endY - this.label.clientHeight + "px";
    } else if (this.label.offsetTop < 0) {
      this.label.style.top = "0px";
    }
  };

  generateRandomColor = () => {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);

    return { r, g, b };
  };
}
