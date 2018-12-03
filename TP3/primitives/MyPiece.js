class MyPiece extends CGFobject
{
	constructor(scene)
	{
       super(scene);
       this.piece = new MySphere(scene, 1, 30, 30);
       this.dir = new MyCylinderWTops(scene, 1, 1, 1, 4, 4);
	};

	display() {

    }
};