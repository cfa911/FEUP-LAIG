/**
 * MyPatch
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyPatch extends MyPlane
{
	constructor(scene, npointsU, npointsV, npartsU, npartsV, controlPoints)
	{
        super(scene,npartsU,npartsV,npointsU,npointsV,controlPoints);
	};
    
    changeLength(length_s, length_t) {}
};