<?php
$sid;
if ($_GET["sid"]) {
    $sid = $_GET["sid"];
} else {
    $sid = 1;
}

$file1 = 'dst/devo_diff'.$sid.'.json';
$file2 = 'dst/devr_diff'.$sid.'.json';
$sentence1 = file_get_contents($file1);
$sentence2 = file_get_contents($file2);

$page = ceil($sid/10);
function getSentence($i) {
    global $page;
    $sid = ($page-1)*10+$i+1;
    $file = 'dst/devo_diff'.$sid.'.json';
    $sentence = file_get_contents($file);
    $sentence = json_decode($sentence);
    return $sentence->sentence;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>dependency parsing detail</title>
    <script type="text/javascript" src="js/HTNode.js"></script>
    <script type="text/javascript" src="js/HTModelNode.js"></script>
    <script type="text/javascript" src="js/HTGeodesic.js"></script>
    <script type="text/javascript" src="js/HTCoordE.js"></script>
    <script type="text/javascript" src="js/HTCoordS.js"></script>
    <script type="text/javascript" src="js/HTTransformation.js"></script>
    <script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
    <style type="text/css">
        #divSideContent {
            /*display: none;*/
            left: -600px;
            position: fixed;
            top: 0px;
            width: 600px;
            height: 610px;
            margin: 0px;
            padding: 0px;
            background-color: White;
            background-color: #DEF3FF;
            border: 2px solid #C1E8FF;
            border-radius: 0px 10px 10px 0px;
            z-index: 2;
        }
        #divSideBar {
            position: fixed;
            top: 0px;
            margin: 0px;
            padding: 0px;
            left: 0px;
            background-color: White;
            cursor: pointer;
            width: 30px;
            height: 20px;
            border: 2px solid #C1E8FF;
            border-radius: 0px 10px 10px 0px;
            z-index: 2;  /*层次，数值越大，显示在越上面*/
        }
        #gray {
            left: -1333px;
            position: fixed;
            top: 0px;
            width: 1333px;
            height: 610px;
            margin: 0px;
            padding: 0px;
            background-color: White;
            opacity: 0.5;
            z-index: 1;
        }
        div#top {
            text-align: center;
        }
        a {
            text-decoration: none;
        }
        #top a {
            border: 1px darkgray solid;
            padding: 2px;
        }
        body {
            -webkit-user-select: none;  /*为了更改鼠标形状*/
            background-color: #f0f8ff;
        }
        .button {
            border-radius: 0.5em;
            box-shadow: inset 0 0 0 2px rgba(255,255,255,0.5);
            /*color: #369ab8;*/
            display: inline-block;
            text-decoration: none;
        }
        p {
            padding-left: 10px;
        }
        div#tree {
            background-color: #f0f8ff;
            z-index: 2;
        }
        div#tree canvas {
            float: left;
        }
    </style>

    <script type="text/javascript">

        var root1, root2;
        var togetherFlag = true;
        var sid = <?php echo $sid;?>;

        function initTree(json1, json2, sMax, sOrigin) {
            json1 = eval('('+json1+')');
            json2 = eval('('+json2+')');
            var node1 = new HTNode(json1);
            var node2 = new HTNode(json2);

            root1 = new HTModelNode(node1, sMax, sOrigin);
            root1.layoutHyperbolicTree();
            root2 = new HTModelNode(node2, sMax, sOrigin);
            root2.layoutHyperbolicTree();
            root1.compareTree = root2;
            root2.compareTree = root1;
            clearCanvas();
            root1.drawTree(cxt1, 0);
            root2.drawTree(cxt2, 0);

            root1.drawText(textDiv);
        }

