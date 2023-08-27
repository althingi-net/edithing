import Quill from "quill";
import "./quill.snow.css";
import "./style.css";
import AlthingiNetLogo from "./althingi.net.png";
import Constitution from "./1944.33.xml";

let Inline = Quill.import('blots/inline');
class MarkBlot extends Inline {
  static blotName = 'mark';
  static tagName = 'mark';

  constructor(domNode: HTMLElement) {
    super(domNode);

    this.clickHandler = this.clickHandler.bind(this);
    domNode.addEventListener("click", this.clickHandler);
  }

  clickHandler(event: MouseEvent) {
    console.log("Mark blot clicked!");
    console.log("Event:", event);
    console.log("This:", this);
  }
};
Quill.register(MarkBlot);

const Parchment = Quill.import('parchment');
var boxAttributor = new Parchment.Attributor.Class('box', 'line', {
 scope: Parchment.Scope.INLINE,
 whitelist: ['solid', 'double', 'dotted']
});
Quill.register(boxAttributor);

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
