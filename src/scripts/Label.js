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
    this.checkPoints = {}; // Add/update in this when dragend
    this.timeStamps = {};

    this.color = this.generateRandomColor();
    this.createLabel(this.color);
    this.deleteLabels = deleteLabels;
    // this.dragged = false;
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
      checkPoints: this.checkPoints,
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
      // this.dragged = true;
    });

    this.label.addEventListener("mouseout", () => {
      let w = this.label.clientWidth;
      let h = this.label.clientHeight;
      this.dimension = { w, h };

      // if (this.dragged) {
      let currentTime = Math.round(this.video.currentTime * 100) / 100;
      this.addCheckPoints(currentTime, {
        position: this.position,
        dimension: this.dimension,
      });
      // this.dragged = false;
      // }
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

  addCheckPoints = (time, data) => {
    this.checkPoints[time] = data;
    this.timeStamps = this.addTimeStamps();
  };

  addTimeStamps = () => {
    let fullTimeStamps = {};
    let sortedCheckPoints = Object.entries(this.checkPoints).sort(
      (a, b) => a[0] - b[0]
    );

    sortedCheckPoints.forEach((item, index, array) => {
      let first = array[index];
      let second = array[index + 1];
      if (second) {
        let { rx, ry, rw, rh, t } = this.getRates(first, second);
        let { x, y } = first[1].position;
        let { w, h } = first[1].dimension;
        for (
          let i = Number(first[0]);
          i < Number(second[0]);
          i = (Number(i) + 0.1).toFixed(1)
        ) {
          x = (x - rx).toFixed(2);
          y = (y - ry).toFixed(2);
          w = (w - rw).toFixed(2);
          h = (h - rh).toFixed(2);
          fullTimeStamps[i] = { position: { x, y }, dimension: { w, h } };
        }
      }
    });
    return fullTimeStamps;
  };

  getRates = (first, second) => {
    let t = (Math.abs(Number(first[0]) - Number(second[0])) / 0.1).toFixed(2);
    let rx = ((first[1].position.x - second[1].position.x) / t).toFixed(2);
    let ry = ((first[1].position.y - second[1].position.y) / t).toFixed(2);
    let rw = ((first[1].dimension.w - second[1].dimension.w) / t).toFixed(2);
    let rh = ((first[1].dimension.h - second[1].dimension.h) / t).toFixed(2);

    return { rx, ry, rw, rh, t };
  };

  createLabelDuration = () => {};
}