//--------预览效果---------
        var tree1, tree2, view_cxt1, view_cxt2;
        var view_sx, view_sy;
        var view_started = false;
        var view_startPoint = new HTCoordE(); // starting point of dragging
        var view_endPoint   = new HTCoordE(); // ending point of dragging
        var view_clickPoint = new HTCoordS(); // clicked point

        function switchSide() {
//            $("#divSideContent").toggle();
            if (parseInt($("#divSideBar").css("left")) == 0) {
                $("#gray").css("left", "0px");
                $("#divSideContent").animate({left:"0px"}, 1000);
                $("#divSideBar").text('<<<').animate({left:"600px"},1000);
            } else {
                $("#gray").css("left", "-1333px");
                $("#divSideContent").animate({left:"-600px"}, 1000);
                $("#divSideBar").text('>>>').animate({left:"0px"}, 1000);
                $("#tree").css("display", "none");
            }
        }

        var max = new HTCoordS();
        var origin = new HTCoordS();
        max.x = 150;
        max.y = 150;
        origin.x = 150;
        origin.y = 150;

        var xmlHttp;
        function getS(sid) {
            xmlHttp = GetXmlHttpObject();
            if (xmlHttp==null) {
                alert ("Browser does not support HTTP Request");
                return;
            }
            var url="Helper.php?sid=" + sid;
            xmlHttp.onreadystatechange=stateChanged;
            xmlHttp.open("GET",url,true);
            xmlHttp.send(null);
        }
        function stateChanged() {
            if (xmlHttp.readyState==4 || xmlHttp.readyState=="complete") {
                var json = xmlHttp.responseText;
                var words = json.split('#');
                var devo = eval('('+words[0]+')');
                var devr = eval('('+words[1]+')');
                var node1 = new HTNode(devo);
                var node2 = new HTNode(devr);

                tree1 = new HTModelNode(node1, max, origin, 'view'); //预览tree
                tree1.layoutHyperbolicTree();
                tree2 = new HTModelNode(node2, max, origin, 'view');
                tree2.layoutHyperbolicTree();
                clearView();
                tree1.drawTree(view_cxt1, 0);
                tree2.drawTree(view_cxt2, 0);
            }
        }
        function GetXmlHttpObject() {
            var xmlHttp=null;
            try {
                // Firefox, Opera 8.0+, Safari
                xmlHttp=new XMLHttpRequest();
            }
            catch (e) {
                // Internet Explorer
                try {
                    xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
                }
                catch (e) {
                    xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
                }
            }
            return xmlHttp;
        }

        function clearView() {
            view_cxt1.clearRect(0, 0, 300, 300);
            view_cxt1.fillStyle = 'black';
            view_cxt1.fillText('By Dependency Parser', 0, 10);
            view_cxt2.clearRect(0, 0, 300, 300);
            view_cxt2.fillStyle = 'black';
            view_cxt2.fillText('Golden Rule', 0, 10);
        }

        function mouseDown(event) {
            this.style.setProperty('cursor', 'pointer');
            view_sx = event.offsetX;
            view_sy = event.offsetY;
            view_started = true;
            view_startPoint.projectionStoE(view_sx, view_sy, tree1.sOrigin, tree1.sMax);
        }

        function mouseMove(event) {
            if (view_started) {
                this.style.setProperty('cursor', 'pointer');
                if(event.offsetX!=view_sx || event.offsetY!=view_sy) {
                    if (view_startPoint.isValid()) {
                        view_endPoint.projectionStoE(event.offsetX, event.offsetY, tree1.sOrigin, tree1.sMax);
                        if (view_endPoint.isValid()) {
                            if(togetherFlag) {
                                clearView();
                                tree1.translate(view_startPoint, view_endPoint, view_cxt1);
                                tree2.translate(view_startPoint, view_endPoint, view_cxt2);
                            }
                        }
                    }
                }
            }
        }

        function mouseUp(event) {
            if (view_started) {
                this.style.setProperty('cursor', 'default');
                view_started = false;
                tree1.endTranslation();
                tree2.endTranslation();
            }
        }

        function over(mmObj, e) {
//            $("p").css("color", "rgb(0,0,0)");
            $("p").css("font-weight", "normal");
            var p = mmObj.getElementsByTagName("p")[0];
//            $(p).css("color", "rgb(255,0,0)");
            $(p).css("font-weight", "bold");
            $("#tree").css("display", "block");
            var can1 = $("#tree")[0].getElementsByTagName("canvas")[0];
            view_cxt1 = can1.getContext('2d');
            var can2 = $("#tree")[0].getElementsByTagName("canvas")[1];
            view_cxt2 = can2.getContext('2d');

            can1.addEventListener("mousedown", mouseDown, false);
            can1.addEventListener('mousemove', mouseMove, false);
            can1.addEventListener('mouseup', mouseUp, false);
            can2.addEventListener("mousedown", mouseDown, false);
            can2.addEventListener('mousemove', mouseMove, false);
            can2.addEventListener('mouseup', mouseUp, false);

            getS(mmObj.id);
        }

        function out(mmObj, e) {

        }

    </script>
