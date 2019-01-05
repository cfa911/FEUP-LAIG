var DEGREE_TO_RAD = Math.PI / 180;
var TIMELAPSE = 1;
var coffe = [];
var WorkingBoard = [
    ['empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty']
];
var allBoards = [];
// var ArrBoards = firstBoard;
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
        this.currentScene = 1;

        this.initCameras();

        this.enableTextures(true);
        this.axis = new CGFaxis(this);
        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.picked = false;

        this.arrayO = new Array(4);
        for (let j = 0; j < 4; j++) {
            this.arrayO[j] = new Array(4);
            for (let i = 0; i < 4; i++) {

                this.arrayO[j][i] = new MyPlane(this, 2, 2);
            }
        }
        //this.ani = new initialAnimation(this, 10, [[0,0,0],[1,0,0],[0,0,1]]);
        //this.cir = new CircularAnimation(this, 10, [0,0,0], 5, 90, 0);
        //this.tri = new MyRectangle(this,0,0,1,1);
        //this.tri = new My2ndCylinder(this,1,1,5,20,20);
        //this.cof = new MyCoffee(this,2,180);
        this.box2 = new MyBox(this, 2);
        this.box1 = new MyBox(this, 1);
        this.player = 2;
        this.rotation = 90;
        this.coffe = new MyCoffee(this, this.player, 0);
        this.coffe.type = 'orange';
        this.upControlPoints = [[0, 0, 0], [0, 3, 0]];
        this.upAnimation = new LinearAnimation(this, 3, this.upControlPoints);



        this.x = 0;
        this.z = 0;
        this.passed = false;
        this.circ = new CircularAnimation(this, 3, [this.x, 3, this.z], 0, 0, this.rotation);
        this.globalTime = 0;
        this.lastTime = -1;
        this.setPickEnabled(true);
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
                if (view.type == "perspective") {
                    this.viewValues[key] = new CGFcamera(view[0], view[1], view[2], view[3], view[4]);
                }
                if (view.type == "ortho") {
                    this.viewValues[key] = new CGFcameraOrtho(view[0], view[1], view[2], view[3], view[4], view[5], view[6], view[7], view[8]);
                }
            }
        }

        //sets default camera ✓

        this.camera = this.viewValues[this.graph.default];
        this.cameraId = this.graph.default;
        this.interface.setActiveCamera(this.camera);
    }

    rotateCamera() {
        this.rotateCam = true;
        this.cameraTime = 0;
    }

    selectView(id) {
        if (id == this.graph.default || id == "ortho1" || this.cameraId == "ortho1" || this.graph.default == this.cameraId) {
            this.camera = this.viewValues[id];
            this.cameraId = id;
        }
        else {
            this.cameraId = id;
            this.rotateCamera();
        }

        //this.interface.setActiveCamera(this.camera);
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
                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                if (this.lights[0] == "spot") {
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
        this.axis = new CGFaxis(this, this.graph.axis_length);
        // TODO: Change ambient and background details according to parsed graph ✓
        var ambient = this.graph.ambient;
        var background = this.graph.background;
        this.gl.clearColor(background[0], background[1], background[2], background[3]); //global from parser ✓
        this.setGlobalAmbientLight(ambient[0], ambient[1], ambient[2], ambient[3]);//global from parser ✓
        this.initLights();
        this.initViews();
        // Adds lights group ✓
        this.interface.addLightsGroup(this.graph.lights); //add all lights ✓
        this.interface.addViewsGroup(this.viewValues);
        this.sceneInited = true;
        this.interface.changeScene();
        this.setUpdatePeriod(20);
        this.boardTex = textureMap.get("board");
    }

    update(currTime) {
        var deltaTime;

        if (this.lastTime == -1)
            deltaTime = 0;
        else
            deltaTime = (currTime - this.lastTime) / 1000;
        //time is different for some reason initial porly done
        this.upAnimation.update(deltaTime);
        if (this.picked == true)
            this.moveAnimation.animation.update(deltaTime);
        if (this.upAnimation.final)
            this.circ.update(deltaTime);

        for (const k of componentMap.keys()) {
            var component = componentMap.get(k);
            if (component.animations.length > component.i)
                component.animations[component.i].update(deltaTime);
        }
        this.lastTime = currTime;


        this.globalTime += deltaTime; // Calculates total time since start of program(in seconds)

        if (!this.rotateCam) { // Waiting to load everything

        }
        else {

            if (Math.floor(this.cameraTime) < TIMELAPSE) {
                /*
                for (var key in this.viewValues)
                {
                    if(key == "player 1" || key == "player 2")
                    this.viewValues[key].orbit('X',deltaTime*180*DEGREE_TO_RAD/TIMELAPSE);
                }*/
                this.camera.orbit('X', deltaTime * 180 * DEGREE_TO_RAD / TIMELAPSE);
                this.previous = this.cameraTime;
                this.cameraTime += deltaTime;
            }
            else {
                this.camera.orbit('X', deltaTime * - 100 * (this.previous - Math.floor(this.previous)) * DEGREE_TO_RAD / TIMELAPSE);

                this.rotateCam = false;
            }
        }

    }

    loadMode(val) {
        var filename;
        if (val == 2) {
            filename = getUrlVars()['file'] || "YAS2.xml";
            // this.cameras = [];
            this.graph = new MySceneGraph(filename, this);
        }
        else if (val == 1) {
            filename = getUrlVars()['file'] || "YAS.xml";
            // this.cameras = [];
            this.graph = new MySceneGraph(filename, this);

        }
    };


    logPicking() {
        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i = 0; i < this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj) {
                        this.picked = true;
                        var customId = this.pickResults[i][1];
                        console.log("Picked object: " + obj + ", with pick id " + customId);
                        this.moveAnimation = new MovePlayer(this, 2, customId, 3);
                        allBoards.push(WorkingBoard);
                        let u = customId % 10;
                        let d = (customId - customId % 10) / 10;
                        WorkingBoard[d - 1][u - 1] = this.coffe.type;
                    }
                    else {
                        this.picked = false;

                    }
                }
                this.pickResults.splice(0, this.pickResults.length);
            }
        }
    }


    /**
     * Displays the scene.
     */
    display() {
        var i = 0;
        var j = 0;

        // ---- BEGIN Background, camera and axis setup
        this.logPicking();
        this.clearPickRegistration();
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
            this.translate(0, 0, 10);
            this.box2.display();
            this.popMatrix();

            this.pushMatrix();
            this.translate(20, 0, 10);
            this.box1.display();
            this.popMatrix();


            //We should create the object when the input starts
            this.pushMatrix();
            this.translate(0, 2.5, 10);
            if (!this.upAnimation.final)
                this.upAnimation.apply();
            else if (this.picked == true) {
                this.moveAnimation.animation.apply();

            }
            else {
                this.translate(0, 3, 0);

            }
            this.coffe.display();
            this.popMatrix();

            for (let i = 0; i < WorkingBoard; i++) {
                for (let i = 0; i < WorkingBoard; i++) {

                }
            }

            this.pushMatrix();
            this.translate(4, 0, 4);
            for (let j = 0; j < 4; j++) {
                for (let i = 0; i < 4; i++) {
                    this.pushMatrix();
                    this.scale(4, 1, 4);
                    this.translate(i, 0.1, j);
                    this.registerForPick((4 - j) + (i + 1) * 10, this.arrayO[j][i]);
                    this.boardTex.bind();
                    this.arrayO[j][i].display();
                    this.popMatrix();
                }
            }
            this.popMatrix();

            /*this.pushMatrix();
            //console.log(this.ani.apply());
            //this.multMatrix(this.ani.apply());
            this.ani.apply();
            this.tri.display();
            this.popMatrix();*/
            //this.vei.display();
        }
        else {
            // Draw axis
            this.axis.display();
        }
        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}