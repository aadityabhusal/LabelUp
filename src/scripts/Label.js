export class Label {
  constructor(deleteLabels) {
    this.video = document.getElementById("video");
    this.videoContainer = document.getElementById("video-container");
    this.overlay = document.getElementById("video-overlay");
    this.labelList = document.getElementById("label-list");
    this.label = null;
    this.labelInput = null;
    this.labelDuration = null;
    this.removeLabel = null;

    this.labelX = 0;
    this.labelY = 0;
    this.id = performance.now().toString(36).replace(/\./g, "");
    this.name = "";
    this.position = { x: 0, y: 0 };
    this.dimension = { w: 100, h: 100 };
    this.timeStamps = {};

    this.color = this.generateRandomColor();
    this.createLabel(this.color);
    this.deleteLabels = deleteLabels;
    this.dragged = false;
  }

  get labelElement() {
    return this.label;
  }

  set labelElement({ x, y, w, h }) {
    if (this.label) {
      this.label.style.left = x + "px";
      this.label.style.top = y + "px";
      this.label.style.width = w + "px";
      this.label.style.height = h + "px";
    }
  }

  get labelInfo() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      timeStamps: this.timeStamps,
    };
  }

  set labelInfo(name) {
    this.name = name;
  }

  labelListeners = () => {
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
      this.dragged = true;
    });

    this.label.addEventListener("mouseout", () => {
      let w = this.label.clientWidth;
      let h = this.label.clientHeight;
      this.dimension = { w, h };

      if (this.dragged) {
        let currentTime = Math.round(this.video.currentTime * 10) / 10;
        this.addTimeStamps(currentTime, {
          position: this.position,
          dimension: this.dimension,
        });
        this.dragged = false;
      }

      if (Number(this.video.dataset.isPlaying)) {
        this.video.play();
      }
    });

    this.label.addEventListener("mousedown", () => {
      this.video.pause();
    });

    this.label.addEventListener("click", () => {
      this.labelInput.focus();
    });
  };

  createLabel = (color) => {
    this.label = document.createElement("div");
    this.label.id = "label" + this.id;
    this.label.classList.add("label");
    this.label.draggable = true;
    this.label.style.border = `3px solid rgb(${color.r}, ${color.g},${color.b})`;
    this.overlay.appendChild(this.label);
    this.labelListeners();
    this.createLabelInput();
  };

  checkBoundaries = () => {
    let x = this.label.offsetLeft;
    let y = this.label.offsetTop;
    let w = this.label.clientWidth;
    let h = this.label.clientHeight;
    let endX = this.videoContainer.clientWidth;
    let endY = this.videoContainer.clientHeight;

    if (x + w > endX) {
      this.label.style.left = endX - w + "px";
    } else if (x < 0) {
      this.label.style.left = "0px";
      x = 0;
    }

    if (y + h > endY) {
      this.label.style.top = endY - h + "px";
    } else if (y < 0) {
      this.label.style.top = "0px";
      y = 0;
    }

    this.position = { x, y };
  };

  generateRandomColor = () => {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);

    return { r, g, b };
  };

  createLabelInput = () => {
    let labelBox = document.createElement("div");
    labelBox.classList.add("label-box");

    this.labelInput = document.createElement("input");
    this.labelInput.classList.add("labelInput");
    this.labelInput.placeholder = "Enter label text";
    this.labelInput.style.border = `3px solid rgb(${this.color.r}, ${this.color.g},${this.color.b})`;

    this.removeLabel = document.createElement("div");
    this.removeLabel.classList.add("closeIcon");
    this.removeLabel.innerHTML = "&#x2716;";

    this.labelInputListeners();
    labelBox.appendChild(this.labelInput);
    labelBox.appendChild(this.removeLabel);
    this.labelList.appendChild(labelBox);
  };

  labelInputListeners = () => {
    this.labelInput.addEventListener("keyup", (e) => {
      this.name = e.target.value;
    });
    this.labelInput.addEventListener("focus", this.selectLabel);
    this.labelInput.addEventListener("blur", () => this.highlightLabel(false));
    this.removeLabel.addEventListener("click", this.deleteLabel);
  };

  selectLabel = () => {
    this.highlightLabel(true);
  };

  highlightLabel = (state) => {
    let boxShadow = state ? "0px 0px 10px 5px #fff" : "none";
    // let border = state ? "1px solid #222" : "none";
    let zIndex = state ? "2" : "";

    this.label.style.boxShadow = boxShadow;
    // this.label.style.border = border;
    this.label.style.zIndex = zIndex;
  };

  deleteLabel = (e) => {
    e.stopPropagation();
    let parent = this.labelInput.parentElement;
    parent.parentElement.removeChild(parent);
    this.label.parentElement.removeChild(this.label);
    // this.labelDuration.parentElement.removeChild(this.labelDuration);
    this.deleteLabels(this.id);
  };

  addTimeStamps = (time, data) => {
    this.timeStamps[time] = data;
  };

  createLabelDuration = () => {};
}
