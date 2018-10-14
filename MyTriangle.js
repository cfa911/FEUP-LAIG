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
            -0.5, 0.5, 0,
            -0.5, -0.5, 0,
            0.5, -0.5, 0,

            ];

        this.indices = [
            0, 1, 2

            ];

        this.textCoords = [
        0, 1,
        1, 1,
        0, 0,
        1, 0

        ];

        // vector U = p2 - p1
        // vector V = p3 - p1
        // vector N = U X V (produto escalar)

        var Nx = ((p2[1] - p1[1])*(p3[2] - p1[2]) - (p2[2] - p1[2])*(p3[1] - p1[1]))/Math.sqrt(Math.pow((p2[1] - p1[1])*(p3[2] - p1[2]) - (p2[2] - p1[2])*(p3[1] - p1[1]),2) + Math.pow((p2[2] - p1[2])*(p3[0] - p1[0]) - (p2[0] - p1[0]) * (p3[2] - p1[2]),2) + Math.pow((p2[0] - p1[0])*(p3[1] - p1[1]) - (p2[1] - p1[1])*(p3[0] - p1[0]),2));
        var Ny = ((p2[2] - p1[2])*(p3[0] - p1[0]) - (p2[0] - p1[0])*(p3[2] - p1[2]))/Math.sqrt(Math.pow((p2[1] - p1[1])*(p3[2] - p1[2]) - (p2[2] - p1[2])*(p3[1] - p1[1]), 2) + Math.pow((p2[2] - p1[2])*(p3[0] - p1[0]) - (p2[0] - p1[0])*(p3[2] - p1[2]),2) + Math.pow((p2[0] - p1[0])*(p3[1] - p1[1]) - (p2[1] - p1[1])*(p3[0] - p1[0]),2));
        var Nz = ((p2[0] - p1[0])*(p3[1] - p1[1]) - (p2[1] - p1[1])*(p3[0] - p1[0]))/Math.sqrt(Math.pow((p2[1] - p1[1])*(p3[2] - p1[2])- (p2[2] - p1[2])*(p3[1] - p1[1]), 2) + Math.pow((p2[2] - p1[2])*(p3[0] - p1[0]) - (p2[0] - p1[0])*(p3[2] - p1[2]),2) + Math.pow((p2[0] - p1[0])*(p3[1] - p1[1]) - (p2[1] - p1[1])*(p3[0] - p1[0]), 2));

        this.normals = [
            Nx, Ny, Nz,
            Nx, Ny, Nz,
            Nx, Ny, Nz

        ];
        
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    }
}