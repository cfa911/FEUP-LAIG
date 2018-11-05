var DEGREE_TO_RAD = Math.PI / 180;
/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightValues = {};
        this.viewValues = {};
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.quad = new MyTriangle(this, -0.5, -0.5, 0, 0.5, -0.5, 0, -0.5, 0.5, 0);

        this.t = new CGFappearance(this);
		this.t.setAmbient(0.1, 0.1, 0.1, 1);
		this.t.setDiffuse(0.5, 0.5, 0.5, 1);
		this.t.setSpecular(0, 0, 0, 1);
        this.t.loadTexture("../scenes/images/wood.png");
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }
    
    initViews() {
        for (var key in this.graph.views) {
            var view = this.graph.views[key];

            if (this.graph.views.hasOwnProperty(key)) {
                if(view.type == "perspective"){
                    this.viewValues[key] = new CGFcamera(view[0], view[1],view[2], view[3], view[4]);
                }
                if(view.type == "ortho"){
                    this.viewValues[key] = new CGFcameraOrtho(view[0], view[1], view[2], view[3], view[4], view[5], view[6], view[7], view[8]);
                }
            }
        }

        //sets default camera ✓

        this.camera = this.viewValues[this.graph.default];
        this.interface.setActiveCamera(this.camera);
    }
    selectView(id) {
        this.camera = this.viewValues[id];
        this.interface.setActiveCamera(this.camera);
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                //lights are predefined in cgfscene
                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2],light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                if(this.lights[0] == "spot"){
                    this.lights[i].setSpotCutOff(light[7][0]);
                    this.lights[i].setSpotDirection(light[6][0] - light[2][0], light[6][1] - light[2][1], light[6][2] - light[2][2]);
                    this.lights[i].setSpotExponent(light[7][1]);
                }
                this.lights[i].setVisible(true);
                if (light[1])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }


    /* Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        
        //TODO: Change reference length according to parsed graph ✓
        this.axis = new CGFaxis(this,this.graph.axis_length);
        // TODO: Change ambient and background details according to parsed graph ✓
        var ambient = this.graph.ambient;
        var background = this.graph.background;
        this.gl.clearColor(background[0],background[1],background[2],background[3]); //global from parser ✓
        this.setGlobalAmbientLight(ambient[0],ambient[1],ambient[2],ambient[3]);//global from parser ✓
        this.initLights();
        this.initViews();
        // Adds lights group ✓
        this.interface.addLightsGroup(this.graph.lights); //add all lights ✓
        this.interface.addViewsGroup(this.viewValues);
        this.sceneInited = true;

    }


    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup
        
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        
        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        if (this.sceneInited) {
            // Draw axis
            this.axis.display();

            var i = 0;
            
            for (var key in this.lightValues) {
                if (this.lightValues.hasOwnProperty(key)) {
                    if (this.lightValues[key]) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    }
                    else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }

            // Displays the scene (MySceneGraph function).
            /*this.pushMatrix();
                this.scale(10,10,10);
                this.translate(1, 1.5, 1);
                this.rotate(-Math.PI / 3, 1, 0, 0);
                this.t.apply();
                this.sphere.display();
            this.popMatrix();*/

            this.pushMatrix();
                this.t.apply();
                this.quad.display();
            this.popMatrix();

            this.graph.displayScene();
        }
        else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();
        
        // ---- END Background, camera and axis setup
    }
}