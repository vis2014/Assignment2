/**
 * Created by Administrator on 14-11-10.
 */


var width = 3300;
var height = 2800;



var svg = d3.select("body").append("svg")
.attr("width",width)
.attr("height",height);



d3.json("data/relation.json",function(error,root){

    if( error ){
    return console.log(error);
    }
    console.log(root);

    var force = d3.layout.force()
    .nodes(root.nodes)
    .links(root.edges)
    .size([width,height])
    .linkDistance(100)
    .charge(-800)
    .start();

    var edges_line = svg.selectAll("line")
    .data(root.edges)
    .enter()
    .append("line")
    .style("stroke","#ccc")
    .style("stroke-width",1);

    var edges_text = svg.selectAll(".linetext")
    .data(root.edges)
    .enter()
    .append("text")
    .attr("class","linetext")
    .text(function(d){
    return d.relation;
    });



    var text_dx = -20;
    var text_dy = 20;

    var nodes_text = svg.selectAll(".nodetext")
        .data(root.nodes)
        .enter()
        .append("text")
        .attr("class","nodetext")
        .attr("dx",text_dx)
        .attr("dy",text_dy)
        .text(function(d){
            return d.name;
        });



    var color = d3.scale.category20();
    var svg_nodes = svg.selectAll("circle")
    .data(root.nodes)
    .enter()
    .append("circle")
    .attr("r",10)
    .style("fill",function(d,i){
    return color(i);
    })


    .on("mouseover",function(d,i){
    //显示连接线上的文字
    edges_text.style("fill-opacity",function(edge){
    if( edge.source === d || edge.target === d ){
    return 1.0;
    }
    });

    //显示绰号
    nodes_text
     .text(function(d) {
         return d.name + "(" + d.nikeName + ")";

      });

    })
    .on("mouseout",function(d,i){
    //隐去连接线上的文字
    edges_text.style("fill-opacity",function(edge){
    if( edge.source === d || edge.target === d ){
    return 0.0;
    }
    });

    //隐藏
    nodes_text
    .text(function(d) {
       return d.name;
         });
        })
    .call(force.drag);



    force.on("tick", function(){



    //更新连接线的位置
    edges_line.attr("x1",function(d){ return d.source.x; });
    edges_line.attr("y1",function(d){ return d.source.y; });
    edges_line.attr("x2",function(d){ return d.target.x; });
    edges_line.attr("y2",function(d){ return d.target.y; });

    //更新连接线上文字的位置
    edges_text.attr("x",function(d){ return (d.source.x + d.target.x) / 2 ; });
    edges_text.attr("y",function(d){ return (d.source.y + d.target.y) / 2 ; });


    //更新结点和文字
    svg_nodes.attr("cx",function(d){ return d.x; });
    svg_nodes.attr("cy",function(d){ return d.y; });

    nodes_text.attr("x",function(d){ return d.x });
    nodes_text.attr("y",function(d){ return d.y; });

    });
    });

