
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler2;

uniform float heightScale;

void main() {
	vTextureCoord = aTextureCoord;
	vec4 color = texture2D(uSampler2, aTextureCoord);
	vec4 pos = vec4(aVertexPosition.x,
				aVertexPosition.y + color.r * color.a * heightScale,
				aVertexPosition.z,
				1.0);

	gl_Position = uPMatrix * uMVMatrix * pos;
}

