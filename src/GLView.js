function requestShaderSource(shaderPath, callback) {
    var isAsync = !!callback;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', shaderPath, isAsync);
    xhr.send();
    if (isAsync) {
        xhr.onload(function () {
            callback(xhr.responseText);
        });
        xhr.onerror(function () {
            throw new Error("Cannot load shader " + shaderPath);
        });
    } else return xhr.responseText;
}

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success) {
        return shader;
    }

    console.info(gl.getShaderInfoLog(shader));
    this.gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.info(this.gl.getProgramInfoLog(program));
    this.gl.deleteProgram(program);
}

function GLView(containerElement) {

    this._chart = document.createElement('canvas');
    this._chart.style.position = 'absolute';
    containerElement.appendChild(this._chart);

    var gl = this._chart.getContext("webgl");

    this.gl = gl;

    //var vertexShaderSource = document.getElementById("shader.vert").innerText;
    //var fragmentShaderSource = document.getElementById("shader.vert").text;

    var vertexShaderSource = requestShaderSource('shaders/shader.vert');
    var fragmentShaderSource = requestShaderSource('shaders/shader.frag');

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    var program = createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    var mouseUniformLocation = gl.getUniformLocation(program, 'mouse');

    this._chart.onmousemove = function (event) {
        var x = (event.clientX - this.offsetLeft) / rect.width;
        var y = (event.clientY - this.offsetTop) / rect.height;
        gl.uniform2f(mouseUniformLocation, x, y);
    };

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var positions = [
        0, 0,
        1, 0,
        0, 1,
        0, 1,
        1, 0,
        1, 1
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    this.gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    // canvas.width = 640;
    // canvas.height = 480;
    var rect = containerElement.getBoundingClientRect();
    this._chart.width = rect.width;
    this._chart.height = rect.height;
    this.gl.viewport(0,0, rect.width, rect.height);
}

GLView.prototype.draw = function() {
    this.gl.clearColor(0,0,0,0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    var primitiveType = this.gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    this.gl.drawArrays(primitiveType, offset, count);
};

module.exports = GLView;
