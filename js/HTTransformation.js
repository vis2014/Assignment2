/**
 * Created by wl on 14-4-9.
 */
document.write("<script src='js/HTCoordE.js'></script>");

function HTTransformation() {
    this.P = new HTCoordE();// translation vector
    this.O = new HTCoordE();// rotation vector

    /**
     * Compose the 2 given vectors translations
     * into one given transformation.
     */
    this.composition = function(first, second) {
        this.P.x = first.x + second.x;
        this.P.y = first.y + second.y;

        var d = new HTCoordE();
        d.setE(second.x, second.y);
        d.y = - d.y;
        d.multiply(first);
        d.x += 1;
        this.P.divide(d);

        this.O.x = first.x;
        this.O.y = - first.y;
        this.O.multiply(second);
        this.O.x += 1;
        this.O.divide(d);
//        console.log('first: ' + first.x + ' ' +first.y);
//        console.log('second: ' + second.x + ' ' +second.y);
//        console.log('d: ' + d.x + ' ' +d.y);
//        console.log('rotation : ' + this.O.x + ' ' + this.O.y);
//        console.log('translation : ' + this.P.x + ' ' + this.P.y);
    }
}
