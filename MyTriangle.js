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

        var a = Math.sqrt( Math.pow((this.x1-this.x3),2) +  Math.pow((this.y1-this.y3),2) +  Math.pow((this.z1-this.z3),2) );
        var b = Math.sqrt( Math.pow((this.x2-this.x1),2) +  Math.pow((this.y2-this.y1),2) +  Math.pow((this.z2-this.z1),2) );
        var c = Math.sqrt( Math.pow((this.x3-this.x2),2) +  Math.pow((this.y3-this.y2),2) +  Math.pow((this.z3-this.z2),2) );

        var cosBeta = (Math.pow(a,2) - Math.pow(b,2) + Math.pow(c,2)) / (2*a*c);
        var v = a*Math.sin(Math.acos(cosBeta));

        /*this.textCoords = [
            c - a*cosBeta, v - a*Math.sin(Math.acos(cosBeta)),
            v, 0,
            c, v,
        ];*/

        this.textCoords = [
            0, v,
            c, v,
            c - a*cosBeta, v-a*Math.sin(Math.acos(cosBeta)),
    
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