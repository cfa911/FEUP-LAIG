/**
 * MyComponent
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyComponent extends CGFobject
{
	constructor(scene, id, transformations, materials, textures, children)
	{
		super(scene);
		this.id = id;
        this.transformations = transformations;
        this.materials = materials;
        this.textures = textures;
        this.children = children; "sera uma nova class de MyComponents"
		this.initBuffers();
	};

	initBuffers()
	{
		//apply changes
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    }
}