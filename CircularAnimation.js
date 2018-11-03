class CircularAnimation extends Animation{

    constructor(scene, id, center, radius, AngInicial, AngRotate, time) {

        super(scene, id, speed);

        this.center = center;
        this.radius = radius;
        this.AngInicial = AngInicial;
        this.AngRotate = AngRotate;
        this.time = time;
    }
}