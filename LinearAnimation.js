class LinearAnimation extends Animation{

    constructor(scene, id, time, controlPts) {

        super(scene, id, speed);

        this.controlPts = controlPts;
        this.time = time;
    }
}