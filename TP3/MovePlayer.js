/**
 * MovePlayer
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MovePlayer {
    constructor(scene, player, position, time) {
        this.scene = scene;
        this.player = player;
        this.position = position;
        this.time = time;
        this.initialize();
    }
    initialize() {
        if (this.player == 1) {
            this.x = ((4 * ((this.position - (this.position % 10)) / 10 - 3)) - 8);
            this.z = ((-4 * (this.position % 10)) + 10);
            this.controlPoints = [[0,0,0],[0, 3, 0], [this.x, 3, this.z], [this.x, -2, this.z]];
        }
        else if(this.player == 2){
            this.x = ((4 * ((this.position - (this.position % 10)) / 10 + 3)) - 12);
            this.z = ((-4 * (this.position % 10)) + 10);

            this.controlPoints = [[0,0,0],[0, 3, 0], [this.x, 3, this.z], [this.x, -2, this.z]];
        }
        this.animation = new LinearAnimation(this.scene, this.time, this.controlPoints);
    }
}