/**
 * Created by yzhang on 14-11-15.
 */
var width  = 1366;
var height = 768;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(0,0)")


var projection = d3.geo.mercator()
    .center([107, 31])
    .scale(600)
    .translate([width/2, height/2]);

var path = d3.geo.path()
    .projection(projection);

var force = d3.layout.force().size([width, height]);

var color = d3.scale.category20();


d3.json("city.json", function(error, root) {

    if (error)
        return console.error(error);
    console.log(root.features)

    var nodes = [];
    var links = [];

    root.features.forEach(function(d, i) {
        var centroid = path.centroid(d);
        centroid.x = centroid[0];
        centroid.y = centroid[1];
        centroid.feature = d;
        nodes.push(centroid);

    });

    var triangles = d3.geom.voronoi().triangles(nodes);

    triangles.forEach(function(d,i){
        links.push( edge( d[0] , d[1] ) );
        links.push( edge( d[1] , d[2] ) );
        links.push( edge( d[2] , d[0] ) );
    });

    console.log(nodes);
    console.log(links);

    force.gravity(0)
        .charge(0)
        .nodes(nodes)
        .links(links)
        .linkDistance(function(d){ return d.distance; })
        .start();

    var node = svg.selectAll("g")
        .data(nodes)
        .enter().append("g")
        .attr("transform", function(d) { return "translate(" + -d.x + "," + -d.y + ")"; })
        .call(force.drag)
        .append("path")
        .attr("class","node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .attr("fill", function(d,i){
            return color(i);
        })
        .attr("d", function(d){
            return path(d.feature);
        } )

        .on("mouseover",function(d,i){
            d3.select(this)
                .attr("fill","yellow")
        })
        .on("mouseout",function(d,i){
            d3.select(this)
                .attr("fill",color(i));
        });


    var link = svg.selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("class","link")
        .attr("x1",function(d) { return d.source.x; } )
        .attr("y1",function(d) { return d.source.y; } )
        .attr("x2",function(d) { return d.target.x; } )
        .attr("y2",function(d) { return d.target.y; } );


    force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
});
});

function edge(a, b) {
    var dx = a[0] - b[0], dy = a[1] - b[1];
    return {
        source: a,
        target: b,
        distance: Math.sqrt(dx * dx + dy * dy)
    };
}
function lockmap(){
    force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });


        node.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
    })
    alert("Lock map successfully!");

}
