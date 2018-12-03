/**
 * MyPlane
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyPlane extends CGFobject
{
	constructor(scene, npartsU, npartsV, degree1 = 1, degree2 = 1, controlvertexes = [[[0.5, 0.0, 0.5, 1], [-0.5,  0.0, 0.5, 1]], [[0.5, 0, -0.5, 1], [-0.5, 0.0, -0.5, 1]]], translation = [0,0,0])
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
		this.surfaces = new CGFnurbsObject(this.scene, this.npartsU,  this.npartsV, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
    }
    display(){
			this.scene.pushMatrix();
			this.scene.translate(this.translation[0], this.translation[1], this.translation[2]);
            this.surfaces.display();
			this.scene.popMatrix();
		
    }
    changeLength(bla,blas){

    }
};