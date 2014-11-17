
var svg = d3.select("body").append('svg')
.attr({
    width: 1000,
    height: 800
    });
var svg1=d3.select("svg");
svg1.attr(
            {
                width: 400,
                height:400
                }
);
var Node={
    newnode: function(){
    var node = {};
    node.cx=null;
    node.cy=null;
    node.created=false;
    node.circle = null;
    node.size =null;
    node.lable=null;
    return node
    }
    }
var Edge={
    newedge: function(){
    var edge={};
    edge.source=null;
    edge.target=null;
    return edge
    }
    }
//初始化nodes坐标以及edges
var nodes=[];
var edges=[];
var g=svg1.select("g").selectAll("g")
.each(function(d){
    var k=d3.select(this);
    if(k.attr("class")=="node")
    {
    var nodeid=k.select("title").html();
    var node=Node.newnode();
    var title= k.select("text").html();
    var size= k.select("sizes").attr("size");

    ellipse= k.select("ellipse")
    node.cx= ellipse.attr("cx");
    node.cy= ellipse.attr("cy");
    node.lable=title;
    node.size=size;
    nodes[nodeid]=node;
    }
    else if(k.attr("class")=="edge")
    {
    var temp= k.select("title").html();
    temp=String(temp);
    var source=0;
    var target=0;
    var edge=Edge.newedge();
    var flag=false;
    for(var i=0;i<temp.length;i++)
    {
    if(temp[i]>=0&&temp[i]<=9&&flag==false)
    {
    source=source*10+parseInt(temp[i]);
    }
    else if(temp[i]=="-")
    {
    flag=true;
    }
    else if(temp[i]>=0&&temp[i]<=9&&flag==true)
    {
    target=target*10+parseInt(temp[i]);
    }
    }
    edge.source=source;
    edge.target=target;
    edges.push(edge)
    }
    })


var handleRadius = 8;
//    var curves = [
//        {
//            type: 'L',
//            points: [
//                {x: 25, y: 150},
//                {x: 320, y: 254}
//            ]
//        }
//    ];
var curves =[];
for (var i=0;i<edges.length;i++)
    {
        var source_x=parseInt(nodes[edges[i].source].cx);
        var source_y=parseInt(nodes[edges[i].source].cy);
        var target_x=parseInt(nodes[edges[i].target].cx);
        var target_y=parseInt(nodes[edges[i].target].cy);
        var source_size=parseInt(nodes[edges[i].source].size);
        var target_size=parseInt(nodes[edges[i].target].size);
        var source_lable=nodes[edges[i].source].lable;
        var target_lable=nodes[edges[i].target].lable;
        curves[i]={
        type:'L',
        points:[
        {x:source_x*2+100,y:source_y*2+800,size:source_size,text:source_lable},
        // {x:(source_x+target_x)/2,y:(source_y+target_y)/2+500},
        {x:target_x*2+100,y:target_y*2+800,size:target_size,text:target_lable}

        ],
        nodes:[edges[i].source, edges[i].target]
        }
        }
