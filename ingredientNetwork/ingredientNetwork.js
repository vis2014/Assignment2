var width = 800, height = 600;

var color = d3.scale.category20();  //取得20个颜色的序列

var force = d3.layout.force().charge(-300).linkDistance(200).size(    //定义力学结构
    [ width, height ]);

var svg = d3.select("#chart").append("svg").attr("width", width).attr("height",   //定义画布
    height);

svg.nodeShapeSVG = "circle";
svg.nodeSize = 5;

svg.dataSet = "ingredient-network-data";                 //svg的数据源：文件名为  "ingredient-network-data.json"

var current_network_data = null;
var currentNodeShape = "circle";

d3.json("data/" + svg.dataSet + ".json", function(json) {      //读数据

    current_network_data = json;
    currentNodeShape =  svg.nodeShapeSVG;

    force.nodes(json.nodes).links(json.edges).start();   //读取数据

    var edge = svg.selectAll("line.edge").data(json.edges).enter().append(
            "line").attr("class", "edge").style("stroke-width", function(d) {   //在svg中画边
            return d.weight+"px";
        }).on("mouseover",function(d){
            d3.select(this)
                .style("stroke", "#8B0000");

            for(var i = 0; i < json.edges.length; i++) {
                if (d.source.index == json.nodes[i].index || d.target.index == json.nodes[i].index ) {
                    svg.select(".c" + d.source.index)
                        .style("fill", "#FF0000");
                    svg.select(".c" + d.target.index)
                        .style("fill", "#FF0000");
                }
            };
        })
        .on("mouseout",function(d){
            d3.select(this)
                .transition()
                .duration(400)
                .style("stroke", "#999");
            for(var i = 0; i < json.edges.length; i++) {
                if (d.source.index == json.nodes[i].index || d.target.index == json.nodes[i].index ) {
                    svg.select(".c" + d.source.index)
                        .style("fill", "#0F0F0F");
                    svg.select(".c" + d.target.index)
                        .style("fill", "#0F0F0F");
                }
            };
        })
        .call(force.drag);

    var node = svg.selectAll(svg.nodeShapeSVG+".node").data(json.nodes).enter().append(       //在svg中画点
            svg.nodeShapeSVG).attr("class", function(d) { return "circle" + " c" + d.index })
        .style("fill",
            function(d) {
                 return "#0F0F0F";
        })
        .on("mouseover",function(d){
            d3.select(this)
                .attr("r", 1.5*svg.nodeSize)
                .style("fill","#FF0000");

            for (var i = 0; i < json.edges.length; i++) {
                if (d.index == json.edges[i].source.index || d.index == json.edges[i].target.index ) {
                    //Emphasize edge
                    svg.selectAll(".n" + d.index)
                        .style("stroke", "#8B0000");

                    //Emphasize node
                    if (d.index == json.edges[i].source.index) {
                        svg.select(".c" + json.edges[i].target.index)
                            .style("fill", "#FF0000");
                        svg.select(".c" + json.edges[i].target.index).append("title").text("abc")


                    } else {
                        svg.select(".c" + json.edges[i].source.index)
                            .style("fill", "#FF0000");
                        svg.select(".c" + json.edges[i].target.index).append("title").text("abc")
                    }
                }
            };
        })
        .on("mouseout",function(d){
            d3.select(this)
                .transition()
                .duration(400)
                .attr("r", svg.nodeSize)
                .style("fill","#0F0F0F");

            for (var i = 0; i < json.edges.length; i++) {
                if (d.index == json.edges[i].source.index || d.index == json.edges[i].target.index ) {
                    //Emphasize links
                    svg.selectAll(".n" + d.index)
                        .transition()
                        .duration(400)
                        .style("stroke", "#999");
                    //Emphasize circles
                    if (d.index == json.edges[i].source.index) {
                        svg.select(".c" + json.edges[i].target.index)
                            .transition()
                            .duration(400)
                            .style("fill", "#0F0F0F");
                    } else {
                        svg.select(".c" + json.edges[i].source.index)
                            .transition()
                            .duration(400)
                            .style("fill", "#0F0F0F");
                    }
                }
            };


        })
        .call(force.drag);


    node.append("title").text(function(d) {    //为点标记鼠标悬停的标签
       return d.name;
    });

    edge.append("title").text(function(d) {    //为边标记鼠标悬停的标签
        return d.weight;
    });

    force.on("tick", function() {          //开始力学动作：监听布局位置的变化。(仅支持"start","step","end"三种事件)
        edge.attr("class", function(d) { return "edge" + " n" + d.source.index + " n" + d.target.index})
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("r", svg.nodeSize)
            .attr("cx", function(d) {
                return d.x;
            }).attr("cy", function(d) {
                return d.y;
            });
    });

});




