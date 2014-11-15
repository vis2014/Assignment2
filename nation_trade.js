//Width and height
var width =1000, height = 600;

var color = d3.scale.category20();
//Initialize a default layout
var force = d3.layout.force()
    .charge(-120)
    .linkDistance(180)
    .size([ width, height ]);

//Create SVG element
var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height",height);
svg.edgeThicknessSelectionId = "edgeThickness";
svg.nodeShapeSelectionId = "cycle";
svg.nodeFillColorSelectionId = "nodeFillColor";
svg.nodeHoverTitleSelectionId = "nodeHoverTitle";
svg.nodeSizeSelectionId = "nodeSize";

svg.edgeThicknessDim = "value";
svg.nodeShapeSVG = "cycle";
svg.nodeFillColorDim = "";
svg.nodeHoverTitleDims = [];
svg.nodeSize = 5;

svg.dataSet = "nation_trade";

var current_network_data = null;
var currentNodeShape = "cycle";
var drag = force.drag()
    .on("dragstart",dragstart)
    .on("drag",drags);

d3.json( svg.dataSet + ".json", function (json) {

    current_network_data = json;
    currentNodeShape = svg.nodeShapeSVG;

    initNetworkSetting(json);
    force
        .nodes(json.nodes)
        .links(json.edges)
        .start();

    var edges = svg.selectAll("line")
        .data(json.edges)
        .enter()
        .append( "line")
        .attr("class", "links")
        .style("stroke","#dddddd")
        .style("stroke-width", function (d) {
            return Math.sqrt(d[svg.edgeThicknessDim] ? d[svg.edgeThicknessDim] : 1);
        })
        .attr("class",function(d){
            return "edges" + " n" + d.source.index + " n" + d.target.index;
        });

    var nodes = svg.selectAll( "circle")
        .data(json.nodes)
        .enter()
        .append("circle")
        .attr("class","nodes")
        .style("fill",function (d) {
            return color(d[svg.nodeFillColorDim]);
        })
        .attr("id",function(d){
            return "c" + d.index;
        })
        .call(force.drag);

    nodes.append("title").text(function (d) {
        var title = "";
        if (svg.nodeHoverTitleDims.length > 0) {
            title = d[svg.nodeHoverTitleDims[0]];
        }

        for (var i = 1; i < svg.nodeHoverTitleDims.length; i++) {
            title += "," + d[svg.nodeHoverTitleDims[i]];
        }
        return title;
    });

    nodes.attr("r", svg.nodeSize);

    force.on("tick", function () {
       edges.attr("class", function(d) { return "links" + " n" + d.source.index + " n" + d.target.index})
            .attr("x1",function (d) { return d.source.x; })
            .attr("y1",function (d) { return d.source.y; })
            .attr("x2",function (d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; })

        var mouseover = function () {
            d3.select(this)
                .transition()
                .duration(750)
                .style("fill", "#000")
        };
        var mouseout= function() {
            d3.select(this)
               .transition()
               .duration(750)
               .style("fill",function (d) {
                    return color(d[svg.nodeFillColorDim])
                })
        };

        nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")";})
             .on("mouseover", mouseover)
             .on("mouseout", mouseout)
    });
});

 function dragstart(d) {
    //Restore the other
    svg.selectAll(".links")
        .style("stroke", "#dddddd")

    svg.selectAll("circle")
        .attr("r", svg.nodeSize);

    //Render current node
    d3 .select(this)
        .attr("r", 2 *svg.nodeSize);

    for (var i = 0; i < current_network_data.edges.length; ++i) {
        if ( d.index == current_network_data .edges[i].target.index ) {
            //Emphasize links
            svg.selectAll(".n" + d.index)
                .style("stroke", "#666666")

            d3 .select( "#c" + current_network_data.edges[i].source.index)
                    .attr("r", 2 * svg.nodeSize);
        }
    };
}

//Automatically set "fixed" attribute when drag
function drags(d) {
    d3.select(this)
        .classed("fixed", d.fixed = true)
        .attr("r", 2 *svg.nodeSize);
}


