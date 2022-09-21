//
// start here
//
function main() {
    var kanvas = document.getElementById("kanvas");
    // Initialize the GL context
    const gl = kanvas.getContext("webgl");

    var vertices = [
      0.5, 0.5, 0.996, 0.578, 0.578, //A: kanan atas (FF9494 --> 0.996, 0.578, 0.578)
      0.0, 0.0, 0.996, 0.816, 0.816, //B: bawah tengah (FFD1D1 --> 0.996, 0.816, 0.816)
      -0.5, 0.5, 0.996, 0.887, 0.879, // C: kiri atas (FFE3E1 --> 0.996, 0.887, 0.879)
      0.0, 1.0, 0.998, 0.957, 0.891, //D: atas tengah (FFF5E4 --> 0.998, 0.957, 0.891)
    ]; // x1, y1, x2, y2, x3, y3

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    //vertex shader
    var vertexShaderCode = `
    attribute vec2 aPosition;
    attribute vec3 aColor;
    uniform float uTheta;
    varying vec3 vColor;
    void main() { 
      float x = -sin(uTheta)*aPosition.x + cos(uTheta)*aPosition.y;
      float y = cos(uTheta)*aPosition.x + sin(uTheta)*aPosition.y;
      //gl_PointSize = 10.0;
      gl_Position = vec4(x, y, 0.0, 1.0);
      vColor = aColor;
    }
    `;

    var vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderObject, vertexShaderCode);
    gl.compileShader(vertexShaderObject);   //sampai sini jadi file .o

    //fragment shader
    var fragmentShaderCode = `
    precision mediump float;
    varying vec3 vColor;
    void main() {
      gl_FragColor = vec4(vColor, 1.0);
    }
    `;

    var fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShaderObject, fragmentShaderCode);
    gl.compileShader(fragmentShaderObject);   //sampai sini jadi file .o

    var shaderProgram = gl.createProgram(); //wadah executeable shadernya nanti (.exe)

    gl.attachShader(shaderProgram, vertexShaderObject);
    gl.attachShader(shaderProgram,fragmentShaderObject);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    //variabel lokal
    var theta = 0.0;

    //Variabel pointer ke GLSG
    var uTheta = gl.getUniformLocation(shaderProgram, "uTheta");

    // Mengajari GPU bagaimana caranya mengoleksi nilai posisi dari ARRAY_BUFFER
    // Untuk setiap verteks yang sedang diproses

    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(aPosition);

    var aColor = gl.getAttribLocation(shaderProgram, "aColor");
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aColor);

    function render(){
    // Set clear color to black, fully opaque
      gl.clearColor(0.0, 0.0, 0.0, 1.0);  //BLACK
    //dari kiri ke kanan Red --> Green --> Blue --> Transparansi

    // Clear the color buffer with specified clear color
      gl.clear(gl.COLOR_BUFFER_BIT);  
      theta += 0.1;
      gl.uniform1f(uTheta, theta);
      // var vektor2D = [x, y];
      // gl.uniform2f(uTheta, vektor2D[0], vektor2D[1]);
      // gl.uniform2fv(uTheta, vektor2D);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      //render();
    }
    setInterval(render, 1000/60);

    // Only continue if WebGL is available and working
    if (gl === null) {
      alert("Unable to initialize WebGL. Your browser or machine may not support it.");
      return;
    }
  
  }
  
  window.onload = main;
  