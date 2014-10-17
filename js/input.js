var Input = (function() {
    var mouseDown = false;
    var lastX = null;
    var lastY = null;
    var lastVelX = null;
    var lastVelY = null;

    var timeDecay = 0.8;
    var velSmoothing = 0.1;

    var handleMouseDown = function(event) {
        mouseDown = true;
        lastX = event.clientX;
        lastY = event.clientY;
    };


    var handleMouseUp = function(event) {
        mouseDown = false;
    };


    var handleMouseMove = function(event) {
        var newX = event.clientX;
        var newY = event.clientY;

        lastVelX += velSmoothing * (newX - lastX - lastVelX);
        lastVelY += velSmoothing * (newY - lastY - lastVelY);

        lastX = newX
        lastY = newY;
    };

    var handleTouchStart = function(e) {
        lastVelX += velSmoothing * (e.touches[0].pageX - lastX - lastVelX);
        lastVelY += velSmoothing * (e.touches[0].pageY - lastY - lastVelY);
        lastX = e.touches[0].pageX
        lastY = e.touches[0].pageY
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        if (e && e.stopPropagation) {
            e.stopPropagation();
        }
        return false;
    };

    var handleTouchMove = function(e) {
        lastVelX += velSmoothing * (e.touches[0].pageX - lastX - lastVelX);
        lastVelY += velSmoothing * (e.touches[0].pageY - lastY - lastVelY);
        lastX = e.touches[0].pageX
        lastY = e.touches[0].pageY
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        if (e && e.stopPropagation) {
            e.stopPropagation();
        }
        return false;
    };

    var tick = function() {
        lastVelX *= timeDecay;
        lastVelY *= timeDecay;
    };

    return {
        lastX: function(){return lastX},
        lastY: function(){return lastY},
        lastVelX: function(){return lastVelX},
        lastVelY: function(){return lastVelY},

        handleMouseDown: handleMouseDown,
        handleMouseUp: handleMouseUp,
        handleMouseMove: handleMouseMove,
        handleTouchStart: handleTouchStart,
        handleTouchMove: handleTouchMove,

        tick: tick
    };
})();