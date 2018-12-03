class Animation
{
    constructor(scene, span)
    {
        this.scene = scene;
        this.finalMatrix = mat4.create();
        // duraçao do movimento
        this.span = span;
        this.matrixAni = mat4.create();

        this.final = false;
    }

    update(deltaTime) {
        //calculate matrix
    }

    apply() {
        if(this.final) {
            this.finalMatrix = this.matrixAni;
            this.scene.multMatrix(this.finalMatrix);
        }
        else{
            this.scene.multMatrix(this.matrixAni);
        }
    }
}