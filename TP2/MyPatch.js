/**
 * MyPatch
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyPatch extends CGFobject
{
	constructor(scene, npointsU, npointsV, npartsU, npartsV, controlPoints, minS = 0, maxS = 1, minT = 0, maxT = 1)
	{
        super(scene);
        this.npointsU = npointsU;
        this.npointsV = npointsV;
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.controlPoints = controlPoints;

		this.minS = minS;
        this.maxS = maxS;
        this.minT = minT;
        this.maxT = maxT;

		this.initBuffers();
	};

	initBuffers()
	{

    }
    
    changeLength(length_s, length_t) {}
};