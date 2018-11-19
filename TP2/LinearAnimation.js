class LinearAnimation extends Animation{

    constructor(id, span, controlPts) {

        super(id, span);

        // {(0,0,0), (1,0,0), (1,1,0)}
        this.controlPts = controlPts;
        // distancia calculada em cada reta (p2-p1) (p3-p2) em x, y e z
        this.vecCPoints = [];
        // Aplicando tempo nos pontos do vecPoints
        this.vecInterp = [];
        // distancia total de todas as retas
        this.distance = 0;

        this.final = false;

        this.totalTime = 0;

        this.index = 0;

        //P = (P2 - P1)*(deltaTime/span)

        //calcular distancias
        for(var i=0; i<=this.controlPts.length; i++) {
            this.distance += Math.sqrt(Math.pow(this.controlPts[i+1][0] - this.controlPts[i][0], 2) + Math.pow(this.controlPts[i+1][1] - this.controlPts[i][1], 2) + Math.pow(this.controlPts[i+1][2] - this.controlPts[i][2], 2));
            var temp = [ this.controlPts[i+1][0] - this.controlPts[i][0], this.controlPts[i+1][1] - this.controlPts[i][1], this.controlPts[i+1][2] - this.controlPts[i][2] ];
            this.vecCPoints.push(temp);
        }

        this.speed = this.distance / this.span;

        this.timeTroco = this.span / vecCPoints.length;
    }

    update(deltaTime) {

        if(this.totalTime > this.span) {
            this.final = true;
            return;
        }

        if(this.totalTime > (this.timeTroco * this.index)) {
            this.index++;
        }

        this.totalTime += deltaTime;
    }

    apply(deltaTime) {
        var matrix = mat4.create();

        var x = vecCPoints[this.index][0] * this.speed * (deltaTime / this.span);
        var y = vecCPoints[this.index][1] * this.speed * (deltaTime / this.span);
        var z = vecCPoints[this.index][2] * this.speed * (deltaTime / this.span);

        mat4.translate(matrix, matrix, [x, y, z]);
        return matrix;
    }

}