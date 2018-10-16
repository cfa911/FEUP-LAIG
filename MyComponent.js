/**
 * MyComponent
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyComponent extends CGFobject
{
	constructor(scene, transformations = mat4.create(), materials = "none", textures = "none", primitive = [],children = [])
	{
		super(scene);
        this.transformations = transformations;
        this.materials = materials;
		this.textures = textures;
		this.primitive = primitive;
        this.children = children; "sera uma nova class de MyComponents"
		this.initBuffers();
	};

	initBuffers()
	{
    }
}