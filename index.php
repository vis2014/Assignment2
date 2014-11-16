<?php
$page;
if ($_GET["page"]) {
    $page = $_GET["page"];
} else {
    $page = 1;
}
function getSentence($page, $i) {
    $sid = ($page-1)*10+$i+1;
    $file = 'dst/devo_diff'.$sid.'.json';
    $sentence = file_get_contents($file);
    $sentence = json_decode($sentence);
    return $sentence->sentence;
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>dependency parsing</title>
    <script type="text/javascript" src="js/HTModelNode.js"></script>
    <script type="text/javascript" src="js/HTNode.js"></script>
    <script type="text/javascript" src="js/HTTransformation.js"></script>
    <script type="text/javascript" src="js/HTCoordS.js"></script>
    <script type="text/javascript" src="js/HTCoordE.js"></script>
    <style type="text/css">
        #top {
            text-align: center;
        }
        .tree {
            margin-left: 700px;
            vertical-align: top;
        }
        canvas {
            float: left;
        }
        #can2 {
            margin-left: 1px;
        }
        a {
            text-decoration: none;
            border-color: red;
        }
        p {
            background: rgb(220,220,220);
        }
        body {
            -webkit-user-select: none;
            background-color: #f0f8ff;
        }
    </style>
    <script>
        var node1, node2, root1, root2, cxt1, cxt2;

        var togetherFlag = true;

        var sx, sy;
        var started = false;
        var startPoint = new HTCoordE(); // starting point of dragging
        var endPoint   = new HTCoordE(); // ending point of dragging
        var clickPoint = new HTCoordS(); // clicked point

        var sMax = new HTCoordS();
        var sOrigin = new HTCoordS();
        sMax.x = 150;
        sMax.y = 150;
        sOrigin.x = 150;
        sOrigin.y = 150;

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
                initTree(words[0], words[1], sMax, sOrigin);
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

        function initTree(json1, json2, sMax, sOrigin) {
            json1 = eval('('+json1+')');
            json2 = eval('('+json2+')');
            node1 = new HTNode(json1);
            node2 = new HTNode(json2);

            root1 = new HTModelNode(node1, sMax, sOrigin);
            root1.layoutHyperbolicTree();
            root2 = new HTModelNode(node2, sMax, sOrigin);
            root2.layoutHyperbolicTree();
            root1.compareTree = root2;
            root2.compareTree = root1;

            root1.drawTree(cxt1, 0);
            root2.drawTree(cxt2, 0);
        }


        function clearCanvas() {
            clearCanvas1();
            clearCanvas2();
        }
        function clearCanvas1() {
            cxt1.clearRect(0, 0, 300, 300);
            cxt1.fillStyle = 'black';
            cxt1.fillText('By Dependency Parser', 0, 10);
        }
        function clearCanvas2() {
            cxt2.clearRect(0, 0, 300, 300);
            cxt2.fillStyle = 'black';
            cxt2.fillText('Golden Rule', 0, 10);
        }

        function doMouseDown(event) {
            this.style.cursor = 'url(img/hand.cur),move';
//            this.style.setProperty('cursor', 'pointer');
            sx = event.offsetX;
            sy = event.offsetY;
            started = true;
            startPoint.projectionStoE(sx, sy, root1.sOrigin, root1.sMax);
        }

        function doMouseMove(event) {
            if (started) {
                this.style.cursor = 'url(img/hand.cur),move';
//                this.style.setProperty('cursor', 'pointer');
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

            }
        }

        function doMouseUp(event) {
            if (started) {
                this.style.setProperty('cursor', 'pointer');
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

            }
        }

        var overdiv = null;

        function over(mmObj, e) {
            var mSubObj = mmObj.getElementsByTagName("div")[0];
            mSubObj.style.display = "block";
            if(overdiv == mmObj) return;
            if(overdiv != mmObj) {
                if(overdiv != null)
                    overdiv.getElementsByTagName("div")[0].style.display = "none";
            }
            overdiv = mmObj;
//            mSubObj.style.backgroundColor = "#f60";
//            var json1 = '{"children":[{"children":[{"children":[],"name":"Influential","order":"1","error":"0"},{"children":[{"children":[{"children":[],"name":"the","order":"4","error":"0"},{"children":[],"name":"House","order":"5","error":"0"},{"children":[],"name":"Ways","order":"6","error":"0"},{"children":[],"name":"and","order":"7","error":"0"},{"children":[],"name":"Means","order":"8","error":"0"}],"name":"Committee","order":"9","error":"0"}],"name":"of","order":"3","error":"0"}],"name":"members","order":"2","error":"0"},{"children":[{"children":[{"children":[{"children":[{"children":[{"children":[{"children":[{"children":[],"name":"the","order":"16","error":"0"},{"children":[],"name":"new","order":"17","error":"0"},{"children":[],"name":"savings-and-loan","order":"18","error":"0"},{"children":[],"name":"bailout","order":"19","error":"0"}],"name":"agency","order":"20","error":"0"},{"children":[{"children":[],"name":"capital","order":"23","error":"0"}],"name":"raise","order":"22","error":"0"}],"name":"can","order":"21","error":"0"}],"name":"how","order":"15","error":"0"},{"children":[],"name":"%2C","order":"24","error":"0"},{"children":[{"children":[{"children":[],"name":"another","order":"26","error":"0"},{"children":[],"name":"potential","order":"27","error":"0"},{"children":[{"children":[{"children":[{"children":[],"name":"the","order":"30","error":"2"},{"children":[],"name":"government","order":"31","error":"2"}],"name":"%27s","order":"32","error":"2"},{"children":[{"children":[{"children":[],"name":"sick","order":"35","error":"2"}],"name":"thrifts","order":"36","error":"2"}],"name":"of","order":"34","error":"2"}],"name":"sale","order":"33","error":"2"}],"name":"to","order":"29","error":"1"}],"name":"obstacle","order":"28","error":"0"}],"name":"creating","order":"25","error":"0"}],"name":"restrict","order":"14","error":"0"}],"name":"would","order":"13","error":"0"}],"name":"that","order":"12","error":"0"}],"name":"legislation","order":"11","error":"0"},{"children":[],"name":".","order":"37","error":"0"}],"name":"introduced","order":"10","error":"0","sentence":"Influential members of the House Ways and Means Committee introduced legislation that would restrict how the new savings-and-loan bailout agency can raise capital , creating another potential obstacle to the government \'s sale of sick thrifts . "}';
//            var json2 = '{"children":[{"children":[{"children":[],"name":"Influential","order":"1","error":"0"},{"children":[{"children":[{"children":[],"name":"the","order":"4","error":"0"},{"children":[],"name":"House","order":"5","error":"0"},{"children":[],"name":"Ways","order":"6","error":"0"},{"children":[],"name":"and","order":"7","error":"0"},{"children":[],"name":"Means","order":"8","error":"0"}],"name":"Committee","order":"9","error":"0"}],"name":"of","order":"3","error":"0"}],"name":"members","order":"2","error":"0"},{"children":[{"children":[{"children":[{"children":[{"children":[{"children":[{"children":[{"children":[],"name":"the","order":"16","error":"0"},{"children":[],"name":"new","order":"17","error":"0"},{"children":[],"name":"savings-and-loan","order":"18","error":"0"},{"children":[],"name":"bailout","order":"19","error":"0"}],"name":"agency","order":"20","error":"0"},{"children":[{"children":[],"name":"capital","order":"23","error":"0"}],"name":"raise","order":"22","error":"0"}],"name":"can","order":"21","error":"0"}],"name":"how","order":"15","error":"0"},{"children":[],"name":"%2C","order":"24","error":"0"},{"children":[{"children":[{"children":[],"name":"another","order":"26","error":"0"},{"children":[],"name":"potential","order":"27","error":"0"},{"children":[{"children":[{"children":[{"children":[],"name":"the","order":"30","error":"2"},{"children":[],"name":"government","order":"31","error":"2"}],"name":"%27s","order":"32","error":"2"},{"children":[{"children":[{"children":[],"name":"sick","order":"35","error":"2"}],"name":"thrifts","order":"36","error":"2"}],"name":"of","order":"34","error":"2"}],"name":"sale","order":"33","error":"2"}],"name":"to","order":"29","error":"1"}],"name":"obstacle","order":"28","error":"0"}],"name":"creating","order":"25","error":"0"}],"name":"restrict","order":"14","error":"0"}],"name":"would","order":"13","error":"0"}],"name":"that","order":"12","error":"0"}],"name":"legislation","order":"11","error":"0"},{"children":[],"name":".","order":"37","error":"0"}],"name":"introduced","order":"10","error":"0","sentence":"Influential members of the House Ways and Means Committee introduced legislation that would restrict how the new savings-and-loan bailout agency can raise capital , creating another potential obstacle to the government \'s sale of sick thrifts . "}';

            var canvas1 = mSubObj.getElementsByTagName("canvas")[0];
            cxt1 = canvas1.getContext('2d');
            var canvas2 = mSubObj.getElementsByTagName("canvas")[1];
            cxt2 = canvas2.getContext('2d');

            canvas1.style.cursor = 'pointer';
            canvas2.style.cursor = 'pointer';

            canvas1.addEventListener("mousedown", doMouseDown, false);
            canvas1.addEventListener('mousemove', doMouseMove, false);
            canvas1.addEventListener('mouseup', doMouseUp, false);
            canvas1.addEventListener('click', doClick, false);
            canvas2.addEventListener("mousedown", doMouseDown, false);
            canvas2.addEventListener('mousemove', doMouseMove, false);
            canvas2.addEventListener('mouseup', doMouseUp, false);
            canvas2.addEventListener('click', doClick, false);

            clearCanvas();
            getS(mmObj.id);
        }

        function out(mmObj, e) {
//            var mSubObj = mmObj.getElementsByTagName("div")[0];
//            mSubObj.style.display = "none";
        }

        function bodyclick(obj, e) {
            if(e.target.tagName.toLowerCase() != 'canvas')
                if(overdiv != null) {
                    overdiv.getElementsByTagName("div")[0].style.display = "none";
                    overdiv = null;
                }
        }

        function prev() {
            var page = <?php echo $page;?>;
            if(page > 1) {
                page--;
                window.location = 'index.php?page='+page;
            }
        }

        function next() {
            var page = <?php echo $page;?>;
            if(page >= 10) {
                alert("last page!");
                return;
            }
            page++;
            window.location = 'index.php?page='+page;
        }
    </script>

</head>

<body onclick="bodyclick(this, event)">
<div id="top">
    <button type="button" onclick="prev()">prev</button>
    <span id="sno">page.<?php echo $page;?></span>
    <button type="button" onclick="next()">next</button>
</div>
<?php
    for($i = 0; $i < 10; $i++) {
?>
        <div id="<?php echo ($page-1)*10+$i+1;?>" onmouseover="over(this, event)" onmouseout="out(this, event)" style="width:700px;position:relative;display: block;">
            <p><a href="show.php?sid=<?php echo ($page-1)*10+$i+1;?>"><?php echo getSentence($page, $i);?></a></p>
            <div class="tree" style="width:610px;height:304px;display:none;position:absolute;left:0;top:0;">
                <canvas id="can<?php echo ($page-1)*10+$i+1;?>1" width="300px" height="300px" style="border: 1px solid rgb(100,100,100)"></canvas>
                <canvas id="can<?php echo ($page-1)*10+$i+1;?>2" width="300px" height="300px" style="border: 1px solid rgb(100,100,100)"></canvas>
            </div>
        </div>
<?php
    }
?>
</body>
</html>
