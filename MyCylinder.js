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

        this.deltaH = this.height / this.stacks;
        this.delta = (this.top - this.base) / this.stacks;

		this.initBuffers();
	};

	initBuffers()
	{
        this.vertices = [];
        this.indices = [];
        this.normals = [];
	    this.texCoords = [];

        var ang = 2*Math.PI / this.slices;
        var i, j;

        //Filling Vertices, normals and texCoords
        
        for(i = 0; i <= this.stacks; i++)
        {
            var inc = (i * this.delta) + this.base;

            for(j = 0; j <= this.slices; j++)
            {

                this.vertices.push(inc * Math.cos(j * ang),inc * Math.sin(j * ang), i * this.deltaH);
                this.normals.push(Math.cos(j * ang), Math.sin(j * ang), Math.atan((this.base - this.top) / this.height));
                this.texCoords.push(this.minS + j * (this.maxS - this.minS) / this.slices,
                this.minT + i * (this.maxT - this.minT) / this.stacks);
            }
            
        }
    

        var sides = this.slices +1;
    
        for (var j = 0; j < this.stacks; j++)
        {
            for (var i = 0; i < this.slices; i++)
            {
    
                this.indices.push(sides*j+i, sides*(j+1)+i, sides*j+i+1);
                this.indices.push(sides*j+i+1, sides*(j+1)+i, sides*(j+1)+i+1);
    
                this.indices.push(sides*j+i, sides*j+i+1, sides*(j+1)+i);
                this.indices.push(sides*j+i+1, sides*(j+1)+i+1, sides*(j+1)+i);
    
            }
    
        }
        
		this.primitiveType=this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	};
};