function initNetworkSetting(json) {
    var edgeSchemas = json._schemas.edges;
    var nodeSchemas = json._schemas.nodes;
    var selectList = document.getElementById(svg.edgeThicknessSelectionId);

    for (var key in edgeSchemas) {
        var schema = edgeSchemas[key];
        if (schema.name != "source" && schema.name != "target" && (schema.type == "int" || schema.type == "float" || schema.type == "double" || schema.type == "long")) {
            var newOption = document.createElement("option");
            newOption.appendChild(document.createTextNode(schema.name));
            newOption.setAttribute("value", schema.name);
            selectList.appendChild(newOption);
        }
    }

    selectList = document.getElementById(svg.nodeFillColorSelectionId);

    for (var key in nodeSchemas) {
        var schema = nodeSchemas[key];
        if (schema.type == "int" || schema.type == "float" || schema.type == "double" || schema.type == "long" || schema.type == "string") {
            var newOption = document.createElement("option");
            newOption.appendChild(document.createTextNode(schema.name));
            newOption.setAttribute("value", schema.name);
            selectList.appendChild(newOption);
        }
    }

    selectList = document.getElementById(svg.nodeHoverTitleSelectionId);

    for (var key in nodeSchemas) {
        var schema = nodeSchemas[key];
        if (schema.type == "int" || schema.type == "float" || schema.type == "double" || schema.type == "long" || schema.type == "string") {
            var newOption = document.createElement("option");
            newOption.appendChild(document.createTextNode(schema.name));
            newOption.setAttribute("value", schema.name);
            selectList.appendChild(newOption);
        }
    }

    refreshNetworkSettings();
}

function refreshNetworkSettings() {
    var selectList = document.getElementById(svg.edgeThicknessSelectionId);
    var selectedValue = selectList.options[selectList.selectedIndex].getAttribute("value");

    svg.edgeThicknessDim = selectedValue;

    svg.nodeShapeSVG = "cycle";

    selectList = document.getElementById(svg.nodeSizeSelectionId);
    selectedValue = selectList.options[selectList.selectedIndex].getAttribute("value");

    svg.nodeSize = selectedValue;

    selectList = document.getElementById(svg.nodeFillColorSelectionId);
    selectedValue = selectList.options[selectList.selectedIndex].getAttribute("value");

    svg.nodeFillColorDim = selectedValue;

    selectList = document.getElementById(svg.nodeHoverTitleSelectionId);
    selectedValue = selectList.options[selectList.selectedIndex].getAttribute("value");

    svg.nodeHoverTitleDims = [];
    svg.nodeHoverTitleDims.push(selectedValue);
}

function reloadNetwork() {

    var json = current_network_data;
    var edges = svg.selectAll("line")
        .style("stroke", "#dddddd")
        .style("stroke-width", function (d) {
        return Math.sqrt(d[svg.edgeThicknessDim] ? d[svg.edgeThicknessDim] : 1);
    });
    console.log(edges);
    var nodes = svg
        .selectAll("circle")
        .call(force.drag);;

    nodes.style("fill", function (d) {
            return color(d[svg.nodeFillColorDim]);
        });

    nodes.selectAll("title").text(function (d) {
        var title = "";
        if (svg.nodeHoverTitleDims.length > 0) {
            title = d[svg.nodeHoverTitleDims[0]];
        }

        for (var i = 1; i < svg.nodeHoverTitleDims.length; i++) {
            title += "," + d[svg.nodeHoverTitleDims[i]];
        }
        return title;
    });

    nodes.attr("r", svg.nodeSize);
    force.on("tick", function () {
        edges.attr("class", function(d) { return "links" + " n" + d.source.index + " n" + d.target.index})
             .attr("x1",function (d) { return d.source.x; })
             .attr("y1",function (d) { return d.source.y;})
             .attr("x2",function (d) { return d.target.x;})
             .attr("y2", function(d) { return d.target.y;});

        nodes.attr("transform",function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
    });
}

