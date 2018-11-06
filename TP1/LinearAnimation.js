class LinearAnimation extends Animation{

    constructor(scene, id, time, controlPts) {

        super(scene, id);

        // {(0,0,0), (1,0,0), (1,1,0)}
        this.controlPts = controlPts;
        // duraçao do movimento
        this.time = time;
        // distancia calculada em cada reta (p2-p1) (p3-p2) (p3-p1)
        var vecCPoints = [];
        // distancia total de todas as retas
        var distance = 0;
    }

    calculateDistance() {

        for(var i=0; i<=this.controlPts.length; i++) {
            distance += Math.sqrt(Math.pow(this.controlPts[i+1][0] - this.controlPts[i][0], 2) + Math.pow(this.controlPts[i+1][1] - this.controlPts[i][1], 2) + Math.pow(this.controlPts[i+1][2] - this.controlPts[i][2], 2));
            vecCPoints.push(Math.sqrt(Math.pow(this.controlPts[i+1][0] - this.controlPts[i][0], 2) + Math.pow(this.controlPts[i+1][1] - this.controlPts[i][1], 2) + Math.pow(this.controlPts[i+1][2] - this.controlPts[i][2], 2)));
        }
    }

}