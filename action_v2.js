/**
 * Created by panzg on 14-11-17.
 */
var width = 1280;
var height = 600;
var w = 1280,
    h = 600;
var clickFlag =0;
var color = d3.scale.category20();
zoom = d3.behavior.zoom();
zoom.on("zoom", onZoomChanged);
var svg_nodes,edges_line;
var nodes_text
var nodes,edges;
var svg = d3.select("body").append("svg")
    .attr("width",width)
    .attr("height",height)
    .call(zoom);
function onZoomChanged() {
    svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");}
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
//过滤功能
function reloadNetwork(){
    var selectedIndex = document.getElementById("nodeSize");
    var selectedValue = selectedIndex.options[selectedIndex.selectedIndex].getAttribute("value");

    //  alert(selectedValue);

    var nodeSizeArr = new Array();
    svg_nodes.style("fill",function(d,i){
        nodeSizeArr.push(d.size);
        if(d.size<selectedValue)
        {
            return "white";
        }
        else
        {
            return color(i);
        }
    });


    nodes_text.style("fill-opacity",function(i){
      if(nodeSizeArr[i.index] < selectedValue){ return 0; }
    });


    svg_nodes.attr("r",function(d){
        if(d.size<selectedValue) return 0;
        else return  d.children ? 4.5 : Math.sqrt(d.size);
    });

    edges_line.style("stroke-width",function(d){
        if(d.target.size < selectedValue) { return 0}
        else {return 1.5}
    });
}
d3.json("cas.json",function(error,root){
    if( error ){
        return console.log(error);
    }


         nodes = flatten(root);
            edges = d3.layout.tree().links(nodes);
        console.log(nodes);
      //  console.log(edges);


        var force = d3.layout.force()
            .nodes(nodes)
            .links(edges)
            .charge(function(d) { return d._children ? -d.size / 100 : -30; })
            .linkDistance(function(d) { return d.target._children ? 80 : 30; })
            .size([w, h - 160])
            .start();
        var text_dx = -20;
        var text_dy = 20;




        /*
        svg_nodes.append("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function(d) { return d.name; });
            */

         edges_line = svg.selectAll("line")
            .data(edges)
            .enter()
            .append("line")
            .style("stroke","#ccc")
            .style("stroke-width",1);

        svg_nodes = svg.selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .on("click", click)
            .attr("r", function(d) { return d.children ? 4.5 : Math.sqrt(d.size); })
            .style("fill",function(d,i){
                return color(i);
            }) ;

        nodes_text = svg.selectAll(".nodetext")
            .data(nodes)
            .enter()
            .append("text")
            .attr("class","nodetext")
            .attr("dx",0)
            .attr("dy",0)
            .text(function(d){
                return d.name;
            });

        force.on("tick", function(){



            //更新连接线的位置
            edges_line.attr("x1",function(d){ return d.source.x; });
            edges_line.attr("y1",function(d){ return d.source.y; });
            edges_line.attr("x2",function(d){ return d.target.x; });
            edges_line.attr("y2",function(d){ return d.target.y; });


            //更新结点和文字
            svg_nodes.attr("cx",function(d){ return d.x; });
            svg_nodes.attr("cy",function(d){ return d.y; });

            nodes_text.attr("x",function(d){ return d.x });
            nodes_text.attr("y",function(d){ return d.y; });

        });
        console.log(nodes_text);
    }
)
// 实现按地点过滤
function click(e) {
    if(clickFlag==0)
    {
        var flag = new Array([147]);
        for(var i=0;i<147;i++){ flag[i] = 0;}
        //  alert("click test");
        edges_line.style("stroke-width",function(d){
            var i=0;
            if(d.source.id != e.id){  flag[d.target.id] =1;return 0;}
            else return 1.5;
        });

        var deleteTextArray = new  Array();
        svg_nodes.attr("r",function(d){
            if(flag[d.id] ==1 && d.id!= e.id) {
                deleteTextArray.push(d.index);
                return 0
            }
            else return  d.children ? 4.5 : Math.sqrt(d.size);
        });


        var j=0;
        nodes_text.style("fill-opacity",function(i){
            if( deleteTextArray[j]== i.index ){ j++;return 0; }
        });

        clickFlag=1;
    }
    else
    {
        edges_line.style("stroke-width",1.5);
        svg_nodes.attr("r",function(d){
            return  d.children ? 4.5 : Math.sqrt(d.size);  });
        svg_nodes.style("fill",function(d,i){
                return color(i);
            });
        nodes_text.style("fill-opacity",1.0);
        clickFlag=0;
    }
}