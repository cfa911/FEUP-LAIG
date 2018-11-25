/**
 * MyTerrain
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyTerrain extends MyPlane
{
	constructor(scene, idtexture, idheightmap, parts, heightscale)
	{
        super(scene, parts, parts);
        this.idtexture = idtexture;
        this.idheightmap = idheightmap;
        this.heightscale = heightscale;

        this.testShader = new CGFshader(this.scene.gl, "shaders/texture3.vert", "shaders/texture3.frag");
        this.testShader.setUniformsValues({uSampler: 0});
        this.testShader.setUniformsValues({uSampler2: 1});
        this.testShader.setUniformsValues({heightscale: this.heightscale});

	};

    display() {
        this.scene.setActiveShader(this.testShader);
        //this.scene.pushMatrix();
        // textura
        this.idtexture.bind(0);
        this.idheightmap.bind(1);
        this.surfaces.display();
        //this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader)

    }
};