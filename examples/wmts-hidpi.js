import Map from '../src/ol/Map.js';
import View from '../src/ol/View.js';
import WMTSCapabilities from '../src/ol/format/WMTSCapabilities.js';
import {DEVICE_PIXEL_RATIO} from '../src/ol/has.js';
import TileLayer from '../src/ol/layer/Tile.js';
import WMTS, {optionsFromCapabilities} from '../src/ol/source/WMTS.js';


const capabilitiesUrl = 'https://www.basemap.at/wmts/1.0.0/WMTSCapabilities.xml';

// HiDPI support:
// * Use 'bmaphidpi' layer (pixel ratio 2) for device pixel ratio > 1
// * Use 'geolandbasemap' layer (pixel ratio 1) for device pixel ratio == 1
const hiDPI = DEVICE_PIXEL_RATIO > 1;
const layer = hiDPI ? 'bmaphidpi' : 'geolandbasemap';
const tilePixelRatio = hiDPI ? 2 : 1;

const map = new Map({
  target: 'map',
  view: new View({
    center: [1823849, 6143760],
    zoom: 11
  })
});

fetch(capabilitiesUrl).then(function(response) {
  return response.text();
}).then(function(text) {
  const result = new WMTSCapabilities().read(text);
  const options = optionsFromCapabilities(result, {
    layer: layer,
    matrixSet: 'google3857',
    style: 'normal'
  });
  options.tilePixelRatio = tilePixelRatio;
  map.addLayer(new TileLayer({
    source: new WMTS(/** @type {!module:ol/source/WMTS~Options} */ (options))
  }));
});
