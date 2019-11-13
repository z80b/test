// import LamodaPanoramaViewer from '@js/lamoda-panorama-viewer';
import PhotoSphereViewer from 'photo-sphere-viewer';
//import iOsVersion from 'ios-version';
// import 'three/examples/js/controls/DeviceOrientationControls.js';
import 'photo-sphere-viewer/src/scss/photo-sphere-viewer.scss';
import '@css/index.styl';

class PanoramaBanner {
  constructor(el, options = {}) {
    this.$el = typeof(el) == 'string' ? document.querySelector(el) : el;
    this.accessButton = this.$el.querySelector('.panorama-banner__access-button');
    this.accessButton.addEventListener('click', this.onClickRequestPermissions.bind(this), false);
    options.container = this.createBody(this.$el);
    options.panorama = this.$el.getAttribute('data-image');
    options.markers = [...options.markers || [], ...this.getMarkers()];
    options.hoveringMarker = this.onOverMarker.bind(this);
    options.gyroscoop = true;

    this.photoSphereViewer = new PhotoSphereViewer(options);

    this.photoSphereViewer.on('ready', this.onPanoramaReady.bind(this));
    this.photoSphereViewer.on('over-marker', (event) => {
      event.$el.className += ' hovered';
    });
    this.photoSphereViewer.on('leave-marker', (event) => {
      event.$el.className = event.$el.className.replace(/\s?hovered/, '');
    });
  }

  async onClickRequestPermissions() {
    let orientationRespone = '';
    let motionRespone = '';

    if (DeviceMotionEvent && DeviceMotionEvent.requestPermission) {
      motionRespone = await DeviceMotionEvent.requestPermission();
    } motionRespone = 'granted'

    if (DeviceOrientationEvent && DeviceOrientationEvent.requestPermission) {
      orientationRespone = await DeviceOrientationEvent.requestPermission();
    }

    if (motionRespone == 'granted' && orientationRespone == 'granted') {
      this.accessButton.innerText = 'Права предоставлены';
      this.startGyroscopeControl();
    } else this.accessButton.innerText = 'Невозможно включить сенсор положения';

    setTimeout(() => {
      this.accessButton.style.display = 'none';
    }, 2000);
  }

  async onPanoramaReady(event) {
    const scope = this;
    let accelerometerPermissions = { state: 'denied' };
    let gyroscopePermissions = { state: 'denied' };

    if (navigator.permissions && navigator.permissions.query) {
      accelerometerPermissions = await navigator.permissions.query({ name: 'accelerometer' });
      gyroscopePermissions = await navigator.permissions.query({ name: 'gyroscope' });

      if (accelerometerPermissions.state === 'granted' && gyroscopePermissions.state === 'granted') {
        this.startGyroscopeControl();
      } else if (accelerometerPermissions.state !== 'denied' && gyroscopePermissions.state !== 'denied') {
        this.accessButton.style.display = 'block';
      } else {
        console.log('Невозможно включить сенсор положения програмно');
      }
    }
  }

  iOSversion() {
    let d, v;
    if (/iP(hone|od|ad)/.test(navigator.platform)) {
      v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
      d = {
        status: true,
        version: parseInt(v[1], 10) , 
        info: parseInt(v[1], 10)+'.'+parseInt(v[2], 10)+'.'+parseInt(v[3] || 0, 10)
      };
    }else{
      d = {status:false, version: false, info:''}
    }
    return d;
  }

  startGyroscopeControl() {
    console.log('startGyroscopeControl');
    this.photoSphereViewer.startGyroscopeControl();
    this.photoSphereViewer.unlockOrientation();
  }

  createBody(parent) {
    const el = document.createElement('div');
    el.className = 'panorama-banner__body';
    parent.appendChild(el);
    return el;
  }

  getMarkers() {
    return Array.prototype.slice.call(this.$el.querySelectorAll('.panorama-banner__marker-html')).map((marker, index) => {
      console.log('getMarkers:', marker, index);
      return {
        id: `marker-${index}`,
        latitude: parseFloat(marker.dataset.latitude),
        longitude: parseFloat(marker.dataset.longitude),
        x: parseFloat(marker.dataset.x),
        y: parseFloat(marker.dataset.y),
        html: `<a class="panorama-banner__marker" href="${marker.dataset.href}"></a>`,
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
    latitude_range: [0, 0],
  });
});