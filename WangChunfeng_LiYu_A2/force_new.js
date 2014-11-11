var width = 800, height = 600;

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
svg.nodeSize = 3;

//svg.dataSet = "socialnet_count";
svg.dataSet = "shop";

var current_network_data = null;
var currentNodeShape = "circle";

var all_edge;
var arr_id =[];
var arr_value =[];

var deleted_edge=[{'count':1,'source':1,'target':2},{'count':1,'source':2,'target':3}];
var nodes_weight= [{'id':'nn','num':0}];

var edge;
var node;

var last_id = -1;

var node_info;


d3.json("data/" + svg.dataSet + ".json", function(json) {


    /*force.charge(function(d,i){
        if((d.ego == 1)||(d.ego == 2)){return 0;}
        else{return -50;}
    })
        .linkStrength(function(d,i){
            if(d.ego_line == 1){
                return  0.1*d.target.co_time;
            }
            else if (d.ego_line == 2) return 0.5;
            else{return 0.1;}
        })*/
        force.linkStrength(function(d,i){
            if(d.ego_line == 1){
                return  0.01*d.target.co_time;
            }
            else if (d.ego_line == 2) return 0.05;
            else{return 0.01;}
        })
        .linkDistance(function(d,i){
            if(d.ego_line == 1)return 100/d.target.co_time;
            else if(d.ego_line == 2) return 20;
            else{return 40;}
        });
        //.gravity(0);

    current_network_data = json;
    currentNodeShape =  svg.nodeShapeSVG;
    for(var k = 0; k < json.edges.length; k++) {
        var flag1 = true;
        var flag2 = true;
        for(var i=1;i<nodes_weight.length;i++){
            if(json.edges[k]["source"] == nodes_weight[i]["id"]) {
                nodes_weight[i]["num"]++;
                flag1 = false;
                break;
            }
        }
        if(flag1)
            nodes_weight.push({'id':json.edges[k]["source"],'num':1});

        for(var i=1;i<nodes_weight.length;i++){
            if(json.edges[k]["target"] == nodes_weight[i]["id"]) {
                nodes_weight[i]["num"]++;
                flag2 = false;
                break;
            }
        }
        if(flag2)
            nodes_weight.push({'id':json.edges[k]["target"],'num':1});
    }

    initNetworkSetting(json);
    //alert(json.nodes)

    var i = 1;
    var j = 1;
    force.nodes(json.nodes).links(json.edges).start();
	edge = svg.selectAll("line.edge").data(json.edges).enter().append(
			"line").attr("class", "edge").attr("id", function(){return i++;}).attr("value", function(d){return d["count"];}).style("stroke-width", function(d) {
		return Math.sqrt(d[svg.edgeThicknessDim]?d[svg.edgeThicknessDim]:1);
	});

	node = svg.selectAll(svg.nodeShapeSVG+".node").data(json.nodes).enter().append(
            svg.nodeShapeSVG).attr("class", "node").attr("id",function(){var str = "n"+j;j++;return str;}).style("fill",
			function(d) {
				return color(d[svg.nodeFillColorDim]);
			}).call(force.drag);



    svg.selectAll(svg.nodeShapeSVG+".node").on("click",function(d){
        /*for(var i=0;i<json.edges.length;i++){
            document.getElementById(i+1).style.stroke = "";
        }
        for(var i=0;i<node[0].length;i++){
            document.getElementById("n"+ node[0][i].id).style.stroke = "";
        }*/

        for(var i=0;i<json.edges.length;i++){
            document.getElementById("n"+ parseInt(json.edges[i]["target"].id)).style.stroke = "";
            document.getElementById("n"+ parseInt(json.edges[i]["source"].id)).style.stroke = "";
            document.getElementById(i+1).style.stroke = "";
        }

        for(var i=0;i<json.nodes.length;i++){
            var i_ = i+1;
            document.getElementById("n"+ i_).style.stroke = "";
            document.getElementById("tn"+ i_).innerHTML="";
        }

        if(last_id != d.id){
            document.getElementById("n"+ d.id).style.stroke = "red";
            node.attr("cx", function(t){if(t.id == d.id){document.getElementById("tn"+ t.id).setAttribute("x", t.x);}return t.x})
                .attr("cy", function(t){if(t.id == d.id){document.getElementById("tn"+ t.id).setAttribute("y", t.y);document.getElementById("tn"+ t.id).innerHTML=t[svg.nodeHoverTitleDims[0]];
                    }return t.y;});
            node_info.attr("fill",function(t){if(t.id == "n"+d.id){return "orange";}return "black";});

            for(var i=0;i<json.edges.length;i++){

                if(parseInt(json.edges[i]["source"].id) == parseInt(d.id)){
                    document.getElementById("n"+ parseInt(json.edges[i]["target"].id)).style.stroke = "red";
                    document.getElementById(i+1).style.stroke = "red";
                    node.attr("cx", function(t){if(t.id == json.edges[i]["target"].id){document.getElementById("tn"+ t.id).setAttribute("x", t.x);}return t.x})
                        .attr("cy", function(t){if(t.id == json.edges[i]["target"].id){document.getElementById("tn"+ t.id).setAttribute("y", t.y);document.getElementById("tn"+ t.id).innerHTML=t[svg.nodeHoverTitleDims[0]];}return t.y;});

                }
                if(parseInt(json.edges[i]["target"].id) == parseInt(d.id)){
                    document.getElementById("n"+ parseInt(json.edges[i]["source"].id)).style.stroke = "red";
                    document.getElementById(i+1).style.stroke = "red";
                    node.attr("cx", function(t){if(t.id == json.edges[i]["source"].id){document.getElementById("tn"+ t.id).setAttribute("x", t.x);}return t.x})
                        .attr("cy", function(t){if(t.id == json.edges[i]["source"].id){document.getElementById("tn"+ t.id).setAttribute("y", t.y);document.getElementById("tn"+ t.id).innerHTML=t[svg.nodeHoverTitleDims[0]];}return t.y;});

                }

            }
            node_info.attr("font-size","10px");
            last_id = d.id;
        }
        else {
            last_id = -1;
        }

       //alert(node.length);
    });


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

		node.attr("r", function(d){
            for(var k = 1; k < nodes_weight.length; k++) {
                if(parseInt(d.id) == parseInt(nodes_weight[k]["id"]))
                    return 4+parseInt((nodes_weight[k]["num"])/5);
            }
            return svg.nodeSize;
            })
            .attr("cx", function(d) {
			return d.x;
		}).attr("cy", function(d) {
			return d.y;
		});
	});
    //node.attr("cx", function(d){alert(d[svg.nodeHoverTitleDims[0]]);return d.cx});
    node_info = svg.selectAll("text").data(node[0]).enter().append("text").attr("id", function(d){return "t"+ d.id;});

    all_edge = document.getElementsByClassName("edge");
    for(var j = 0; j < all_edge.length; j++) {
        arr_id[j] = all_edge[j].attributes["id"].value;
        arr_value[j] = all_edge[j].attributes["value"].value;
        /*arr_x1[j] = all_edge[j].attributes["x1"].value;
        arr_x2[j] = all_edge[j].attributes["x2"].value;
        arr_y1[j] = all_edge[j].attributes["y1"].value;
        arr_y2[j] = all_edge[j].attributes["y2"].value;*/
    }
});

