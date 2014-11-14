/*fisheye effects*/
var fisheye = d3.fisheye.circular()
    .radius(200)
    .distortion(2);
/*svg width and height*/
var width = 1200,
    height =1000

/*svg object*/
var svg = d3.select("#mysvg").append("svg")
    .attr("width", width)
    .attr("height", height);
/*d3 force object*/
var force = d3.layout.force()
    .gravity(.05)
    .distance(130)
    .charge(-100)
    .size([width, height]);
/*force drag */
var drag = force.drag()
    .on("dragstart", dragstart);
/*the json data*/
var dataset;
/*load  data*/
d3.json("data/lol.json", function(error, json) {
    /*start the force*/
    force.nodes(json.nodes)
         .links(json.links)
         .start();

    dataset = json;
    /*load link*/
    var link = svg.selectAll(".link")
        .data(json.links)
        .enter().append("line")
        .attr("class", "link")
        .attr("id",function(d){
          return d.id;
        })
        .on("mouseover",linkMouseOver);
    /*load node*/
    var node = svg.selectAll(".node")
        .data(json.nodes)
        .enter().append("g")
        .attr("class", "node")
        // .call(force.drag);      
        .on("dblclick", dblclick)
        .call(drag);
    /*load node image*/
    node.append("image")
        .attr("xlink:href", function(d){
            return d.image;
          })
        .attr("x", -8)
        .attr("y", -8)
        .attr("width", 40)
        .attr("height", 40);
    /*load node text*/
    node.append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });
    /*load node event*/
    node.on("mouseover",nodeMouseOver)
        .on("mouseout",nodeMouseOut);
    /*tick function*/
    force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    });
  /*
  svg.on("mousemove", function() {
    fisheye.focus(d3.mouse(this));
    node.each(function(d) { d.fisheye = fisheye(d); })
        .select("image")
        .attr("x", function(d) { return d.fisheye.x; })
        .attr("y", function(d) { return d.fisheye.y; })
        .attr("width", function(d) { return d.fisheye.z * 20; })
        .attr("height", function(d) { return d.fisheye.z * 20; });
        //.attr("r", function(d) { return d.fisheye.z * 4.5; });
    link.attr("x1", function(d) { return d.source.fisheye.x; })
        .attr("y1", function(d) { return d.source.fisheye.y; })
        .attr("x2", function(d) { return d.target.fisheye.x; })
        .attr("y2", function(d) { return d.target.fisheye.y; });
  });
*/

});
/*mouse over node response function*/
function nodeMouseOver(d){
        d3.select("#img1")
          .attr("src", d.image)
          .attr("width", 80)
          .attr("height", 80);
          d3.select("#img2")          
          .attr("src", d.image)
          .attr("width", 80)
          .attr("height", 80);
        
        d3.select("#title")
          .text(d.name + " " + d.title);
        d3.select("#content")
          .text(d.describe);
        d3.select(this)
          .select("image")
          .attr("width", 80)
          .attr("height", 80);
        d3.select(this)
          .select("text")
          .attr("font", "15px sans-serif");
}
/*mouse out node response function*/
function nodeMouseOut(d){
      d3.select(this)
        .select("image")
        .attr("width", 40)
        .attr("height", 40);
}
/*mouse over link response function*/
function linkMouseOver(d){
          d3.select("#title")
            .text(d.source.name + " " + d.target.name);
          d3.select("#content")
            .text(d.descripte);
          d3.select("#img1")
            .attr("src", d.source.image)
            .attr("width", 80)
            .attr("height", 80);
          d3.select("#img2")
            .attr("src", d.target.image)
            .attr("width", 80)
            .attr("height", 80);
}
/*dbclick function*/
function dblclick(d) {
  d3.select(this).classed("fixed", d.fixed = false);
  d3.select(this).select("image").attr("width", 60)
      .attr("height", 60);
  for (var i = 0; i < dataset.links.length; ++i){

    if(d.index == dataset.links[i].source.index || d.index == dataset.links[i].target.index){
        // console.log(d.index + "#" + dataset.links[i].source.index + "#" +dataset.links[i].target.index);
        var k = svg.selectAll("#"+dataset.links[i].id)
          .style("stroke" , "#ccc")
          .style("stroke-width", "3");
    }
  }
}
/*dragstart function*/
function dragstart(d) {
  d3.select(this).classed("fixed", d.fixed = true);
  d3.select(this).select("image").attr("width", 40)
      .attr("height", 40);

  for (var i = 0; i < dataset.links.length; ++i){

    if(d.index == dataset.links[i].source.index || d.index == dataset.links[i].target.index){
        // console.log(d.index + "#" + dataset.links[i].source.index + "#" +dataset.links[i].target.index);
        var k = svg.selectAll("#"+dataset.links[i].id)
          .style("stroke" , "#fff252")
          .style("stroke-width", "3");

    }
  }
}
