var width = 800, height = 600  ;

var color = d3.scale.category20();

var force = d3.layout.force().charge(-120).linkDistance(30).size(
		[ width, height ]);

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

svg.influenceName="";

svg.dataSet = "socialnet_count";

var current_network_data = null;
var currentNodeShape = "circle";

var specialNodes;
var MAX;
var nodesVisited;
d3.json("data/" + svg.dataSet + ".json", function(json) {

    current_network_data = json;
    currentNodeShape =  svg.nodeShapeSVG;
    
    var preNodes = json.nodes;
    var preEdges = json.edges;
    specialNodes = new Array();
    for(var i=0;i<preNodes.length;i++){
	specialNodes[i] = {};
	specialNodes[i].weight=0;
	specialNodes[i].neighbours=new Array();
    }    
    for(var i=0;i<preEdges.length;i++){
	specialNodes[preEdges[i].source].weight++;
	specialNodes[preEdges[i].target].weight++;
	specialNodes[preEdges[i].source].neighbours.push(preEdges[i].target);
	specialNodes[preEdges[i].target].neighbours.push(preEdges[i].source);
    }
    MAX = specialNodes[0].weight;
    for(var i=1;i<specialNodes.length;i++){
	if(MAX<specialNodes[i].weight){
	    MAX = specialNodes[i].weight;
	}
    }



    initNetworkSetting(json);
	force.nodes(json.nodes).links(json.edges).start();
	
	var edge = svg.selectAll("line.edge").data(json.edges).enter().append(
			"line").attr("class", "edge").style("stroke-width", function(d) {
		return Math.sqrt(d[svg.edgeThicknessDim]?d[svg.edgeThicknessDim]:1);
	});

	var node = svg.selectAll(svg.nodeShapeSVG+".node").data(json.nodes).enter().append(
            svg.nodeShapeSVG).attr("class", "node").call(force.drag);
	if(svg.nodeFillColorDim!="weight"){
	    node.style("fill",function(d){
				return color(d[svg.nodeFillColorDim]);
			}).style("opacity",1);
	}else{
	    node.style("fill",'black').style("opacity",function(d,i){
                     return Math.sqrt(specialNodes[i].weight/MAX);
                 });
	}
	
	node.append("title").text(function(d) {
        var title = "";
        if(svg.nodeHoverTitleDims.length > 0){
            title = d[svg.nodeHoverTitleDims[0]];
        }

        for (var i = 1; i < svg.nodeHoverTitleDims.length; i++ ){
            title+=","+  d[svg.nodeHoverTitleDims[i]];
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

		node.attr("r", svg.nodeSize)
            .attr("cx", function(d) {
			return d.x;
		}).attr("cy", function(d) {
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
	    if(schema.name=="name")
		newOption.setAttribute("selected","selected");
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

    svg.nodeHoverTitleDims = [];
    svg.nodeHoverTitleDims.push(selectedValue);
}

function reloadNetwork(){

    var json = current_network_data;
    var edge = svg.selectAll("line.edge").style("stroke-width", function(d) {
            return Math.sqrt(d[svg.edgeThicknessDim]?d[svg.edgeThicknessDim]:1);
        });

    var node = svg.selectAll(".node");
    if(currentNodeShape != svg.nodeShapeSVG){

        currentNodeShape =  svg.nodeShapeSVG;

    }
    else{
       
	if(svg.nodeFillColorDim!="weight"){ 
            node.style("fill",
                function(d) {
                    return color(d[svg.nodeFillColorDim]);
                }).style("opacity",1);
	}else{
	    node.style("fill",'black').style("opacity",
		function(d,i){
		    return Math.sqrt(specialNodes[i].weight/MAX);
		});
	}
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
        if(svg.nodeShapeSVG == "circle"){
            node.attr("r", svg.nodeSize);
        }
        else if(svg.nodeShapeSVG == "rect"){

            node.attr("width", svg.nodeSize).attr("height", svg.nodeSize);
        }
    }

}

function findInfluence(){
    nodesVisited = new Array();
    for(var k=0;k<specialNodes.length;k++){
	nodesVisited[k]=false;
    }
    var specifiedName = document.getElementById("targetName").value;
    var node = svg.selectAll(".node");
    node.style("fill",'black').style("opacity",0.1);
    var nodes = current_network_data.nodes;
    var i=0;
    for(;i<nodes.length;i++){
	if(specifiedName ==nodes[i].name)
            break;
    }
    if(i==nodes.length){
	alert("no such name in the current network\n\nplease check out the names in json file if you want to have a test.");
	return;
    }else{
        colorBFS(i,node);
    } 
	    
}
    

function colorBFS(index,node){
    var layerNum = 1;
    node[0][index].style=1;
    node[0][index].style.fill='green';
    nodesVisited[index]=true;
    var queue = new Array();
    var preQueue = new Array();
    for(var m=0;m<specialNodes[index].weight;m++){
	queue.push(specialNodes[index].neighbours[m]);
    }
    while(queue.length!=0){
	
   	 while(queue.length!=0){
		var current = queue.shift();
		node[0][current].style=1;
	        node[0][current].style.fill='black';
		node[0][current].style.opacity = 1.0/layerNum;
	        nodesVisited[current]=true;
		preQueue.push(current);
   	 }
	layerNum++;	
        while(preQueue.length!=0){
		var current = preQueue.shift();
      		for(var m =0;m<specialNodes[current].weight;m++){
		    if(nodesVisited[specialNodes[current].neighbours[m]]==false){
			queue.push(specialNodes[current].neighbours[m]);
	   	 }
		}
	}
    }
}
		
