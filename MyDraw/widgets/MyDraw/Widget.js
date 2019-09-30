///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
define(['dojo/_base/declare',"dijit/form/Button", "dojo/dom", "dojo/_base/lang","esri/toolbars/draw", "esri/symbols/SimpleMarkerSymbol","esri/symbols/SimpleLineSymbol","esri/symbols/SimpleFillSymbol","esri/graphic", "esri/Color","esri/tasks/GeometryService","esri/tasks/BufferParameters","dojo/parser","dijit/registry", 'jimu/BaseWidget',"dojo/domReady!"],
function(declare, Button, dom, lang, Draw, SimpleMarkerSymbol,SimpleLineSymbol,SimpleFillSymbol, Graphic, 
        Color,GeometryService, BufferParameters, parser, registry, BaseWidget,ready) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {
    // DemoWidget code goes here

    //please note that this property is be set by the framework when widget is loaded.
    //templateString: template,
    baseClass: 'jimu-widget-mydraw',
    toggleFlag: true,
    postCreate: function() {
      this.inherited(arguments);
      console.log("postCreate");
    },

    startup: function() {
      this.inherited(arguments);
      // this.mapIdNode.innerHTML = 'map id:' + this.map.id;
      parser.parse();
      var self= this.map
      var myButton = new Button({
        label: "Point",
        onClick: lang.hitch(this, function(event){
          registry.byId('buffer').set('disabled', false)
            var markerpointSymbol = new SimpleMarkerSymbol();
            markerpointSymbol.setColor(new Color("#00FFFF"));

            var toolbar = new Draw(this.map);
            toolbar.activate(Draw.POINT)
            toolbar.on("draw-end", addGraphic);

          function addGraphic(pointevt){
            var symbol=markerpointSymbol;
            this.map.graphics.add(new Graphic(pointevt.geometry, symbol))
            toolbar.deactivate()
           }
           
        })
    }, "point").startup();

      var myButton = new Button({
        label: "Line",
        onClick: lang.hitch(this, function(event){
          registry.byId('buffer').set('disabled', false)
            var markerlineSymbol = new SimpleLineSymbol();
            markerlineSymbol.setColor(new Color("#718fca"));

            var toolbar = new Draw(this.map);
            toolbar.activate(Draw.LINE)
            toolbar.on("draw-end", addGraphic);

          function addGraphic(lineevt){
            var symbol=markerlineSymbol;
            this.map.graphics.add(new Graphic(lineevt.geometry, symbol))
            toolbar.deactivate()
           }
        })
    }, "line").startup();

      var myButton = new Button({
        label: "Polygon",
        onClick: lang.hitch(this, function(event){
          registry.byId('buffer').set('disabled', false)
            var markerpolySymbol = new SimpleFillSymbol();
            markerpolySymbol.setColor(new Color("#ff000e"));

            var toolbar = new Draw(this.map);
            toolbar.activate(Draw.POLYGON)
            toolbar.on("draw-end", addGraphic);

          function addGraphic(polyevt){
            var symbol=markerpolySymbol;
            this.map.graphics.add(new Graphic(polyevt.geometry, symbol))
            toolbar.deactivate()
           }

        })
    }, "polygon").startup();

      var myButton = new Button({
        label: "Clear",
        onClick: lang.hitch(this, function(event){
            this.map.graphics.clear()
            registry.byId('buffer').set('disabled', true)

        })
    }, "cleard").startup();

      var myButton = new Button({
        label: "Buffer",
        disabled: true,
        onClick: lang.hitch(this, function(event){
            console.log(this.map.graphics.graphics[0].geometry);
            gsvc= new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
            var params = new BufferParameters()
            params.geometries  = [this.map.graphics.graphics[0].geometry]
            params.distances = [ 1000 ]
            params.unit = esri.tasks.GeometryService.UNIT_KILOMETER;
            gsvc.buffer(params, showBuffer)

            function showBuffer(geometries){
            var markerSymbol = new SimpleFillSymbol();
            markerSymbol.setColor(new Color("#ff000g"))
            var symbol=markerSymbol;
            dojo.forEach(geometries, function(geometry) {
              var graphic = new esri.Graphic(geometry,symbol);
              self.graphics.add(graphic);
              // self.graphics.getDojoShape().moveToBack()
              registry.byId('buffer').set('disabled', true)
            });
            // this.map.graphics.add(new Graphic(geometries.geometry, symbol))
          }
        })
    }, "buffer").startup();

      console.log('startup');
    },

    onOpen: function(){
      console.log('onOpen');
    },

    onClose: function(){
      console.log('onClose');
    },

    onMinimize: function(){
      console.log('onMinimize');
    },

    onMaximize: function(){
      console.log('onMaximize');
    },

    onSignIn: function(credential){
      /* jshint unused:false*/
      console.log('onSignIn');
    },

    onSignOut: function(){
      console.log('onSignOut');
    },

    showVertexCount: function(count){
      this.vertexCount.innerHTML = 'The vertex count is: ' + count;
      // console.log('showVertexCount')
    }
  });
});