function initNetworkSetting(json){
    var edgeSchemas = json._schemas.edges;
    var nodeSchemas = json._schemas.nodes;
    //var selectList = document.getElementById(svg.edgeThicknessSelectionId);

    /*for (var key in edgeSchemas){
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
    }*/

    var selectList = document.getElementById(svg.nodeHoverTitleSelectionId);

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
    //var selectList = document.getElementById(svg.edgeThicknessSelectionId);
    //var selectedValue = selectList.options[selectList.selectedIndex].getAttribute("value");

    /*svg.edgeThicknessDim =  selectedValue;
    if(document.getElementById('edgeThickness').options[document.getElementById('edgeThickness').selectedIndex].getAttribute("value") == "count")
        document.getElementById('Thres').disabled=false;

    selectList = document.getElementById(svg.nodeShapeSelectionId);
    selectedValue = selectList.options[selectList.selectedIndex].getAttribute("value");

    svg.nodeShapeSVG =  selectedValue;

    selectList = document.getElementById(svg.nodeSizeSelectionId);
    selectedValue = selectList.options[selectList.selectedIndex].getAttribute("value");

    svg.nodeSize =  selectedValue;

    selectList = document.getElementById(svg.nodeFillColorSelectionId);
    selectedValue = selectList.options[selectList.selectedIndex].getAttribute("value");*/

    svg.nodeFillColorDim = "id";

    var selectList = document.getElementById(svg.nodeHoverTitleSelectionId);
    var selectedValue = selectList.options[selectList.selectedIndex].getAttribute("value");

    svg.nodeHoverTitleDims = [];
    svg.nodeHoverTitleDims.push(selectedValue);
}

