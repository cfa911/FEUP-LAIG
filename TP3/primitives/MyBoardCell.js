/**
 * MyBoardCell
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyBoardCell extends CGFobject
{
	constructor(scene, cx, cy, cz)
	{
		super(scene);
		this.cx = cx;
		this.cy = cy;
		this.cz = cz;
		this.cell = new MyRectangle(scene, -0.5, -0.5, 0.5, 0.5);
	};

	display() {
		this.scene.pushMatrix();
		this.cell.display();
		this.scene.popMatrix();
	}
    
    changeLength(length_s, length_t) {

    }
};