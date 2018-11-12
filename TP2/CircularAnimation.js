class CircularAnimation extends Animation{

    constructor(id, span, center, radius, AngInicial, AngRotate) {

        super(id, span);

        // center = [x, y, z]
        this.center = center;
        this.radius = radius;
        this.AngInicial = AngInicial;
        this.AngRotate = AngRotate;
    }

    update(currTime) {

        // mover para o centro de rotaçao

        matrix = mat4.create();
        mat4.translate(matrix, matrix, [center[0], center[1], center[2]]);
    }
}