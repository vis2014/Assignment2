var width = 800, height = 400;

var color = d3.scale.category20();

var force = d3.layout.force().charge(-120).linkDistance(150).size(
    [ width, height ]);

var svg = d3.select("#chart").append("svg").attr("width", width).attr("height",
    height);
svg.edgeThicknessSelectionId = "edgeThickness";
svg.nodeShapeSelectionId = "nodeShape";
svg.nodeFillColorSelectionId = "nodeFillColor";
svg.nodeHoverTitleSelectionId = "nodeHoverTitle";
svg.nodeSizeSelectionId = "nodeSize";

svg.edgeThicknessDim = "value";
svg.nodeShapeSVG = "rect";
svg.nodeFillColorDim = "";
svg.nodeHoverTitleDims = [];
svg.nodeSize = 5;

svg.dataSet = "mouse_brain";

var current_network_data = null;
var currentNodeShape = "rect";

d3.json("data/" + svg.dataSet + ".json", function(json) {

    current_network_data = json;
    currentNodeShape =  svg.nodeShapeSVG;

    initNetworkSetting(json);
    force.nodes(json.nodes).links(json.edges).start();

    var edge = svg.selectAll("line.edge").data(json.edges).enter().append(
            "line").attr("class", "edge").style("stroke-width", function(d) {
            return d[svg.edgeThicknessDim]*5;
        });

    var node = svg.selectAll(svg.nodeShapeSVG+".node").data(json.nodes).enter().append(
            svg.nodeShapeSVG).attr("class", "node").style("fill",
        function(d) {
            return color(d[svg.nodeFillColorDim]);
        }).call(force.drag);

    node.append("title").text(function(d) {
        var title = "";
        if(svg.nodeHoverTitleDims.length > 0){
            title = d[svg.nodeHoverTitleDims[0]];
        }

        for (var i = 1; i < svg.nodeHoverTitleDims.length; i++ ){
            title+= ","+ d[svg.nodeHoverTitleDims[i]];
        }
        return title;
    });

    force.on("tick", function() {
        edge.attr("x1", function(d) {
            return d.source.x;
        }).attr("y1", function(d) {
                return d.source.y;
            }).attr("x2", function(d) {
                return d.target.x;
            }).attr("y2", function(d) {
                return d.target.y;
            });

          node.attr("width", svg.nodeSize)
              .attr("height", svg.nodeSize)
              .attr("x", function(d) {
                  return d.x;
              }).attr("y", function(d) {
                  return d.y;
              });


    });
});

function initNetworkSetting(json){
    var edgeSchemas = json._schemas.edges;
    var nodeSchemas = json._schemas.nodes;
    var selectList = document.getElementById(svg.edgeThicknessSelectionId);

    for (var key in edgeSchemas){
        var schema = edgeSchemas[key];
        if(schema.name != "source" && schema.name != "target" && (schema.type == "int" || schema.type == "float" || schema.type == "double" ||  schema.type == "long")) {
            var newOption = document.createElement("option");
            newOption.appendChild(document.createTextNode(schema.name));
            newOption.setAttribute("value", schema.name);
            selectList.appendChild(newOption);
        }
    }

    selectList = document.getElementById(svg.nodeFillColorSelectionId);

    for (var key in nodeSchemas){
        var schema = nodeSchemas[key];
        if(schema.type == "int" || schema.type == "float" || schema.type == "double" ||  schema.type == "long"||  schema.type == "string") {
            var newOption = document.createElement("option");
            newOption.appendChild(document.createTextNode(schema.name));
            newOption.setAttribute("value", schema.name);
            selectList.appendChild(newOption);
        }
    }

    selectList = document.getElementById(svg.nodeHoverTitleSelectionId);

    for (var key in nodeSchemas){
        var schema = nodeSchemas[key];
        if(schema.type == "int" || schema.type == "float" || schema.type == "double" ||  schema.type == "long"||  schema.type == "string") {
            var newOption = document.createElement("option");
            newOption.appendChild(document.createTextNode(schema.name));
            newOption.setAttribute("value", schema.name);
            selectList.appendChild(newOption);
        }
    }

    refreshNetworkSettings();
}

function refreshNetworkSettings(){

    var selectList = document.getElementById(svg.edgeThicknessSelectionId);
    var selectedValue = selectList.options[selectList.selectedIndex].getAttribute("value");

    svg.edgeThicknessDim =  selectedValue;

    selectList = document.getElementById(svg.nodeSizeSelectionId);
    selectedValue = selectList.options[selectList.selectedIndex].getAttribute("value");

    svg.nodeSize =  selectedValue;

    selectList = document.getElementById(svg.nodeFillColorSelectionId);
    selectedValue = selectList.options[selectList.selectedIndex].getAttribute("value");

    svg.nodeFillColorDim =  selectedValue;

    selectList = document.getElementById(svg.nodeHoverTitleSelectionId);
    selectedValue = selectList.options[selectList.selectedIndex].getAttribute("value");

    svg.nodeHoverTitleDims = [];
    svg.nodeHoverTitleDims.push(selectedValue);
}

function reloadNetwork(){
    //document.getElementById("chart").innerHTML = "";
    var json = current_network_data;
    var edge = svg.selectAll("line.edge").style("stroke-width", function(d) {
        return d[svg.edgeThicknessDim]*5;
    });

    var node = svg.selectAll(".node");


        node.style("fill",
            function(d) {
                return color(d[svg.nodeFillColorDim]);
            });
        node.selectAll("title").text(function(d) {
            var title = "";
            if(svg.nodeHoverTitleDims.length > 0){
                title = d[svg.nodeHoverTitleDims[0]];
            }

            for (var i = 1; i < svg.nodeHoverTitleDims.length; i++ ){
                title+= ","+ d[svg.nodeHoverTitleDims[i]];
            }
            return title;
        });



}
