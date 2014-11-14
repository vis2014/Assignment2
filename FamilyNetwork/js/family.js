/**
 * Created by asuspc on 2014/11/6.
 */
var selectedRelationType=1;


function MapChart(ele){
    typeof(ele)=='string' && (ele=document.getElementById(ele));
    var w=ele.clientWidth,
        h=ele.clientHeight,
        self=this;
    this.force = d3.layout.force().gravity(.05).distance(100).charge(-300).size([w, h]);
    this.nodes=this.force.nodes();
    this.links=this.force.links();
    this.clickFn=function(){};
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


MapChart.prototype.doZoom=function(){
    d3.select(this).select('g')
        .attr("transform","translate(" + d3.event.translate + ")"
            + " scale(" + d3.event.scale + ")");
}

/*******************结点增删*****************/
//增加节点
MapChart.prototype.addNode=function(node){
    this.nodes.push(node);
}

//增加多个节点
MapChart.prototype.addNodes=function(nodes){
    if (Object.prototype.toString.call(nodes)=='[object Array]' ){
        var self=this;
        nodes.forEach(function(node){
            self.addNode(node);
        });
    }
}

//增加连线
MapChart.prototype.addLink=function(source,target){
    if(this.findNode(source)!= null && this.findNode(target)!=null)
        this.links.push({source:this.findNode(source),target:this.findNode(target)});
}

//增加多个连线
MapChart.prototype.addLinks=function(links){
    if (Object.prototype.toString.call(links)=='[object Array]' ){
        var self=this;
        links.forEach(function(link){
            self.addLink(link['source'],link['target']);
        });
    }
}

//删除节点
MapChart.prototype.removeNode=function(id){
    var i=0,
        n=this.findNode(id),
        links=this.links;
    while ( i < links.length){
        links[i]['source']==n || links[i]['target'] ==n ? links.splice(i,1) : ++i;
    }
    this.nodes.splice(this.findNodeIndex(id),1);
}

MapChart.prototype.removeAllLinks= function () {
    links=this.links,
        self=this;
    var linksToDelete=[];

    links.forEach(function(link,index){
        linksToDelete.push(index);
    });

    linksToDelete.reverse().forEach(function(index){
        links.splice(index,1);
    });
}

//删除节点下的子孙节点，同时清除link
MapChart.prototype.removeChildNodes=function(id){
    var nodes=this.nodes;

    this.removeAllLinks();

    //删除子节点
    for(var i=nodes.length-1;i>=0;i--){
        if(nodes[i]['father']==id || nodes[i]['mother']==id)
        {
            var son = nodes[i]['id'];
            for(var j=nodes.length-1;j>=0;j--){
                if(nodes[j]['father']==son || nodes[j]['mother']==son)
                    nodes.splice(j,1);
            }
            nodes.splice(i,1);
        }
    }

}

/*******************结点查找*****************/


//查找节点
MapChart.prototype.findNode=function(id){
    var nodes=this.nodes;
    for (var i in nodes){
        if (nodes[i]['id']==id ) return nodes[i];
    }
    return null;
}

//查找节点下标
MapChart.prototype.findNodeIndex=function(id){
    var nodes=this.nodes;
    for (var i in nodes){
        if (nodes[i]['id']==id ) return i;
    }
    return -1;
}

MapChart.prototype.findLink=function(id1,id2){
    var links=linksBuffer;
    for (var i in links){
        if (links[i]['source']==id1 && links[i]['target']==id2 )
        {
            return links[i].type;
        }
    }
    return -1;
}
/*******************事件响应部分*****************/
//节点点击事件
MapChart.prototype.setNodeClickFn=function(callback){
    this.clickFn=callback;
}


//更新拓扑图状态信息
MapChart.prototype.update=function(){
    var link = this.vis.selectAll("line.link")
        .data(this.links, function(d) { return d.source.id + "-" + d.target.id; })
        .attr("class", "link");

    link.enter().insert("svg:line", "g.node")
        .attr("class", "link")
        .style("stroke-width", function (d) {
            var type = "";
            for(var i=0;i<linksBuffer.length;i++)
                if(linksBuffer[i]['source']== d.source.id && linksBuffer[i]['target']== d.target.id)
                    type = linksBuffer[i]['type'];
            if(selectedRelationType==1)
            {
                if(type == "husband" || type == "wife")
                    return 5;
                if(type == "father" || type == "mother" || type == "son" || type == "daughter" )
                    return 3;
                if(type == "brother" || type == "sister")
                    return 2;
                if(type == "aunt" || type == "uncle" || type == "niece" || type == "nephew")
                    return 1;
            }
            else{
                if(selectedRelationType == 2 && (type == "husband" || type == "wife"))
                    return 5;
                if(selectedRelationType == 3 && (type == "father" || type == "mother" || type == "son" || type == "daughter" ))
                    return 5;
                if(selectedRelationType == 4 && (type == "brother" || type == "sister"))
                    return 5;
                if(selectedRelationType == 5 && (type == "aunt" || type == "uncle" || type == "niece" || type == "nephew"))
                    return 5;
                return 1;
            }
        })
        .style("stroke", function (d) {
            var type = "";
            for(var i=0;i<linksBuffer.length;i++)
                if(linksBuffer[i]['source']== d.source.id && linksBuffer[i]['target']== d.target.id)
                    type = linksBuffer[i]['type'];

            if(type == "husband" || type == "wife")
                return "rgb(128,24,24)";
            else if(type == "father" || type == "mother" || type == "son" || type == "daughter")
                return "rgb(202,134,135)";
            else if(type == "brother" || type == "sister")
                return "rgb(34,143,189)";
            else
                return "rgb(188,181,156)";
        });

    link.exit().remove();

    var node = this.vis.selectAll("g.node")
        .data(this.nodes, function(d) { return d.id;});

    var nodeEnter = node.enter().append("svg:g")
        .attr("class", "node")
        .call(this.force.drag);

    //设置结点
    var self=this;
    nodeEnter.append("circle")
        .attr("class", "circle")
        .attr("r", function(d){
            return (4 - d.level) * 3;
        })
        .attr("fill", function(d){
            if(d.sex=="male")
            {
                if(d.level==0)
                    return "rgb(43,76,126)";
                else if(d.level==1)
                    return "rgb(86,126,187)";
                else
                    return "rgb(96,109,128)";
            }
            else
            {
                if(d.level==0)
                    return "rgb(139,2,25)";
                else if(d.level==1)
                    return "rgb(191,48,115)";
                else
                    return "rgb(242,99,178 )";
            }
        })
        .attr("x", "0px")
        .attr("y", "0px")
        .on('click',function(d){ d.expand && self.clickFn(d);})

    nodeEnter.append("svg:text")
        .attr("class", "nodetext")
        .attr("dx", 15)
        .attr("dy", 15)
        .text(function(d) { return d.name });


    node.exit().remove();

    this.force.start();
}


var MapChart=new MapChart('container');

var links=[];

var initNodes=[];
nodes.forEach(function(node){
    if(node['father']==0)
        initNodes.push(node);
});

MapChart.addNodes(initNodes);
MapChart.addLinks(linksBuffer);
//可展开节点的点击事件
MapChart.setNodeClickFn(function(node){
    if(!node['_expanded']){
        expandNode(node.id);
        node['_expanded']=true;
    }else{
        collapseNode(node.id);
        node['_expanded']=false;
    }
});
MapChart.update();

function expandNode(id){
    var newNodes=[];
    nodes.forEach(function(node){
        if(node['father']==id || node['mother']==id)
            newNodes.push(node);
    });
    MapChart.addNodes(newNodes);
    MapChart.addLinks(linksBuffer);
    MapChart.update();
}

function collapseNode(id){
    MapChart.removeChildNodes(id);
    MapChart.addLinks(linksBuffer);
    MapChart.update();
}

function refreshNetworkSettings(){
    selectList = document.getElementById("relationType");
    selectedRelationType = selectList.options[selectList.selectedIndex].getAttribute("value");
    MapChart.removeAllLinks();
    MapChart.update();
    MapChart.addLinks(linksBuffer);
    MapChart.update();
//
}