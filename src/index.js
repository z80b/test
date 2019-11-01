import DomElement from '@js/dom-element.js';
import pageTpl from '@tpl/page.html';

require('@css/index.styl');

class Page extends DomElement {
  constructor(el) {
    super(el);
    this.data = {
      title: 'Page title'
    };
    this.render();
  }

  render() {
    this.$el.innerHTML = pageTpl(this.data);
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
  const page = new Page('.page');
});

