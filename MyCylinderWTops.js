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
        this.tamp = new MyDisk(scene, slices);
        this.cyl = new MyCylinder(scene, slices, stacks);
     }
 };

 /*display()
 {
     
 }*/