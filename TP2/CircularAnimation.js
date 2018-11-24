class CircularAnimation extends Animation{

    constructor(scene, span, center, radius, AngInicial, AngRotate) {

        super(scene, span);

        // center = [x, y, z]
        this.center = center;
        this.radius = radius;
        this.AngInicial = AngInicial;
        this.AngRotate = AngRotate;

        this.elapsedTime = 0;
        //this.distance = (this.AngRotate - this.AngInicial)* DEGREE_TO_RAD ;
        this.speed = ((this.AngRotate - this.AngInicial) * DEGREE_TO_RAD)/this.span;
        this.init();
    }
    init(){
        mat4.translate(this.matrixAni, this.matrixAni, [this.center[0], this.center[1], this.center[2]]);
        mat4.translate(this.matrixAni, this.matrixAni, [this.radius,0,0]);
    }

    update(deltaTime) {
        if(this.elapsedTime >= this.span) {
            this.final = true;
            this.finalMatrix = this.matrixAni;
            return;
        }
        mat4.translate(this.matrixAni, this.matrixAni, [-this.radius,0,0]);
        this.elapsedTime = this.elapsedTime + deltaTime;

        mat4.rotateY(this.matrixAni, this.matrixAni,  deltaTime*this.speed);
        mat4.translate(this.matrixAni, this.matrixAni, [this.radius,0,0]);
    }

    apply() {
        super.apply();
    }
}