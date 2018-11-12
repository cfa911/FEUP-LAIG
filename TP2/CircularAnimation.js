class CircularAnimation extends Animation{

    constructor(scene, id, time, center, radius, AngInicial, AngRotate) {

        super(scene, id, speed);

        this.center = center;
        this.radius = radius;
        this.AngInicial = AngInicial;
        this.AngRotate = AngRotate;
        this.time = time;
    }
}