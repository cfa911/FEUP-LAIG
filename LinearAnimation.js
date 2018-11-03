class LinearAnimation extends Animation{

    constructor(scene, id, controlPts, time) {

        super(scene, id, speed);

        this.controlPts = controlPts;
        this.time = time;
    }
}