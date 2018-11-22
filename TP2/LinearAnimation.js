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

        this.vecAngles = [];

        //P = (P2 - P1)*(deltaTime/span)

        //calcular distancias
        for(var i=0; i < this.controlPts.length - 1; i++) {
            this.distance += Math.sqrt(Math.pow(this.controlPts[i+1][0] - this.controlPts[i][0], 2) + Math.pow(this.controlPts[i+1][1] - this.controlPts[i][1], 2) + Math.pow(this.controlPts[i+1][2] - this.controlPts[i][2], 2));
            var temp = [this.controlPts[i+1][0] - this.controlPts[i][0], this.controlPts[i+1][1] - this.controlPts[i][1], this.controlPts[i+1][2] - this.controlPts[i][2] ];
            console.log(temp);
            this.vecCPoints.push(temp);
        }

        for(var j=0; j < this.vecCPoints.length; j++) {

            var x = Math.atan(this.vecCPoints[j][0] - 0);
            var y = Math.atan(this.vecCPoints[j][1] - 0);
            var z = Math.atan(this.vecCPoints[j][2] - 1);

            this.vecAngles.push([x,y,z]);
        }
        //this.span = this.span * 1000;

        this.speed = this.distance / this.span;

        this.timeTroco = this.span / (this.vecCPoints.length);
    }

    update(deltaTime) {

        if(this.totalTime >= this.span) {
            this.final = true;
            this.finalMatrix = this.matrixAni;
            return;
        }
        else{
            /*console.log("totalTime: ");
            console.log(this.totalTime);
            console.log("Span: ");
            console.log(this.span);
            console.log(deltaTime);*/
        }

        if(this.totalTime > (this.timeTroco * (this.index + 1))) {
            this.index++;
        }

        this.totalTime += deltaTime;

        var x = this.vecCPoints[this.index][0] * this.speed * (deltaTime / this.span);
        var y = this.vecCPoints[this.index][1] * this.speed * (deltaTime / this.span);
        var z = this.vecCPoints[this.index][2] * this.speed * (deltaTime / this.span);
        var angleX = this.vecAngles[this.index][0];
        var angleY = this.vecAngles[this.index][1];
        var angleZ = this.vecAngles[this.index][2];

        mat4.translate(this.matrixAni, this.matrixAni, [x, y, z]);
        console.log(angleX);
        console.log(angleY);
        console.log(angleZ);
        //mat4.rotate(this.matrixAni, this.matrixAni, [angleX, angleY, angleZ], [0,1,0]);

    }

    apply(){
        super.apply();
    }
}