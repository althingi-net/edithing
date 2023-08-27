import Quill from "quill";
import "./quill.snow.css";
import "./style.css";
import AlthingiNetLogo from "./althingi.net.png";
import Constitution from "./1944.33.xml";

let Inline = Quill.import('blots/inline');
class MarkBlot extends Inline {
  static blotName = 'mark';
  static tagName = 'mark';
};
Quill.register(MarkBlot);

var quill = new Quill('#editor', {
  debug: 'warning',
  theme: 'snow',
  modules: {
    toolbar: {
      container: "#toolbar"
    }
  }
});

const logo = new Image();
logo.src = AlthingiNetLogo;
logo.height = 100;
logo.width = 100;
document.body.append(logo);

console.log(Constitution);
