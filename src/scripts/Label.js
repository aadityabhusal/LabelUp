export class Label {
  constructor(deleteLabels, data = {}) {
    this.video = document.getElementById("video");
    this.videoOverlay = document.getElementById("video-overlay");
    this.labelList = document.getElementById("label-list");
    this.canvas = document.getElementById("canvas");

    this.label = null;
    this.labelInput = null;
    this.removeLabel = null;
    this.removeLabelBox = null;
    this.labelColorPicker = null;
    this.labelColorInput = null;

    this.labelX = 0;
    this.labelY = 0;
    this.id = data.id || performance.now().toString(36).replace(/\./g, "");
    this.name = data.name || "";
    this.position = { x: 0, y: 0 };
    this.dimension = { w: 100, h: 100 };

    this.checkPoints = data.checkPoints || {};
    this.sortedCheckPoints = data.checkPoints
      ? Object.entries(this.checkPoints).sort((a, b) => a[0] - b[0])
      : [];
    this.timeStamps = data.timeStamps || {};
    this.imageList = {};

    this.color = data.color || this.generateRandomColor();
    this.createLabel(this.color);
    this.deleteLabels = deleteLabels;
  }

  get labelElement() {
    return this.label;
  }

  get removeBox() {
    return this.removeLabelBox;
  }

  set labelElement({ x, y, w, h }) {
    if (this.label) {
      this.label.style.left = x * (window.scale || 1) + "px";
      this.label.style.top = y * (window.scale || 1) + "px";
      this.label.style.width = w * (window.scale || 1) + "px";
      this.label.style.height = h * (window.scale || 1) + "px";
    }
  }

  get labelInfo() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      checkPoints: this.checkPoints,
      sortedCheckPoints: this.sortedCheckPoints,
      timeStamps: this.timeStamps,
    };
  }

  labelListeners = () => {
    this.label.addEventListener("click", () => {
      this.labelInput.focus();
    });

    this.removeLabelBox.addEventListener("click", (e) => {
      e.stopPropagation();
      this.label.style.visibility = "hidden";
      // Deletes Checkpoint
      delete this.checkPoints[this.video.currentTime.toFixed(1)];
      this.timeStamps = this.addTimeStamps();
    });
  };

  createLabel = (color) => {
    this.label = document.createElement("div");
    this.label.id = this.id;
    this.label.classList.add("label");
    this.label.style.border = `3px solid ${color}`;

    this.removeLabelBox = document.createElement("div");
    this.removeLabelBox.classList.add("labelBoxCloseIcon");
    this.removeLabelBox.innerHTML = "&#x2716;";
    this.removeLabelBox.style.backgroundColor = `${color}`;

    this.label.appendChild(this.removeLabelBox);
    this.videoOverlay.appendChild(this.label);
    this.labelListeners();
    this.createLabelInput();
  };

  generateRandomColor = () => {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  createLabelInput = () => {
    let labelBox = document.createElement("div");
    labelBox.classList.add("label-box");

    this.labelInput = document.createElement("input");
    this.labelInput.classList.add("labelInput");
    this.labelInput.placeholder = "Enter label text";
    this.labelInput.value = this.name;

    this.removeLabel = document.createElement("div");
    this.removeLabel.classList.add("closeIcon");
    this.removeLabel.innerHTML = "&#x2716;";

    this.labelColorPicker = document.createElement("label");
    this.labelColorPicker.classList.add("label-color-picker");
    this.labelColorPicker.style.backgroundColor = this.color;
    this.labelColorInput = document.createElement("input");
    this.labelColorInput.type = "color";
    this.labelColorPicker.appendChild(this.labelColorInput);

    this.labelInputListeners();
    labelBox.appendChild(this.labelInput);
    labelBox.appendChild(this.removeLabel);
    labelBox.appendChild(this.labelColorPicker);
    this.labelList.appendChild(labelBox);
  };

  labelInputListeners = () => {
    this.labelInput.addEventListener("keyup", (e) => {
      this.name = e.target.value;
    });
    this.labelInput.addEventListener("focus", () => {
      this.highlightLabel(true);
      this.labelElement.style.visibility = "visible";
    });
    this.labelInput.addEventListener("blur", () => this.highlightLabel(false));
    this.removeLabel.addEventListener("click", this.deleteLabel);
    this.labelColorInput.addEventListener("input", (e) => {
      this.color = this.labelColorInput.value;
      this.labelColorPicker.style.backgroundColor = this.color;
      this.label.style.borderColor = this.color;
    });
  };

  highlightLabel = (state) => {
    let boxShadow = state ? "0px 0px 10px 5px #fff" : "none";
    let zIndex = state ? "2" : "";
    this.label.style.boxShadow = boxShadow;
    this.label.style.zIndex = zIndex;
  };

  deleteLabel = (e) => {
    e.stopPropagation();
    let parent = this.labelInput.parentElement;
    parent.parentElement.removeChild(parent);
    this.label.parentElement.removeChild(this.label);
    this.deleteLabels(this.id);
  };

  addTimeStamps = () => {
    let fullTimeStamps = {};

    this.sortedCheckPoints = Object.entries(this.checkPoints).sort(
      (a, b) => a[0] - b[0]
    );

    this.sortedCheckPoints.forEach((item, index, array) => {
      let first = array[index];
      let second = array[index + 1];
      if (second) {
        let { rx, ry, rw, rh, t } = this.getRates(first, second);
        let { x, y } = first[1].position;
        let { w, h } = first[1].dimension;
        for (
          let i = Number(first[0]);
          i < Number(second[0]);
          i = Number(i) + 0.1
        ) {
          x = (x - rx).toFixed(2);
          y = (y - ry).toFixed(2);
          w = (w - rw).toFixed(2);
          h = (h - rh).toFixed(2);

          fullTimeStamps[i.toFixed(1)] = {
            position: { x, y },
            dimension: { w, h },
          };
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

  cropImages = async () => {
    for (const t in this.timeStamps) {
      await new Promise((resolve) => {
        let { x, y } = this.timeStamps[t].position;
        let { w, h } = this.timeStamps[t].dimension;
        setTimeout(() => {
          this.video.currentTime = Number(t);
          this.canvas.width = w;
          this.canvas.height = h;
          this.canvas
            .getContext("2d")
            .drawImage(this.video, x, y, w, h, 0, 0, w, h);
          this.imageList[t] = this.canvas.toDataURL("image/png");
          resolve();
        }, 80);
      });
    }
    return this.imageList;
  };
}
