/**
 * @name    core.js
 * @author  OshynSong
 */

EgoNetworks = function (ele){
	typeof(ele)=='string' && (ele=document.getElementById(ele));
    var w = ele.clientWidth,
        h = ele.clientHeight,
        self = this;
    this.force = d3.layout.force().gravity(.08).charge(-300).size([w, h]);
    this.nodes = this.force.nodes();
    this.links = this.force.links();
    this.clickFn = function(){};
    this.vis = d3.select(ele).append("svg:svg")
                 .attr("width", w).attr("height", h).attr("pointer-events", "all");

    this.force.on("tick", function(x) {
      self.vis.selectAll("g.node")
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

      self.vis.selectAll("line.link")
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
    });
}

EgoNetworks.prototype.doZoom = function(){
	d3.select(this).select("g").attr("transform","translate(" + d3.event.translate + ")"+ " scale(" + d3.event.scale + ")");
}

EgoNetworks.prototype.addNode = function(node){
	this.nodes.push(node);
}
EgoNetworks.prototype.addNodes = function(nodes){
	if (Object.prototype.toString.call(nodes)=='[object Array]' ){
        var self = this;
        nodes.forEach(function(node){
            self.addNode(node);
        });
    }
}

EgoNetworks.prototype.addLink = function(source,target){
	this.links.push({source:this.findNode(source),target:this.findNode(target)});
}
EgoNetworks.prototype.addLinks=function(links){
    if (Object.prototype.toString.call(links)=='[object Array]' ){
        var self=this;
        links.forEach(function(link){
            self.addLink(link['source'],link['target']);
        });
    }
}

EgoNetworks.prototype.removeNode=function(id){
    var i=0,
        n=this.findNode(id),
        links=this.links;
    while ( i < links.length){
        links[i]['source']==n || links[i]['target'] ==n ? links.splice(i,1) : ++i;
    }
    this.nodes.splice(this.findNodeIndex(id),1);
}

EgoNetworks.prototype.removeChildNodes=function(id){
    var node=this.findNode(id),
        nodes=this.nodes;
        links=this.links,
        self=this;

    var linksToDelete=[],
        childNodes=[];
    
    links.forEach(function(link,index){
        link['source']==node 
            && linksToDelete.push(index) 
            && childNodes.push(link['target']);
    });

    linksToDelete.reverse().forEach(function(index){
        links.splice(index,1);
    });

    var remove=function(node){
        var length=links.length;
        for(var i=length-1;i>=0;i--){
            if (links[i]['source'] == node ){
               var target=links[i]['target'];
               links.splice(i,1);
               nodes.splice(self.findNodeIndex(node.id),1);
               remove(target);
               
            }
        }
    }

    childNodes.forEach(function(node){
        remove(node);
    });
    for(var i=nodes.length-1;i>=0;i--){
        var haveFoundNode=false;
        for(var j=0,l=links.length;j<l;j++){
            ( links[j]['source']==nodes[i] || links[j]['target']==nodes[i] ) && (haveFoundNode=true) 
        }
        !haveFoundNode && nodes.splice(i,1);
    }
}

EgoNetworks.prototype.findNode=function(id){
    var nodes=this.nodes;
    for (var i in nodes){
        if (nodes[i]['id']==id ) return nodes[i];
    }
    return null;
}

EgoNetworks.prototype.findNodeIndex=function(id){
    var nodes=this.nodes;
    for (var i in nodes){
        if (nodes[i]['id']==id ) return i;
    }
    return -1;
}

EgoNetworks.prototype.setNodeClickFn=function(callback){
    this.clickFn=callback;
}

EgoNetworks.prototype.update=function(){
  var link = this.vis.selectAll("line.link")
      .data(this.links) //, function(d) { return d.source.id + "-" + d.target.id; })
      .attr("class", function(d){
            return d['source']['status'] && d['target']['status'] ? 'link' :'link link_error';
      });

  link.enter().insert("svg:line", "g.node")
      .attr("class", function(d){
         return d['source']['status'] && d['target']['status'] ? 'link' :'link link_error';
      });

  link.exit().remove();

  var node = this.vis.selectAll("g.node")
      .data(this.nodes, function(d) { return d.id;});

  var nodeEnter = node.enter().append("svg:g")
      .attr("class", "node")
      .call(this.force.drag);
  var self=this;
  nodeEnter.append("svg:image")
      .attr("class", "circle")
      .attr("xlink:href", function(d){
         return d.expand ? "./images/user_f.png" : "./images/user_facebook.png";
      })
      .attr("x", "-32px")
      .attr("y", "-32px")
      .attr("width", "64px")
      .attr("height", "64px")
      .on('click',function(d){ d.expand && self.clickFn(d);})

  nodeEnter.append("svg:text")
      .attr("class", "nodetext")
      .attr("dx", 15)
      .attr("dy", -35)
      .text(function(d) { return d.id });

  
  node.exit().remove();

  this.force.start();
}

var topology = new EgoNetworks('div-chart');
topology.addNodes(nodes);
topology.addLinks(links);

//可展开节点的点击事件
topology.setNodeClickFn(function(node){
    if(!node['_expanded']){
        expandNode(node.id);
        node['_expanded']=true;
    }else{
        collapseNode(node.id);
        node['_expanded']=false;
    }
});
//topology.update();


function expandNode(id){
    topology.addNodes(childNodes);
    topology.addLinks(childLinks);
    topology.update();
}
function collapseNode(id){
    topology.removeChildNodes(id);
    topology.update();
}
