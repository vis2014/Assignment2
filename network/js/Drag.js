//create a slider object
network.Drag = network.Class.create();

network.Drag.prototype = {
    //initialize a drag objects
    initialize: function(drag, options) {
        this.Drag = network.$id(drag);
        this._x = this._y = 0;
        this._marginLeft = this._marginTop = 0;

        this._fM = network.BindAsEventListener(this, this.Move);
        this._fS = network.Bind(this, this.Stop);

        this.SetOptions(options);

        this.Limit = !!this.options.Limit;
        this.mxLeft = parseInt(this.options.mxLeft);
        this.mxRight = parseInt(this.options.mxRight);
        this.mxTop = parseInt(this.options.mxTop);
        this.mxBottom = parseInt(this.options.mxBottom);

        this.LockX = !!this.options.LockX;
        this.LockY = !!this.options.LockY;
        this.Lock = !!this.options.Lock;

        this.onStart = this.options.onStart;
        this.onMove = this.options.onMove;
        this.onStop = this.options.onStop;

        this._Handle = network.$id(this.options.Handle) || this.Drag;
        this._mxContainer = network.$id(this.options.mxContainer) || null;

        this.Drag.style.position = "absolute";

        if(network.isIE && !!this.options.Transparent){

            with(this._Handle.appendChild(document.createElement("div")).style){
                width = height = "100%"; backgroundColor = "#fff"; filter = "alpha(opacity:0)"; fontSize = 0;
            }
        }

        this.Repair();
        network.addEventHandler(this._Handle, "mousedown", network.BindAsEventListener(this, this.Start));
    },
    //set the default properties
    SetOptions: function(options) {
        this.options = {
            Handle:			"",
            Limit:			false,
            mxLeft:			0,
            mxRight:		9999,
            mxTop:			0,
            mxBottom:		9999,
            mxContainer:	"",
            LockX:			false,
            LockY:			false,
            Lock:			false,
            Transparent:	false,
            onStart:		function(){},
            onMove:			function(){},
            onStop:			function(){}
        };
        network.Extend(this.options, options || {});
    },

    Start: function(oEvent) {
        if(this.Lock){ return; }
        this.Repair();

        this._x = oEvent.clientX - this.Drag.offsetLeft;
        this._y = oEvent.clientY - this.Drag.offsetTop;

        this._marginLeft = parseInt(network.CurrentStyle(this.Drag).marginLeft) || 0;
        this._marginTop = parseInt(network.CurrentStyle(this.Drag).marginTop) || 0;

        network.addEventHandler(document, "mousemove", this._fM);
        network.addEventHandler(document, "mouseup", this._fS);
        if(network.isIE){

            network.addEventHandler(this._Handle, "losecapture", this._fS);

            this._Handle.setCapture();
        }else{

            network.addEventHandler(window, "blur", this._fS);

            oEvent.preventDefault();
        };

        this.onStart();
    },

    Repair: function() {
        if(this.Limit){

            this.mxRight = Math.max(this.mxRight, this.mxLeft + this.Drag.offsetWidth);
            this.mxBottom = Math.max(this.mxBottom, this.mxTop + this.Drag.offsetHeight);

            !this._mxContainer || network.CurrentStyle(this._mxContainer).position == "relative" || network.CurrentStyle(this._mxContainer).position == "absolute" || (this._mxContainer.style.position = "relative");
        }
    },

    Move: function(oEvent) {

        if(this.Lock){ this.Stop(); return; };

        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

        this.SetPos(oEvent.clientX - this._x, oEvent.clientY - this._y);
    },

    SetPos: function(iLeft, iTop) {

        if(this.Limit){

            var mxLeft = this.mxLeft, mxRight = this.mxRight, mxTop = this.mxTop, mxBottom = this.mxBottom;

            if(!!this._mxContainer){
                mxLeft = Math.max(mxLeft, 0);
                mxTop = Math.max(mxTop, 0);
                mxRight = Math.min(mxRight, this._mxContainer.clientWidth);
                mxBottom = Math.min(mxBottom, this._mxContainer.clientHeight);
            };

            iLeft = Math.max(Math.min(iLeft, mxRight - this.Drag.offsetWidth), mxLeft);
            iTop = Math.max(Math.min(iTop, mxBottom - this.Drag.offsetHeight), mxTop);
        }

        if(!this.LockX){ this.Drag.style.left = iLeft - this._marginLeft + "px"; }
        if(!this.LockY){ this.Drag.style.top = iTop - this._marginTop + "px"; }

        this.onMove();
    },

    Stop: function() {

        network.removeEventHandler(document, "mousemove", this._fM);
        network.removeEventHandler(document, "mouseup", this._fS);
        if(network.isIE){
            network.removeEventHandler(this._Handle, "losecapture", this._fS);
            this._Handle.releaseCapture();
        }else{
            network.removeEventHandler(window, "blur", this._fS);
        };

        this.onStop();
    }
};