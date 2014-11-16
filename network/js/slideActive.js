var sld3 = new network.Slider("idSlider3", "idBar3", {
    onMin: function(){ network.$id("idCurrentState").innerHTML = "到达开始值"; },
    onMax: function(){ network.$id("idCurrentState").innerHTML = "到达结束值"; },
    onMid: function(){ network.$id("idCurrentState").innerHTML = "滑动中"; },
    onMove: function(){
        network.$id("idCurrentValue").innerHTML = Math.round(this.GetValue());
        network.$id("idCurrentPercent").innerHTML = Math.round(this.GetPercent() * 100);
    }
});
sld3.onMove();