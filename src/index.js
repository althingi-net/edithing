import Quill from "quill";
import "./quill.snow.css";
import "./style.css";
import AlthingiNetLogo from "./althingi.net.png";

var quill = new Quill('#editor', {
  debug: 'warning',
  theme: 'snow',
});

const logo = new Image();
logo.src = AlthingiNetLogo;
logo.height = 100;
logo.weight = 100;
document.body.append(logo);
