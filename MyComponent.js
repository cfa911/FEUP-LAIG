/**
 * MyComponent
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyComponent extends CGFobject
{
	constructor(scene, id, transformations = mat4.create(), materials = 0, textures = 0, children = 0)
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