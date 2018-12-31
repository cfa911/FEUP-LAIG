class MyVehicle extends CGFobject {
    constructor(scene) {
        super(scene);
        this.patch = new MyPatch(scene, 1, 2, 5, 5, [[[-2, -2, 0, 1], [-2, 0, 0, 1], [-2, 2, 0, 0.7]], [[2, -2, 0, 0.7], [2, 0, 0, 0.7], [2, 2, 0, 0.7]]]);
        this.tronco = new My2ndCylinder(scene, 4, 4, 3, 30, 30);
        this.cauda = new MyCylinder(scene, 0, 1, 1, 30, 30);
        this.antena = new My2ndCylinder(scene, 2, 2, 1, 30, 30);
        this.cabeca = new MySphere(scene, 1, 30, 30);

        //colors 

        this.yellow = new CGFappearance(this.scene);
        this.yellow.setAmbient(0.4, 0.4, 0, 0.5);
        this.yellow.setDiffuse(0.6, 0.6, 0, 0.6);
        this.yellow.setSpecular(1, 1, 0, 0.8);
        this.yellow.setShininess(100);

        this.black = new CGFappearance(this.scene);
        this.black.setAmbient(0, 0, 0, 0.5);
        this.black.setDiffuse(0.1, 0.1, 0.1, 0.6);
        this.black.setSpecular(0.2, 0.2, 0.2, 0.8);
        this.black.setShininess(500);

        this.grey = new CGFappearance(this.scene);
        this.grey.setAmbient(0.2, 0.2, 0.2, 0.5);
        this.grey.setDiffuse(0.4, 0.4, 0.4, 0.6);
        this.grey.setSpecular(0.6, 0.6, 0.6, 0.8);
        this.grey.setShininess(700);

        //this.bee = new CGFtexture(this.scene, "./scenes/images/bee.jpg");
        //this.wing = new CGFtexture(this.scene, "./scenes/images/wing.png");


    };

    changeLength(length_s, length_t) {

    };

    display() {
        //Asa 1
        this.scene.pushMatrix();
        this.grey.apply();
        this.scene.rotate(90 * DEGREE_TO_RAD, 1, 0, 0);
        this.scene.rotate(-40 * DEGREE_TO_RAD, 0, 1, 0);
        this.scene.translate(-2.5, 2, 0);
        this.patch.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(270 * DEGREE_TO_RAD, 1, 0, 0);
        this.scene.rotate(40 * DEGREE_TO_RAD, 0, 1, 0);
        this.scene.translate(-2.5, -2, 0);
        this.patch.display();
        this.scene.popMatrix();


        //Asa 2
        this.scene.pushMatrix();
        this.scene.rotate(270 * DEGREE_TO_RAD, 1, 0, 0);
        this.scene.rotate(-40 * DEGREE_TO_RAD, 0, 1, 0);
        this.scene.translate(2.5, -2, 0);
        this.patch.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(90 * DEGREE_TO_RAD, 1, 0, 0);
        this.scene.rotate(40 * DEGREE_TO_RAD, 0, 1, 0);
        this.scene.translate(2.5, 2, 0);
        this.patch.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.yellow.apply();
        //this.bee.bind();
        this.tronco.display();
        this.scene.popMatrix();
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
        this.yellow.apply();
        this.cabeca.display();
        this.scene.popMatrix();

        // olhos
        this.scene.pushMatrix();
        this.scene.scale(0.3, 0.3, 0.3);
        this.scene.translate(-2.5, 1, 19.5);
        this.black.apply();
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
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.rotate(-Math.PI / 6, 0, 1, 0);
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
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.rotate(Math.PI / 6, 0, 1, 0);
        this.scene.scale(0.1, 0.1, 2);
        this.antena.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.scale(0.3, 0.3, 0.3);
        this.scene.translate(-4, 10, 15);
        this.cabeca.display();
        this.scene.popMatrix();

        //leg 1
        this.scene.pushMatrix();
        this.scene.translate(1, -1, 2);
        this.scene.rotate(Math.PI / 4, 1, 0, 0);
        this.scene.rotate(Math.PI / 10, 0, 1, 0);
        this.scene.scale(0.4, 0.4, 2);
        this.antena.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.8, -4, 1.3);
        this.scene.rotate(-Math.PI / 4, 1, 0, 0);
        this.scene.rotate(-Math.PI / 10, 0, 1, 0);
        this.scene.scale(0.2, 0.2, 3);
        this.antena.display();
        this.scene.popMatrix();
        //leg 2
        this.scene.pushMatrix();
        this.scene.translate(-1, -1, 2);
        this.scene.rotate(Math.PI / 4, 1, 0, 0);
        this.scene.rotate(-Math.PI / 10, 0, 1, 0);
        this.scene.scale(0.4, 0.4, 2);
        this.antena.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.8, -4, 1.3);
        this.scene.rotate(-Math.PI / 4, 1, 0, 0);
        this.scene.rotate(Math.PI / 10, 0, 1, 0);
        this.scene.scale(0.2, 0.2, 3);
        this.antena.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 4, 1, 0, 0);
        this.scene.translate(0, 0, -4);
        this.scene.scale(1, 1, 2);

        //leg 1
        this.scene.pushMatrix();
        this.scene.translate(1, -1, 2);
        this.scene.rotate(Math.PI / 4, 1, 0, 0);
        this.scene.rotate(Math.PI / 10, 0, 1, 0);
        this.scene.scale(0.4, 0.4, 2);
        this.antena.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.8, -4, 1.3);
        this.scene.rotate(-Math.PI / 4, 1, 0, 0);
        this.scene.rotate(-Math.PI / 10, 0, 1, 0);
        this.scene.scale(0.2, 0.2, 3);
        this.antena.display();
        this.scene.popMatrix();
        //leg 2
        this.scene.pushMatrix();
        this.scene.translate(-1, -1, 2);
        this.scene.rotate(Math.PI / 4, 1, 0, 0);
        this.scene.rotate(-Math.PI / 10, 0, 1, 0);
        this.scene.scale(0.4, 0.4, 2);
        this.antena.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.8, -4, 1.3);
        this.scene.rotate(-Math.PI / 4, 1, 0, 0);
        this.scene.rotate(Math.PI / 10, 0, 1, 0);
        this.scene.scale(0.2, 0.2, 3);
        this.antena.display();
        this.scene.popMatrix();

        this.scene.popMatrix();

        //this.bee.unbind();
    }
};