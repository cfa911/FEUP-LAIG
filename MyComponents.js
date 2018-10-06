/**
 * MyComponents
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyComponents extends CGFobject
{
	constructor(scene,transformations,materials,textures,children)
	{
		super(scene);
        this.transformations = transformations;
        this.materials = materials;
        this.textures = textures;
        this.children = children;
		this.initBuffers();
	};

	initBuffers()
	{
		//apply changes
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    }
}