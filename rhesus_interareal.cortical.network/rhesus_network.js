var width = 1000, height =800;

var color = d3.scale.category10();

var force = d3.layout.force().charge(-500).linkDistance(280)
                    .linkStrength(0.3).size([ width, height ])
                    .gravity([0.5]);
var drag = force.drag().on("dragstart", function(d){d.fixed = true;});

var svg = d3.select("#chart").append("svg").attr("width", width).attr("height",
		height);
svg.edgeThicknessSelectionId = "edgeThickness";
svg.nodeShapeSelectionId = "nodeShape";
svg.nodeFillColorSelectionId = "nodeFillColor";
svg.nodeHoverTitleSelectionId = "nodeHoverTitle";
svg.nodeSizeSelectionId = "nodeSize";
svg.edgeThicknessDim = "value";
svg.nodeShapeSVG = "circle";
svg.nodeFillColorDim = "";
svg.nodeHoverTitleDims = [];
svg.nodeSize = 5;
svg.dataSet = "rhesus";

svg.edgefilter = 30;

var current_network_data = null;
var currentNodeShape = "circle";
var node_text;
var edge_text;
var node_text_on = true;
var related_edge;
var edge,
    node;

d3.json("data/" + svg.dataSet + ".json", function(json) {

    current_network_data = json;
    currentNodeShape =  svg.nodeShapeSVG;
    initNetworkSetting(json);

	edge = svg.selectAll("line.edge")
        .data(json.edges)
        .enter().append("line")
//        .filter(function(d){return d.weight > 40;})
        .attr("class", "edge")
        .style("stroke-width", function(d) {
		        return Math.sqrt(d[svg.edgeThicknessDim]?d[svg.edgeThicknessDim]:1);
     	    });
    node = svg.selectAll(svg.nodeShapeSVG+".node")
        .data(json.nodes)
        .enter().append(svg.nodeShapeSVG)
        .attr("class", "node")
        .attr("r",svg.nodeSize)
        .style("fill","blue")
        .call(drag);


        node.on("click",nodeclick);
        node.on("dblclick", function(d){d.fixed = false;});

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

    node_text = svg.selectAll(".nodetext")
        .data(json.nodes)
        .enter()
        .append("text")
        .attr("dx", svg.nodeSize)
        .attr("dy", svg.nodeSize)
        .attr("font-size", 12)
        .text(function(d){return d.name});

//    edge_text = svg.selectAll(".linetext")
//        .data(json.edges)
//        .enter().append("text")
////        .attr("class","linetext")
//        .attr("font-size", 12)
//        .style("fill-opacity", 0)
//        .text(function(d){
//        return d.weight;
//    });

    force.nodes(json.nodes).links(json.edges).start();

    // Extract the array of nodes from the map by name.
    force.on("tick", tick);// {
});

function tick()
{
    edge.attr("x1", function(d) {return d.source.x;})
        .attr("y1", function(d) { return d.source.y;})
        .attr("x2", function(d) { return d.target.x;})
        .attr("y2", function(d) { return d.target.y;});

    if(currentNodeShape == "rect"){
        node.attr("x", function(d) {return d.x-svg.nodeSize/2;})
            .attr("y", function(d) {return d.y-svg.nodeSize/2;});
    }
    if(currentNodeShape == "circle"){
        node.attr("cx", function(d) {return d.x;})
            .attr("cy", function(d) {return d.y;});
    }

    node_text.attr("x", function(d){return d.x});
    node_text.attr("y", function(d){return d.y});

//    edge_text.attr("x", function(d){return (d.source.x + d.target.x)/2;});
//    edge_text.attr("y", function(d){return (d.source.y + d.target.y)/2;});
}

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

    selectList = document.getElementById(svg.nodeShapeSelectionId);
    selectedValue = selectList.options[selectList.selectedIndex].getAttribute("value");

    svg.nodeShapeSVG =  selectedValue;

    selectList = document.getElementById(svg.nodeSizeSelectionId);
    selectedValue = selectList.options[selectList.selectedIndex].getAttribute("value");

    svg.nodeSize =  selectedValue;

    selectList = document.getElementById(svg.nodeFillColorSelectionId);
    selectedValue = selectList.options[selectList.selectedIndex].getAttribute("value");

    svg.nodeFillColorDim =  selectedValue;

    selectList = document.getElementById(svg.nodeHoverTitleSelectionId);
    selectedValue = selectList.options[selectList.selectedIndex].getAttribute("value");

    selectList = document.getElementById("edgeWeight");
    svg.edgefilter = parseInt(selectList.value);

    var selectList = document.getElementById("edgefilter");
    edgefilter_on = selectList.checked;

    svg.nodeHoverTitleDims = [];
    svg.nodeHoverTitleDims.push(selectedValue);
}