</head>
<body>
<div id="divSideContent">
    <?php
    for($i = 0; $i < 10; $i++) {
        ?>
        <div id="<?php echo ($page-1)*10+$i+1;?>" onmouseover="over(this, event)" onmouseout="out(this, event)" style="width:580px;position:relative;display: block;">
<!--        <div id="--><?//=($page-1)*10+$i+1;?><!--" style="width:580px;position:relative;display: block;">-->
            <p><a href="show.php?sid=<?php echo ($page-1)*10+$i+1;?>"><?php echo getSentence($i);?></a></p>
        </div>
    <?php
    }
    ?>
</div>
<div id="divSideBar" onclick="switchSide()"> >>> </div>

<!--预览div-->
<div id="tree" style="width:610px;height:304px;display:none;position:absolute;left:610px;top:100px;">
    <canvas width="300px" height="300px" style="border: 1px solid rgb(100,100,100)"></canvas>
    <canvas width="300px" height="300px" style="border: 1px solid rgb(100,100,100)"></canvas>
</div>

<div id="gray"></div>

<div id="top">
    <a href="index.php?page=<?php echo ceil($sid/10);?>" class="button">Main</a>
    <input type="checkbox" checked="true" id="together" onclick="together()"/>together
    <button type="button" onclick="prev()">prev</button>
    <span id="sno">no.1</span>
    <button type="button" onclick="next()">next</button>
