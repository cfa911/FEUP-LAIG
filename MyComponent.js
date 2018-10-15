/**
 * MyComponent
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyComponent extends CGFobject
{
	constructor(scene, id = 0, transformations = mat4.create(), materials = "none", textures = "none", children = "none" )
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
    }
}