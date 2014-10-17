var stats;;

var ShaderObject = function() {
    this.decay = 0.08;
    this.threshold = 0.85;

    return{
        decay: this.decay,
        threshold: this.threshold
    };
};

function main(fragmentShader) {
    var canvas = document.getElementById("main_canvas");
    stats = new Stats(200);
    stats.setMode(0);

    document.body.appendChild( stats.domElement );

//    Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '20px';
    stats.domElement.style.top = '20px';

    var shaderObject = new ShaderObject();
    var gui = new dat.GUI({autoPlace:false});
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.right = '20px';
    gui.domElement.style.bottom = '40px';
    document.body.appendChild( gui.domElement );
    var aController = gui.add(shaderObject, 'decay', 0, 1.0);
    var bController = gui.add(shaderObject, 'threshold', 0.0, 1.0);

    aController.onChange(function(value){
        Renderer.setA(value);
    });

    bController.onChange(function(value){
        Renderer.setB(value);
    });

    Renderer.WebGLStart(canvas, fragmentShader);

    canvas.onmousedown = Input.handleMouseDown;
    canvas.onmouseup = Input.handleMouseUp;
    canvas.onmousemove = Input.handleMouseMove;
    canvas.ontouchstart = Input.handleTouchStart;
    canvas.ontouchmove = Input.handleTouchMove;
    tick();
}

function tick() {
    stats.update();
    Input.tick();
    requestAnimFrame(tick);
    Renderer.drawScene();
}