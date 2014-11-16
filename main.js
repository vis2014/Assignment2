/**
 * Created by Administrator on 14-11-12.
 */
var width = 1200;
var height = 1200;
var img_size = 30;
var edgesCount = 15;
var edgeColorDefualt = "#aaa";

var color = d3.scale.category10();

var svg = d3.select("body").append("svg")
    .attr("width",width)
    .attr("height",height);

d3.json("data/data.json",function(error,root){

    if( error ){
        return console.log(error);
    }
    console.log(root);

    //检测是否链接到另一位诗人
    function connectTo(targetIndex,sourceIndex)
    {
        var l=edgesCount;
        var n = 0;
        while(n<l)
        {
            if(root.edges[n].target.index == targetIndex && root.edges[n].source.index == sourceIndex)
                return true;
            n++;
        }
        return false;
    }
    //检测某诗人的被提到数
    function connecttedNodesCount(meIndex)
    {
        var n=0;
        var count= 0;
        while(n<edgesCount)
        {
            if(root.edges[n].target.index == meIndex)
                count++;
            n++;
        }
        count++;
        return count;
    }

    var force = d3.layout.force()
        .nodes(root.nodes)
        .links(root.edges)
        .size([width,height])
        .linkDistance(400)
        .charge(-3000)
        .start();

    var edges_line = svg.selectAll("line")
        .data(root.edges)
        .enter()
        .append("line")
        .style("stroke",edgeColorDefualt)
        .style("stroke-width",1);

    var edges_text = svg.selectAll(".linetext")
        .data(root.edges)
        .enter()
        .append("text")
        .attr("class","linetext")
        .text(function(d){
            var temp = "";
            for(var shi in d.shige)
            {
                if(d.shige[shi] == "")continue;
                temp = temp+ d.shige[shi]+" ";
            }
            //alert(temp);
            return temp;
        });


    var nodes_img = svg.selectAll("image")
        .data(root.nodes)
        .enter()
        .append("image")
        .attr("width",function(d,i){
            return img_size*connecttedNodesCount(i);
        })
        .attr("height",function(d,i){
            return img_size*connecttedNodesCount(i);
        })
        .attr("xlink:href",function(d){
            return "data/"+d.image;
        })
        .on("mouseover",function(d,i){
            //显示连接线上的文字
            edges_text.style("fill-opacity",function(edge){
                if( edge.source === d){
                    return 1.0;
                }
            })
                .style("fill",function(edge){
                    return color(edge.target.index);
                });
            //线变色
            edges_line.style("stroke",function(edge){
                if( edge.source.index == i){
                    return color(edge.target.index);
                }
                else return edgeColorDefualt;
            });
            //图片及相关图片放大
            var currentNodeIndex = i;
            nodes_img.attr("width",function(d,i){
                if(i == currentNodeIndex || connectTo(i,currentNodeIndex))
                    return img_size*connecttedNodesCount(i)*1.3;
                else
                    return img_size*connecttedNodesCount(i);
            }).attr("height",function(d,i){
                    if(i == currentNodeIndex || connectTo(i,currentNodeIndex))
                        return img_size*connecttedNodesCount(i)*1.3;
                    else
                        return img_size*connecttedNodesCount(i);
                });
        })
        .on("mouseout",function(d,i){
            //隐去连接线上的文字
            edges_text.style("fill-opacity",function(edge){
                if( edge.source === d || edge.target === d ){
                    return 0.0;
                }
            //线颜色回复
            edges_line.style("stroke",function(edge){
                 return edgeColorDefualt;
            });
            //图片回复大小
            nodes_img.attr("width",function(d,i){
                    return img_size*connecttedNodesCount(i);
            })
            .attr("height",function(d,i){
                    return img_size*connecttedNodesCount(i);
                });
            });
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
            d.x = d.x - img_size/2 < 0     ? img_size/2 : d.x ;
            d.x = d.x + img_size/2 > width ? width - img_size/2 : d.x ;
            d.y = d.y - img_size/2 < 0      ? img_size/2 : d.y ;
            d.y = d.y + img_size/2 + text_dy > height ? height - img_size/2 - text_dy : d.y ;
        });

        //更新连接线的位置
        edges_line.attr("x1",function(d){ return d.source.x; });
        edges_line.attr("y1",function(d){ return d.source.y; });
        edges_line.attr("x2",function(d){ return d.target.x; });
        edges_line.attr("y2",function(d){ return d.target.y; });

        //更新连接线上文字的位置
        edges_text.attr("x",function(d){ return (d.source.x + d.target.x) / 2 ; });
        edges_text.attr("y",function(d){ return (d.source.y + d.target.y) / 2 ; });

        //更新结点图片和文字
        nodes_img.attr("x",function(d,i){ return d.x - img_size*connecttedNodesCount(i)/2; });
        nodes_img.attr("y",function(d,i){ return d.y - img_size*connecttedNodesCount(i)/2; });

        nodes_text.attr("x",function(d,i){ return d.x });
        nodes_text.attr("y",function(d,i){ return d.y + img_size*connecttedNodesCount(i)/2; });
    });
});