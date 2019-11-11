import PhotoSphereViewer from 'photo-sphere-viewer';
import 'photo-sphere-viewer/src/scss/photo-sphere-viewer.scss';
import '@css/index.styl';

class PanoramaBanner {
  constructor(el, options = {}) {
    this.$el = typeof(el) == 'string' ? document.querySelector(el) : el;
    options.container = this.createBody(this.$el);
    options.panorama = this.$el.getAttribute('data-image');
    options.markers = [...options.markers, ...this.getMarkers()];
    options.hoveringMarker = this.onOverMarker.bind(this);
    // options.markers = [
    //   {
    //     // html marker with custom style
    //     id: 'text',
    //     longitude: 0,
    //     latitude: 0,
    //     html: '<div class="panorama-banner__marker">1</div>',
    //     anchor: 'bottom right',
    //   },
    // ];
    console.log('constructor:', options);
    this.photoSphereViewer = new PhotoSphereViewer(options);
    this.photoSphereViewer.on('over-marker', (event) => {
      console.log(event);
      event.$el.className += ' hovered';
    });
    this.photoSphereViewer.on('leave-marker', (event) => {
      console.log(event);
      event.$el.className = event.$el.className.replace(/\s?hovered/, '');
    });
  }

  createBody(parent) {
    const el = document.createElement('div');
    el.className = 'panorama-banner__body';
    parent.appendChild(el);
    return el;
  }

  getMarkers() {
    console.log(this.$el.querySelectorAll('.panorama-banner__marker'));
    return Array.prototype.slice.call(this.$el.querySelectorAll('.panorama-banner__marker-html')).map((marker, index) => {
      console.log('getMarkers:', marker, index);
      return {
        id: `marker-${index}`,
        latitude: parseFloat(marker.dataset.latitude),
        longitude: parseFloat(marker.dataset.longitude),
        x: parseFloat(marker.dataset.x),
        y: parseFloat(marker.dataset.y),
        html: `<div class="panorama-banner__marker">${index + 1}</div>`,
        anchor: 'bottom right',
        hoveringMarker: this.onOverMarker.bind(this),
        selectMarker: (event) => {console.log(event)},
      };
    });
  }

  onOverMarker(event) {
    console.log('onOverMarker:', event);
  }
}


document.addEventListener('DOMContentLoaded', (event) => {
  window.panoramaViewer = new PanoramaBanner('.panorama-banner', {
    navbar: false,
    time_anim: false,
    markers: [
      {id: 'dewd', latitude: 0, longitude: 0, html: '<div class="panorama-banner__marker">@</b>'}
    ]
  });
});