class LinearAnimation extends Animation{

    constructor(scene, span, controlPts) {

        super(scene, span);

        // {(0,0,0), (1,0,0), (1,1,0)}
        this.controlPts = controlPts;
        // distancia calculada em cada reta (p2-p1) (p3-p2) em x, y e z
        this.vecCPoints = [];
        // Aplicando tempo nos pontos do vecPoints
        this.vecInterp = [];
        // distancia total de todas as retas
        this.distance = 0;

        this.totalTime = 0;

        this.index = 0;

        //P = (P2 - P1)*(deltaTime/span)

        //calcular distancias
        for(var i=0; i < this.controlPts.length - 1; i++) {
            this.distance += Math.sqrt(Math.pow(this.controlPts[i+1][0] - this.controlPts[i][0], 2) + Math.pow(this.controlPts[i+1][1] - this.controlPts[i][1], 2) + Math.pow(this.controlPts[i+1][2] - this.controlPts[i][2], 2));
            var temp = [this.controlPts[i+1][0] - this.controlPts[i][0], this.controlPts[i+1][1] - this.controlPts[i][1], this.controlPts[i+1][2] - this.controlPts[i][2] ];
            console.log(temp);
            this.vecCPoints.push(temp);
        }

        //this.span = this.span * 1000;

        this.speed = this.distance / this.span;

        this.timeTroco = this.span / (this.vecCPoints.length- 1);
    }

    update(deltaTime) {



        if(this.totalTime >= this.span) {
            this.final = true;
            this.finalMatrix = this.matrixAni;
            return;
        }
        else{
            console.log("totalTime: ");
            console.log(this.totalTime);
            console.log("Span: ");
            console.log(this.span);
            console.log(deltaTime);
        }

        if(this.totalTime > (this.timeTroco * this.index)) {
            this.index++;
        }

        this.totalTime += deltaTime;

        var x = this.vecCPoints[this.index][0] * this.speed * (deltaTime / this.span);
        var y = this.vecCPoints[this.index][1] * this.speed * (deltaTime / this.span);
        var z = this.vecCPoints[this.index][2] * this.speed * (deltaTime / this.span);

        this.final = false;

        mat4.translate(this.matrixAni, this.matrixAni, [x, y, z]);

        //this.final = false;
    }
    apply(){
        super.apply();
    }
}