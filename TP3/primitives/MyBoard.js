/**
 * MyBoard
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyBoard extends CGFobject
{
	constructor(scene)
	{
		super(scene);

		this.boardLine = new Array();
		this.board = new Array();
		
		for(var i=0; i<4; i++) {

			for(var j=0; j<4; j++) {

				this.cell = new MyBoardCell(scene, i, 0, j);
				this.boardLine.push(this.cell);
			}

			this.board.push(this.boardLine);
		}
	};

	display() {

		this.scene.pushMatrix();

		for(var i=0; i<4; i++) {

			for(var j=0; j<4; j++) {

				this.scene.translate(1, 0, 0);
				this.board[i][j].display();
			}

			this.scene.translate(-4, 1, 0);
		}

		this.scene.popMatrix();

	}
    
    changeLength(length_s, length_t) {

    }

};