</div>
<div id="text" style="width:1210px; height:60px; border: 1px solid rgb(100,100,100)"></div>
<canvas id="can1" width="600px" height="500px" style="border: 1px solid rgb(100,100,100)"></canvas>
<canvas id="can2" width="600px" height="500px" style="border: 1px solid rgb(100,100,100)"></canvas>
<script type="text/javascript">

    document.getElementById('sno').innerHTML = "no." + sid;
    var textDiv = document.getElementById("text");
    var highlight = false;  //是否单击节点保持高亮

    var canvas1 = document.getElementById("can1");
    var cxt1 = canvas1.getContext('2d');
    var canvas2 = document.getElementById("can2");
    var cxt2 = canvas2.getContext('2d');

    canvas1.style.cursor = 'pointer';
    canvas2.style.cursor = 'pointer';

    var json1 = '<?php echo str_replace("'", "\\'", $sentence1);?>';
    var json2 = '<?php echo str_replace("'", "\\'", $sentence2);?>';

    var sMax = new HTCoordS();
    var sOrigin = new HTCoordS();
    sMax.x = 300;
    sMax.y = 250;
    sOrigin.x = 300;
    sOrigin.y = 250;

    initTree(json1, json2, sMax, sOrigin);

    canvas1.addEventListener("mousedown", doMouseDown, false);
    canvas1.addEventListener('mousemove', doMouseMove, false);
    canvas1.addEventListener('mouseup', doMouseUp, false);
    canvas1.addEventListener('click', doClick, false);

    canvas2.addEventListener("mousedown", doMouseDown, false);
    canvas2.addEventListener('mousemove', doMouseMove, false);
    canvas2.addEventListener('mouseup', doMouseUp, false);
    canvas2.addEventListener('click', doClick, false);

    var sx, sy;
    var started = false;
    var startPoint = new HTCoordE(); // starting point of dragging
    var endPoint   = new HTCoordE(); // ending point of dragging
    var clickPoint = new HTCoordS(); // clicked point

    function doMouseDown(event) {
        this.style.cursor = 'url(img/hand.cur),move';
//        this.style.setProperty('cursor', 'pointer');
        sx = event.offsetX;
        sy = event.offsetY;
        started = true;
        startPoint.projectionStoE(sx, sy, root1.sOrigin, root1.sMax);
    }

    function doMouseMove(event) {
        if (started) {
            this.style.cursor = 'url(img/hand.cur),move';
//            this.style.setProperty('cursor', 'pointer');
            if(event.offsetX!=sx || event.offsetY!=sy) {
                if (startPoint.isValid()) {
                    endPoint.projectionStoE(event.offsetX, event.offsetY, root1.sOrigin, root1.sMax);
                    if (endPoint.isValid()) {
                        console.log(startPoint);
                        console.log(endPoint);
                        if(togetherFlag) {
                            clearCanvas();
                            root1.translate(startPoint, endPoint, cxt1);
                            root2.translate(startPoint, endPoint, cxt2);
                        } else {
                            switch (this) {
                                case canvas1:
                                    clearCanvas1();
                                    root1.translate(startPoint, endPoint, cxt1);
                                    break;
                                case canvas2:
                                    clearCanvas2();
                                    root2.translate(startPoint, endPoint, cxt2);
                                    break;
                            }
                        }
                    }
                }
            }
        } else {
            var zs = new HTCoordS();
            zs.setS(event.offsetX, event.offsetY);
            var isfind = new Object();
            isfind.flag = false;
            if(this == canvas1) {
                root1.findNode(zs, isfind);
            }
            else {
                root2.findNode(zs, isfind);
            }
            if(!isfind.flag && !highlight) {
                root1.clearFocus();
                root1.clearHighlight();
                root1.drawText(textDiv);
                root2.clearFocus();
                root2.clearHighlight();
            }
            clearCanvas();
            root1.drawTree(cxt1, 0);
            root2.drawTree(cxt2, 0);
//            if(flag) {
//                this.style.setProperty('cursor', 'pointer');
//            } else {
//                this.style.setProperty('cursor', 'default');
//            }
        }
    }

    function doMouseUp(event) {
        this.style.setProperty('cursor', 'pointer');
        if (started) {
            started = false;
            root1.endTranslation();
            root2.endTranslation();
        }
    }

    function doClick(event) {
        if(event.shiftKey == 1) {   //恢复原始状态
            if(togetherFlag) {
                root1.restore();
                root2.restore();
                clearCanvas();
                root1.drawTree(cxt1, 0);
                root2.drawTree(cxt2, 0);
            } else if(this == canvas1) {
                root1.restore();
                clearCanvas1();
                root1.drawTree(cxt1, 0);
            } else {
                root2.restore();
                clearCanvas2();
                root2.drawTree(cxt2, 0);
            }
        } else {    //变焦
            var zs = new HTCoordS();
            zs.setS(event.offsetX, event.offsetY);
            var isfind = new Object();
            isfind.flag = false;
            if(this == canvas1) {
                root1.findNode(zs, isfind);
                if(isfind.flag) {
                    highlight = true;
                } else {
                    highlight = false;
                    root1.clearFocus();
                    root1.clearHighlight();
                    root2.clearHighlight();
                    root1.drawText(textDiv);
                }
            } else {
                root2.findNode(zs, isfind);
                if(isfind.flag) {
                    highlight = true;
                } else {
                    highlight = false;
                    root2.clearFocus();
                    root1.clearHighlight();
                    root2.clearHighlight();
                    root2.drawText(textDiv);
                }
            }
            clearCanvas();
            root1.drawTree(cxt1, 0);
            root2.drawTree(cxt2, 0);
//            if(flag) {
//                this.style.setProperty('cursor', 'pointer');
//            } else {
//                this.style.setProperty('cursor', 'default');
//            }
        }
    }

    function clearCanvas() {
        clearCanvas1();
        clearCanvas2();
    }
    function clearCanvas1() {
        cxt1.clearRect(0, 0, 600, 600);
        cxt1.fillStyle = 'black';
        cxt1.fillText('By Dependency Parser', 0, 10);
    }
    function clearCanvas2() {
        cxt2.clearRect(0, 0, 600, 600);
        cxt2.fillStyle = 'black';
        cxt2.fillText('Golden Rule', 0, 10);
    }

    function prev() {
        if(sid > 1) {
            sid--;
            window.location = 'show.php?sid='+sid;
        }
    }

    function next() {
        sid++;
        window.location = 'show.php?sid='+sid;
    }

    function together() {
        var checkbox = document.getElementById('together');
        togetherFlag = checkbox.checked;
        if(checkbox.checked) {
            root1.restore();
            root2.restore();
            clearCanvas();
            root1.drawTree(cxt1, 0);
            root2.drawTree(cxt2, 0);
        } else {

        }
    }
</script>
</body>
</html>