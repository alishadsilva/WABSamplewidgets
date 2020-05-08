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
  "esri/layers/FeatureLayer",
  "esri/tasks/RelationshipQuery",
  "dojo/_base/connect",
  "esri/tasks/query",
  "dojo/store/Memory",
  "dojo/_base/array",
  "dojo/data/ObjectStore",  
  "dijit/layout/TabContainer", 
  "dijit/layout/ContentPane",
  "dojox/grid/EnhancedGrid",
  "dojo/data/ItemFileWriteStore",
  "dojo/domReady!"
  ],

function(declare, 
  BaseWidget,
  parser, 
  FeatureLayer,
  RelationshipQuery,
  connect,
  Query,
  Memory,
  array,
  ObjectStore,
  TabContainer, 
  ContentPane,
  EnhancedGrid,
  ItemFileWriteStore
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
      var tc = new TabContainer({
        style: "height: 100%; width: 100%;"
    }, "reldata");

      var self= this.map
    
      this.map.on("click", registerpt)

      function registerpt(evt){
        var featurelayer= self.getLayer("RelatedTables_4354")

        var relquery= new RelationshipQuery()
        relquery.outFields=['*']
        relquery.relationshipId=1
        
        featurelayer.on("click", function(evt){
          graphicAttributes=evt.graphic.attributes;
          relquery.definitionExpression= "STATE_NAME=" +"'" + graphicAttributes.STATE_NAME +"'"
          featurelayer.queryRelatedFeatures(relquery, function relatedRecords(data){
            console.log(data)
            var outFieldsNF = ["OBJECTID", "CITY_NAME", "STATE_NAME", "TYPE", "POP1990"]
              dataNF = array.map(data[4].features, function(feature) {
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
              // reldata.setStore(store);
              // reldata.resize();

              var grid= new EnhancedGrid({
                id: "grid",
                store: store
              })

              var cp1 = new ContentPane({
                   title: "Table 1",
                   content: grid
              });
              tc.addChild(cp1);
          })
      })
    }


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