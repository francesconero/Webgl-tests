var canvas;
var gl;
var fps = 60, timeSince=17, lastTime=Date.now();

function initGL(canvas) {
    try {
        gl = WebGLUtils.setupWebGL(canvas, {antialias:false});
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

var shaderProgram;

function initShaders() {
    var fragmentShader = WebGLUtils.loadShaders(gl, "fs/f-shader")[0];
    var vertexShader = WebGLUtils.loadShaders(gl, "vs/v-shader")[0];

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);


    shaderProgram.mousePosition = gl.getUniformLocation(shaderProgram, "mouseP");
    shaderProgram.mouseVelocity = gl.getUniformLocation(shaderProgram, "mouseV");
}

var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
var mouseSpeedX = null;
var mouseSpeedY = null;

function handleMouseDown(event) {
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}


function handleMouseUp(event) {
    mouseDown = false;
}


function handleMouseMove(event) {
    var newX = event.clientX;
    var newY = event.clientY;

    mouseSpeedX += 0.01*(newX - lastMouseX - mouseSpeedX);
    mouseSpeedY += 0.01*(newY - lastMouseY - mouseSpeedY);

    lastMouseX = newX
    lastMouseY = newY;
}

function initBuffers() {
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            -1.0, -1.0,
            1.0, -1.0,
            -1.0,  1.0,
            -1.0,  1.0,
            1.0, -1.0,
            1.0,  1.0]),
        gl.STATIC_DRAW
    );
}


function drawScene() {
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    if(mouseSpeedX==null || mouseSpeedY==null){
        gl.uniform2f(shaderProgram.mousePosition, 0.0, 0.0);
        gl.uniform2f(shaderProgram.mouseVelocity, 0.0, 0.0);
    } else {
        gl.uniform2f(shaderProgram.mousePosition, lastMouseX, canvas.height-lastMouseY);
        gl.uniform2f(shaderProgram.mouseVelocity, mouseSpeedX, -mouseSpeedY);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}


function tick() {
    var currentTime = Date.now();
    timeSince += (currentTime - lastTime - timeSince) * 0.2;
    if(timeSince!=0){
        fps += ((1000/timeSince)-fps)*0.02;
    }
        lastTime = currentTime;
    mouseSpeedX *= 0.95;
    mouseSpeedY *= 0.95;
    requestAnimFrame(tick);
    resizeCanvas();
    drawScene();
}



function resizeCanvas() {
    // only change the size of the canvas if the size it's being displayed
    // has changed.
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    if (canvas.width != width ||
        canvas.height != height) {
        console.log("Size changed to: "+width+" "+height);
        // Change the size of the canvas to match the size it's being displayed
        canvas.width = width;
        canvas.height = height;
    }
};


function webGLStart() {
    window.setInterval(function(){$("#FPS").text("FPS: "+fps.toFixed(0));},100);
    canvas = document.getElementById("main_canvas");
    resizeCanvas();
    initGL(canvas);
    initShaders();
    initBuffers();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;
    canvas.ontouchstart = function(e) {
        mouseSpeedX += 0.01*(e.touches[0].pageX - lastMouseX - mouseSpeedX);
        mouseSpeedY += 0.01*(e.touches[0].pageY - lastMouseY - mouseSpeedY);
        lastMouseX = e.touches[0].pageX
        lastMouseY = e.touches[0].pageY
        if (e && e.preventDefault) { e.preventDefault(); }
        if (e && e.stopPropagation) { e.stopPropagation(); }
        return false;
    };

    canvas.ontouchmove = function(e) {
        mouseSpeedX += 0.01*(e.touches[0].pageX - lastMouseX - mouseSpeedX);
        mouseSpeedY += 0.01*(e.touches[0].pageY - lastMouseY - mouseSpeedY);
        lastMouseX = e.touches[0].pageX
        lastMouseY = e.touches[0].pageY
        if (e && e.preventDefault) { e.preventDefault(); }
        if (e && e.stopPropagation) { e.stopPropagation(); }
        return false;
    };
    tick();
}

