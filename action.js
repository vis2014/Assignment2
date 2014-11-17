/**
 * Created by panzg on 14-11-16.
 */


zoom = d3.behavior.zoom();
zoom.on("zoom", onZoomChanged);

var w = 1280,
    h = 600,
    node,
    link,
    root;
var scale_max = 2.3;
var scale_min = 0.2;
var current_scale = 1.1;
var bar_len = 100;
var border_len = 20 ;
var colors = d3.scale.category20();
var clickFlag =0;
var force = d3.layout.force()
    .on("tick", tick)
    .charge(function(d) { return d._children ? -d.size / 100 : -30; })
    .linkDistance(function(d) { return d.target._children ? 80 : 30; })
    .size([w, h - 160]);

var vis = d3.select("body").append("svg:svg")
    .attr("width", w)
    .attr("height", h)
    .attr("pointer-events","all")
    .call(zoom)
    .append("svg:g");


d3.json("cas.json", function(json) {
    root = json;
    root.fixed = true;
    root.x = w / 2;
    root.y = h / 2 - 80;
    update();
});

function init(){

}
function refreshNetworkSettings(){


}

//过滤功能
function reloadNetwork(){
    var selectedIndex = document.getElementById("nodeSize");
    var selectedValue = selectedIndex.options[selectedIndex.selectedIndex].getAttribute("value");

    //  alert(selectedValue);

    node.style("fill",function(d){
        if(d.size<selectedValue)
        {
            return "white";
        }
        else
        {
            return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
        }
    });

    node.attr("r",function(d){
        if(d.size<selectedValue) return 0;
        else return  d.children ? 4.5 : Math.sqrt(d.size);
    });

    link.style("stroke-width",function(d){
        if(d.target.size < selectedValue) { return 0}
        else {return 1.5}
    });
}
function update() {
    var nodes = flatten(root),
        links = d3.layout.tree().links(nodes);


    // Restart the force layout.
    force
        .nodes(nodes)
        .links(links)
        .start();

    // Update the links…
    link = vis.selectAll("line.link")
        .data(links, function(d) { return d.target.id; });

    // Enter any new links.
    link.enter().insert("svg:line", ".node")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    // Exit any old links.
    link.exit().remove();

    // Update the nodes…
    node = vis.selectAll("g.node")
        .data(nodes, function(d) { return d.id; })
        .attr("class", "node");


    node.transition()
        .attr("r", function(d) { return d.children ? 4.5 : Math.sqrt(d.size); });


    // Enter any new nodes.
    node.enter().append("svg:circle")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        //     .attr("r",5)
        .attr("r", function(d) { return d.children ? 4.5 : Math.sqrt(d.size); })
        .style("fill", color)
        .on("click", click)
        .call(force.drag);


    node.append("title").text(function(d){return d.name;});


    node.append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });




    //添加文本不成功

    /*var text_dx = -20;
     var text_dy = 20;

     var nodetext = vis.selectAll("g.nodetext")
     .data(nodes, function(d) { return d.id; })
     .enter()
     .append("text")
     .attr("class","nodetext")
     .attr("dx", function(d){return d.x;})
     .attr("dy", function(d){return d.y})
     .text(function(d){ return d.name});*/

    /*
     console.log(nodes);
     for(var i=0;i<nodes.length;i++)
     {
     vis.append("text")

     .attr("x",function(){ return nodes[i].x})
     .attr("y",function(){return nodes[i].y})
     .text(function(){return nodes[i].name})
     .attr("font-size",10);
     }

     */

    // Exit any old nodes.
    node.exit().remove();
}

var scale = 1.1;
var currentY = 0;
function redraw(){  //放大缩小 鼠标滑动   scale放大倍数，translate是转变，转换

    scale = d3.event.scale;
    if(scale > scale_max || scale < scale_min){
        return ;
    }
    vis.attr("transform","translate(" + d3.event.translate + ")" + "scale(" + scale + ")" );
}

function tick() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

}

// Color leaf nodes orange, and packages white or blue.
function color(d) {
    return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
}

// 实现按地点过滤
function click(e) {
    if(clickFlag==0)
    {
        var flag = new Array([147]);
        for(var i=0;i<147;i++){ flag[i] = 0;}
        //  alert("click test");
        link.style("stroke-width",function(d){
            var i=0;
            if(d.source.id != e.id){  flag[d.target.id] =1;return 0;}
            else return 1.5;
        });
        node.attr("r",function(d){
            if(flag[d.id] ==1 && d.id!= e.id) {return 0}
            else return  d.children ? 4.5 : Math.sqrt(d.size);
        });
        clickFlag=1;
    }
    else
    {
        link.style("stroke-width",1.5);
        node.attr("r",function(d){
            return  d.children ? 4.5 : Math.sqrt(d.size);
        });
        clickFlag=0;
    }

    //    alert(d.name);
    /*
     if (d.children) {
     d._children = d.children;
     d.children = null;
     } else {
     d.children = d._children;
     d._children = null;
     }
     */
    //   update();

}

// Returns a list of all nodes under the root.
function flatten(root) {
    var nodes = [], i = 0;

    function recurse(node) {
        if (node.children) node.size = node.children.reduce(function(p, v) { return p + recurse(v); }, 0);
        if (!node.id) node.id = ++i;
        nodes.push(node);
        return node.size;
    }

    root.size = recurse(root);
    return nodes;
}

function onZoomChanged() {
    vis.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");}
