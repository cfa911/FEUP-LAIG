/**
 * MyTriangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyTriangle extends CGFobject
{
	constructor(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3)
	{
        super(scene);
        this.x1 = x1;
        this.y1 = y1;
        this.z1 = z1;
        this.x2 = x2;
        this.y2 = y2;
        this.z2 = z2;
        this.x3 = x3;
        this.y3 = y3;
        this.z3 = z3;

        this.p1 = [x1, y1, z1];
        this.p2 = [x2, y2, z2];
        this.p3 = [x3, y3, z3];

        this.initBuffers();
    };

	initBuffers()
	{
		this.vertices = [
            this.x1, this.y1, this.z1,
            this.x2, this.y2, this.z2,
            this.x3, this.y3, this.z3

            ];

        this.indices = [
            0, 1, 2

            ];

        var p1ap3 = Math.sqrt((this.p1[0] - this.p3[0]) * (this.p1[0] - this.p3[0]) +
			 		   (this.p1[1] - this.p3[1]) * (this.p1[1] - this.p3[1]) +
			 		   (this.p1[2] - this.p3[2]) * (this.p1[2] - this.p3[2]));

	    var p2ap1 = Math.sqrt((this.p2[0] - this.p1[0]) * (this.p2[0] - this.p1[0]) +
			 		   (this.p2[1] - this.p1[1]) * (this.p2[1] - this.p1[1]) +
			 		   (this.p2[2] - this.p1[2]) * (this.p2[2] - this.p1[2]));

	    var p3ap2 = Math.sqrt((this.p3[0] - this.p2[0]) * (this.p3[0] - this.p2[0]) +
			 		   (this.p3[1] - this.p2[1]) * (this.p3[1] - this.p2[1]) +
                        (this.p3[2] - this.p2[2]) * (this.p3[2] - this.p2[2]));
            
        var beta = Math.acos(( p3ap2 * p3ap2 - p1ap3 * p1ap3 + p2ap1 * p2ap1) / (2 * p3ap2 * p2ap1));

        this.textCoords = [
        0, 0,
        p2ap1 / 1, 0,
        (p2ap1 - p3ap2 * Math.cos(beta)) / 1, (p3ap2 * Math.sin(beta)) / 1,

        ];

        // vector U = p2 - p1
        // vector V = p3 - p1
        // vector N = U X V (produto escalar)

        var Nx = ((this.p2[1] - this.p1[1])*(this.p3[2] - this.p1[2]) - (this.p2[2] - this.p1[2])*(this.p3[1] - this.p1[1]))/Math.sqrt(Math.pow((this.p2[1] - this.p1[1])*(this.p3[2] - this.p1[2]) - (this.p2[2] - this.p1[2])*(this.p3[1] - this.p1[1]),2) + Math.pow((this.p2[2] - this.p1[2])*(this.p3[0] - this.p1[0]) - (this.p2[0] - this.p1[0]) * (this.p3[2] - this.p1[2]),2) + Math.pow((this.p2[0] - this.p1[0])*(this.p3[1] - this.p1[1]) - (this.p2[1] - this.p1[1])*(this.p3[0] - this.p1[0]),2));
        var Ny = ((this.p2[2] - this.p1[2])*(this.p3[0] - this.p1[0]) - (this.p2[0] - this.p1[0])*(this.p3[2] - this.p1[2]))/Math.sqrt(Math.pow((this.p2[1] - this.p1[1])*(this.p3[2] - this.p1[2]) - (this.p2[2] - this.p1[2])*(this.p3[1] - this.p1[1]), 2) + Math.pow((this.p2[2] - this.p1[2])*(this.p3[0] - this.p1[0]) - (this.p2[0] - this.p1[0])*(this.p3[2] - this.p1[2]),2) + Math.pow((this.p2[0] - this.p1[0])*(this.p3[1] - this.p1[1]) - (this.p2[1] - this.p1[1])*(this.p3[0] - this.p1[0]),2));
        var Nz = ((this.p2[0] - this.p1[0])*(this.p3[1] - this.p1[1]) - (this.p2[1] - this.p1[1])*(this.p3[0] - this.p1[0]))/Math.sqrt(Math.pow((this.p2[1] - this.p1[1])*(this.p3[2] - this.p1[2])- (this.p2[2] - this.p1[2])*(this.p3[1] - this.p1[1]), 2) + Math.pow((this.p2[2] - this.p1[2])*(this.p3[0] - this.p1[0]) - (this.p2[0] - this.p1[0])*(this.p3[2] - this.p1[2]),2) + Math.pow((this.p2[0] - this.p1[0])*(this.p3[1] - this.p1[1]) - (this.p2[1] - this.p1[1])*(this.p3[0] - this.p1[0]), 2));

        this.normals = [
            Nx, Ny, Nz,
            Nx, Ny, Nz,
            Nx, Ny, Nz

        ];
        
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    }
}