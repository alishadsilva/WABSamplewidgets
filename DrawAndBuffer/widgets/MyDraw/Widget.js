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
define(['dojo/_base/declare',"dijit/form/Button","dijit/Tooltip", "dojo/dom", "dojo/_base/lang","esri/toolbars/draw", "esri/symbols/SimpleMarkerSymbol","esri/symbols/SimpleLineSymbol","esri/symbols/SimpleFillSymbol","esri/graphic", "esri/Color","esri/tasks/GeometryService","esri/tasks/BufferParameters","dojo/parser","dijit/registry","esri/tasks/query","esri/tasks/QueryTask","dojo/_base/array","dojo/store/JsonRest","dojox/grid/EnhancedGrid","dojo/store/Memory","dojo/data/ObjectStore","dojo/request","dojox/grid/enhanced/plugins/exporter/CSVWriter","dojo/dom-construct","dijit/_WidgetBase", "dijit/_Templated", "jimu/BaseWidget","dojo/dom-style","jimu/WidgetManager","dojo/domReady!"],
function(declare, Button, Tooltip, dom, lang, Draw, SimpleMarkerSymbol,SimpleLineSymbol,SimpleFillSymbol, Graphic, 
        Color,GeometryService, BufferParameters, parser, registry, Query,QueryTask,array, JsonRest, EnhancedGrid, Memory, ObjectStore, request,CSVWriter, domConstruct,_WidgetBase, _Templated,BaseWidget,domStyle,WidgetManager, ready) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {
    // DemoWidget code goes here

    //please note that this property is be set by the framework when widget is loaded.
    //templateString: template,
    baseClass: 'jimu-widget-mydraw',
    // toggleFlag: true,
    
    postCreate: function() {
      this.inherited(arguments);
      console.log("postCreate");
    },

    startup: function() {
      this.inherited(arguments);
      parser.parse();

      var self= this.map;

      domStyle.set(grid.domNode, 'display', 'none');
      var myButton = new Button({
        label: "Point",
        onClick: lang.hitch(this, function(event){
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
            var markerlineSymbol = new SimpleLineSymbol();
            markerlineSymbol.setColor(new Color("#718fca"));

            var toolbar = new Draw(this.map);
            toolbar.activate(Draw.POLYLINE)
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
            dom.byId("BufferValue").value=""
            domStyle.set(grid.domNode, 'display', 'none')
            registry.byId('export').set('disabled', true)
            // toggler.hide();
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
            params.distances = [parseInt(dom.byId("BufferValue").value)]
            console.log(params.geometries)
            params.unit = esri.tasks.GeometryService.UNIT_KILOMETER;
            gsvc.buffer(params, showBuffer)

            function showBuffer(geometries){
              var markerSymbol= new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                  new Color([150,0,0]), 2),new Color([255,255,0,0.25])
                );
              var symbol=markerSymbol;
              dojo.forEach(geometries, function(geometry) {
              var graphic = new esri.Graphic(geometry,symbol);
              self.graphics.add(graphic);
              registry.byId('buffer').set('disabled', true)
            });
            }
          })
          }, "buffer").startup();
          
          function toggle2(){
            registry.byId('buffer').set('disabled', false)
          }
          dojo.ready(function(){
            dojo.connect(dojo.byId("BufferValue"), "onclick", toggle2);
          });

          var myButton = new Button({
            label: "View",
            onClick: lang.hitch(this, function(event){
            // toggler.show();
            registry.byId('export').set('disabled', false)
            domStyle.set(grid.domNode, 'display', '')
            var queryTask = new QueryTask(this.map._layers.U_S__Cities_6992.url)
            var queryparams= new Query()
            queryparams.geometry= this.map.graphics.graphics[1].geometry
            queryparams.where="1=1"
            queryparams.outFields=['*']
            queryparams.spatialRelationship= Query.SPATIAL_REL_CONTAINS
            queryTask.execute(queryparams,select)

            function select(evt){
              var outFieldsNF = ["OBJECTID", "CITY_NAME", "STATE_NAME", "TYPE", "POP1990"]
              dataNF = array.map(evt.features, function(feature) {
                return {
                // Step: Reference the attribute field values
                "OBJECTID" : feature.attributes[outFieldsNF[0]],
                "CITY_NAME" : feature.attributes[outFieldsNF[1]],
                "STATE_NAME" : feature.attributes[outFieldsNF[2]],
                "TYPE" : feature.attributes[outFieldsNF[3]],
                "POP1990" : feature.attributes[outFieldsNF[4]]
              }
            });

              var objectstore= new Memory({
                data: dataNF
              });

              var store= new ObjectStore({objectStore: objectstore});
              grid.setStore(store);
              grid.resize();
            };
          })
          }, "view").startup();

          // dojo.ready(function(){
          //   dojo.connect(dojo.byId("view"), "onclick", toggle3);
          // });
          
          // function toggle3(){
          //   registry.byId('export').set('disabled', false)
          // }

          var myButton = new Button({
            label: "Export",
            disabled: true,
          onClick: lang.hitch(this, function(event){
              dijit.byId("dojox_grid_EnhancedGrid_0").exportGrid("csv", function(str){
                var csvContent = "data:text/csv;charset=utf-8,";
                csvContent +=str;
                var encodedUri = encodeURI(csvContent);
                var link = document.createElement('a');
                link.download = "export.csv";
                link.href = encodedUri;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            })
          }, "export").startup();

          console.log('startup');
        },

    onOpen: function(){
      console.log('onOpen');
      // new Tooltip({
      //   connectId: ["point"],
      //   label: "Click on the button and then on the map to add a point"
      // });

      // new Tooltip({
      //   connectId: ["line"],
      //   label: "Click on the map to add a line"
      // });

      // new Tooltip({
      //   connectId: ["polygon"],
      //   label: "Click on the map to add a polygon"
      // });

      new Tooltip({
        connectId: ["view"],
        label: "Click to view the cities within the buffer."
      });
      new Tooltip({
        connectId: ["cleard"],
        label: "Click to clear data."
      });
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