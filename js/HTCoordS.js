/**
 * Created by wl on 14-3-31.
 */
function HTCoordS() {
    this.x = 0;
    this.y = 0;

    this.setS = function(x, y) {
        this.x = x;
        this.y = y;
    }

    this.projectionEtoS = function(ze, sOrigin, sMax) {
        this.x = Math.round(ze.x * sMax.x) + sOrigin.x;
        this.y = - Math.round(ze.y * sMax.y) + sOrigin.y;
    }

    this.getDistance = function(z) {
        var d2 = (z.x - this.x) * (z.x - this.x) + (z.y - this.y) * (z.y - this.y);
        return Math.round(Math.sqrt(d2));
    }
}