function Label()
{
    var selectList = document.getElementById("label");
    node_text_on = selectList.checked;
    if(!node_text_on){
        node_text.attr("font-size", 0);
    }
    else
    {
        node_text.attr("font-size", 12);
    }
}

function nodeclick(d){
    if(svg.nodeShapeSVG == "circle"){
        d3.selectAll(svg.nodeShapeSVG).style("fill","blue").attr("r", svg.nodeSize);
        d3.select(this).style("fill","red").attr("r",svg.nodeSize * 1.5);
    }
    else if(svg.nodeShapeSVG == "rect"){
        d3.selectAll(svg.nodeShapeSVG).style("fill","blue").attr("width", svg.nodeSize).attr("height", svg.nodeSize);
        d3.select(this).style("fill","red").attr("width",svg.nodeSize * 1.5).attr("height", svg.nodeSize * 1.5);
    }

    svg.selectAll("line").style("stroke-width", 0);
    related_edge = d3.selectAll("line").filter(function(data){
        return (data.source.id == d.id) || (data.target.id == d.id);
    });
    related_edge.style("stroke","#1a0").style("stroke-width","5");
//    edge_text.style("fill-opacity", 0);
//    edge_text.style("fill-opacity", function(text_edge){
//        if(text_edge.source.id == d.id || text_edge.target.id == d.id)return 1.0;
////        if(text_edge.source.id != d.id && text_edge.target.id != d.id) alert("he");
//    });
}

function reloadNetwork(){
    var json = current_network_data;
        currentNodeShape =  svg.nodeShapeSVG;
        node.remove();
        if(svg.nodeShapeSVG == "circle"){
            node = svg.selectAll(svg.nodeShapeSVG+".node")
                .data(json.nodes)
                .enter().append(svg.nodeShapeSVG)
                .attr("class", "node")
                .attr("r",svg.nodeSize)
                .style("fill","blue")
                .call(force.drag);
        }
        else if(svg.nodeShapeSVG == "rect"){
            node = svg.selectAll(svg.nodeShapeSVG+".node")
                .data(json.nodes)
                .enter().append(svg.nodeShapeSVG)
                .attr("class", "node")
                .style("fill","blue")
                .call(force.drag);
            node.attr("width", svg.nodeSize).attr("height", svg.nodeSize);


        }
        force.start();

    node.on("click", nodeclick);
    node.on("dblclick", function(d){d.fixed = false;});

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

    node_text.attr("dx", svg.nodeSize)
        .attr("dy", svg.nodeSize);

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

    if(edgefilter_on){
        edge.classed("fade", function(d){ return d.weight < svg.edgefilter;});
        edge.filter(function(d){
            return d.weight > svg.edgefilter;  //意思是从所有的边中间挑选出来此行不等式为真的边
        }).style("stroke-width", 3)        //此行和下面一行对满足条件的边进行操作
            .style("stroke", "#a43");
    }
    else
    {
        edge.classed("fade", false);
    }
    node.style("fill",
        function(d) {
            return color(d[svg.nodeFillColorDim]);
        });
}

function resetNetwork()
{
    svg.edgeThicknessSelectionId = "edgeThickness";
    svg.nodeShapeSelectionId = "nodeShape";
    svg.nodeFillColorSelectionId = "nodeFillColor";
    svg.nodeHoverTitleSelectionId = "nodeHoverTitle";
    svg.nodeSizeSelectionId = "nodeSize";
    svg.edgeThicknessDim = "value";
    svg.nodeShapeSVG = "circle";
    svg.nodeFillColorDim = "";
    svg.nodeHoverTitleDims = [];
    svg.nodeSize = 5;
    svg.edgefilter = 30;

	node.style("fill","blue");
    edge.style("stroke", "#999")
        .style("stroke-width", function(d) {
        return Math.sqrt(d[svg.edgeThicknessDim]?d[svg.edgeThicknessDim]:1);
    });
    reloadNetwork();
}
