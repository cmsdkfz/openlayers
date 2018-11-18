npm run build-legacy
rm -f /Users/mingcui/Documents/gerrit1/deepmap-core/javascript/third_party/openlayers/history-copy/openlayers-3/ol.js
rm -f /Users/mingcui/Documents/gerrit1/deepmap-core/javascript/third_party/openlayers/history-copy/openlayers-3/ol.js.map
cp ./build/legacy/ol.js /Users/mingcui/Documents/gerrit1/deepmap-core/javascript/third_party/openlayers/history-copy/openlayers-3/ol.js
cp ./build/legacy/ol.js.map /Users/mingcui/Documents/gerrit1/deepmap-core/javascript/third_party/openlayers/history-copy/openlayers-3/ol.js.map
echo "all done"
