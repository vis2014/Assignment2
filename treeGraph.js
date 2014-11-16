var w = 800;
var h = 600;
var img_w = 80;
var img_h = 80;
var tree = d3.layout.tree()
    .size([w-img_w,h-img_h])
    .separation(function(a,b) { return a.parent == b.parent ? 1 : 2;});


var svg = d3.select("#content").append("svg")
    .attr("width", w)
    .attr("height", h)
    .append("g");


d3.json("Data/data2.json", function(error, json) {


    var nodes = tree.nodes(json);


    var links = tree.links(nodes);

    console.log(links);

    var link=svg.selectAll(".link")
        .data(links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d",d3.svg.diagonal());


    var node = svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append("g");
    var img_dx=-30;
    var img_dy=-40;

    node
        .append("image")
        .attr("width",img_w)
        .attr("height",img_h)
        .attr("dx",img_dx)
        .attr("dy",img_dy)
        .attr("xlink:href",function(d){
            return d.image+".jpg";
        })
        .attr("class", "node")
        .attr("transform", function(d){ return "translate("+(d.x-img_w/2)+"," + (d.y-img_h/2) + ")";})
        .on("mouseover",function(d){


            d3.select("#tooltip")
                .select("#value")
                .text(d.description);

        })
        .on("mouseout",function(d,i){
        });

    var text_dx = -20;
    var text_dy = 20;
    node.append("text")
        .attr("class","nodetext")
        .attr("dx",text_dx)
        .attr("dy",text_dy)
        .text(function(d){
            return d.name;
        })
        .attr("transform", function(d){ return "translate("+(d.x-img_w/4)+"," + (d.y+img_h/2) + ")";});
});