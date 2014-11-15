
var width =1000,
    height =800;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-1000)
    .linkDistance(200)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);



var drag = force.drag()
    .on("dragstart",start)
    .on("dragend",end);

d3.json("forcelayoutdata.json", function(error, graph) {

    dataset = graph;
    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

    var link = svg.selectAll(".links")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("class", function(d) { return "links" + " node" + d.source.index + " node" + d.target.index})
        .style("stroke","#999999")
        .style("stroke-width", function(d) { return 1; });


    var node = svg.selectAll(".nodes")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("class", function(d) { return "circles" + d.index })
        .attr("r",15 )
        .style("fill", function (d) {
            return color(d.group)
        })

        .call(force.drag)
        .attr("r",15 )
        .on("mousemove", mousemove)
        .on("mouseout", mouseout)

    var text=svg.selectAll("text")
        .data(graph.nodes)
        .enter()
        .append("text")
        .text(function(d){
            return d.name
        })
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });

    var text1=svg.selectAll(null)
        .data(graph.links)
        .enter()
        .append("text")
        .text(function(d){
            return d.value
        })
        .attr("x", function(d) { return (d.source.x+d.target.x)/2; })
        .attr("y", function(d) { return (d.source.y+d.target.y)/2; });




    force.on("tick", function() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        text.attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });
        text1.attr("x", function(d) { return (d.source.x+d.target.x)/2; })
            .attr("y", function(d) { return (d.source.y+d.target.y)/2; });




    })
});
function mousemove(d){
    svg.select(".circles" + d.index)
        .attr("r",30);


}
function mouseout(d){
    svg.select(".circles" + d.index)
        .attr("r",15 )
        .style("fill", function (d) {
            return color(d.group)
        });}


function start(d){
    svg.select(".circles" + d.index)
        .style("fill", "red");
    for (var i = 0; i < dataset.links.length; ++i) {
        if (d.index == dataset.links[i].source.index || d.index == dataset.links[i].target.index ) {
            svg.selectAll(".node" + d.index)
                .style("stroke", "blue")
                .style("stroke-width",6);
            if (d.index == dataset.links[i].source.index) {
                svg.select(".circles" + dataset.links[i].target.index)
                    .style("fill", "red");

            }

            else {
                svg.select(".circles" + dataset.links[i].source.index)
                    .style("fill", "red");

            }
        }
    }
}
function end(d){
    svg.selectAll("circle")
        .style("fill", function (d) {
            return color(d.group);
        });
    svg.selectAll(".links")
        .style("stroke","#999999")
        .style("stroke-width", function(d) { return 1; });
}