var controlLineLayer = svg.append('g').attr('class', 'control-line-layer');
    var mainLayer = svg.append('g').attr('class', 'main-layer');
    var handleTextLayer = svg.append('g').attr('class', 'handle-text-layer');
    var handleLayer = svg.append('g').attr('class', 'handle-layer');
    var drag = d3.behavior.drag()
            .origin(function(d) { return d; })
            .on('drag', dragmove);
    var flag=false;
    function dragmove(d) {

        d.x = d3.event.x;
        d.y = d3.event.y;
        console.log(d);
        d3.select(this).attr({cx: d.x, cy: d.y});
//        d.pathElem.attr('d', pathData);
//        console.log(d.pathElems[2]);
//        d.pathElems[2].attr('d', pathData);
        for(var i=0; i < d.pathElems.length; i++) {
            var path = d.pathElems[i];
//            console.log(path);
            path.attr('d', pathData);
        }
//        console.log('drag!');

//        d.test=d.pathElems[0];
//        d.test.attr('d', pathData);
        flag=true;
//        console.log(d);

    }
    function pathData(d) {
//        if(flag==true){
//            console.log(d);
//        }

        var p = d.points;
        switch (d.type) {
            case 'L':
                return [
                    'M', p[0].x, ' ', p[0].y,
                    ' ', p[1].x, ' ', p[1].y
                ].join('');
            case 'Q':
                return [
                    'M', p[0].x, ' ', p[0].y,
                    'Q', p[1].x, ' ', p[1].y,
                    ' ', p[2].x, ' ', p[2].y
                ].join('');
        }
    }
    function controlLinePath(d) {
        var values = [];
        d.points.forEach(function(p) {
            values.push(p.x);
            values.push(p.y);
        });
        return 'M' + values.join(' ');
    }
    function handleText(d, i) {
        return 'p' + (i + 1) + ': ' + d.x + '/' + d.y;
}
var source_created, target_created;
mainLayer.selectAll('path.curves').data(curves)
            .enter().append('path')
            .attr({
                'class': function(d, i) {return 'curves path' + i; },
                d: pathData

            })
            .each(function (d, i) {
                var pathElem = d3.select(this),
                        controlLineElem,
                        handleTextElem;
                var points = [];
                source_created = nodes[edges[i].source].created,
                        target_created = nodes[edges[i].target].created;
                if(source_created && target_created) {
//                    alert(edges[i].source + " " + edges[i].target);
                    nodes[edges[i].source].circle.pathElems.push(pathElem);
                    nodes[edges[i].target].circle.pathElems.push(pathElem);
                    return;
                } else if(source_created) {
//                    alert('s ' +edges[i].source + " " + edges[i].target);
                    nodes[edges[i].source].circle.pathElems.push(pathElem);
                    points[0] = d.points[1];
                } else if(target_created) {
//                    alert('t ' +edges[i].source + " " + edges[i].target);
                    nodes[edges[i].target].circle.pathElems.push(pathElem);
                    points[0] = d.points[0];
                } else {
//                    alert('no '+edges[i].source + " " + edges[i].target);
                    points = d.points;
                }
                {

                    handleLayer.selectAll('circle.handle.path' + i)
                            .data(points).enter().append('circle')
                            .attr({
                                'class': 'handle path' + i,
                                cx: function(d) { return d.x },
                                cy: function(d) { return d.y },
                                r: function(d) { return Math.sqrt(d.size)+handleRadius}
                            })
                            .style("fill","blue")
                            .each(function(d, handleI) {
                                d.pathID = i;
                                d.handleID = handleI;
                                d.pathElems = [];
                                d.pathElems.push(pathElem);
//                                console.log(pathElem);
//                            d.pathElem = pathElem;
                                d.controlLineElem = controlLineElem;
                                if(handleI == 0) {
                                    if(source_created) {
                                        nodes[edges[i].target].circle = d;
                                        nodes[edges[i].target].created = true;
                                    } else {
                                        nodes[edges[i].source].circle = d;
                                        nodes[edges[i].source].created = true;
                                    }
                                } else {
                                    nodes[edges[i].target].circle = d;
                                    nodes[edges[i].target].created = true;
                                }
                            })
//                            .call(drag);
                    handleLayer.selectAll('text_field' + i)
                            .data(points).enter().append('text')
                            .html(function(d){return d.text;})
                            .attr("x",function(d){return d.x- 8*d.text.length/2;})
                            .attr("y",function(d){return d.y+2*(Math.sqrt(d.size)+handleRadius);});
                    handleLayer.selectAll('text_size' + i)
                            .data(points).enter().append('text')
                            .html(function(d){return d.size;})
                            .attr("x",function(d){return d.x- 8*String(d.size).length/2;})
                            .attr("y",function(d){return d.y+6;});
                }



            });
    svg1.attr(
            {
                height:0,
                width:0
            }
    )
