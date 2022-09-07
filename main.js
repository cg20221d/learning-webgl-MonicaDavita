//
// start here
//
function main() {
    var kanvas = document.getElementById("kanvas");
    // Initialize the GL context
    const gl = kanvas.getContext("webgl");

    //vertex shader
    var vertexShaderCode = 
    "void main() {" +
    "}";

    var vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderObject, vertexShaderCode);
    gl.compileShader(vertexShaderObject);   //sampai sini jadi file .o

    //fragment shader
    var fragmentShaderCode = `
    void main() {

    }
    `;

    var fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShaderObject, fragmentShaderCode);
    gl.compileShader(fragmentShaderObject);   //sampai sini jadi file .o

    var shaderProgram = gl.createProgram(); //wadah executeable shadernya nanti (.exe)

    gl.attachShader(shaderProgram, vertexShaderObject);
    gl.attachShader(shaderProgram,fragmentShaderObject);
    gl.linkProgram(shaderProgram);

    gl.useProgram(shaderProgram)

    // Only continue if WebGL is available and working
    if (gl === null) {
      alert("Unable to initialize WebGL. Your browser or machine may not support it.");
      return;
    }
  
    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  //dari kiri ke kanan Red --> Green --> Blue --> Transparansi

    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);  
  }
  
  window.onload = main;
  