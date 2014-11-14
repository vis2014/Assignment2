
var edgeCountId = "edgeCount";
var nodeCountId = "nodeCount";
var edgeCountDim="2"
var nodeCountDim="2"

function refreshNetworkSettings(){
    var selectList = document.getElementById(edgeCountId);
    var selectedValue = selectList.options[selectList.selectedIndex].getAttribute("value");

    edgeCountDim =  selectedValue;

    selectList = document.getElementById(nodeCountId);
    selectedValue = selectList.options[selectList.selectedIndex].getAttribute("value");

    nodeCountDim =  selectedValue;
    alert(nodeCountDim)
}

function reloadNetwork(){

    links = svg.selectAll(".edge")
    node = svg.selectAll(".node");
    links = links.filter(function(d){
        if (d.edge_count>=edgeCountDim){
            return this;
        }else{
            return null;
        }
    });
    this.setLinks(links);
    nodes = nodes.filter(function(d){
        if (d.nodeCount>=nodeCountDim){
            return this;
        }else{
            return null;
        }
    });
    this.setNodes(nodes);
}

