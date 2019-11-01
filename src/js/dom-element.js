class DomElement {
  constructor(el) {
    if (typeof(el) == 'object') {
      this.$el = el;
    } else this.$el = document.querySelector(el);
  }

  getElement(selector) {
    return this.$el.querySelector(selector);
  }

  getElements(selector) {
    return this.$el.querySelectorAll(selector);
  }

  setClass(className) {
    if (this.$el.className.search(className) < 0) {
      this.$el.className += ` ${className}`;
    }
  }

  removeClass(className) {
    if (this.$el.className.search(className) >= 0) {
      this.$el.className = this.$el.className.replace(` ${className}`, '');
    }  
  }
}

export default DomElement;