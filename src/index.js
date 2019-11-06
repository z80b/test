import { PanoViewer } from '@egjs/view360';
import '@css/index.styl';

class PanoramaBanner extends PanoViewer {
  constructor(el, options) {
    // this.container = el.querySelector('.panoviewer__body');
    const image = el.getAttribute('data-image');
    const container = el.querySelector('.panoviewer__body');
    super(container, {
      ...options,
      image: image,
      cubemapConfig: {
        tileConfig: { flipHorizontal: true, rotation: 0 },
        order: "RLUDBF",
        // order: "FBUDRL",
      },
      pitchRange: [-20, 20]
    });
    this.container = container;
    this.hotspots = Array.prototype.slice.call(options.hotspots);
    this.on('ready', this.onReady.bind(this));
    this.on('viewChange', this.setHotspotOffsets.bind(this));
    window.addEventListener('resize', this.onResize.bind(this));
    console.log('PanoramaBanner:', this);
  }

  onReady() {
    this.setHotspotOffsets();
    this.lookAt({ fov: 80 });
  }

  onResize() {
    this.updateViewportDimensions();
    this.setHotspotOffsets();
  }

  getRadian(deg) { return deg * Math.PI / 100 }

  getHFov(fov) {
    const rect = this.container.getBoundingClientRect();
    return Math.atan(rect.width / rect.height * Math.tan(this.getRadian(fov) / 2)) / Math.PI * 360;
  }

  rotate(point, deg) {
    const rad = this.getRadian(deg);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return [cos * point[0] - sin * point[1], sin * point[0] + cos * point[1]];
  }

  setHotspotOffset(hotspot, viewer) {
    const oyaw = viewer.getYaw();
    const opitch = viewer.getPitch();
    const yaw = parseFloat(hotspot.getAttribute("data-yaw"));
    const pitch = parseFloat(hotspot.getAttribute("data-pitch"));
    let deltaYaw = yaw - oyaw;
    let deltaPitch = pitch - opitch;

    if (deltaYaw < -180) {
        deltaYaw += 360;
    } else if (deltaYaw > 180) {
        deltaYaw -= 360;
    }
    if (Math.abs(deltaYaw) > 90) {
        hotspot.style.transform = "translate(-200px, 0px)";
        return;
    }
    
    const radYaw = this.getRadian(deltaYaw);
    const radPitch = this.getRadian(deltaPitch);

    const fov = viewer.getFov();
    const hfov = this.getHFov(fov);

    const rx = Math.tan(this.getRadian(hfov) / 2);
    const ry = Math.tan(this.getRadian(fov) / 2);


    let point = [
        Math.tan(-radYaw) / rx,
        Math.tan(-radPitch) / ry,
    ];

    // console.log('setHotspotOffset:', deltaYaw, deltaPitch, radYaw, radPitch);

    // Image rotation compensation
    // The original image is about 10 degrees tilted.
    point = point.map(p => {
        return p * Math.cos(15 / 180 * Math.PI);
    });
    // point[0] = this.rotate(point, deltaPitch > 0 ? 10 : -10)[0];
    point[1] = this.rotate(point, deltaYaw > 0 ? -10 : 10)[1];

    // point[0] = 1.05;
    const left = viewer._width / 2 + point[0] * viewer._width / 2;
    const top = viewer._height / 2 + point[1] * viewer._height / 2;

    //hotspot.style.transform = "translate(" + left + "px, " + top + "px) translate(-50%, -50%)";
    hotspot.style.transform = `translate(${left}px, ${top}px) translate(-50%, -50%)`;
  }

  setHotspotOffsets() {
    this.hotspots.forEach(hotspot => this.setHotspotOffset(hotspot, this));
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
  window.panoViewer = new PanoramaBanner(
    document.querySelector('.panoviewer__banner'), {
    useZoom: false,
    showPolePoint: true,
    hotspots: document.querySelectorAll('.hotspot'),
    projectionType: PanoViewer.PROJECTION_TYPE.CUBEMAP
  });
});