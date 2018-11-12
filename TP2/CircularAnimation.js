class CircularAnimation extends Animation{

    constructor(id, span, center, radius, AngInicial, AngRotate) {

        super(id, span);

        this.center = center;
        this.radius = radius;
        this.AngInicial = AngInicial;
        this.AngRotate = AngRotate;
    }
}