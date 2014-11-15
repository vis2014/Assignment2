var width = 1200, height = 1500;

var color = d3.scale.category20();

var force = d3.layout.force().charge(-120).linkDistance(30).size([ width/2, height/2 ]);

var svg = d3.select("#chart").append("svg").attr("width", width).attr("height",height);
svg.nodeFillColorSelectionId = "nodeFillColor";
svg.nodeHoverTitleSelectionId = "nodeHoverTitle";
svg.nodeSizeSelectionId = "nodeSize";


svg.nodeFillColorDim = "";
svg.nodeHoverTitleDims = [];
svg.nodeSize = 5;
svg.nodeShapeSVG = "circle";

svg.dataSet = "artists";

var current_network_data = null;

d3.json("" + svg.dataSet + ".json",
    function (json) {

        current_network_data = json;

        initNetworkSetting(json);
        force.nodes(json.nodes).links(json.edges).start();

        var edge = svg.selectAll("line.edge").data(json.edges).enter().append(
                "line").attr("class", "edge");

        var node = svg.selectAll(svg.nodeShapeSVG + ".node").data(json.nodes).enter().append(
                svg.nodeShapeSVG).attr("class", "node").style("fill",
            function (d) {
                return color(d[svg.nodeFillColorDim]);
            })
            .attr('id', function (d) {
                return "c" + d.id;
            }).call(force.drag);

        node.append("title").text(function (d) {
            var title = "";
            if (svg.nodeHoverTitleDims.length > 0) {
                title = d[svg.nodeHoverTitleDims[0]];
            }

            for (var i = 1; i < svg.nodeHoverTitleDims.length; i++) {
                title += "," + d[svg.nodeHoverTitleDims[i]];
            }
            return title;
        });

        force.on("tick", function () {
            edge.attr("x1",function (d) {
                return d.source.x;
            }).attr("y1",function (d) {
                    return d.source.y;
                }).attr("x2",function (d) {
                    return d.target.x;
                }).attr("y2", function (d) {
                    return d.target.y;
                });

            node.attr("r", svg.nodeSize)
                .attr("cx",function (d) {
                    return d.x;
                }).attr("cy", function (d) {
                    return d.y;
                });
        });
    });


function initNetworkSetting(json) {
    var edgeSchemas = json._schemas.edges;
    var nodeSchemas = json._schemas.nodes;

    var selectList = document.getElementById(svg.nodeFillColorSelectionId);

    for (var key in nodeSchemas) {
        var schema = nodeSchemas[key];
        if (schema.type == "int" || schema.type == "float" || schema.type == "double" || schema.type == "long" || schema.type == "string") {
            var newOption = document.createElement("option");
            newOption.appendChild(document.createTextNode(schema.name));
            newOption.setAttribute("value", schema.name);
            selectList.appendChild(newOption);
        }
    }

    selectList = document.getElementById(svg.nodeHoverTitleSelectionId);

    for (var key in nodeSchemas) {
        var schema = nodeSchemas[key];
        if (schema.type == "int" || schema.type == "float" || schema.type == "double" || schema.type == "long" || schema.type == "string") {
            var newOption = document.createElement("option");
            newOption.appendChild(document.createTextNode(schema.name));
            newOption.setAttribute("value", schema.name);
            selectList.appendChild(newOption);
        }
    }

    refreshNetworkSettings();
}

function refreshNetworkSettings() {
    var selectList = document.getElementById(svg.nodeSizeSelectionId);
    selectedValue = selectList.options[selectList.selectedIndex].getAttribute("value");

    svg.nodeSize = selectedValue;

    selectList = document.getElementById(svg.nodeFillColorSelectionId);
    selectedValue = selectList.options[selectList.selectedIndex].getAttribute("value");

    svg.nodeFillColorDim = selectedValue;

    selectList = document.getElementById(svg.nodeHoverTitleSelectionId);
    selectedValue = selectList.options[selectList.selectedIndex].getAttribute("value");

    svg.nodeHoverTitleDims = [];
    svg.nodeHoverTitleDims.push(selectedValue);
}

function reloadNetwork() {

    var json = current_network_data;
    var edge = svg.selectAll("line.edge");

    var node = svg.selectAll(".node");
    node.style("fill",
        function (d) {
            return color(d[svg.nodeFillColorDim]);
        });

    node.selectAll("title").text(function (d) {
        var title = "";
        if (svg.nodeHoverTitleDims.length > 0) {
            title = d[svg.nodeHoverTitleDims[0]];
        }

        for (var i = 1; i < svg.nodeHoverTitleDims.length; i++) {
            title += "," + d[svg.nodeHoverTitleDims[i]];
        }
        return title;
    });
    node.attr("r", svg.nodeSize);
    force.on("tick", function () {

        edge.attr("x1",function (d) {
            return d.source.x;
        }).attr("y1",function (d) {
                return d.source.y;
            }).attr("x2",function (d) {
                return d.target.x;
            }).attr("y2", function (d) {
                return d.target.y;
            });

        node.attr("cx",function (d) {
            return d.x;
        }).attr("cy", function (d) {
                return d.y;
            });
    });

}
