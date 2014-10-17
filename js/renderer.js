var Renderer = (function() {
    var canvas;
    var gl;

    var shaderProgramTex;
    var shaderProgramCompute;

    var startTime;
    var a = 0.08;
    var b = 0.85;
    var blockCountX;
    var blockCountY;
    var fboA, fboB, textureA, textureB;
    var counter=0;

    function initShaders(fragmentShader) {
        initGraphicShader(fragmentShader);
        initComputeShader();
    }

    function initComputeShader() {
        var fragmentShader = WebGLUtils.loadShaders(gl, "fs/f-shader-compute" )[0];
        var vertexShader = WebGLUtils.loadShaders(gl, "vs/v-shader")[0];

        shaderProgramCompute = gl.createProgram();
        gl.attachShader(shaderProgramCompute, vertexShader);
        gl.attachShader(shaderProgramCompute, fragmentShader);
        gl.linkProgram(shaderProgramCompute);

        if (!gl.getProgramParameter(shaderProgramTex, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        shaderProgramCompute.positionLocation = gl.getAttribLocation(shaderProgramCompute, "a_position");
        shaderProgramCompute.texCoordLocation = gl.getAttribLocation(shaderProgramCompute, "a_texCoord");

        shaderProgramCompute.mousePosition = gl.getUniformLocation(shaderProgramCompute, "mouseP");
        shaderProgramCompute.mouseVelocity = gl.getUniformLocation(shaderProgramCompute, "mouseV");
        shaderProgramCompute.time = gl.getUniformLocation(shaderProgramCompute, "time");
        shaderProgramCompute.canvasSize = gl.getUniformLocation(shaderProgramCompute, "screenSize");
        shaderProgramCompute.blockCount = gl.getUniformLocation(shaderProgramCompute, "u_blockCount");
        shaderProgramCompute.a = gl.getUniformLocation(shaderProgramCompute, "a");
        shaderProgramCompute.b = gl.getUniformLocation(shaderProgramCompute, "b");

        shaderProgramCompute.input = gl.getUniformLocation(shaderProgramCompute, "u_input");
    }

    function initGraphicShader(fragmentShader) {
        var fragmentShader = WebGLUtils.loadShaders(gl, "fs/"+fragmentShader)[0];
        var vertexShader = WebGLUtils.loadShaders(gl, "vs/v-shader")[0];

        shaderProgramTex = gl.createProgram();
        gl.attachShader(shaderProgramTex, vertexShader);
        gl.attachShader(shaderProgramTex, fragmentShader);
        gl.linkProgram(shaderProgramTex);

        if (!gl.getProgramParameter(shaderProgramTex, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgramTex);


        shaderProgramTex.positionLocation = gl.getAttribLocation(shaderProgramTex, "a_position");
        shaderProgramTex.texCoordLocation = gl.getAttribLocation(shaderProgramTex, "a_texCoord");

        shaderProgramTex.mousePosition = gl.getUniformLocation(shaderProgramTex, "mouseP");
        shaderProgramTex.mouseVelocity = gl.getUniformLocation(shaderProgramTex, "mouseV");
        shaderProgramTex.time = gl.getUniformLocation(shaderProgramTex, "time");
        shaderProgramTex.canvasSize = gl.getUniformLocation(shaderProgramTex, "screenSize");
        shaderProgramTex.blockCount = gl.getUniformLocation(shaderProgramTex, "u_blockCount");
        shaderProgramTex.a = gl.getUniformLocation(shaderProgramTex, "a");
        shaderProgramTex.b = gl.getUniformLocation(shaderProgramTex, "b");

        shaderProgramTex.tex = gl.getUniformLocation(shaderProgramTex, "u_tex");
    }

    var buffer, texCoordBuffer;

    function initBuffers() {
        buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                -1.0, -1.0,
                1.0, -1.0,
                -1.0, 1.0,
                -1.0, 1.0,
                1.0, -1.0,
                1.0, 1.0]),
            gl.STATIC_DRAW
        );

        texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0.0,  0.0,
            1.0,  0.0,
            0.0,  1.0,
            0.0,  1.0,
            1.0,  0.0,
            1.0,  1.0]), gl.STATIC_DRAW
        );
    }

    function textureFromPixelArray(gl, dataArray, type, width, height, textureID) {
        var dataTypedArray = new Uint8Array(dataArray); // Don't need to do this if the data is already in a typed array
        var texture = gl.createTexture();
        gl.activeTexture(textureID);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, type, width, height, 0, type, gl.UNSIGNED_BYTE, dataTypedArray);
        // Set up texture so we can render any size image and so we are
        // working with pixels.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        return texture;
    }

    function drawScene() {
        gl.useProgram(shaderProgramCompute);
        gl.uniform2f(shaderProgramCompute.blockCount, blockCountX, blockCountY);
        if(counter%2==0) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, fboA);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, textureB);
        } else {
            gl.bindFramebuffer(gl.FRAMEBUFFER, fboB);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, textureA);
        }

        gl.viewport(0, 0, blockCountX, blockCountY);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        if(counter%2==0) {
            gl.activeTexture(gl.TEXTURE2);
            gl.bindTexture(gl.TEXTURE_2D, textureA);
        } else {
            gl.activeTexture(gl.TEXTURE2);
            gl.bindTexture(gl.TEXTURE_2D, textureB);
        }
