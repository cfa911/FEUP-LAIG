/**
 * MyBox
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyBox extends CGFobject
{
	constructor(scene,player)
	{
        super(scene);
        this.cof = new MyCoffee(scene,player);
        this.rec = new MyContainer(scene);
        this.display();
	};

    display(){
        
        this.scene.pushMatrix();
        this.scene.scale(2.2,3,2.2);
        this.rec.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(1.1,0.5,1.1);
        this.cof.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1.1,1.5,1.1);
        this.cof.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1.1,2.5,1.1);
        this.cof.display();
        this.scene.popMatrix();
    }
    changeLength(bla,blas){

    }
};