/**
 * Created by LXH on 2014/11/14.
 */
var height=500;
var width=950;
var force=d3.layout.force().charge(-120).linkDistance(30).size([width,height]);
var svg=d3.select("#chart").append("svg").attr("height",height).attr("width",width);
var color=d3.scale.category20();
svg.edgeThicknessSelectionId="edgeThickness";
svg.nodeFillColorSelectionId="nodeFillColor";
svg.nodeHoverTitleSelectionId="nodeHoverTitle";
svg.edgesThicknessDim="";
svg.edgesFillColorDim="";
svg.edgesHoverTitleDims=[];
svg.nodesSize=8;
svg.nodeShapeSVG="circle";
d3.json("data/data.json",function(json){
    initNetworkSetting(json);
    force.nodes(json.nodes).links(json.edges).start();

    var edge=svg.selectAll("line.edges").data(json.edges).enter().append("line").attr("class","edges").style("stroke-width",function(d){
        return Math.sqrt(d[svg.edgeThicknessDim]?d[svg.edgeThicknessDim]:1);
    });
    var node=svg.selectAll(svg.nodeShapeSVG+".node").data(json.nodes).enter().append(svg.nodeShapeSVG).attr("class","node").attr("r",svg.nodesSize).style("fill",function(d){
        return color(d[svg.nodeFillColorDim]);
    }).call(force.drag);

    node.append("title").text(function(d) {
        return d[svg.nodeHoverTitleDims];
    });
    node.on("click",function(d){
        var nx= d.x;
        var ny= d.y;

        edge.style("stroke", function (e) {
            if((e.source.x==nx&& e.source.y==ny)||(e.target.x==nx&& e.target.y==ny)){
                return "red";
            }
        });

        //   d3.select(this).attr("r",10);//选择被选中 或者被监听的对象 都是使用d3.select(this)

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

        node.attr("cx", function(d) {
            return d.x;
        }).attr("cy", function(d) {
            return d.y;
        });
    });
});
function createOption(name){
    var Option=document.createElement("option");
    Option.appendChild(document.createTextNode(name));
    Option.setAttribute("value",name);
    return Option;
}
function initNetworkSetting(json){
    var edgesSchema=json.schemas.edges;
    var nodesSchema=json.schemas.nodes;
    var selectedList=document.getElementById(svg.edgeThicknessSelectionId);
    for(var index in edgesSchema){
        var schema=edgesSchema[index];
        if(schema.name!="source"&&schema.name!="target"&&(schema.type=="float"||schema.type=="int"||schema.type=="long"||schema.type=="double")){
            selectedList.appendChild(createOption(schema.name) );
        }
    }
    var selectedList=document.getElementById(svg.nodeFillColorSelectionId);
    for(var index in nodesSchema){
        var schema=nodesSchema[index];
        if(schema.type=="string"||schema.type=="float"||schema.type=="int"||schema.type=="long"||schema.type=="double"){
            selectedList.appendChild(createOption(schema.name));
        }
    }
    var selectedList=document.getElementById(svg.nodeHoverTitleSelectionId);
    for(var index in nodesSchema){
        var schema=nodesSchema[index];
        if(schema.type=="string"||schema.type=="float"||schema.type=="int"||schema.type=="long"||schema.type=="double"){
            selectedList.appendChild(createOption(schema.name));
        }
    }

    refreshNetworkSettings();
}

function refreshNetworkSettings(){
    var selectList = document.getElementById(svg.edgeThicknessSelectionId);
    var selectedValue = selectList.options[selectList.selectedIndex].getAttribute("value");
    svg.edgeThicknessDim =  selectedValue;
    var selectList = document.getElementById(svg.nodeFillColorSelectionId);
    var selectedValue = selectList.options[selectList.selectedIndex].getAttribute("value");
    svg.nodeFillColorDim =  selectedValue;

    var selectList = document.getElementById(svg.nodeHoverTitleSelectionId);
    var selectedValue = selectList.options[selectList.selectedIndex].getAttribute("value");
    svg.nodeHoverTitleDims = [];
    svg.nodeHoverTitleDims.push(selectedValue);
}

function reloadNetwork() {

    var edge=svg.selectAll("line.edges").style("stroke-width",function(d){
        return Math.sqrt(d[svg.edgeThicknessDim]?d[svg.edgeThicknessDim]:1);
    });
    var node=svg.selectAll(svg.nodeShapeSVG+".node").attr("r",svg.nodesSize).style("fill",function(d){
        return color(d[svg.nodeFillColorDim]);
    });
    node.selectAll("title").text(function(d) {
        return d[svg.nodeHoverTitleDims];
    });
    force.on("tick", function () {

        edge.attr("x1", function (d) {
            return d.source.x;
        }).attr("y1", function (d) {
            return d.source.y;
        }).attr("x2", function (d) {
            return d.target.x;
        }).attr("y2", function (d) {
            return d.target.y;
        });

        node.attr("cx", function (d) {
            return d.x;
        }).attr("cy", function (d) {
            return d.y;
        });
    });


}
