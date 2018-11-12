/**
 * MyComponent
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyComponent
{
	constructor(transformations = mat4.create(), materials = [], textures = null, primitive = [],children = [])
	{
        this.transformations = transformations;
        this.materials = materials;
		this.textures = textures;
		this.primitive = primitive;
		this.children = children;
		this.display();
	};
	display(){}

}