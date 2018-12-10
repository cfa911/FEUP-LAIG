/**
 * MyCoffee
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCoffee extends CGFobject {
	constructor(scene, player) {
		super(scene);

		this.brown = new CGFappearance(scene);
		this.brown.setEmission(0.14, 0.07, 0, 0.2);
		this.brown.setAmbient(0.28, 0.14, 0, 0.5);
		this.brown.setDiffuse(0.42, 0.20, 0, 0.6);
		this.brown.setSpecular(0.55, 0.27, 0, 0.8);
		this.brown.setShininess(10);

		this.player = player;
		this.orange = new CGFappearance(scene);

		this.orange.setEmission(0.25, 0.13, 0, 0.5);
		this.orange.setAmbient(0.5, 0.27, 0, 0.6);
		this.orange.setDiffuse(0.75, 0.41, 0, 0.8);
		this.orange.setSpecular(1, 0.55, 0, 1);
		this.orange.setShininess(10);
		this.sphere = new MySphere(scene, 1, 30, 20);
		this.pointer = new MyCylinder(scene, 1, 1, 1, 30, 20);
		this.display();
	};

	display() {
		this.scene.pushMatrix();
		this.scene.scale(1, 0.5, 0.05);
		this.scene.translate(0, 0, -0.25);
		this.pointer.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.scale(1, 0.5, 1);
		if (this.player == 1)
			this.brown.apply();
		else {
			this.orange.apply();
		}
		this.sphere.display();
		this.scene.popMatrix();
	}
	changeLength(a, b) {

	}
}