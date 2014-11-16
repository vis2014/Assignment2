/**
 * Created by wl on 14-3-31.
 */
document.write("<script src='js/HTCoordE.js'></script>");      //调用其他js文件
document.write("<script src='js/HTCoordS.js'></script>");      //调用其他js文件

function HTGeodesic(za, zb) {
    var LINE = 0;
    var ARC = 1;
    var type = LINE;
//    var EPSILON = 1E - 10;
    var EPSILON = Math.pow(10,-10);
    this.error = 0; //0为正确，1，2为错误及其对应的正确

    this.za = za; // first point (Euclidian)
    this.zb = zb; // second point (Euclidian)
    this.zc = new HTCoordE();   // control point (Euclidian)
    this.zo = new HTCoordE();   // center of the geodesic;
    this.a = new HTCoordS();    // first point (on the screen)
    this.b = new HTCoordS();    // second point (on the screen)
    this.c = new HTCoordS();    // control point (on the screen)

    this.rebuild = function() {
        if ( (Math.abs(this.za.d()) < EPSILON) ||                       // za == origin
            (Math.abs(this.zb.d()) < EPSILON) ||                       // zb == origin
            (Math.abs((this.za.x / this.zb.x) - (this.za.y / this.zb.y)) < EPSILON) ) // za = lambda.zb
        {
            type = LINE;
        } else {
            type = ARC;

            var da = 1 + this.za.x * this.za.x + this.za.y * this.za.y;
            var db = 1 + this.zb.x * this.zb.x + this.zb.y * this.zb.y;
            var dd = 2 * (this.za.x * this.zb.y - this.zb.x * this.za.y);

            this.zo.x = (this.zb.y * da - this.za.y * db) / dd;
            this.zo.y = (this.za.x * db - this.zb.x * da) / dd;

            var det = (this.zb.x - this.zo.x) * (this.za.y - this.zo.y) - (this.za.x - this.zo.x) * (this.zb.y - this.zo.y);
            var fa  = this.za.y * (this.za.y - this.zo.y) - this.za.x * (this.zo.x - this.za.x);
            var fb  = this.zb.y * (this.zb.y - this.zo.y) - this.zb.x * (this.zo.x - this.zb.x);

            this.zc.x = ((this.za.y - this.zo.y) * fb - (this.zb.y - this.zo.y) * fa) / det;
            this.zc.y = ((this.zo.x - this.za.x) * fb - (this.zo.x - this.zb.x) * fa) / det;
        }
    }

    this.rebuild();

    this.refreshScreenCoordinates = function(sOrigin, sMax) {
        this.a.projectionEtoS(this.za, sOrigin, sMax);
        this.b.projectionEtoS(this.zb, sOrigin, sMax);
        this.c.projectionEtoS(this.zc, sOrigin, sMax);
    }

    this.draw = function(cxt) {
        if(this.error == 1) {
            cxt.save();
            cxt.strokeStyle = "red";
            cxt.lineWidth = 2;
        } else if(this.error == 2) {
            cxt.save();
//            cxt.strokeStyle = "green";
        }
        switch(type) {
            case LINE:
                cxt.beginPath();
                cxt.moveTo(this.a.x, this.a.y);
                cxt.lineTo(this.b.x, this.b.y);
                cxt.closePath();
                cxt.stroke();
                break;
            case ARC:
                cxt.beginPath();
                cxt.moveTo(this.a.x, this.a.y);
                cxt.quadraticCurveTo(this.c.x, this.c.y, this.b.x, this.b.y);
//                cxt.closePath();
                cxt.stroke();
//                g2.draw(new QuadCurve2D.Double(a.x, a.y, c.x, c.y, b.x, b.y));
                break;
            default:
                break;
        }
        if(this.error) {
            cxt.restore();
        }
    }

    this.hasPoint = function(x, y) {
        var x0,x1,x2,y0,y1,y2;
        x0 = this.a.x;
        x1 = this.b.x;
        x2 = this.c.x;
        y0 = this.a.y;
        y1 = this.b.y;
        y2 = this.c.y;


    }

}
