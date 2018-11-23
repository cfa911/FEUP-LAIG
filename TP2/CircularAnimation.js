class CircularAnimation extends Animation{

    constructor(scene, span, center, radius, AngInicial, AngRotate) {

        super(scene, span);

        // center = [x, y, z]
        this.center = center;
        this.radius = radius;
        this.AngInicial = AngInicial;
        this.AngRotate = AngRotate;

        this.elapsedTime = 0;
        this.AngAtual = 0;
        this.AngAnterior = 0;
        this.init();
    }
    init(){
        mat4.translate(this.matrixAni, this.matrixAni, [this.center[0], this.center[1], this.center[2]]);
        mat4.translate(this.matrixAni, this.matrixAni, [this.radius,0,0]);
    }

    update(deltaTime) {
        if(this.AngAtual > (this.AngInicial - this.AngRotate)) {
            this.final = true;
            this.finalMatrix = this.matrixAni;
            return;
        }

        mat4.translate(this.matrixAni, this.matrixAni, [-this.radius,0,0]);
        this.elapsedTime = this.elapsedTime + deltaTime;

        this.AngAtual = (this.AngRotate * this.elapsedTime) / this.span;
        mat4.rotateY(this.matrixAni, this.matrixAni, (this.AngAtual - this.AngAnterior) * DEGREE_TO_RAD);
        mat4.translate(this.matrixAni, this.matrixAni, [this.radius,0,0]);
        this.AngAnterior = this.AngAtual;
    }

    apply() {
        super.apply();
    }
}