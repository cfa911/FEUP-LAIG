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
    }

    update(currTime) {

        //calcular distancias
        for(var i=0; i<=this.controlPts.length; i++) {
            this.distance += Math.sqrt(Math.pow(this.controlPts[i+1][0] - this.controlPts[i][0], 2) + Math.pow(this.controlPts[i+1][1] - this.controlPts[i][1], 2) + Math.pow(this.controlPts[i+1][2] - this.controlPts[i][2], 2));
            var temp = [ Math.pow(this.controlPts[i+1][0] - this.controlPts[i][0], 2), Math.pow(this.controlPts[i+1][1] - this.controlPts[i][1], 2), Math.pow(this.controlPts[i+1][2] - this.controlPts[i][2], 2) ];
            this.vecCPoints.push(temp);
        }

        //P = (P2 - P1)*(currTime/span)

        var deltaT = currTime / this.span;

        for(var i=0; i< this.vecCPoints.length; i++) {
            var temp = [ this.vecCPoints[i][0] / deltaT, this.vecCPoints[i][1] / deltaT, this.vecCPoints[i][2] / deltaT ];
            this.vecInterp.push(temp);
        }

        var matrix = mat4.create();
        mat4.translate(matrix, matrix, [])
    }

}