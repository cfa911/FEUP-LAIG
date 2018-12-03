/**
 * MyRectangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyRectangle extends CGFobject
{
	constructor(scene, x1, y1, x2, y2, minS = 0.0, maxS = 1.0, minT = 0.0, maxT = 1.0)
	{
        super(scene);
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.minS = minS;
		this.maxS = maxS;
		this.minT = minT;
		this.maxT = maxT;
        this.initBuffers();
	};

	initBuffers()
	{
		this.vertices = [
            this.x1, this.y1, 0, //x1 y1
            this.x2, this.y1, 0, //x2 y1
            this.x1, this.y2, 0, //x1 y2
            this.x2, this.y2, 0, //x2 y2

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
			this.minS, this.maxT, // 0,1    1,1
			this.maxS, this.maxT, // 1,1,   0,1
			this.minS, this.minT, // 0,0,   1,0
			this.maxS, this.minT // 1,0     0,0
		];

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
	changeLength(length_s,length_t) {

		this.length_s = length_s;
		this.length_t = length_t;
	
		/*
		this.texCoords = [
			0, (this.y1 - this.y2) / this.length_t,
			(this.x2- this.x1) / this.length_s, (this.y1 - this.y2) / this.length_t,
			0, 0,
			(this.x2- this.x1) / this.length_s, 0,
		];*/
		this.texCoords = [
			0,  this.length_t,
			this.length_s, this.length_t,
			0, 0,
			this.length_s, 0
		];
	
		this.updateTexCoordsGLBuffers();
	};
}