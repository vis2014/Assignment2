network.isIE = (document.all) ? true : false;

network.$id = function (id) {
    return "string" == typeof id ? document.getElementById(id) : id;
};

network.Class = {
    create: function() {
        return function() { this.initialize.apply(this, arguments); }
    }
}

network.Extend = function(destination, source) {
    for (var property in source) {
        destination[property] = source[property];
    }
}

network.Bind = function(object, fun) {
    var args = Array.prototype.slice.call(arguments).slice(2);
    return function() {
        return fun.apply(object, args);
    }
}

network.BindAsEventListener = function(object, fun) {
    return function(event) {
        return fun.call(object, network.Event(event));
    }
}

network.Event=function(e){
    var oEvent = network.isIE ? window.event : e;
    if (network.isIE) {
        oEvent.pageX = oEvent.clientX + document.documentElement.scrollLeft;
        oEvent.pageY = oEvent.clientY + document.documentElement.scrollTop;
        oEvent.preventDefault = function () { this.returnValue = false; };
        oEvent.detail = oEvent.wheelDelta / (-40);
        oEvent.stopPropagation = function(){ this.cancelBubble = true; };
    }
    return oEvent;
}

network.CurrentStyle = function(element){
    return element.currentStyle || document.defaultView.getComputedStyle(element, null);
}

network.addEventHandler = function(oTarget, sEventType, fnHandler) {
    if (oTarget.addEventListener) {
        oTarget.addEventListener(sEventType, fnHandler, false);
    } else if (oTarget.attachEvent) {
        oTarget.attachEvent("on" + sEventType, fnHandler);
    } else {
        oTarget["on" + sEventType] = fnHandler;
    }
};

network.removeEventHandler = function(oTarget, sEventType, fnHandler) {
    if (oTarget.removeEventListener) {
        oTarget.removeEventListener(sEventType, fnHandler, false);
    } else if (oTarget.detachEvent) {
        oTarget.detachEvent("on" + sEventType, fnHandler);
    } else {
        oTarget["on" + sEventType] = null;
    }
};
