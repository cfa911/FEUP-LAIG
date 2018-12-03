
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler2;

uniform float heightScale;
uniform float timeFactor;
uniform float texScale;

void main() {
    vec2 temp = (aTextureCoord + timeFactor) * texScale;
	vTextureCoord = temp;
	vec4 color = texture2D(uSampler2, temp);

	vec4 pos = vec4(aVertexPosition.x,
				aVertexPosition.y + color.r * color.a * heightScale,
				aVertexPosition.z,
				1.0);

	gl_Position = uPMatrix * uMVMatrix * pos;
}