/*
        if (Input.lastVelX() === null || Input.lastVelY() === null) {
            gl.uniform2f(shaderProgramTex.mousePosition, 0.0, 0.0);
            gl.uniform2f(shaderProgramTex.mouseVelocity, 0.0, 0.0);
        } else {
            gl.uniform2f(shaderProgramTex.mousePosition, Input.lastX(), canvas.height - Input.lastY());
            gl.uniform2f(shaderProgramTex.mouseVelocity, Input.lastVelX(), -Input.lastVelY());
        }
        gl.uniform2f(shaderProgramTex.canvasSize, canvas.width, canvas.height);
        gl.uniform2f(shaderProgramTex.blockCount, blockCountX, blockCountY);
        gl.uniform1i(shaderProgramTex.time, Date.now()-startTime);*/
        gl.uniform1f(shaderProgramCompute.a, a);
        gl.uniform1f(shaderProgramCompute.b, b);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        resizeCanvas();
        gl.useProgram(shaderProgramTex);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        counter++;
    }

    function initScene() {
        resizeCanvas();
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        //setup vertex coordinates
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(shaderProgramTex.positionLocation);
        gl.vertexAttribPointer(shaderProgramTex.positionLocation, 2, gl.FLOAT, false, 0, 0);

        //setup texture coordinates
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.enableVertexAttribArray(shaderProgramTex.texCoordLocation);
        gl.vertexAttribPointer(shaderProgramTex.texCoordLocation, 2, gl.FLOAT, false, 0, 0);

        gl.uniform1i(shaderProgramTex.tex, 2);
    }

    function createFBOs() {
        blockCountX = 2048;
        blockCountY = 2048;
//        blockCountX = Math.floor(canvas.width/10.0);
//        blockCountY = Math.floor(canvas.height/10.0);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(shaderProgramCompute.positionLocation);
        gl.vertexAttribPointer(shaderProgramCompute.positionLocation, 2, gl.FLOAT, false, 0, 0);
        //setup texture coordinates
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.enableVertexAttribArray(shaderProgramCompute.texCoordLocation);
        gl.vertexAttribPointer(shaderProgramCompute.texCoordLocation, 2, gl.FLOAT, false, 0, 0);

        var area = blockCountX*blockCountY;
        var randArray = new Array(area*4);

        //random data for input texture
        for(var i = 0; i < area*4; i+=4){
            randArray[i] = Math.random()>=0.7?255:0;
            randArray[i+1] = 0;
            randArray[i+2] = 0;
            randArray[i+3] = 255;
        }


        fboA = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fboA);
        fboA.width = blockCountX;
        fboA.height = blockCountY;
        textureA = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureA);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, fboA.width, fboA.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(randArray));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textureA, 0);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        fboB = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fboB);
        fboB.width = blockCountX;
        fboB.height = blockCountY;
        textureB = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureB);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, fboB.width, fboB.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(randArray));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textureB, 0);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    function resizeCanvas() {
        // only change the size of the canvas if the size it's being displayed
        // has changed.
        var width = canvas.clientWidth;
        var height = canvas.clientHeight;
        if (canvas.width != width ||
            canvas.height != height) {
            console.log("Size changed to: " + width + " " + height);
            // Change the size of the canvas to match the size it's being displayed
            canvas.width = width;
            canvas.height = height;
        }
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    var WebGLStart = function (_canvas, fragmentShader) {
        startTime = Date.now();
        canvas = _canvas;
        gl = WebGLUtils.setupWebGL(canvas, {antialias: false});
        initBuffers();
        initShaders(fragmentShader);
        initScene();
        createFBOs();
    };

    return {
        WebGLStart: WebGLStart,
        drawScene: drawScene,
        setA: function(new_a){a = new_a},
        setB: function(new_b){b = new_b}
    };

})();