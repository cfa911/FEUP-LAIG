class MyVehicle extends CGFobject
{
    constructor(scene)
	{
        super(scene);
        //this.patch = new MyPatch(scene, 1, 1, 5, 5, [[-2, -2, 0], [-2, 2, 0], [2, -2, 0], [2, 2, 0]]);
        this.tronco = new My2ndCylinder(scene, 2, 2, 3, 30, 30);
        this.cauda = new MyCylinder(scene, 0, 1, 1, 30, 30);
        this.antena = new MyCylinder(scene, 1, 1, 1, 30, 30);
        this.cabeca = new MySphere(scene, 1, 30, 30);
    };

    changeLength(length_s, length_t) {

    };
    
    display() {
        this.tronco.display();

        // cauda
        this.scene.pushMatrix();
            this.scene.scale(1.55, 1.6, 3.5);
            this.scene.translate(0, -0.25, -0.97);
            this.cauda.display();
        this.scene.popMatrix();

        // cabeça 
        this.scene.pushMatrix();
            this.scene.scale(1.9, 1.9, 1.9);
            this.scene.translate(0, -0.2, 2.1);
            this.cabeca.display();
        this.scene.popMatrix();

        // olhos
        this.scene.pushMatrix();
            this.scene.scale(0.3, 0.3, 0.3);
            this.scene.translate(-2.5, 1, 19.5);
            this.cabeca.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.scale(0.3, 0.3, 0.3);
            this.scene.translate(2.5, 1, 19.5);
            this.cabeca.display();
        this.scene.popMatrix();

        // antenas
        this.scene.pushMatrix();
            this.scene.translate(1.3, 3, 4.5);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.scene.rotate(-Math.PI/6, 0, 1, 0);
            this.scene.scale(0.1, 0.1, 2);
            this.antena.display();
        this.scene.popMatrix(); 
        this.scene.pushMatrix();
            this.scene.scale(0.3, 0.3, 0.3);
            this.scene.translate(4, 10, 15);
            this.cabeca.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(-1.3, 3, 4.5);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.scene.rotate(Math.PI/6, 0, 1, 0);
            this.scene.scale(0.1, 0.1, 2);
            this.antena.display();
        this.scene.popMatrix(); 
        this.scene.pushMatrix();
            this.scene.scale(0.3, 0.3, 0.3);
            this.scene.translate(-4, 10, 15);
            this.cabeca.display();
        this.scene.popMatrix();

    }
};