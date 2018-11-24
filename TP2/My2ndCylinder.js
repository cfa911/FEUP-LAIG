/**
 * My2ndCylinder
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class My2ndCylinder extends CGFobject
{
	constructor(scene,base,top,height,slices,stacks)
	{
        super(scene);
        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;
        this.controlvertexes = [[[0,-this.base,0,1],
                              [-this.base,-this.base,0,0.707],
                              [-this.base,0,0,1],
                              [-this.base,this.base,0,0.707],
                              [0,this.base,0,1],
                              [this.base,this.base,0,0.707],
                              [this.base,0,0,1],
                              [this.base,-this.base,0,0.707],
                              [0,-this.base,0,1]],
                              [[0,-this.top,this.height,1],
                              [-this.top,-this.top,this.height,0.707],
                              [-this.top,0,this.height,1],
                              [-this.top,this.top,this.height,0.707],
                              [0,this.top,this.height,1],
                              [this.top,this.top,this.height,0.707],
                              [this.top,0,this.height,1],
                              [this.top,-this.top,this.height,0.707],
                              [0,-this.top,this.height,1]]];
                             
		this.initBuffers();
	};

	initBuffers()
	{
        var nurbsSurface = new CGFnurbsSurface(1 , 8, this.controlvertexes);
		var obj = new CGFnurbsObject(this.scene, this.stacks,  this.slices, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
		this.surfaces = obj;        
    }
    display(){
        this.scene.pushMatrix();
        /*
        this.scene.rotate(270*DEGREE_TO_RAD,1,0,0);
        this.scene.translate(this.translation[0], this.translation[1], this.translation[2]);*/
        this.surfaces.display();
        this.scene.popMatrix();
    }
    changeLength(length_s, length_t) {

    }
};