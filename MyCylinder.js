/**
 * MyCylinder
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCylinder extends CGFobject
{
	constructor(scene, base, top, height, slices, stacks, minS = 0, maxS = 1, minT = 0, maxT = 1)
	{
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.base = base;
        this.top = top;
        this.height = height;

		this.minS = minS;
        this.maxS = maxS;
        this.minT = minT;
        this.maxT = maxT;

        this.h = this.height / this.stacks;
        this.delta = (this.top - this.base) / this.stacks;
		this.initBuffers();
	};

	initBuffers()
	{
        var i, ang_og;

        this.vertices = [];
        this.indices = [];
        this.normals = [];
	    this.texCoords = [];

        var ang = 2*Math.PI / this.slices;
        var i, j;

        //Filling Vertices, normals and texCoords
        
        for(i = 0; i < this.stacks; i++)
        {
            var inc = (i * this.delta) + this.base;

            for(j = 0; j < this.slices; j++)
            {

                this.vertices.push(inc * Math.cos(j * ang),inc * Math.sin(j * ang), i * this.h);
                this.normals.push(Math.cos(j * ang), Math.sin(j * ang), 0);
                this.texCoords.push(this.minS + j * (this.maxS - this.minS) / this.slices,
                this.minT + i * (this.maxT - this.minT) / this.stacks);
            }
        }

        //Filling Indexs

        for(i = 0; i <= this.stacks * this.slices -1 - this.slices; i++)
        {
            this.indices.push(i, i + this.slices, i + this.slices - 1);
            this.indices.push(i, i + this.slices - 1, i + this.slices);
            this.indices.push(i, i + 1, i + this.slices);
            this.indices.push(i, i + this.slices, i + 1);
        }

		this.primitiveType=this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	};
};