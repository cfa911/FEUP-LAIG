class CircularAnimation extends Animation{

    constructor(scene, span, center, radius, AngInicial, AngRotate) {

        super(scene, span);

        // center = [x, y, z]
        this.center = center;
        this.radius = radius;
        this.AngInicial = AngInicial;
        this.AngRotate = AngRotate;

        this.duration = this.AngRotate /this.span;
    }

    update(currTime) {

        // mover para o centro de rotaçao
        matrix = mat4.create();
        mat4.translate(matrix, matrix, [center[0], center[1], center[2]]);
    }

    apply() {
        
    }
}