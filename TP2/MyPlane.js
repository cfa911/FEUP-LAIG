/**
 * MyPlane
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyPlane extends CGFobject
{
	constructor(scene, npartsU, npartsV,degree1 = 1,degree2 = 1,controlvertexes = [[[-1.0, -1.0, 0.0, 0.5 ],[-1.0,  1.0, 0.0, 0.5 ]],[[ 1.0, -1.0, 0.0,0.5 ],[ 1.0, 1.0, 0.0, 0.5 ]]],translation = [0,0,0])
	{
        super(scene);
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.degree1 = degree1;
        this.degree2 = degree2;
        this.controlvertexes = controlvertexes;
        this.translation = translation;
        this.surfaces = [];
        this.translations = [];
        this.create();
	};

	create()
	{
		var nurbsSurface = new CGFnurbsSurface(this.degree1 , this.degree2, this.controlvertexes);
		var obj = new CGFnurbsObject(this.scene,  this.npartsU,  this.npartsV, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
		this.surfaces.push(obj);	
        this.translations.push(this.translation);
    }
    display(){
        for (i =0; i<this.surfaces.length; i++) {
			this.scene.pushMatrix();
		
			this.scene.translate(this.translations[i][0], this.translations[i][1], this.translations[i][2]);

			this.surfaces[i].display();
			this.scene.popMatrix();
		}
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