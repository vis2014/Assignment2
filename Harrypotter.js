/**
 * Created by Administrator on 2014/11/15.
 */
/**
 * Created by Shikai on 14-10-27.
 */
//定义图像的和网页的相关属性
var width = 900;
var height = 600;
var img_w = 90;
var img_h = 120;

//定义SVG
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

//定义SVG相关属性
svg.dataSet = "Harrypotter";//定义数据集
svg.picStyle = "circle";//定义图片展示样式
svg.netStyle = "force";//定义网络展示样式
//绑定前台的selection。
svg.picStyleSelectionId = "picStyle";
svg.netStyleSelectionId = "netStyle";

d3.json("data/" + svg.dataSet + ".json", function (error, json) {
    refresh();
    var force = d3.layout.force()
        .nodes(json.nodes)
        .links(json.edges)
        .size([width, height])
        .linkDistance(450)
        .charge(-225)
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

//
//    var nodes = {};
//
//    //(2)从链接中分离出不同的节点
//    //一个小问题：节点的weight属性怎么产生的？
//    links.forEach(function(link) {  //思路就是：在连接中遍历链接，节点数组有了这个链接的源节点就把链接指向这个节点。没有的话把链接上的节点加到链接数组指定名称name属性，并把链接指向这个节点
//        console.log(nodes);
//        link.source = nodes[link.source] //link.sourc就是节点值比如Apple
//        || (nodes[link.source] = {name: link.source});//(填加节点数据)
//
//        link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
//    });
//
//    var width = 960,
//        height = 500;
//
//    var force = d3.layout.force()
//        .nodes(d3.values(nodes))
//        .links(links)
//        .size([width, height])
//        .linkDistance(60)
//        .charge(-300)
//        .on("tick", tick)
//        .start();
//
//    var svg = d3.select("body").append("svg")
//        .attr("width", width)
//        .attr("height", height);
//    //(3)为链接添加线
//    var link = svg.selectAll(".link")
//        .data(force.links())
//        .enter().append("line")
//        .attr("class", "link");
//
//    var colors=d3.scale.category20();
//
//    link.style("stroke",function(d){//  设置线的颜色
//        return colors(d.color);
//    })
//        .style("stroke-width",function(d,i){//设置线的宽度
//            return d.weight;
//        });
//    //(4)为链接添加节点
//    var node = svg.selectAll(".node")
//        .data(force.nodes())
//        .enter().append("g")
//        .attr("class", "node")
//        .on("mouseover", mouseover)
//        .on("mouseout", mouseout)
//        .call(force.drag);
//
//
//    //设置圆点的半径，圆点的度越大weight属性值越大，可以对其做一点数学变换
//    function  radius (d){
//        if(!d.weight){//节点weight属性没有值初始化为1（一般就是叶子了）
//            d.weight=1;
//        }
//        return Math.log(d.weight)*10;
//    }
//    node.append("circle")
//        .attr("r",function(d){  //设置圆点半径
//            return radius (d);
//        })
//        .style("fill",function(d){ //设置圆点的颜色
//            return colors(d.weight*d.weight*d.weight);
//        }) ;
//
//    node.append("text")
//        .attr("x", 12)
//        .attr("dy", ".35em")
//        .text(function(d) { return d.name; });
//
//    function tick() {//打点更新坐标
//        link
//            .attr("x1", function(d) { return d.source.x; })
//            .attr("y1", function(d) { return d.source.y; })
//            .attr("x2", function(d) { return d.target.x; })
//            .attr("y2", function(d) { return d.target.y; });
//
//        node
//            .attr("transform", function(d) {
//                return "translate(" + d.x + "," + d.y + ")";
//            });
//    }
//
//    function mouseover() {
//        d3.select(this).select("circle").transition()
//            .duration(750)
//            .attr("r", function(d){  //设置圆点半径
//                return radius (d)+10;
//            }) ;
//    }
//
//    function mouseout() {
//        d3.select(this).select("circle").transition()
//            .duration(750)
//            .attr("r", function(d){  //恢复圆点半径
//                return radius (d);
//            }) ;
//    }
//}


    var nodes_img = svg.selectAll("image")
        .data(json.nodes)
        .enter()
        .append("image")
        .attr("width", img_w)
        .attr("height", img_h)
        .attr("xlink:href", function (d) {
            return d.image + ".png";
        })
        .on("mouseover", function (d, i) {
            d.show = true;
            //取得条形的x/y的值，增大后作为提示条的坐标
            var xPosition=parseFloat(d3.select(this).attr("x"))+img_w;
            var yPosition=parseFloat(d3.select(this).attr("y"))-img_h;

            //更新提示条的位置和值
            d3.select("#tooltip")
                .style("left",xPosition+"px")
                .style("top",yPosition+"px")
                .select("#value")
                .text(d.description);

            //显示提示条
            d3.select("#tooltip").classed("hidden",false);
        })
        .on("mouseout", function (d, i) {
            d.show = false;
            //影藏提示条
            d3.select("#tooltip").classed("hidden",true);

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

        //限制结点的边界
        json.nodes.forEach(function (d, i) {
            d.x = d.x - img_w / 2 < 0 ? img_w / 2 : d.x;
            d.x = d.x + img_w / 2 > width ? width - img_w / 2 : d.x;
            d.y = d.y - img_h / 2 < 0 ? img_h / 2 : d.y;
            d.y = d.y + img_h / 2 + text_dy > height ? height - img_h / 2 - text_dy : d.y;
        });

//更新连接线的位置
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
//更新连接线上文字的位置
        edges_text.attr("x", function (d) {
            return (d.source.x + d.target.x) / 2;
        });
        edges_text.attr("y", function (d) {
            return (d.source.y + d.target.y) / 2;
        });

//是否绘制连接线上的文字
        edges_text.style("fill-opacity", function (d) {
            return d.source.show || d.target.show ? 1.0 : 0.0;//如果鼠标在边的起始节点或者终点，则绘制这条边
        });

//更新结点图片和文字
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
    //获取前台的选项,并设置值
    svg.picStyle = document.getElementById(svg.picStyleSelectionId);
    svg.netStyle = document.getElementById(svg.netStyleSelectionId);
}

function reload() {
    refresh();
    //更新节点的图片
    if (svg.picStyle.value == "cartoon") {
        svg.selectAll("image")
            .attr("xlink:href", function (d) {
                return d.image + "c" + ".png";
            })
    }
    if (svg.picStyle.value == "rectangle") {
        svg.selectAll("image")
            .attr("xlink:href", function (d) {
                return d.image + ".png";
            })
    }


    //if (svg.picStyle.value == "circle") {
    //    //svg.selectAll("image")
    //    //    .attr("xlink:href", function (d) {
    //    //        return d.image + ".png";
    //    //    })
    //
    //
    //}

}
