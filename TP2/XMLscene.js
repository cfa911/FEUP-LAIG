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
        this.axis = new CGFaxis(this);
        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.setUpdatePeriod(1000/60);
        this.ani = new LinearAnimation(this, 5, [[0,0,0],[1,0,0],[1,1,0],[2,2,2]]);
        this.cir = new CircularAnimation(this, 20, [1,1,1], 1, 40, 20);
        this.tri = new MyRectangle(this,-0.5, -0.5, 0.5, 0.5);
        this.lastTime = -1;
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

    update(currTime) {
        var deltaTime;

        if(this.lastTime == -1)
            deltaTime = 0;
        else
            deltaTime = (currTime - this.lastTime) / 1000;

        this.lastTime = currTime;
        this.cir.update(deltaTime);
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

            this.graph.displayScene();

            this.pushMatrix();
            //console.log(this.ani.apply());
            //this.multMatrix(this.ani.apply());
            this.cir.apply();
            this.tri.display();
            this.popMatrix();
        }
        else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();
        
        // ---- END Background, camera and axis setup
    }
}