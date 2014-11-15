var width=900,height=650;
var color=d3.scale.category20();
var force=d3.layout.force().charge(-150).linkDistance(50).size([width,height]);
var svg=d3.select("body").append("svg").attr("width",width).attr("height",height);

d3.json("sushe.json",function(error,dataSet){
//	这里的dataSet.nodes和dataSetpaths分别是数据中的节点和路径数据源，我们默认为空，需要更具具体的jason数据来改。。。。具体写的时候要改一下
	force.nodes(dataSet.nodes).links(dataSet.links).start();
	
	//这里节点颜色的取值先填为d.group,当然也可以填充图片等内容，更具具体的json数据进行修改，填写半径的大小，我们默认先写15
	var node=svg.selectAll(".node").data(dataSet.nodes).enter().append("circle").attr("class","node").attr("r",15).style("fill",function(d){return color(d.group);}).call(force.drag);
	//这里的路径线条格式我们先用d.target来代替，当然，线条也可是曲线等等，这里默认为直线，具体的取值要根据json数据进行修改
	var link =svg.selectAll(".link").data(dataSet.links).enter().append("line").attr("class","link").style("stroke-width",function(d){return Math.sqrt(d.value);}).style("stroke",function(d){return color(d.value);});
	//这里的d.name是节点node里的name值，要具体看数据，如果jason数据里没有，要修改
	var text=svg.selectAll(".text").data(dataSet.nodes).enter().append("text").text(function(d){return d.name;}).style("fill",function(d){return color(d.group);}).style("font-size",function(d){return d.group;}).call(force.drag);
	
	force.on("tick",function(){
			
			link.attr("x1",function(d){return d.source.x;})
			    .attr("y1",function(d){return d.source.y;})
				.attr("x2",function(d){return d.target.x;})
				.attr("y2",function(d){return d.target.y;});
			
			node.attr("cx",function(d){return d.x;})
			    .attr("cy",function(d){return d.y;});

            text.attr("x",function(d){return d.x;})
			    .attr("y",function(d){return d.y;});
							 
			});


			
	});