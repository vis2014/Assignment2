//
//document.write("<script src='js/HTCoordE.js'></script>");      //调用其他js文件件
//document.write("<script src='js/HTCoordS.js'></script>");      //调用其他js文件件
//
//var node1, node2, root1, root2;
//
//function initTree(json1, json2) {
//    json1 = eval('('+json1+')');
//    json2 = eval('('+json2+')');
//    node1 = new HTNode(json1);
//    node2 = new HTNode(json2);
//
//    root1 = new HTModelNode(node1);
//    root1.layoutHyperbolicTree();
//    root2 = new HTModelNode(node2);
//    root2.layoutHyperbolicTree();
//    root1.drawTree(cxt1);
//    root2.drawTree(cxt2);
//
//    root1.drawText(textDiv);
//}
//
//var sx, sy;
//var started = false;
//var startPoint = new HTCoordE(); // starting point of dragging
//var endPoint   = new HTCoordE(); // ending point of dragging
//var clickPoint = new HTCoordS(); // clicked point
//
//function doMouseDown(event) {
//    this.style.setProperty('cursor', 'pointer');
//    sx = event.offsetX;
//    sy = event.offsetY;
//    started = true;
//    startPoint.projectionStoE(sx, sy, root1.sOrigin, root1.sMax);
//}
//
//function doMouseMove(event) {
//    if (started) {
//        this.style.setProperty('cursor', 'pointer');
//        if(event.offsetX!=sx || event.offsetY!=sy) {
//            if (startPoint.isValid()) {
//                endPoint.projectionStoE(event.offsetX, event.offsetY, root1.sOrigin, root1.sMax);
//                if (endPoint.isValid()) {
//                    if(togetherFlag) {
//                        clearCanvas();
//                        root1.translate(startPoint, endPoint, cxt1);
//                        root2.translate(startPoint, endPoint, cxt2);
//                    } else {
//                        switch (this) {
//                            case canvas1:
//                                clearCanvas1();
//                                root1.translate(startPoint, endPoint, cxt1);
//                                break;
//                            case canvas2:
//                                clearCanvas2();
//                                root2.translate(startPoint, endPoint, cxt2);
//                                break;
//                        }
//                    }
//                }
//            }
//        }
//    } else {
//        var zs = new HTCoordS();
//        zs.setS(event.offsetX, event.offsetY);
////            root1.findNode(zs);
//        if(this == canvas1)
//            root1.findNode(zs);
//        else
//            root2.findNode(zs);
////            if(flag) {
////                this.style.setProperty('cursor', 'pointer');
////            } else {
////                this.style.setProperty('cursor', 'default');
////            }
//    }
//}
//
//function doMouseUp(event) {
//    this.style.setProperty('cursor', 'default');
//    if (started) {
//        started = false;
//        root1.endTranslation();
//        root2.endTranslation();
//    }
//}
//
//function doClick(event) {
//    if(event.shiftKey == 1) {   //恢复原始状态
//        if(togetherFlag) {
//            root1.restore();
//            root2.restore();
//            clearCanvas();
//            root1.drawTree(cxt1);
//            root2.drawTree(cxt2);
//        } else if(this == canvas1) {
//            root1.restore();
//            clearCanvas1();
//            root1.drawTree(cxt1);
//        } else {
//            root2.restore();
//            clearCanvas2();
//            root2.drawTree(cxt2);
//        }
//    } else {    //变焦
//
//    }
//}
//
//function clearCanvas() {
//    cxt1.clearRect(0, 0, 600, 600);
//    cxt2.clearRect(0, 0, 600, 600);
//}
//function clearCanvas1() {
//    cxt1.clearRect(0, 0, 600, 600);
//}
//function clearCanvas2() {
//    cxt2.clearRect(0, 0, 600, 600);
//}