/**
 * @module ol/source/Omap
 */

import TileImage from '../source/TileImage.js';
import TileState from '../TileState.js';
import {TileCoord} from '../tilecoord.js';
import {createXYZ, extentFromProjection} from '../tilegrid.js';

/**
 * @typedef {Object} Options
 * @property {TileUrlCache} [tileUrlCache] Cache to fetch tile url from Anga
 * @property {import("./Source.js").AttributionLike} [attributions] Attributions.
 * @property {boolean} [attributionsCollapsible=true] Attributions are collapsible.
 * @property {number} [cacheSize=2048] Cache size.
 * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
 * you must provide a `crossOrigin` value if you are using the WebGL renderer or
 * if you want to access pixel data with the Canvas renderer.  See
 * https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more
 * detail.
 * @property {boolean} [opaque=true] Whether the layer is opaque.
 * @property {import("../proj.js").ProjectionLike} [projection='EPSG:3857'] Projection.
 * @property {number} [reprojectionErrorThreshold=0.5] Maximum allowed reprojection error (in pixels).
 * Higher values can increase reprojection performance, but decrease precision.
 * @property {number} [maxZoom=18] Optional max zoom level.
 * @property {number} [minZoom=0] Optional min zoom level.
 * @property {number} [tilePixelRatio=1] The pixel ratio used by the tile service.
 * For example, if the tile service advertizes 256px by 256px tiles but actually
 * sends 512px by 512px images (for retina/hidpi devices) then `tilePixelRatio`
 * should be set to `2`.
 * @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
 * @property {number} [transition] Duration of the opacity transition for rendering.
 * To disable the opacity transition, pass `transition: 0`.
 */


/**
 * @classdesc
 * Layer source for tile data with URLs in a set XYZ format that are
 * defined in a URL template. By default, this follows the widely-used
 * Google grid where `x` 0 and `y` 0 are in the top left. Grids like
 * TMS where `x` 0 and `y` 0 are in the bottom left can be used by
 * using the `{-y}` placeholder in the URL template, so long as the
 * source does not have a custom tile grid. In this case,
 * {@link module:ol/source/TileImage} can be used with a `tileUrlFunction`
 * such as:
 *
 *  tileUrlFunction: function(coordinate) {
 *    return 'http://mapserver.com/' + coordinate[0] + '/' +
 *        coordinate[1] + '/' + coordinate[2] + '.png';
 *    }
 *
 * @api
 */
class Omap extends TileImage {
  /**
   * @param {Options=} opt_options Omap options.
   */
  constructor(opt_options) {
    const options = opt_options || {};
    const projection =
        options.projection !== undefined ? options.projection : 'EPSG:3857';

    const tileGrid =
        options.tileGrid !== undefined ? options.tileGrid : createXYZ({
          extent: extentFromProjection(projection),
          maxZoom: 23,
          minZoom: 0,
          tileSize: options.tileSize
        });

    super({
      attributions: options.attributions,
      cacheSize: options.cacheSize,
      crossOrigin: options.crossOrigin,
      opaque: options.opaque,
      projection: projection,
      reprojectionErrorThreshold: options.reprojectionErrorThreshold,
      tileGrid: tileGrid,
      tileLoadFunction: omapTileLoadFunction.bind(this),
      tilePixelRatio: options.tilePixelRatio,
      tileUrlFunction: omapTileUrlFunction,
      wrapX: options.wrapX !== undefined ? options.wrapX : true,
      transition: options.transition,
      attributionsCollapsible: options.attributionsCollapsible
    });

    if (!options.tileUrlCache) {
      throw 'must provide a TileUrlCache';
    }
    this.tileUrlCache = options.tileUrlCache;
    this.tileLoadErrorCount = 0;
  }
}

/**
 * Gets the omap tile key
 * @param {TileCoord} tileCoord
 * @return {string}
 */
function omapTileUrlFunction(tileCoord) {
  const z = tileCoord[0];
  const x = tileCoord[1];
  const y = -tileCoord[2] - 1;
  const key = `/${z}/x${x}/y${y}`;
  return key;
}

/**
 * @param {ImageTile} imageTile Image tile.
 * @param {string} key Source key, generated from the omapTileUrlFunction
 */
function omapTileLoadFunction(imageTile, key) {
  var callback = function(url) {
    if (!url) {
      imageTile.setState(TileState.ERROR);
      return;
    }
    /** @type {HTMLImageElement|HTMLVideoElement} */ (imageTile.getImage()).src = url;
  };
  this.tileUrlCache.addGetTileUrlTaskByKey(key, callback);
}

export default Omap;
