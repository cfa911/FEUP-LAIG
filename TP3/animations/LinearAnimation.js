/**
 * MyLinearAnimation
 * @constructor
 */
class LinearAnimation extends Animation{

    /**
     * @constructor
     */
    constructor(scene, span, points) {
        super(scene, span);

        this.points = points;
        this.totalDistance = 0;
        this.routes = [];
        for(let i = 0; i < points.length - 1; i++){
            this.totalDistance += vec3.dist(vec3.fromValues(points[i][0], points[i][1], points[i][2]), vec3.fromValues(points[i + 1][0], points[i + 1][1], points[i + 1][2]));
            this.routes.push(this.totalDistance);
        }
        this.speed = this.totalDistance / this.span;
        this.previousAngle = 0;
        
        this.difference = 0;
        this.firstPoint = 0;
        this.secondPoint = 0;
        this.timeCounter = 0;
    }

    update(deltaTime){
        this.timeCounter += deltaTime;

        if(this.timeCounter > this.span)
        {
            this.timeCounter = this.span;
            this.final = true;
        }


        this.currentPosition = this.speed * this.timeCounter;

        let i = 0;
        while (this.currentPosition > this.routes[i] && i < this.routes.length)
		    i++;

        this.firstPoint = this.points[i];
        this.secondPoint = this.points[i+1];

        if(i == 0)
            this.difference = this.currentPosition/this.routes[i];
        else{
            this.difference = (this.currentPosition - this.routes[i-1]) / (this.routes[i] - this.routes[i-1]);
        }

        let angle = Math.atan((this.secondPoint[0] - this.firstPoint[0]) / (this.secondPoint[2] - this.firstPoint[2]));
        
        if(isNaN(angle))
            angle = 0;

        if (this.secondPoint[2] - this.firstPoint[2] < 0)
            angle += Math.PI;
    
        this.previousAngle = angle;
    }

    apply(){
        var x = (this.secondPoint[0] - this.firstPoint[0]) * this.difference + this.firstPoint[0];
        var y = (this.secondPoint[1] - this.firstPoint[1]) * this.difference + this.firstPoint[1];
        var z = (this.secondPoint[2] - this.firstPoint[2]) * this.difference + this.firstPoint[2];

        this.scene.translate(x, y, z);
        this.scene.rotate(this.previousAngle, 0, 1, 0);
    }

}