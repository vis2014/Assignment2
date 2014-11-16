var width = 800;
var height = 600;
var img_w = 80;
var img_h = 80;

var svg = d3.select("#content").append("svg")
    .attr("width", width)
    .attr("height", height);


svg.dataSet = "data";
svg.picStyle = "circle";
svg.netStyle = "force";
svg.picStyleSelectionId = "picStyle";
svg.netStyleSelectionId = "netStyle";

d3.json("Data/" + svg.dataSet + ".json", function (error, json) {
    refresh();
    var force = d3.layout.force()
        .nodes(json.nodes)
        .links(json.edges)
        .size([width, height])
        .linkDistance(300)
        .charge(-150)
        .start();

    var edges_line = svg.selectAll("line")
        .data(json.edges)
        .enter()
        .append("line")
        .style("stroke", "#ccc")
        .style("stroke-width", 1);

    var edges_text = svg.selectAll(".linetext")
        .data(json.edges)
        .enter()
        .append("text")
        .attr("class", "linetext")
        .text(function (d) {
            return d.relation;
        });


    var nodes_img = svg.selectAll("image")
        .data(json.nodes)
        .enter()
        .append("image")
        .attr("width", img_w)
        .attr("height", img_h)
        .attr("xlink:href", function (d) {
            return d.image + ".jpg";
        })
        .on("mouseover", function (d, i) {
            d.show = true;
            d3.select("#tooltip")
                .select("#value")
                .text(d.description);
        })
        .on("mouseout", function (d, i) {
            d.show = false;

        })
        .call(force.drag);


    var text_dx = -20;
    var text_dy = 20;

    var nodes_text = svg.selectAll(".nodetext")
        .data(json.nodes)
        .enter()
        .append("text")
        .attr("class", "nodetext")
        .attr("dx", text_dx)
        .attr("dy", text_dy)
        .text(function (d) {
            return d.name;
        });

    force.on("tick", function () {
        json.nodes.forEach(function (d, i) {
            d.x = d.x - img_w / 2 < 0 ? img_w / 2 : d.x;
            d.x = d.x + img_w / 2 > width ? width - img_w / 2 : d.x;
            d.y = d.y - img_h / 2 < 0 ? img_h / 2 : d.y;
            d.y = d.y + img_h / 2 + text_dy > height ? height - img_h / 2 - text_dy : d.y;
        });

        edges_line.attr("x1", function (d) {
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
            .style("stroke", function (d) {
                if (d.source.show || d.target.show)
                    return "#00bbbb";
                else
                    return "#ccc";
            })
            .style("stroke-width", function (d) {
                if (d.source.show || d.target.show)
                    return 4;
                else
                    return 1;
            });
        edges_text.attr("x", function (d) {
            return (d.source.x + d.target.x) / 2;
        });
        edges_text.attr("y", function (d) {
            return (d.source.y + d.target.y) / 2;
        });

        edges_text.style("fill-opacity", function (d) {
            return d.source.show || d.target.show ? 1.0 : 0.0;//如果鼠标在边的起始节点或者终点，则绘制这条边
        });

        nodes_img.attr("x", function (d) {
            return d.x - img_w / 2;
        });
        nodes_img.attr("y", function (d) {
            return d.y - img_h / 2;
        });

        nodes_text.attr("x", function (d) {
            return d.x
        });
        nodes_text.attr("y", function (d) {
            return d.y + img_w / 2;
        });
        nodes_text.text(function (d) {
            return d.name;
        });
    });
});

function refresh() {
    svg.picStyle = document.getElementById(svg.picStyleSelectionId);
    svg.netStyle = document.getElementById(svg.netStyleSelectionId);
}

function reload() {
    refresh();
    if (svg.picStyle.value == "type2") {
        svg.selectAll("image")
            .attr("xlink:href", function (d) {
                return d.image  + ".png";
            })
    }
    if (svg.picStyle.value == "type1") {
        svg.selectAll("image")
            .attr("xlink:href", function (d) {
                return d.image + ".jpg";
            })
    }
}
