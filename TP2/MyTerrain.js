/**
 * MyTerrain
 * @param gl {WebGLRenderingContext}
 * @constructor
 */


class MyTerrain extends MyPlane{
	constructor (scene, idtexture, idheightmap, parts, heightScale) {
		super(scene, parts, parts);
		this.texTerrain = idtexture;
		this.idheightmap = idheightmap;
		this.heightScale = heightScale;

        this.terrainShader = new CGFshader(this.scene.gl, "shaders/texture3.vert", "shaders/texture3.frag");
    }
    
    changeLength(length_s, length_t) {}

	display() {
		this.scene.setActiveShader(this.terrainShader);
		this.texTerrain.bind();
		this.idheightmap.bind(1);
		
		this.terrainShader.setUniformsValues({heightScale: this.heightScale, uSampler2: 1});

        this.surfaces.display();
		this.scene.setActiveShader(this.scene.defaultShader);
	}
}