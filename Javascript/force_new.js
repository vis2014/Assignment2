/**
 * Created by Jzk on 2014/11/3.
 */


var width = 800;
var height = 600;
var img_w = 50;
var img_h = 50;

var colors = d3.scale.category10();


var svg = d3.select("body").append("svg")
    .attr("width",width)
    .attr("height",height);



d3.json("json/relationship.json",function(error,root){ //加载json数据并在加载数据之后进行作图

    if( error ){
        return console.log(error);
    }
    console.log(root);

    var force = d3.layout.force()               //加载数据并且进行force图生成
        .nodes(root.nodes)
        .links(root.edges)
        .size([width,height])
        .linkDistance(100)
        .charge(-600)
        .start();

    var edges_line = svg.selectAll("line")
        .data(root.edges)
        .enter()
        .append("line")
//            .style("stroke","blue")
        .style("stroke",function(d,i){
                if(d.relation=="恋人")
                return "#58c5c7";
                if(d.relation=="敌对")
                return "red";
                if(d.relation=="主仆")
                return "#4d4dff";
                if(d.relation=="同盟")
                return "#00aeef";
                if(d.relation=="兄弟")
                return "#6dcff6";
                if(d.relation=="师徒")
                return "#0000FF";
            })
        .style("stroke-width",2)
        ;

    var edges_text = svg.selectAll(".linetext")
        .data(root.edges)
        .enter()
        .append("text")
        .attr("class","linetext")
        .text(function(d){
            return d.relation;
        });


    var nodes_img = svg.selectAll("image")
        .data(root.nodes)
        .enter()
        .append("image")
        .attr("width",img_w)
        .attr("height",img_h)
        .attr("xlink:href",function(d){
            return "images/"+d.image;
        })
        .on("mouseover", function(d,i) {

            d.show = true;

            //Get this bar's x/y values, then augment for the tooltip
//            var xPosition = parseFloat(d3.select(this).attr("x")) ;
//            var yPosition = parseFloat(d3.select(this).attr("y")) ;

            //Update the tooltip position and value
            d3.select("#tooltip")
                .style("left",  "800px")
                .style("top",   "50px")
//                .style("left", xPosition + "px")
//                .style("top", yPosition + "px")

                .select("#value")
                .text(d.explanation);

            d3.select("#tooltip")
                .select("#intro")
                .text(d.name+":");

            d3.select("#placeholder")
                .attr("src", "images/"+d.image);



            //Show the tooltip
            d3.select("#tooltip").classed("hidden", false);




        })
        .on("mouseout",function(d,i){
            d.show = false;
            d3.select("#tooltip").classed("hidden", true);
        })
        .call(force.drag);

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


    force.on("tick", function(){

        //限制结点的边界
        root.nodes.forEach(function(d,i){
            d.x = d.x - img_w/2 < 0     ? img_w/2 : d.x ;
            d.x = d.x + img_w/2 > width ? width - img_w/2 : d.x ;
            d.y = d.y - img_h/2 < 0      ? img_h/2 : d.y ;
            d.y = d.y + img_h/2 + text_dy > height ? height - img_h/2 - text_dy : d.y ;
        });

        //更新连接线的位置
        edges_line.attr("x1",function(d){ return d.source.x; });
        edges_line.attr("y1",function(d){ return d.source.y; });
        edges_line.attr("x2",function(d){ return d.target.x; });
        edges_line.attr("y2",function(d){ return d.target.y; })
        edges_line.style("stroke-width", function (d) {
                if (d.source.show || d.target.show)
                    return 5;
                else
                    return 1;
            })
            .style("opacity",function(d){
                if (d.source.show || d.target.show)
                    return 1;
                else
                    return 0.5;
            });

        //更新连接线上文字的位置
        edges_text.attr("x",function(d){ return (d.source.x + d.target.x) / 2 ; });
        edges_text.attr("y",function(d){ return (d.source.y + d.target.y) / 2 ; });

        //是否绘制连接线上的文字
        edges_text.style("fill-opacity",function(d){
            return d.source.show || d.target.show ? 1.0 : 0.0 ;
        });

        //更新结点图片和文字
        nodes_img.attr("x",function(d){ return d.x - img_w/2; });
        nodes_img.attr("y",function(d){ return d.y - img_h/2; });

        nodes_text.attr("x",function(d){ return d.x });
        nodes_text.attr("y",function(d){ return d.y + img_w/2; });
    });
});


//on click,此时仅仅显示点击的图片nodes_img,图片的介绍nodes_text，点击图片相连的边edges_line，相连边上的相互关系edges_text
//故应该设置四个量的"fill-opacity"值，设置为0时不显示，为1时显示。
//