/**
 * Created by wl on 14-3-31.
 */
document.write("<script src='js/HTGeodesic.js'></script>");      //调用其他js文件件

var root = null;    //保存树的根
var view_root = null; //保存预览的根

var RADIUS = 8;
var HIGH_RADIUS = 8;

function HTModelNode(node) {
    this.ze = new HTCoordE();        //当前的欧几里得坐标
    this.oldZe = new HTCoordE();     //上次变换结束后的欧几里得坐标
    this.sZe = new HTCoordE();       //最初的欧几里得坐标
    this.zs = new HTCoordS();        //屏幕坐标
    this.weight = 1.0;               //每个节点权重为1
    this.globalWeight = 0;           //该节点的总权重（包括子节点）
    this.parent = null;              //HTModelNode父节点
    this.node = node;                //HTNode
    this.isLeaf = false;             //是否为叶节点
    this.children = new Array();     //子节点数组
    this.radius = RADIUS;
    this.sentence = null;
    this.highlight = 0;          //节点是否高亮显示,1为高亮节点显示为红色，2为与其相邻节点显示为粉色
    this.compareTree = null;
    this.treeRoot = null;   //为每个节点保存这棵树的根

    if(this.node.sentence != null && arguments[3] != 'view') {
//        alert(this.node.sentence.split(" ").length);
        this.sMax = arguments[1];
        this.sOrigin = arguments[2];
        root = this;
        this.treeRoot = root;
        this.sentence = new Array();
        var words = this.node.sentence.split(" ");
        for(var i = 0; i < words.length; i++) {
            this.sentence[i] = new Array();
            this.sentence[i][0] = words[i];
            this.sentence[i][1] = 'unfocus';
        }
    } else if(arguments[3] == 'view') {
        this.sMax = arguments[1];
        this.sOrigin = arguments[2];
        view_root = this;
    } else {
        if(view_root != null) {
            this.sMax = view_root.sMax;
            this.sOrigin = view_root.sOrigin;
        } else {
            this.sMax = root.sMax;
            this.sOrigin = root.sOrigin;
            this.treeRoot = root;
        }

    }

    if(this.node.error == 1 && view_root == null) {  //标记句子中出错的单词
        root.sentence[this.node.order-1][2] = 'error';
    }

    var childNode = null;
    var child = null;
    var count = this.node.children.length;  //HTNode节点的子节点个数
    for (var i = 0; i < count; i++) {
        childNode = node.children[i];
        if (childNode.isLeaf()) {
            child = new HTModelNode(childNode);
            child.setParent(this);
            child.isLeaf = true;
        } else {
            child = new HTModelNode(childNode);
            child.isLeaf = false;
            child.setParent(this);
        }
        this.children.push(child);
    }

    this.computeWeight = function() {
        var child = null;
        var len = this.children.length;
        for (var i = 0; i < len; i++) {
            child = this.children[i];
            this.globalWeight += child.getWeight();
        }
        if (this.globalWeight != 0.0) {
            this.weight += Math.log(this.globalWeight);
        }
    }

    // here the down of the tree is built, so we can compute the weight
    this.computeWeight();       //计算该节点的权重

    this.findNode = function(/*HTCoordS*/ zs, isfind) {

        if(this.zs.getDistance(zs) <= this.radius) {
            root.clearFocus();
            root.clearHighlight();
            root.compareTree.clearHighlight();
            this.focus();   //上面的句子中高亮显示
            this.highLight();//节点高亮显示
            root.drawText(textDiv);
            isfind.flag = true;

            //另一棵树同时高亮显示
            this.treeRoot.compareTree.findOtherTreeNode(this.node.order);
//            console.log(this.treeRoot);
//            console.log(root.compareTree);
        } else {
            for (var i = 0; i < count; i++) {
                var childNode = this.children[i];
                childNode.findNode(zs, isfind);
            }
        }
    }

    this.findOtherTreeNode = function(order) {
        if(this.node.order == order) {
            this.highLight();//节点高亮显示
        } else {
            var len = this.children.length;
            for (var i = 0; i < len; i++) {
                var childNode = this.children[i];
                childNode.findOtherTreeNode(order);
            }
        }
    }

    this.highLight = function() {
        this.highlight = 1;
        root.sentence[this.node.order-1][3] = '1';
//        root.compareTree.sentence[this.node.order-1][3] = '1';
        if(this.parent != null) {
            this.parent.highlight = 2;
            root.sentence[this.parent.node.order-1][3] = '2';
//            root.compareTree.sentence[this.node.order-1][3] = '2';
        }
        var nc = this.children.length;
        for(var i = 0; i < nc; i++) {
            var childNode = this.children[i];
            childNode.highlight = 2;
            root.sentence[childNode.node.order-1][3] = '2';
//            root.compareTree.sentence[this.node.order-1][3] = '2';
        }
    }

    this.clearHighlight = function() {
        this.highlight = 0;
        var nc = this.children.length;
        for(var i = 0; i < nc; i++) {
            var childNode = this.children[i];
            childNode.clearHighlight();
        }
    }

    this.focus = function() {
        root.sentence[this.node.order-1][1] = 'focus';
        var nc = this.children.length;
        for(var i = 0; i < nc; i++) {
            var childNode = this.children[i];
            childNode.focus();
        }
    }

    this.clearFocus = function() {
        for(var i = 0; i < root.sentence.length; i++) {
            root.sentence[i][1] = 'unfocus';
        }
        for(var i = 0; i < root.sentence.length; i++) {
            root.sentence[i][3] = '0';
        }
    }

    this.drawText = function(textDiv) {
        var text = '';
        for(var i = 0; i < root.sentence.length; i++) {
            var isFocus = root.sentence[i][1] == 'focus';
            var isError = root.sentence[i][2] == 'error';
            var isHighlight = root.sentence[i][3];
            var style = "";
//            if(isFocus) {
//                style += "font-weight: bold;";
//            }
            if(isError) {
                style += "font-size: 28px; border-bottom:rgb(50,50,50) solid 2px;";
//                style += "font-size: 28px; TEXT-DECORATION: underline";
            }
            if(isHighlight == 1) {
                style += "color: red; font-weight: bold;";
            } else if(isHighlight == 2) {
                style += "color: #EE0000;";
            }
//            if(style == '') {
//                style = "color: black;font-weight: normal";
//            }
            if(i != root.sentence.length-1) {
                var sub = '<sub style="font-size: 5px;">'+(i+1)+'</sub>';
                text += '<span style="'+style+'">'+root.sentence[i][0]+sub+'</span> ';
            }
        }
        textDiv.innerHTML = text;
    }

    this.restoreLayout = function() {
        this.ze.copy(this.sZe);
        this.zs.projectionEtoS(this.ze, this.sOrigin, this.sMax);
        this.oldZe.copy(this.sZe);
        if(this.isLeaf)
            return;
        var child = null;
        for (var i = 0; i < this.children.length; i++) {
            child = this.children[i];
            child.restoreLayout();
        }
    }

    this.restore = function() {
        this.restoreLayout();
        this.init_translate();
    }

    this.translate = function(/*HTCoordE*/ zs, /*HTCoordE*/ ze, cxt) {
        var zo = new HTCoordE();
        zo.setE(this.oldZe.x, this.oldZe.y);
        zo.x = -zo.x;
        zo.y = -zo.y;
        var zs2 = new HTCoordE();
//            zs2.setE(zs.x, zs.y);
        zs2.copy(zs);
        zs2.translate(zo);

        var t = new HTCoordE();
        var de = ze.d2();
        var ds = zs2.d2();
        var dd = 1.0 - de * ds;
        t.x = (ze.x * (1.0 - ds) - zs2.x * (1.0 - de)) / dd;
        t.y = (ze.y * (1.0 - ds) - zs2.y * (1.0 - de)) / dd;

        if (t.isValid()) {
            var to = new HTTransformation();
            to.composition(zo, t);

            this.transform(to);
            this.drawTree(cxt, 0);
        }
    }

    this.init_translate = function() {
        var zs = new HTCoordE(); // starting point of dragging
        var ze   = new HTCoordE(); // ending point of dragging
        zs.x = 0.02;   //越小越往右移动
        zs.y = -0.3;
        ze.x = 0;
        ze.y = 0.1;     //偏移初始布局
        var zo = new HTCoordE();
        zo.setE(this.oldZe.x, this.oldZe.y);
        zo.x = -zo.x;
        zo.y = -zo.y;
        var zs2 = new HTCoordE();
//            zs2.setE(zs.x, zs.y);
        zs2.copy(zs);
        zs2.translate(zo);

        var t = new HTCoordE();
        var de = ze.d2();
        var ds = zs2.d2();
        var dd = 1.0 - de * ds;
        t.x = (ze.x * (1.0 - ds) - zs2.x * (1.0 - de)) / dd;
        t.y = (ze.y * (1.0 - ds) - zs2.y * (1.0 - de)) / dd;

        if (t.isValid()) {
            var to = new HTTransformation();
            to.composition(zo, t);

            this.transform(to);
//            this.drawTree(cxt, 0);
        }
        this.endTranslation();
    }

    this.endTranslation = function() {  //拖拽结束后记录最终坐标
        this.oldZe.copy(this.ze);
        if(this.isLeaf)
            return;
        var child = null;
        for (var i = 0; i < this.children.length; i++) {
            child = this.children[i];
            child.endTranslation();
        }
    }

    this.transform = function(t) {
        this.ze.copy(this.oldZe);
        this.ze.transform(t);
        this.zs.projectionEtoS(this.ze, this.sOrigin, this.sMax);
        if(this.isLeaf)
            return;
        var child = null;
        for (var i = 0; i < this.children.length; i++) {
            child = this.children[i];
            child.transform(t);
        }
    }

    this.drawLine = function(cxt) {
        var str = cxt.canvas.id;
        var whichTree = str.charAt(str.length - 1); //id最后一位是1便为parser结果，2便为Golden rule
        //先画线
        var count = this.children.length;
        for(var i = 0; i < count; i++) {
            var child = this.children[i];

            var g = new HTGeodesic(this.ze, child.ze);
            if(child.node.error == 1) {
                g.error = whichTree;         //出错，error为1 or 2
            }
            g.refreshScreenCoordinates(this.sOrigin, this.sMax);
            cxt.strokeStyle = "black";
            g.draw(cxt);
            child.drawLine(cxt);
        }
    }

    this.drawTree = function(cxt, n) {    //d3.js
        if(n == 0) {    //先画线，避免线显示在节点上面
            this.drawLine(cxt);
        }
        var str = cxt.canvas.id;
        var whichTree = str.charAt(str.length - 1); //id最后一位是1便为parser结果，2便为Golden rule
//        console.log(str.charAt(str.length - 1));

        //再画点
//        cxt.fillStyle = "";


        //下面是清除节点处的弧线
        cxt.beginPath();
        cxt.fillStyle = "#f0f8ff";
        cxt.arc(this.zs.x, this.zs.y, this.radius, 0, 2 * Math.PI, true);
        cxt.closePath();
        cxt.fill();

        cxt.fillStyle = "rgb(50,50,50)";
        this.radius = RADIUS;


        if(this.highlight == 1) {
            cxt.fillStyle = "red";
            this.radius = HIGH_RADIUS;
            cxt.beginPath();
            cxt.arc(this.zs.x, this.zs.y, this.radius, 0, 2 * Math.PI, true);
            cxt.closePath();
            cxt.fill();
            cxt.fillText(this.node.name, this.zs.x + 12, this.zs.y);
            cxt.fillStyle = "white";
            this.drawIndex(cxt);
        } else if(this.highlight == 2) {
            cxt.fillStyle = "#AA1111";
            this.radius = HIGH_RADIUS;
            cxt.beginPath();
            cxt.arc(this.zs.x, this.zs.y, this.radius, 0, 2 * Math.PI, true);
            cxt.closePath();
            cxt.fill();
            cxt.fillText(this.node.name, this.zs.x + 12, this.zs.y);
            cxt.fillStyle = "white";
            this.drawIndex(cxt);
        } else {
            cxt.fillText(this.node.name, this.zs.x + 12, this.zs.y);
            this.drawIndex(cxt);
        }

//        if(this.node.error == 1) {
//            var isWhite = false;
//            if(this.highlight == 1) {
//                cxt.fillStyle = "red";
//            } else if(this.highlight == 2) {
//                cxt.fillStyle = "#AA1111";
//            } else {
//                cxt.fillStyle = "white";
//                isWhite = true;
//            }
//            this.radius = 6;
//            cxt.fillRect(this.zs.x-this.radius, this.zs.y-this.radius, this.radius*2, this.radius*2);
//            cxt.strokeRect(this.zs.x-this.radius, this.zs.y-this.radius, this.radius*2, this.radius*2);
//            if(isWhite) {
//                cxt.fillStyle = "black";
//            }
//            cxt.strokeStyle = "black";
//            cxt.beginPath();
//            if(whichTree == 1) {
//                cxt.lineTo(this.zs.x-this.radius, this.zs.y-this.radius);
//                cxt.lineTo(this.zs.x+this.radius, this.zs.y+this.radius);
//                cxt.moveTo(this.zs.x-this.radius, this.zs.y+this.radius);
//                cxt.lineTo(this.zs.x+this.radius, this.zs.y-this.radius);
//            } else {
//                cxt.lineTo(this.zs.x-this.radius, this.zs.y);
//                cxt.lineTo(this.zs.x, this.zs.y+this.radius);
//                cxt.lineTo(this.zs.x+this.radius, this.zs.y-this.radius);
//            }
//
////            cxt.closePath();
//            cxt.stroke();
//        } else {
//            cxt.beginPath();
//            cxt.arc(this.zs.x, this.zs.y, this.radius, 0, 2 * Math.PI, true);
//            cxt.closePath();
//            cxt.fill();
//            cxt.strokeStyle = "black";
//            cxt.beginPath();
//            cxt.arc(this.zs.x, this.zs.y, this.radius, 0, 2 * Math.PI, true);
//            cxt.closePath();
//            cxt.stroke();
//        }

        //画节点
//        cxt.beginPath();
//        cxt.arc(this.zs.x, this.zs.y, this.radius, 0, 2 * Math.PI, true);
//        cxt.closePath();
//        cxt.fill();
        cxt.strokeStyle = "black";
        cxt.beginPath();
        cxt.arc(this.zs.x, this.zs.y, this.radius, 0, 2 * Math.PI, true);
        cxt.closePath();
        cxt.stroke();

        var count = this.children.length;
        for(var i = 0; i < count; i++) {
            var child = this.children[i];
            n++;
            child.drawTree(cxt, n);
        }
    }

    this.drawIndex = function(cxt) {
        if(this.node.order > 9) {   //两位数
            cxt.fillText(this.node.order, this.zs.x-6, this.zs.y+4);
        } else {    //一位数
            cxt.fillText(this.node.order, this.zs.x-3, this.zs.y+4);
        }

    }

    this.layoutHyperbolicTree = function() {
//        this.layout(0.0, Math.PI, model.getLength());
//        this.layout(0.0, Math.PI, 0.3);
        this.layout(-Math.PI / 2, Math.PI / 2, 0.3);
        this.init_translate();
    }

    this.layout = function(angle, width, length) {
        this.ze.x = 0;
        this.ze.y = 0;
        // Nothing to do for the root node
        if (this.parent != null) {  //不是根节点
            var zp = this.parent.getCoordinates();
//            console.log(this.parent == root);

            // We first start as if the parent was the origin.
            // We still are in the hyperbolic space.
            this.ze.x = length * Math.cos(angle);
            this.ze.y = length * Math.sin(angle);

//            if(this.node.name == 'would') {
//                console.log("1:("+this.ze.x+','+this.ze.y+')');
//            }

            // Then translate by parent's coordinates
            this.ze.translate(zp);

//            if(this.node.name == 'would') {
//                console.log("2:("+this.ze.x+','+this.ze.y+')');
//            }

            if(this.parent.parent == root) {
                var u1, u2, v1, v2, A, B;
                u1 = zp.x;
                u2 = zp.y;
                v1 = this.ze.x;
                v2 = this.ze.y;
//                console.log('('+u1+','+u2+')');
//                console.log('('+v1+','+v2+')');
//                console.log(v1/u1 == v2/u2);
//                console.log(v2/u2);
                A = (u2*(Math.pow(v1,2)+Math.pow(v2,2))-v2*(Math.pow(u1,2)+Math.pow(u2,2))+u2-v2)/(u1*v2-u2*v1);
                B = (v1*(Math.pow(u1,2)+Math.pow(u2,2))-u1*(Math.pow(v1,2)+Math.pow(v2,2))+v1-u1)/(u1*v2-u2*v1);
//                console.log(A);
//                console.log(B);
//                var re = Math.pow(zp.x,2)+Math.pow(zp.y,2)+A*zp.x+B*zp.y+1;
//                var re = Math.pow(this.ze.x,2)+Math.pow(this.ze.y,2)+A*this.ze.x+B*this.ze.y+1;
//                console.log(re);
                var O1 = -A/2;
                var O2 = -B/2;
                var x1 = u1 - O1;
                var y1 = u2 - O2;
                var x2 = v1 - O1;
                var y2 = v2 - O1;
                var arg1 = (x1*x2+y1*y2)/(Math.sqrt(Math.pow(x1,2)+Math.pow(y1,2))*Math.sqrt(Math.pow(x2,2)+Math.pow(y2,2)));
                var arg = Math.acos(arg1);
                var r = Math.sqrt(Math.pow(A,2)+Math.pow(B,2)-4) / 2;
                var len = arg * r;
//                console.log('node: '+this.node.name);
//                console.log('arg: '+arg);
//                console.log('r: '+r);
//                console.log('length: '+len);
//                console.log('');
            }
        }
        this.zs.projectionEtoS(this.ze, this.sOrigin, this.sMax);
        this.oldZe.copy(this.ze);
        this.sZe.copy(this.ze);

        if(!this.isLeaf) {  //不是叶节点
            if (this.parent != null) {  //不是根节点
                // Compute the new starting angle
                // e(i a) = T(z)oT(zp) (e(i angle))
                var a = new HTCoordE();
                a.setE(Math.cos(angle), Math.sin(angle));
                var nz = new HTCoordE();
                nz.setE(- this.ze.x, - this.ze.y);
                a.translate(this.parent.getCoordinates());
                a.translate(nz);
                angle = a.arg();

                // Compute the new width
                // e(i w) = T(-length) (e(i width))
                // decomposed to do it faster :-)
                var c = Math.cos(width);
                var A = 1 + length * length;
                var B = 2 * length;
                width = Math.acos((A * c - B) / (A - B * c));
            }

            var child = null;
            var nbrChild = this.children.length;
//            var l1 = (0.95 - model.getLength());
            var l1 = (0.95 - 0.3);
            var l2 = Math.cos((20.0 * Math.PI) / (2.0 * nbrChild + 38.0));
//           length = model.getLength() + (l1 * l2);
            length = 0.3 + (l1 * l2);
//            length = 0.5;

            var startAngle = angle - width;

            for (var i = 0; i < nbrChild; i++) {
                child = this.children[i];

                var percent = child.getWeight() / this.globalWeight;
                var childWidth = width * percent;
                var childAngle = startAngle + childWidth;
                child.layout(childAngle, childWidth, length);
                startAngle += 2.0 * childWidth;
            }
        }
    }

    this.setParent = function(parent) {
        this.parent = parent;
    }

    this.getParent = function() {
        return this.parent;
    }

    this.getNode = function() {
        return this.node;
    }

    this.getName = function() {
        return this.node.name;
    }

    this.getWeight = function() {
        return this.weight;
    }

    this.getCoordinates = function() {
        return this.ze;
    }
}
