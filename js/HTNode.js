/**
 * Created by wl on 14-3-31.
 */
function HTNode(json) {
    this.name = json.name;
    this.order = json.order;
    this.error = json.error;
    this.sentence = null;
    if(json.sentence != null) {
        this.sentence = json.sentence;
    }
    this.children = new Array();

    var len = json.children.length;
    for(var i = 0; i < len; i++) {
        var child = new HTNode(json.children[i]);
//        alert(child.name);
        this.children.push(child);
    }

    this.isLeaf = function() {
        return (this.children.length == 0);
    }
}
