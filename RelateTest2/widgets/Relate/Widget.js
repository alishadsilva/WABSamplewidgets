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
        style: "width: 375px; height: 370px;"
    }, "reldata");

      var self= this.map
      var store1,store2, grid1, grid2;

      var layout1 = [[
      {'name': 'OBJECT ID', 'field': 'field1'},
      {'name': 'COUNTY NAME', 'field': 'field2'},
      {'name': 'STATE NAME', 'field': 'field3'},
      {'name': 'AREA', 'field': 'field4'},
      {'name': 'POP1990', 'field': 'field5'}
    ]];

    var layout2 = [[
      {'name': 'OBJECT ID', 'field': 'field6'},
      {'name': 'CITY NAME', 'field': 'field7'},
      {'name': 'STATE NAME', 'field': 'field8'},
      {'name': 'TYPE', 'field': 'field9'},
      {'name': 'POP1990', 'field': 'field10'}
    ]];
      
      var featurelayer= self.getLayer("RelatedTables_4354")

        // var relquery1= new RelationshipQuery()
        // relquery.outFields=['*']
        // relquery.relationshipId=0
        
        featurelayer.on("click", function(evt){
          for (var i = 0; i <= self._layers.RelatedTables_4354.relationships.length; i++) {
            var relquery= new RelationshipQuery()
            relquery.outFields=['*']
            relquery.relationshipId=i
            graphicAttributes=evt.graphic.attributes;
            relquery.definitionExpression= "STATE_NAME=" +"'" + graphicAttributes.STATE_NAME +"'"
            if (i==0) {
            featurelayer.queryRelatedFeatures(relquery, function relatedRecords(data){
              console.log(data)
                var outFieldsNF = ["OBJECTID", "NAME", "STATE_NAME", "AREA", "POP1990"]
                dataNF = array.map(data[graphicAttributes.OBJECTID].features, function(feature) {
                  return {
                  // Step: Reference the attribute field values
                  "field1" : feature.attributes[outFieldsNF[0]],
                  "field2" : feature.attributes[outFieldsNF[1]],
                  "field3" : feature.attributes[outFieldsNF[2]],
                  "field4" : feature.attributes[outFieldsNF[3]],
                  "field5" : feature.attributes[outFieldsNF[4]]
                }
              });
              var objectstore1= new Memory({
                data: dataNF
              });
                
              var store1= new ObjectStore({objectStore: objectstore1});
              grid1.setStore(store1);
              grid1.resize();
              })
            }
            if (i==1) {
              featurelayer.queryRelatedFeatures(relquery, function relatedRecords(data){
                console.log(data)
                var outFieldsNF = ["OBJECTID", "CITY_NAME", "STATE_NAME", "TYPE", "POP1990"]
                dataNF2 = array.map(data[graphicAttributes.OBJECTID].features, function(feature) {
                  return {
                  // Step: Reference the attribute field values
                  "field6" : feature.attributes[outFieldsNF[0]],
                  "field7" : feature.attributes[outFieldsNF[1]],
                  "field8" : feature.attributes[outFieldsNF[2]],
                  "field9" : feature.attributes[outFieldsNF[3]],
                  "field10" : feature.attributes[outFieldsNF[4]]
                }
              });
                var objectstore2= new Memory({
                  data: dataNF2
                })
                var store2= new ObjectStore({objectStore: objectstore2});
                grid2.setStore(store2)
                grid2.resize();
              })
              }
          }
        })

        var grid1= new EnhancedGrid({
              id: "grid1",
              store: store1,
              structure: layout1
            })

        var grid2= new EnhancedGrid({
              id: "grid2",
              store: store2,
              structure: layout2
            })

        var cp1 = new ContentPane({
          title: "Table 1",
          content: grid1,
          style: "width: 375px; height: 370px;"
        });
        tc.addChild(cp1);


    var cp2 = new ContentPane({
         title: "Table 2",
         content: grid2,
         style: "width: 375px; height: 370px;"
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