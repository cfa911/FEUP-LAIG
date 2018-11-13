/**
 * MyComponent
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyComponent
{
	constructor(transformations = mat4.create(),animations = [], materials = [], textures = null, primitive = [],children = [])
	{
		this.transformations = transformations;
		this.animations = animations;
        this.materials = materials;
		this.textures = textures;
		this.primitive = primitive;
		this.children = children;
	}

}