//
// start here
//
function main() {
    var kanvas = document.getElementById("kanvas");
    // Initialize the GL context
    const gl = kanvas.getContext("webgl");

    var vertices = [
      0.5, 0.5, //A: kanan atas
      0.0, 0.0, //B: bawah tengah
      -0.5, 0.5, // C: kiri atas
      0.0, 1.0  //D: atas tengah
    ]; // x1, y1, x2, y2, x3, y3

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    //vertex shader
    var vertexShaderCode = `
    attribute vec2 aPosition;
    void main() { 
      float x = aPosition.x;
      float y = aPosition.y;
      gl_PointSize = 10.0;
      gl_Position = vec4(x, y, 0.0, 1.0);
    }
    `;

    var vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderObject, vertexShaderCode);
    gl.compileShader(vertexShaderObject);   //sampai sini jadi file .o

    //fragment shader
    var fragmentShaderCode = `
    void main() {
      precision mediump float;
      float r = 1.0;
      float g = 0.0;
      float b = 0.0;
      float a = 1.0;
      gl_FragColor = vec4(r, g, b, a);
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

    // Mengajari GPU bagaimana caranya mengoleksi nilai posisi dari ARRAY_BUFFER
    // Untuk setiap verteks yang sedang diproses

    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    // Only continue if WebGL is available and working
    if (gl === null) {
      alert("Unable to initialize WebGL. Your browser or machine may not support it.");
      return;
    }
  
    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  //BLACK
    //dari kiri ke kanan Red --> Green --> Blue --> Transparansi

    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);  

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }
  
  window.onload = main;
  