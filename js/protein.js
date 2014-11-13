
//Width and height
var w = 1300;
var h = 800;

//Initialize a default force layout, using the nodes and edges in dataset
var dataset;
d3.json("json/protein.json", function (error, data) {
    if (error) return console.warn(error);
    dataset = data;

    var force = d3.layout.force()
        .nodes(dataset.nodes)
        .links(dataset.edges)
        .size([w, h])
        .linkDistance([150])
        .charge([-10])
        .start();

    var colors = d3.scale.category10();

    //Create SVG element
    var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .style("fill", "#black");

    //Create edges as lines
    var edges = svg.selectAll("line")
        .data(dataset.edges)
        .enter()
        .append("line")
        .style("stroke", "#003366")
        .style("stroke-width", 1);

    //Create nodes as circles
    var nodes = svg.selectAll("circle")
        .data(dataset.nodes)
        .enter()
        .append("circle")
        .attr("r", function (d) {
            return d.count ;
        })
        .style("fill", function (d, i) {
            return colors(i);
        })
        .on("mouseover", function (d) {
            highlight(d, this);
        })
        .on("mouseout", function (d, i) {
            recovery();
            d3.select(this).style("fill", colors(i))
        })
        .call(force.drag);

    nodes.attr("class", function (d) {
        return "circles" + " cid" + d.index;
    });
    nodes.append("title").text(function (d) {
        return dataset.nodes[d.index].id;
    });
    function highlight(d, node) {
        var index = d.index;
        d3.select(node).style("fill", "#FFFF00");
        for (var m = 0; m < dataset.edges.length; m++) {
            if (dataset.edges[m].source.index == index || dataset.edges[m].target.index == index) {
                svg.selectAll(".eid" + index).style("stroke", "#FFFFCC")
                    .style("stroke-width", 2);
                if (dataset.edges[m].source.index == index) {
                    svg.select(".cid" + dataset.edges[m].target.index).style("fill", "#FFFF00");
                }
                else {
                    svg.select(".cid" + dataset.edges[m].source.index).style("fill", "#FFFF00");
                }
            }
        }
    }

    function recovery() {
        svg.selectAll("line")
            .style("stroke", "#003366")
            .style("stroke-width", 1);
        svg.selectAll("circle")
            .style("fill", function (d, i) {
                return colors(i);
            })
    }

    force.on("tick", function () {
        edges.attr("x1", function (d) {
            return d.source.x;
        })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            })
            .attr("class", function (d) {
                return  "links" + " eid" + d.source.index + " eid" + d.target.index
            });
        nodes.attr("cx", function (d) {
            return d.x;
        })
            .attr("cy", function (d) {
                return d.y;
            });
    })

});