function reloadNetwork(){

    var json = current_network_data;
    //deleted_edge[0]= json.edges[0].constructor;

    var thres = document.getElementById("Thres").value;
    for(var k=2; k < deleted_edge.length; k++) {
        if(parseInt(deleted_edge[k]["count"]) >= parseInt(thres)) {
            json.edges.push(deleted_edge[k]);
            deleted_edge.splice(k,1);
            k--;
        }
    }

    for(var k=0; k < json.edges.length; k++) {
        if(parseInt(json.edges[k]["count"]) < parseInt(thres)) {
            deleted_edge.push(json.edges[k]);
            json.edges.splice(k,1);
            //deleted_edge[deleted_edge.length] = json.edges[0].constructor;
            k--;
        }
    }


    var edges = document.getElementsByClassName("edge");
    for(var k = 0; k < arr_id.length; k++) {
        var cur_line = document.getElementById(arr_id[k]);
        if(cur_line != null) {
            cur_line.parentNode.removeChild(cur_line);
        }
        else {
            continue;
        }
    }
    for(var k = 0; k < node[0].length; k++) {

        var idx = k+1;
        idx = "n"+idx;
        var cur_node = document.getElementById(idx);
        var cur_text = document.getElementById("t"+idx);
        cur_text.parentNode.removeChild(cur_text);
        if(cur_node != null) {
            cur_node.parentNode.removeChild(cur_node);
        }
        else {
            continue;
        }
    }



    //force=null;
   // force = d3.layout.force().charge(-120).linkDistance(30).size(
       // [ width, height ]);

    force.nodes(json.nodes).links(json.edges).start();

    var i = 1;
    var j = 1;

    edge = svg.selectAll("line.edge").data(json.edges).enter().append(
        "line").attr("class", "edge").attr("id", function(){return i++;}).attr("value", function(d){return d["count"];}).style("stroke-width", function(d) {
            return Math.sqrt(1);
        });

    node = svg.selectAll(svg.nodeShapeSVG+".node").data(json.nodes).enter().append(
        svg.nodeShapeSVG).attr("class", "node").attr("id",function(){var str = "n"+j;j++;return str;}).style("fill",
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

   /* force.on("tick", function() {
        edge.attr("x1", function(d) {
            return d.source.x;
        }).attr("y1", function(d) {
            return d.source.y;
        }).attr("x2", function(d) {
            return d.target.x;
        }).attr("y2", function(d) {
            return d.target.y;
        });
        node.attr("r", function(d){
            for(var k = 1; k < nodes_weight.length; k++) {
                if(parseInt(d.id) == parseInt(nodes_weight[k]["id"]))

                    return 5+parseInt(Math.log(nodes_weight[k]["num"]));
            }
            return svg.nodeSize;
            })
            .attr("cx", function(d) {
                return d.x;
            }).attr("cy", function(d) {
                return d.y;
            });
    });*/

    /*var edge = svg.selectAll("line.edge").style("stroke-width", function(d) {
        //alert(d[svg.edgeThicknessDim]);

           //return Math.sqrt(d[svg.edgeThicknessDim]?d[svg.edgeThicknessDim]:1);
        return Math.sqrt(1);
        });
    var edge = svg.selectAll("line.edge").style("display", function(d){
        var thres = document.getElementById("Thres").value;

        if(d[svg.edgeThicknessDim] < thres)
            return "none";
        else
            return "block";
    });
    var thres = document.getElementById("Thres").value;
    for (var j = 0; j < arr_id.length; j++){
        //alert(1)
        if(parseInt(arr_value[j]) < parseInt(thres)){

            var cur_line = document.getElementById(arr_id[j]);
            if(cur_line != null) {
                cur_line.parentNode.removeChild(cur_line);
            }
            else {
                continue;
            }
        }


    }*/

    var nodes = svg.selectAll(".node");
    if(currentNodeShape != svg.nodeShapeSVG){

        currentNodeShape =  svg.nodeShapeSVG;
//        var newnode = svg.append(
//            svg.nodeShapeSVG).attr("class", "node");
//
//        newnode.style("fill",
//            function() {
//                return color(node[svg.nodeFillColorDim]);
//            }).call(force.drag);
//
//        newnode.append("title").text(function() {
//            var title = "";
//            if(svg.nodeHoverTitleDims.length > 0){
//                title = node[svg.nodeHoverTitleDims[0]];
//            }
//
//            for (var i = 1; i < svg.nodeHoverTitleDims.length; i++ ){
//                title+= ","+ node[svg.nodeHoverTitleDims[i]];
//            }
//            return title;
//        });
//
//        if(svg.nodeShapeSVG == "circle"){
//            newnode.attr("r", svg.nodeSize);
//            force.on("tick", function() {
//                newnode.attr("cx", function() {
//                    return node.x;
//                }).attr("cy", function() {
//                        return node.y;
//                    });
//            });
//        }
//        else if(svg.nodeShapeSVG == "rect"){
//
//            newnode.attr("width", svg.nodeSize).attr("height", svg.nodeSize);
//            force.on("tick", function() {
//                newnode.attr("x", function() {
//                    return node.x - svg.nodeSize/2;
//                }).attr("y", function() {
//                        return node.y - svg.nodeSize/2;
//                    });
//
//            });
//        }
//
//        node.remove();

    }
    else{
        nodes.style("fill",
            function(d) {
                return color(d[svg.nodeFillColorDim]);
            });

        nodes.selectAll("title").text(function(d) {
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
            //nodes.attr("r", svg.nodeSize);
            node.attr("r", function(d){
                for(var k = 1; k < nodes_weight.length; k++) {
                    if(parseInt(d.id) == parseInt(nodes_weight[k]["id"])) {
                        //alert(5+parseInt(Math.log(nodes_weight[k]["num"])));
                        return 4+parseInt((nodes_weight[k]["num"])/5);
                    }
                }
                return svg.nodeSize;
            })
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

                nodes.attr("cx", function(d) {
                    return d.x;
                }).attr("cy", function(d) {
                        return d.y;
                    });
            });
            node_info = svg.selectAll("text").data(node[0]).enter().append("text").attr("id", function(d){return "t"+ d.id;});

        }
        else if(svg.nodeShapeSVG == "rect"){

            nodes.attr("width", svg.nodeSize).attr("height", svg.nodeSize);
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

                nodes.attr("x", function(d) {
                    return d.x - svg.nodeSize/2;
                }).attr("y", function(d) {
                        return d.y - svg.nodeSize/2;
                    });

            });
        }
    }


    svg.selectAll(svg.nodeShapeSVG+".node").on("click",function(d){
        /*for(var i=0;i<json.edges.length;i++){
         document.getElementById(i+1).style.stroke = "";
         }
         for(var i=0;i<node[0].length;i++){
         document.getElementById("n"+ node[0][i].id).style.stroke = "";
         }*/

        for(var i=0;i<json.edges.length;i++){
            document.getElementById("n"+ parseInt(json.edges[i]["target"].id)).style.stroke = "";
            document.getElementById("n"+ parseInt(json.edges[i]["source"].id)).style.stroke = "";
            document.getElementById(i+1).style.stroke = "";
        }

        for(var i=0;i<json.nodes.length;i++){
            var i_ = i+1;
            document.getElementById("n"+ i_).style.stroke = "";
            document.getElementById("tn"+ i_).innerHTML = "";
        }

        if(last_id != d.id){
            document.getElementById("n"+ d.id).style.stroke = "red";
            node.attr("cx", function(t){if(t.id == d.id){document.getElementById("tn"+ t.id).setAttribute("x", t.x);}return t.x})
                .attr("cy", function(t){if(t.id == d.id){document.getElementById("tn"+ t.id).setAttribute("y", t.y);document.getElementById("tn"+ t.id).innerHTML=t[svg.nodeHoverTitleDims[0]];}return t.y;});
            node_info.attr("fill",function(t){if(t.id == "n"+d.id){return "orange";}return "black";});
            for(var i=0;i<json.edges.length;i++){

                if(parseInt(json.edges[i]["source"].id) == parseInt(d.id)){
                    document.getElementById("n"+ parseInt(json.edges[i]["target"].id)).style.stroke = "red";
                    document.getElementById(i+1).style.stroke = "red";
                    node.attr("cx", function(t){if(t.id == json.edges[i]["target"].id){document.getElementById("tn"+ t.id).setAttribute("x", t.x);}return t.x})
                        .attr("cy", function(t){if(t.id == json.edges[i]["target"].id){document.getElementById("tn"+ t.id).setAttribute("y", t.y);document.getElementById("tn"+ t.id).innerHTML=t[svg.nodeHoverTitleDims[0]];}return t.y;});
                }
                if(parseInt(json.edges[i]["target"].id) == parseInt(d.id)){
                    document.getElementById("n"+ parseInt(json.edges[i]["source"].id)).style.stroke = "red";
                    document.getElementById(i+1).style.stroke = "red";
                    node.attr("cx", function(t){if(t.id == json.edges[i]["source"].id){document.getElementById("tn"+ t.id).setAttribute("x", t.x);}return t.x})
                        .attr("cy", function(t){if(t.id == json.edges[i]["source"].id){document.getElementById("tn"+ t.id).setAttribute("y", t.y);document.getElementById("tn"+ t.id).innerHTML=t[svg.nodeHoverTitleDims[0]];}return t.y;});
                }

            }
            node_info.attr("font-size","10px")
            last_id = d.id;
        }
        else {
            last_id = -1;
        }

        //alert(node.length);
    });

}
