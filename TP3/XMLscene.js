var DEGREE_TO_RAD = Math.PI / 180;
var TIMELAPSE = 1;
var PLAYER = 1;
var GAMEMODE = 1;
var OVER = 0;
// Small class representing the status of a game
var gameStatus = function () {
    this.valueN = 2;
}

var gameMode = function () {
    this.players = function () {}
    this.cpu = function () {}

}

var gameUndo = function () {

    this.undoBtn = function () {
        let a = (customId % 10) - 1;
        let b = ((customId - customId % 10) / 10) - 1;
        if (ArrBoards.length != 1 && DirectionsBoard[b][a] != "empty") {
            ArrBoards.splice(ArrBoards.length - 1, 1);
            ArrLastMoves.splice(ArrLastMoves.length - 1, 1);
            WorkingBoard = ArrBoards[ArrBoards.length - 1];

            DirectionsBoard[b][a] = "empty";
            if (PLAYER == 1)
                PLAYER = 2;
            else
                PLAYER = 1;
        }
    }


}

// Object that represents the status of OUR game
var currentGameStatus = new gameStatus();
var currentGameUndo = new gameUndo();
var currentMode = new gameMode();





var customId;
var WorkingBoard = [
    ['empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty']
];

var DirectionsBoard = [
    ['empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty']
];
var u, d;
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

        //The input pads
        this.arrayO = new Array(4);
        for (let j = 0; j < 4; j++) {
            this.arrayO[j] = new Array(4);
            for (let i = 0; i < 4; i++) {

                this.arrayO[j][i] = new MyPlane(this, 2, 2);
            }
        }


        this.arrow = new CGFOBJModel(this, 'models/arrow.obj');





        this.brw = new CGFappearance(this);
        this.brw.setEmission(0.14, 0.07, 0, 0.2);
        this.brw.setAmbient(0.28, 0.14, 0, 0.5);
        this.brw.setDiffuse(0.42, 0.20, 0, 0.6);
        this.brw.setSpecular(0.55, 0.27, 0, 0.8);
        this.brw.setShininess(10);


        this.red = new CGFappearance(this);
        this.red.setEmission(0.2, 0, 0, 0.2);
        this.red.setAmbient(0.4, 0, 0, 0.5);
        this.red.setDiffuse(0.6, 0, 0, 0.6);
        this.red.setSpecular(0.8, 0, 0, 0.8);
        this.red.setShininess(10);


        this.green = new CGFappearance(this);
        this.green.setEmission(0, 0.2, 0, 0.2);
        this.green.setAmbient(0, 0.4, 0, 0.5);
        this.green.setDiffuse(0, 0.6, 0, 0.6);
        this.green.setSpecular(0, 0.8, 0, 0.8);
        this.green.setShininess(10);

        //
        this.box2 = new MyBox(this, 2);
        this.box1 = new MyBox(this, 1);

        this.rotation = 90;
        this.coffe = new MyCoffee(this, PLAYER, 0);
        this.upControlPoints = [[0, 0, 0], [0, 3, 0]];
        this.upAnimation = new LinearAnimation(this, 3, this.upControlPoints);

        this.brown = new MyCoffee(this, 1, 0);
        this.brownHorizontal = new MyCoffee(this, 1, 90);
        this.brownVertical = new MyCoffee(this, 1, 0);

        this.orange = new MyCoffee(this, 2, 0);
        this.orangeHorizontal = new MyCoffee(this, 2, 90);
        this.orangeVertical = new MyCoffee(this, 2, 0);

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
        this.interface.addStatusGroup(currentGameStatus);
        this.interface.addUndo(currentGameUndo);
        this.interface.addCpu(currentMode);
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
                    if(key == "PLAYER 1" || key == "PLAYER 2")
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
                        customId = this.pickResults[i][1];
                        console.log("Picked object: " + obj + ", with pick id " + customId);
                        if (customId == 10 || customId == 19) {
                            if (PLAYER == 1) {
                                if (this.moveAnimation != undefined) {
                                    if (this.moveAnimation.animation.final)
                                        this.brown.rotation += 90 * DEGREE_TO_RAD;
                                }
                            }
                            this.picked = false;

                        }
                        else if (customId == 20 || customId == 29) {
                            if (PLAYER == 2) {
                                if (this.moveAnimation != undefined) {
                                    if (this.moveAnimation.animation.final)
                                        this.orange.rotation += 90 * DEGREE_TO_RAD;
                                }
                            }
                            this.picked = false;

                        }
                        else {
                            // customId = linhacoluna
                            var angle;
                            if (PLAYER == 1)
                                angle = this.brown.rotation % (180 * DEGREE_TO_RAD);
                            else
                                angle = this.orange.rotation % (180 * DEGREE_TO_RAD);

                            var direction;
                            //changes direction based on 
                            if (angle != 0)
                                direction = 1;
                            else
                                direction = 2;

                            var vaildMove;
                            this.coluna = customId % 10;
                            this.linha = (customId - customId % 10) / 10;


                            if (ArrLastMoves.length != 0 && checkValidMove(customId, PLAYER, direction)) {
                                allBoards.push(JSON.parse(JSON.stringify(WorkingBoard)));
                                var u = customId % 10;
                                console.log("comeca");
                                console.log(customId);
                                console.log("acaba")
                                var d = (customId - customId % 10) / 10;
                                vaildMove = 1;
                                this.moveAnimation = new MovePlayer(this, PLAYER, customId, 3);

                            }
                            else if (ArrLastMoves.length == 0) {
                                ArrLastMoves.push([this.linha, this.coluna, direction]);
                                var copy = JSON.parse(JSON.stringify(firstBoard));
                                copy[this.linha - 1][this.coluna - 1] = "brown";
                                ArrBoards.push(copy);
                                var work = JSON.parse(JSON.stringify(WorkingBoard));
                                allBoards.push(work);
                                var u = customId % 10;
                                console.log("comeca");
                                console.log(customId);
                                console.log("acaba")
                                var d = (customId - customId % 10) / 10;
                                vaildMove = 1;
                                this.moveAnimation = new MovePlayer(this, PLAYER, customId, 3);

                            }
                            else
                                vaildMove = 0;

                        }

                        if (u == undefined && d == undefined) {

                        }
                        else {
                            if (PLAYER == 1 && vaildMove) {
                                WorkingBoard[d - 1][u - 1] = "brown";
                                if (!(this.brown.rotation % (180 * DEGREE_TO_RAD)))
                                    DirectionsBoard[d - 1][u - 1] = "brownVertical";
                                else
                                    DirectionsBoard[d - 1][u - 1] = "brownHorizontal";
                                PLAYER = 2;
                            }
                            else if (PLAYER == 2 && vaildMove) {
                                WorkingBoard[d - 1][u - 1] = "orange";
                                if (!(this.orange.rotation % (180 * DEGREE_TO_RAD)))
                                    DirectionsBoard[d - 1][u - 1] = "orangeVertical";
                                else
                                    DirectionsBoard[d - 1][u - 1] = "orangeHorizontal";

                                PLAYER = 1;
                            }
                            
                            if (vaildMove) {
                                if (gameOver(WorkingBoard) == 1 && OVER == 0)
                                {
                                    alert("PLAYER 1 Wins!!");
                                    OVER = 1;
                                }
                                else if (gameOver(WorkingBoard) == 2 && OVER == 0)
                                {
                                    alert("PLAYER 2 Wins!!");
                                    OVER = 1;
                                }
                            }
                        }
                        if (ArrLastMoves.length != 1 && validMovesConverted.length == 0 && OVER == 0)
                        alert("Its a draw!!");

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

            //- Uses the PLAYER to discover the color of the bead
            if (PLAYER == 1) {
                this.translate(0, 2.5, 10);
                this.coffe = this.orange;
            }
            else if (PLAYER == 2) {
                this.translate(20, 2.5, 10);
                this.coffe = this.brown;
            }
            //


            if (this.picked == true) {

                this.moveAnimation.animation.apply();
                this.coffe.display();


            }
            else {

                this.translate(0, 3, 0);

            }
            this.popMatrix();




            this.pushMatrix();
            let a = (customId % 10) - 1;
            let b = ((customId - customId % 10) / 10) - 1;

            for (let i = 0; i < DirectionsBoard.length; i++) {
                for (let j = 0; j < DirectionsBoard[i].length; j++) {
                    if (j == a && i == b) {
                    }
                    else {
                        this.pushMatrix();

                        if (DirectionsBoard[i][j] == 'brownVertical') {
                            this.translate(4 * (i + 1), 0.6, 4 * (4 - j));
                            this.brownVertical.display();

                        }
                        else if (DirectionsBoard[i][j] == 'brownHorizontal') {
                            this.translate(4 * (i + 1), 0.6, 4 * (4 - j));
                            this.brownHorizontal.display();
                        }
                        else if (DirectionsBoard[i][j] == 'orangeVertical') {
                            this.translate(4 * (i + 1), 0.6, 4 * (4 - j));
                            this.orangeVertical.display();
                        }
                        else if (DirectionsBoard[i][j] == 'orangeHorizontal') {
                            this.translate(4 * (i + 1), 0.6, 4 * (4 - j));
                            this.orangeHorizontal.display();
                        }
                        this.popMatrix();
                    }


                }
            }

            this.popMatrix();

            //PLAYER 2 controls
            this.pushMatrix();
            this.green.apply();
            this.translate(0, 2.5, 8);
            this.rotate(180 * DEGREE_TO_RAD, 0, 1, 0);
            this.registerForPick(20, this.arrow);
            this.scale(0.1, 0.1, 0.1);
            this.arrow.display();
            this.popMatrix();


            this.pushMatrix();
            this.red.apply();
            this.translate(0, 2.5, 12);
            this.scale(0.1, 0.1, 0.1);
            this.registerForPick(29, this.arrow);
            this.arrow.display();
            this.popMatrix();

            //PLAYER 1 controls
            this.pushMatrix();
            this.red.apply();
            this.translate(20, 2.5, 8);
            this.rotate(180 * DEGREE_TO_RAD, 0, 1, 0);
            this.registerForPick(19, this.arrow);
            this.scale(0.1, 0.1, 0.1);
            this.arrow.display();
            this.popMatrix();


            this.pushMatrix();
            this.green.apply();
            this.translate(20, 2.5, 12);
            this.scale(0.1, 0.1, 0.1);
            this.registerForPick(10, this.arrow);
            this.arrow.display();
            this.popMatrix();


            this.pushMatrix();
            this.translate(4, 0, 4);
            for (let j = 0; j < 4; j++) {
                for (let i = 0; i < 4; i++) {
                    this.pushMatrix();
                    this.scale(4, 1, 4);
                    this.translate(i, 0.1, j);
                    this.registerForPick((4 - j) + (i + 1) * 10, this.arrayO[j][i]);
                    this.brw.apply();
                    this.boardTex.bind();
                    this.arrayO[j][i].display();
                    this.popMatrix();
                    this.boardTex.unbind();

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