/**
 * MyCylinderWTops
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

 class MyCylinderWTops extends CGFobject
 {
     constructor(scene, base, top, height, slices, stacks)
     {
        super(scene);
        this.base = base;
        this.top = top;
        this.height = height;
        this.tamp = new MyDisk(scene, slices);
        this.cyl = new MyCylinder(scene, base, top, height, slices, stacks);
     }

     display()
    {
     this.cyl.display();
     
     if(this.base != null)
     {
         this.scene.pushMatrix();
            this.scene.scale(this.base, this.base, 1);
            this.tamp.display();
         this.scene.popMatrix();
     }

     if(this.top != null)
     {
         this.scene.pushMatrix();
            this.scene.scale(this.top, this.top, 1);
            this.scene.translate(0, 0, this.height);
            this.tamp.display();
         this.scene.popMatrix();
     }
    };
    changeLength(length_s,length_t) {
        //this.tamp.changeLength(length_s,length_t);
        //this.cyl.changeLength(length_s,length_t);
        //this.updateTexCoordsGLBuffers();
	};
 };