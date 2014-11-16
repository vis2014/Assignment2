/**
 * Created by wl on 14-3-31.
 */
function HTCoordE() {
    this.x = 0;
    this.y = 0;

    this.setE = function(x, y) {
        this.x = x;
        this.y = y;
    }

    this.copy = function(z) {
        this.x = z.x;
        this.y = z.y;
    }

    this.projectionStoE = function(x, y, sOrigin, sMax) {
        this.x = (x - sOrigin.x) /  sMax.x;
        this.y = -((y - sOrigin.y) / sMax.y);
    }

    this.d2 = function() {
        return (this.x * this.x) + (this.y * this.y);
    }

    this.d = function() {
        return Math.sqrt(this.d2());
    }
    this.dd = function(p) {
        return Math.sqrt((p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y));
    }

    this.isValid = function() {
        return (this.d2() < 1.0);
    }

    this.arg = function() {
        var a = Math.atan(this.y / this.x);
        if (this.x < 0) {
            a += Math.PI;
        } else if (this.y < 0) {
            a += 2 * Math.PI;
        }
        return a;
    }

    this.multiply = function(z) {
        var tx = this.x;
        var ty = this.y;
        this.x = (tx * z.x) - (ty * z.y);
        this.y = (tx * z.y) + (ty * z.x);
    }

    this.divide = function(z) {
        var d = z.d2();
        var tx = this.x;
        var ty = this.y;
        this.x = ((tx * z.x) + (ty * z.y)) / d;
        this.y = ((ty * z.x) - (tx * z.y)) / d;
    }

    this.sub = function(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
    }

    this.translate = function(t) {
        // z = (z + t) / (1 + z * conj(t))，下面代码是计算该公式！

        // first the denominator(分母)
        var denX = (this.x * t.x) + (this.y * t.y) + 1;
        var denY = (this.y * t.x) - (this.x * t.y) ;
        var dd   = (denX * denX) + (denY * denY);

        // and the numerator（分子）
        var numX = this.x + t.x;
        var numY = this.y + t.y;

        // then the division (bell)
        this.x = ((numX * denX) + (numY * denY)) / dd;
        this.y = ((numY * denX) - (numX * denY)) / dd;
    }

    this.translate2 = function(s, t) {
        this.setE(s.x, s.y);
        this.translate(t);
    }

    /**
     * Transform this node by the given transformation.
     *
     * @param t    the transformation
     */
    this.transform = function(/*HTTransformation*/ t) {

        var z = new HTCoordE();
        z.setE(this.x, this.y);
        this.multiply(t.O);
        this.x += t.P.x;        //t.P平移向量，相加即可
        this.y += t.P.y;

        var d = new HTCoordE();
        d.setE(t.P.x, t.P.y);
        d.y = - d.y;
        d.multiply(z);
        d.multiply(t.O);
        d.x += 1;

        this.divide(d);
    }


}