/**
 * MyPlane
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyPlane extends CGFobject
{
	constructor(scene, npartsU, npartsV,degree1 = 1,degree2 = 1,controlvertexes = [[[-0.5, -0.5, 0.0, 0.25 ],[-0.5,  0.5, 0.0, 0.25 ]],[[ 0.5, -0.5, 0.0,0.25 ],[ 0.5, 0.5, 0.0, 0.25 ]]],translation = [0,0,0])
	{
        super(scene);
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.degree1 = degree1;
        this.degree2 = degree2;
        this.controlvertexes = controlvertexes;
        this.translation = translation;
        this.create();
	};

	create()
	{
		var nurbsSurface = new CGFnurbsSurface(this.degree1 , this.degree2, this.controlvertexes);
		var obj = new CGFnurbsObject(this.scene, this.npartsU,  this.npartsV, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
		this.surfaces = obj;
    }
    display(){
			this.scene.pushMatrix();
            this.scene.rotate(270*DEGREE_TO_RAD,1,0,0);
			this.scene.translate(this.translation[0], this.translation[1], this.translation[2]);
			this.surfaces.display();
			this.scene.popMatrix();
		
    }
    changeLength(length_s, length_t) {/*

        this.length_s = length_s;
		this.length_t = length_t;
    
        for(var i = 0; i <= this.stacks; i++)
        {
            for(var j = 0; j <= this.slices; j++)
            {
               this.texCoords.push(j * length_s / this.slices, i * length_t / this.stacks);
            }    
        }

        this.updateTexCoordsGLBuffers();*/
    }
};