var h=500;
var w=960;
// 颜色函数
var colors=d3.scale.category20()//创建序数比例尺和包括20中颜色的输出范围
//(1)定义节点和联系对象数组
		var dataset={
nodes:[//节点
		{ name:"zmx",number: "138xxxx878"},
		{ name:"lihuaping",number: "138xxxx878"},
		{ name:"songshide",number: "138xxxx878"},
		{ name:"wangjiawei",number: "138xxxx878"},
		{ name:"zhangdacheng",number: "138xxxx878"},
		{ name:"liping",number: "138xxxx878"},
		{ name:"wanghua",number: "138xxxx878"},
		{ name:"wnaghuijun",number: "138xxxx878"},
		{ name:"sunlin",number: "138xxxx878"},
		{ name:"cuijinfeng",number: "138xxxx878"}, 
		{ name:"luxiaobei",number: "138xxxx878"},
		{ name:"zhouyoucun",number: "138xxxx878"},
		{ name:"zongqingjie",number: "138xxxx878"},
		{ name:"zhouzhigang",number: "138xxxx878"},
		{ name:"zhouyouping",number: "138xxxx878"},
		{ name:"wangyong",number: "138xxxx878"},
		{ name:"dennchangsheng",number: "138xxxx878"},
		{ name:"haoli",number: "138xxxx878"},
		{ name:"zhanghe",number: "138xxxx878"},
		{ name:"zhenhan",number: "138xxxx878"}
	],
edges:[//边
		{ source:0,target:1,weight:20,color:1},
		{ source:0,target:2,weight:3,color:1},
		{ source:0,target:3,weight:4,color:1},
		{ source:0,target:4,weight:6,color:200},
		{ source:0,target:5,weight:3,color:200},
		{ source:0,target:6,weight:3,color:600},
		{ source:0,target:7,weight:3,color:600},
		{ source:0,target:8,weight:3,color:600},
		{ source:0,target:9,weight:2,color:600},
		{ source:0,target:10,weight:3,color:400},
		{ source:0,target:11,weight:4,color:400},
		{ source:0,target:12,weight:4,color:400},
		{ source:0,target:13,weight:5,color:400},
		{ source:0,target:14,weight:10,color:400},
		{ source:0,target:15,weight:10,color:400},
		{ source:0,target:16,weight:10,color:400},
		{ source:0,target:17,weight:6,color:400},
		{ source:0,target:18,weight:4,color:400},
		{ source:0,target:19,weight:2,color:400},
		//{ source:1,target:1,weight:3,color:76}
		//{ source:2,target:5,weight:8,color:879},
		//{ source:1,target:2,weight:3,color:989}
		{ source:2,target:3,weight:8,color:1},
		{ source:1,target:3,weight:10,color:1},
		{ source:4,target:5,weight:9,color:200},
		//{ source:5,target:8,weight:1,color:989},
		//{ source:5,target:9,weight:3,color:"black"}, 
		{ source:6,target:7,weight:10,color:600},
		{ source:7,target:8,weight:1,color:600},
		{ source:6,target:8,weight:6,color:600},
		{ source:8,target:9,weight:4,color:600},
		{ source:10,target:12,weight:5,color:400},
		{ source:10,target:13,weight:8,color:400},
		{ source:10,target:15,weight:6,color:400},
		{ source:10,target:16,weight:4,color:400},
		{ source:10,target:19,weight:5,color:400},
		{ source:11,target:12,weight:3,color:400},
		{ source:11,target:16,weight:9,color:400},
		{ source:13,target:14,weight:5,color:400},
		{ source:13,target:16,weight:3,color:400},
		{ source:13,target:19,weight:10,color:400},
		{ source:13,target:17,weight:5,color:400},
		{ source:17,target:18,weight:8,color:400}
		
		
		
	]
};
		//(2)转化数据为适合生成力导向图的对象数组
	var force=d3.layout.force()
			    .nodes(dataset.nodes)//加载节点数据
				.links(dataset.edges)//加载边数据
				.size([w,h])//设置有效空间的大小
				.linkDistance(60)//连线的长度
				.charge(-1000)//负电荷量，相互排斥设置的负值越大越排斥
				.start();//设置生效
	var svg=d3.select("body")
			.append("svg")
			.attr("width",w)
			.attr("height",h);
//(3)创建作为连线的svg直线
var edges=svg.selectAll("line")
            .data(force.links())
			.enter()
			.append("line")
			.style("stroke",function(d){//	设置线的颜色
						    return colors(d.color);
						})
			.style("stroke-width",function(d,i){//设置线的宽度
								return d.weight;
						});
//(4) 创建作为连线的svg圆形
var nodes=svg.selectAll("circle")
			.data(force.nodes())
			.enter()
			.append("g")
			.attr("class", "nodes")
			.on("mouseover", mouseover)
		    .on("mouseout", mouseout)
			.on("mousedown",mousedown)
			.call(force.drag);//可以拖动
			
			
			
		nodes.append("circle")
			.attr("r",function(d){//设置圆点的半径，圆点的度越大weight属性值越大，可以对其做一点数学变换
									return Math.log(d.weight)*10;
								})
			.style("fill",function(d){
										return colors(d.weight*d.weight*d.weight);
								});
	
    nodes.append("text")  
        .text(function(d) {  return d.name;}) 			      
        .attr("text-anchor", "middle")  
        .attr("x", 12)
        .attr("dy", ".35em")
        .attr("font-family", "sans-serif")  
        .attr("font-size", "11px")  
        .attr("fill", "black");
		
	

		
		
function mouseover() {
    d3.select(this).select("circle").transition()
    .duration(750)
    .attr("r", function(d){  //设置圆点半径                      
							return Math.log(d.weight)*10+10;                          
						}); 
        
}

function mouseout() {
    d3.select(this).select("circle").transition()
    .duration(750)
    .attr("r", function(d){  //恢复圆点半径                      
							return Math.log(d.weight)*10;                          
							})
	d3.select(this).select("text")
	.text(function(d) {  return d.name;});
}
function mousedown(){
    d3.select(this).select("text")
	//.transition()
	//.duration(750)
	//.append("text")
	.text(function(d) {  return d.number;}) 			      
        //.attr("text-anchor", "middle")  
        //.attr("x", 12)
        //.attr("dy", ".35em")
        //.attr("font-family", "sans-serif")  
        //.attr("font-size", "11px")  
       // .attr("fill", "red");
}
 //(5)打点更新，没有的话就显示不出来了
force.on("tick",function(){
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
//(6)设置节点坐标，节点先生成再确定坐标的
    nodes
	/*.attr("cx",function(d){//节点有坐标属性
								return d.x;
							})
			.attr("cy",function(d){
							return d.y;
							});*/
			.attr("transform", function(d) { 
      		return "translate(" + d.x + "," + d.y + ")"; 
      });
	})