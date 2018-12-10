/**
 * MyContainer
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyContainer extends CGFobject
{
	constructor(scene)
	{
        super(scene);
        this.wood = new CGFappearance(this.scene);
        this.wood.loadTexture("./scenes/images/Wood.jpg");
        this.rec = new MyRectangle(scene,0,0,1,1);
        this.display();
	};

    display(){
        this.scene.pushMatrix();
        this.wood.apply();
        this.scene.translate(0,0,1);
        this.rec.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.wood.apply();
        this.scene.rotate(270*DEGREE_TO_RAD,0,1,0);
        this.rec.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.wood.apply();
        this.scene.translate(1,0,1);
        this.scene.rotate(90*DEGREE_TO_RAD,0,1,0);
        this.rec.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.wood.apply();
        this.scene.translate(1,0,0);
        this.scene.rotate(180*DEGREE_TO_RAD,0,1,0);
        this.rec.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.wood.apply();
        this.scene.scale(1,1,-1);
        this.rec.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.wood.apply();
        this.scene.scale(1,1,-1);
        this.scene.translate(0,0,-1);
        this.scene.rotate(270*DEGREE_TO_RAD,0,1,0);
        this.rec.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.wood.apply();
        this.scene.scale(1,1,-1);
        this.scene.translate(1,0,0);
        this.scene.rotate(90*DEGREE_TO_RAD,0,1,0);
        this.rec.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.wood.apply();
        this.scene.scale(1,1,-1);
        this.scene.translate(1,0,-1);
        this.scene.rotate(180*DEGREE_TO_RAD,0,1,0);
        this.rec.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.wood.apply();
        this.scene.translate(0,0,1);
        this.scene.rotate(270*DEGREE_TO_RAD,1,0,0);
        this.rec.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.wood.apply();
        this.scene.rotate(90*DEGREE_TO_RAD,1,0,0);
        this.rec.display();
        this.scene.popMatrix();
    }
    changeLength(bla,blas){

    }
};