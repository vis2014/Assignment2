/**
 * Created by Administrator on 14-11-7.
 */
var colors=d3.scale.category20();
var w=1200;
var h=600;
var circleSize=10;
var svg=d3.select("body") .append("svg") .attr("width",w) .attr("height",h);    //设置svg
svg.displayScaleSelectionId="displayScale";
svg.displayScaleSelection="全部";
var currentDisplayScale="全部";
var img_w=40;
var img_h=53;
var tag = 0;
function refresh(){
    alert("comein");
}
d3.json("../Data/HongLouMeng.json",function(error,json){
    refresh();
    if(error){
        return console.log(error);
    }
    console.log(json);
    var force=d3.layout.force()     //转化数据为适合生成力导向图的对象数组
        .nodes(json.nodes)       //加载顶点数据
        .links(json.edges)       //加载边数据
        .size([w,h])                 //设置有效空间的大小
        .linkDistance(300)            //连线的长度
        .charge(-200)                //负电荷量，相互排斥，负值越大越排斥
        .start();                    //设置生效

    var label_text_1 = svg.append("text")
        .attr("class","labeltext")
        .attr("x",10)
        .attr("y",16)
        .text("运动状态：开始");

    var label_text_2 = svg.append("text")
        .attr("class","labeltext")
        .attr("x",10)
        .attr("y",40)
        .text("拖拽状态：结束");


//（1）创建作为连线的svg直线
    var edges=svg.selectAll("line")
        .data(json.edges)
        .enter()
        .append("line")
        .style("stroke","#7B7B7B	")
    .style("stroke-width",function(d,i){        //设置线的宽度
        return d.weight* d.weight;
    });
//创建边上的文字
    var edges_text=svg.selectAll(".linetext")
        .data(json.edges)
        .enter()
        .append("text")
        .attr("class","linetext")
        .text(function(d){return  d.relation;})

    var drag = force.drag()
        .on("dragstart",function(d,i){
            d.fixed = true;
            label_text_2.text("拖拽状态：开始");
        })
        .on("dragend",function(d,i){
            label_text_2.text("拖拽状态：结束");
        })
        .on("drag",function(d,i){
            label_text_2.text("拖拽状态：进行");
        })

//（2）创建作为连线的svg圆形
    var nodes=svg.selectAll("image")
        .data(json.nodes)
        .enter()
        .append("image")
        .attr("width",img_w)
        .attr("height",img_h)
        .attr("xlink:href",function(d){
            return d.image;

        })
        .on("mouseover",function(d,i){
            d.show = true;
        })
        .on("mouseout",function(d,i){
            d.show = false;
        })
        .call(force.drag);                            //设置为可拖动
    //添加节点文字
    var nodes_text = svg.selectAll(".nodetext")
        .data(json.nodes)
        .enter()
        .append("text")
        .attr("class","nodetext")
        .attr("dx",-20)
        .attr("dy",20)
        .text(function(d){
            return d.name;
        });

    //添加节点描述
    var nodeDesc_dx=20;
    var nodeDesc_dy=-20;

    var node_desc=svg.selectAll(".nodeDescription")
        .data(json.nodes)
        .enter()
        .append("text")
        .attr("class","nodeDescription")
        .attr("dx",nodeDesc_dx)
        .attr("dy",nodeDesc_dy)
        .text(function(d){
            return d.description;
        });
    //力学图运动结束时
    force.on("end", function(){
        label_text_1.text("运动状态：结束");
    });

    force.on("tick",function(){
        label_text_1.text("运动状态：开始");
        //更新边的位置
        edges.attr("x1",function(d){
            return  d.source.x;
        })
            .attr("y1",function(d){
                return  d.source.y;
            })
            .attr("x2",function(d){
                return  d.target.x;
            })
            .attr("y2",function(d){
                return  d.target.y;
            });
        //更新边上的关系描述
        edges_text.attr("x",function(d){return (d.source.x + d.target.x)/2;})
        edges_text.attr("y",function(d){return (d.source.y + d.target.y)/2;})
        edges_text.style("fill-opacity",function(d){
            return d.source.show || d.target.show ? 1.0 : 0.0 ;
        });


        edges.style("stroke",function(d){
                return d.source.show || d.target.show ? "#a43" :"#7B7B7B	";
            }
        );

        //更新节点的位置
        nodes.attr("x",function(d){
            return d.x-img_w/2;
        })
            .attr("y",function(d){
                return d.y-img_h/2;
            });

        //更新节点文字的位置
        nodes_text.attr("x",function(d){ return d.x });
        nodes_text.attr("y",function(d){ return d.y + img_w/2; });
        nodes_text.text(function(d){
            return d.name;
        });
        //更新结点描述的位置
        node_desc.attr("x",function(d){ return d.x });
        node_desc.attr("y",function(d){ return d.y + img_w/2; });
        node_desc.text(function(d){
            if(d.show)
                return d.description;
        });

    });
    //根据用户输入重新设置

})

function refresh(){
    var selectList=document.getElementById(svg.displayScaleSelectionId);
    var selectedValue=selectList.options[selectList.selectedIndex].getAttribute("value");
    svg.displayScaleSelection=selectedValue;
    console.log("svg.displayScaleSelection="+svg.displayScaleSelection);

}
function reload(){
    refresh();
    svg.selectAll("line")
        .style("stroke","#7B7B7B");
    var edges=svg.selectAll("line");
    var  nodes=svg.selectAll("images");
    if(currentDisplayScale!=svg.displayScaleSelection){
        currentDisplayScale=svg.displayScaleSelection;
    }
    if(currentDisplayScale=="全部")
        tag=0;
    else if(currentDisplayScale=="贾府")
        tag=1;
    else if(currentDisplayScale=="薛府")
        tag=2;
    else if(currentDisplayScale=="王府")
        tag=3;
    else if(currentDisplayScale=="史府")
        tag=4;
    else if(currentDisplayScale=="十二金钗")
        tag=5;
    svg.selectAll("line")
        .filter(function(d,i){
            console.log("tag="+tag)
            return  d.tag==tag;
        })
        .style("stroke","#a43");

}