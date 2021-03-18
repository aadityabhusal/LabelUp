import { Label } from "./Label.js";

const addLabel = document.getElementById("add-label");

addLabel.addEventListener("click", (e) => {
  new Label().create();
});
