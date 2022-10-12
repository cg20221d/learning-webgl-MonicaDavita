//
// start here
//
function main() {
  var kanvas = document.getElementById("kanvas");
  // Initialize the GL context
  const gl = kanvas.getContext("webgl");

  var vertices = [
    0.5, 0.0, 0.0, 1.0, 1.0,   
    0.0, -0.5, 1.0, 0.0, 1.0, 
    -0.5, 0.0, 1.0, 1.0, 0.0,  
    0.0, 0.5, 1.0, 1.0, 1.0 
  ]; // x1, y1, r1, g1, b1,
    // x2, y2, r2, g2, b2,
    // x3, y3, r3, g3, b3

  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  //vertex shader
  var vertexShaderCode = `
    attribute vec2 aPosition;
    attribute vec3 aColor;
    uniform float uTheta;
    varying vec3 vColor;
    uniform float dx;
    uniform float dy;
    uniform vec2 uDelta;
    void main() { 
      // float x = -sin(uTheta)*aPosition.x + cos(uTheta)*aPosition.y + dx;
      // float y = cos(uTheta)*aPosition.x + sin(uTheta)*aPosition.y + dy;
      //gl_PointSize = 10.0;
      vec2 position = aPosition;
      vec3 d = vec3(0.5, -0.5, 0.0);
      mat4 rotation = mat4(cos(uTheta), sin(uTheta), 0.0, 0.0,
                          -sin(uTheta), cos(uTheta), 0.0, 0.0,
                          0.0, 0.0, 1.0, 0.0,
                          0.0, 0.0, 0.0, 1.0);
      mat4 translation = mat4(1.0, 0.0, 0.0, 0.0,
                              0.0, 1.0, 0.0, 0.0,
                              0.0, 0.0, 1.0, 0.0,
                              uDelta.x, uDelta.y, 0.0, 1.0);
      gl_Position = translation * rotation * vec4(position, 0.0, 1.0);
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
  gl.attachShader(shaderProgram, fragmentShaderObject);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);

  //variabel lokal
  var theta = 0.0;
  var freeze = false;
  var deltaX = 0.0;
  var deltaY = 0.0;
  var horizontalDelta = 0.0;
  var horizontalSpeed = 0.0;
  var verticalDelta = 0.0;
  var verticalSpeed = 0.0;

  //Variabel pointer ke GLSG
  var uTheta = gl.getUniformLocation(shaderProgram, "uTheta");
  var uDelta = gl.getUniformLocation(shaderProgram, "uDelta");
  var dx = gl.getUniformLocation(shaderProgram, "dx");
  var dy = gl.getUniformLocation(shaderProgram, "dy");
 
  // Mengajari GPU bagaimana caranya mengoleksi nilai posisi dari ARRAY_BUFFER
  // Untuk setiap verteks yang sedang diproses

  var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
  gl.enableVertexAttribArray(aPosition);

  var aColor = gl.getAttribLocation(shaderProgram, "aColor");
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
  gl.enableVertexAttribArray(aColor);

  //Grafika Interkatif Mouse
  function onMouseClick(event) {
    freeze = !freeze;
  }
  document.addEventListener("click", onMouseClick);

  //Grafika Iteraktif Keyboard
  function onKeyDown(event){
    if (event.keyCode == 32) freeze = true;
    if (event.keyCode == 65) deltaX -= 0.2;
    if (event.keyCode == 83) deltaY -= 0.2;
    if (event.keyCode == 68) deltaX += 0.2;
    if (event.keyCode == 87) deltaY += 0.2;
  }
  function onKeyUp(event){
    if (event.keyCode == 32) freeze = false;
  }
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  function render() {
    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  //BLACK
    //dari kiri ke kanan Red --> Green --> Blue --> Transparansi

    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (!freeze) {
      theta += 0.1;
    }
    horizontalDelta += horizontalSpeed;
    verticalDelta -= verticalSpeed;
    gl.uniform2f(uDelta, horizontalDelta, verticalDelta);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    requestAnimationFrame(render);
    render();
   }
  requestAnimationFrame(render);

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

}

window.onload = main;
