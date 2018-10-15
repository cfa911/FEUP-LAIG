/**
 * MyTorus
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

 class MyTorus extends CGFobject
 {
    constructor(scene, inner, outer, slices, loops)
    {
        super(scene);
        this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.loops = loops;

        this.initBuffers();
    }

    initBuffers()
	{

		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		for (var i = 0; i <= this.loops; i++) {

			var theta = i * 2 * Math.PI / this.loops;
			var sinTheta = Math.sin(theta);
			var cosTheta = Math.cos(theta);

			for (var j = 0; j <= this.slices; j++) {

                // x(Theta, Phi) = (R + r * cos(Theta)) * cos(Phi)
                // y(Theta, Phi) = (R + r * cos(Theta)) * sin(Phi)
                // z(Theta, Phi) = r * sin(Theta)

                // r = (outer - inner) / 2
                // R = inner + r;

				var phi = j * 2 * Math.PI / this.slices;
				var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);

                var r = (this.outer - this.inner) / 2;
                var R = this.inner + r;

				var x = (R + r * cosTheta) * cosPhi;
				var y = (R + r * cosTheta) * sinPhi;
                var z = r * sinTheta;
                
				var s = 1 - (i / this.loops);
				var t = 1 - (j / this.slices);

				this.vertices.push(x, y, z);
				this.normals.push(x, y, z);
				this.texCoords.push(s, t);
			}
		}

		for (var i = 0; i < this.loops; i++) {
			for (var j = 0; j < this.slices; j++) {

				var first = (i * (this.slices + 1)) + j;
				var second = first + this.slices + 1;

				this.indices.push(first, second + 1, second);
				this.indices.push(first, first + 1, second + 1);
			}
        }
        this.primitiveType = this.scene.gl.TRIANGLES;
 	    this.initGLBuffers();
    };
        







        /*this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var nPhi = 100, nTheta = 50,  Theta = 0, Phi = 0,
        dTheta = 2*Math.PI / nTheta, dPhi = dTheta/nPhi;
        var nn = nTheta*nPhi;

        for (var i = 0; i < nn; i++ ){
            Theta += dTheta;
            Phi   += dPhi;
            var cosTheta = Math.cos( Theta ),  sinTheta = Math.sin( Theta ),
            cosPhi = Math.cos( Phi ),  sinPhi = Math.sin( Phi ),
            dist   = this.outer + this.inner * cosTheta;
            this.vertices.push( cosPhi*dist, -sinPhi*dist, this.inner*sinTheta );     // points
            this.normals.push( cosPhi*cosTheta, -sinPhi*cosTheta, sinTheta); // normals
            this.indices.push( i, (i + nTheta) % nn);
        }
        this.indices.push( 0, nTheta);

 	    this.primitiveType = this.scene.gl.TRIANGLES;
 	    this.initGLBuffers();*/
 	};