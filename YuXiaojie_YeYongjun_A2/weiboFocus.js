
			//Width and height
			var w = 1500;
			var h = 750;
			
						//Create SVG element
			var svg = d3.select("body")
						.append("svg")
						.attr("width", w)
						.attr("height", h);

			
						//Load in GeoJSON data
			d3.json("data/weiboFocus_50.json", function(json) {
			console.log(json);
			console.log(json.nodes);
			console.log(json.edges);
				
				//Initialize a default force layout, using the nodes and edges in json
			var force = d3.layout.force()
								 .nodes(json.nodes)
								 .links(json.edges)
								 .size([w, h])
								 .linkDistance([60])//[50]
								 .charge([-50])
								 .start();

			var colors = d3.scale.category10();


			
			//Create edges as lines
			var edges = svg.selectAll("line")
				.data(json.edges)
				.enter()
				.append("line")
				.style("stroke", "#00FF00")
				.style("stroke-width",1);
			
			//Create nodes as circles
			var nodes = svg.selectAll("circle")
				.data(json.nodes)
				.enter()
				.append("circle")
				.attr("r", 4)
				.style("fill", function(d, i) {
					return colors(i);
				})
				.call(force.drag)
				.on("mouseover",function(d){
				svg.append("text")
				.attr("id","tooltip")//设置id便于移除提示
				.attr("x",d.x)
				.attr("y",d.y)
				.attr("text-anchor","middle")
				.attr("font-family","sans-setif")
				.attr("font-size","14px")
				.attr("font-weight","bold")
				.attr("fill","black")
				.text("ID:"+d.id);
				})
				.on("mouseout",function(){
				d3.select("#tooltip").remove();//ID 选择的语法："#tooltip"
				})
				
			
			//Every time the simulation "ticks", this will be called
			force.on("tick", function() {

				edges.attr("x1", function(d) { return d.source.x; })
					 .attr("y1", function(d) { return d.source.y; })
					 .attr("x2", function(d) { return d.target.x; })
					 .attr("y2", function(d) { return d.target.y; });
			
				nodes.attr("cx", function(d) { return d.x; })
					 .attr("cy", function(d) { return d.y; });
	
			});

		
			});