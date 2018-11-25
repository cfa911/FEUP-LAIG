/**
 * MyWater
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyWater extends MyPlane {

	constructor(scene, idtexture, idwavemap, parts, heightscale, texscale)
	{
        super(scene, parts, parts);
        this.idtexture = idtexture;
        this.idwavemap = idwavemap;
        this.heightscale = heightscale;
        this.texscale = texscale;
        this.initTime = Date.now();
        this.waterShader = new CGFshader(this.scene.gl, "shaders/water.vert", "shaders/water.frag");
    };
    
    changeLength(length_s, length_t) {}

    display() {
        this.scene.setActiveShader(this.waterShader);
        this.idtexture.bind();
        this.idwavemap.bind(1);
        var factor = (Date.now() - this.initTime) * 0.001 * 0.05;
        this.waterShader.setUniformsValues({timeFactor: factor, heightScale: this.heightscale, uSampler2: 1, texScale: this.texscale});
        
        //this.waterShader.setUniformsValues({heightScale: this.heightScale, uSampler2: 1});
        this.scene.translate(0, 0.015, 0);
        this.surfaces.display();
		this.scene.setActiveShader(this.scene.defaultShader);
    }
};