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
define([
  'dojo/_base/declare', 
  'jimu/BaseWidget',
  "dojo/parser", 
  "dojo/_base/lang",
  "esri/tasks/query",
  "esri/tasks/QueryTask",
  "dijit/layout/TabContainer", 
  "dijit/layout/ContentPane",
  "dojox/grid/EnhancedGrid",
  "dojo/data/ItemFileWriteStore",
  "dojo/domReady!"
  ],

function(declare, 
  BaseWidget,
  parser, 
  lang,
  Query,
  QueryTask,
  TabContainer, 
  ContentPane
  ) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {
    // DemoWidget code goes here

    //please note that this property is be set by the framework when widget is loaded.
    //templateString: template,

    baseClass: 'jimu-widget-relate',

    postCreate: function() {
      this.inherited(arguments);
      console.log('postCreate');
    },

    startup: function() {
      this.inherited(arguments);
      var self= this.map
      this.map.on("click", registerpt)

      function registerpt(evt){
        console.log(evt.mapPoint.x, evt.mapPoint.y)
        var newquerytask= new QueryTask(self.itemInfo.itemData.tables[0].url)
        var params= new Query()
        params.geometry= evt.mapPoint
        params.where="1=1"
        params.outFields=['*']
        params.spatialRelationship= Query.SPATIAL_REL_CONTAINS
        newquerytask.execute(params,select)

        function select(feature) {
          console.log(feature)
        }
      }
      var tc = new TabContainer({
        style: "height: 100%; width: 100%;"
    }, "reldata");

    var cp1 = new ContentPane({
         title: "Table 1",
         content: "We offer amazing food"
    });
    tc.addChild(cp1);

    var cp2 = new ContentPane({
         title: "Table 2",
         content: "We are known for our drinks."
    });
    tc.addChild(cp2);

    tc.startup();      
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
    }
  });
});