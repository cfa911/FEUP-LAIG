/**
 * MyRectangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyRectangle extends CGFobject
{
	constructor(scene, minX, minY, maxX, maxY)
	{
        super(scene);
        this.minS = minX;
        this.maxS = maxX;
        this.minT = minY;
        this.maxT = maxY;
        this.initBuffers();
	};

	initBuffers()
	{
		this.vertices = [
            -0.5, -0.5, 0,
            0.5, -0.5, 0,
            -0.5, 0.5, 0,
            0.5, 0.5, 0,

            ];

        this.indices = [
            0, 1, 2,
            3, 2, 1,

            ];

        this.normals = [
			0, 0, 1, 
			0, 0, 1,
			0, 0, 1,
            0, 0, 1,
            
		    ];

	    this.texCoords = [
			this.minS, this.maxT, // 0,1
			this.maxS, this.maxT, // 1,1,
			this.minS, this.minT, // 0,0, 
			this.maxS, this.minT // 1,0
		    ];

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    }
}