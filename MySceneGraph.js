var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

var ambientMap = new Map();
var materialsMap = new Map();
var textureMap = new Map();
var primitivesMap = new Map();
var transformMap = new Map();
var componentMap = new Map();
/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

        this.reader.open('scenes/' + filename, this);
    }


    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order");

            //Parse INITIAL block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse LIGHTS block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }


        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;

        }

        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }


        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }


    }

    /**
     * Parses the <scene> block.
     */
    parseScene(sceneNode) {

        // scene
        if (sceneNode == -1) {
            this.onXMLMinorError("scene planes missing; assuming 'root = 1 & axis_length = 5");
        }
        else {
            this.root = this.reader.getString(sceneNode, 'root');
            this.axis_length = this.reader.getFloat(sceneNode, 'axis_length');

            if (this.root == null || this.axis_length == null) {
                this.root = "1";
                this.axis_length = 5;
            }
        }
        this.log("Parsed scene");
        return null;
    }

    /**
     * Parses the <views> block.
     * @param {views block element} viewsNode
     */
    parseViews(viewsNode) {
        // TODO: Parse views node
        var children = viewsNode.children;
        this.views = [];
        var nodeNames = [];
        var names = [];

        var arrayPerspective = viewsNode.getElementsByTagName('perspective');
        var arrayOrtho = viewsNode.getElementsByTagName('ortho');

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        if (viewsNode == -1) {
            this.onXMLMinorError("views planes missing; assuming default = perspective1");
            this.default = "perspective1";
        }
        else {
            this.default = this.reader.getString(viewsNode, 'default');

            //define a default perspective id -> primary prespective
        }
        this.perspectiveIndex = nodeNames.indexOf("perspective");
        this.orthoIndex = nodeNames.indexOf("ortho");
        if (this.perspectiveIndex == -1 && this.orthoIndex == -1) {
            this.onXMLMinorError("views planes missing;");
        }
        else {
            if (this.perspectiveIndex != -1) {
                for (var j = 0; j < arrayPerspective.length; j++) {

                    var perspectiveChildren = arrayPerspective[j].children;
                    var idPerspective = this.reader.getString(arrayPerspective[j], 'id');
                    var near = this.reader.getFloat(arrayPerspective[j], 'near');
                    var far = this.reader.getFloat(arrayPerspective[j], 'far');
                    var angle = this.reader.getFloat(arrayPerspective[j], 'angle');
                    for (var i = 0; i < perspectiveChildren.length; i++)
                        names.push(perspectiveChildren[i].nodeName);

                    var fromIndex = names.indexOf("from");
                    var toIndex = names.indexOf("to");

                    if (fromIndex == -1 || toIndex == -1) {
                        this.onXMLMinorError("Perspective childs planes missing;");
                    }
                    else {
                        var xf = this.reader.getFloat(perspectiveChildren[fromIndex], 'x');
                        var yf = this.reader.getFloat(perspectiveChildren[fromIndex], 'y');
                        var zf = this.reader.getFloat(perspectiveChildren[fromIndex], 'z');

                        var xt = this.reader.getFloat(perspectiveChildren[toIndex], 'x');
                        var yt = this.reader.getFloat(perspectiveChildren[toIndex], 'y');
                        var zt = this.reader.getFloat(perspectiveChildren[toIndex], 'z');

                        this.views[idPerspective] = [angle * DEGREE_TO_RAD, near, far, [xf, yf, zf], [xt, yt, zt]];
                        this.views[idPerspective].type = "perspective";

                    }
                }
            }
            if (this.orthoIndex != -1) {
                names = [];
                for (var j = 0; j < arrayOrtho.length; j++) {
                    var orthoChildren = arrayOrtho[j].children;

                    var idOrtho = this.reader.getString(children[this.orthoIndex], 'id');
                    var near = this.reader.getFloat(children[this.orthoIndex], 'near');
                    var far = this.reader.getFloat(children[this.orthoIndex], 'far');
                    var left = this.reader.getFloat(children[this.orthoIndex], 'left');
                    var right = this.reader.getFloat(children[this.orthoIndex], 'right');
                    var top = this.reader.getFloat(children[this.orthoIndex], 'top');
                    var bottom = this.reader.getFloat(children[this.orthoIndex], 'bottom');

                    for (var i = 0; i < orthoChildren.length; i++)
                        names.push(orthoChildren[i].nodeName);

                    var positionIndex = names.indexOf("position");
                    var targetIndex = names.indexOf("target");
                    var upIndex = names.indexOf("up");

                    if (positionIndex == -1 || targetIndex == -1 || upIndex == -1) {
                        this.onXMLMinorError("Ortho childs planes missing;");
                    }
                    else {
                        var xp = this.reader.getFloat(orthoChildren[positionIndex], 'x');
                        var yp = this.reader.getFloat(orthoChildren[positionIndex], 'y');
                        var zp = this.reader.getFloat(orthoChildren[positionIndex], 'z');

                        var xt = this.reader.getFloat(orthoChildren[targetIndex], 'x');
                        var yt = this.reader.getFloat(orthoChildren[targetIndex], 'y');
                        var zt = this.reader.getFloat(orthoChildren[targetIndex], 'z');


                        var xu = this.reader.getFloat(orthoChildren[upIndex], 'x');
                        var yu = this.reader.getFloat(orthoChildren[upIndex], 'y');
                        var zu = this.reader.getFloat(orthoChildren[upIndex], 'z');

                        var position = [xp, yp, zp];
                        var target = [xt, yt, zt];
                        var up = [xu, yu, zu];
                    }

                    this.views[idOrtho] = [left, right, bottom, top, near, far, position, target, up];
                    this.views[idOrtho].type = "ortho";

                }
            }
        }
        this.log("Parsed views");

        return null;
    }


    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientNode
     */
    parseAmbient(ambientNode) {

        var children = ambientNode.children;
        var nodeNames = [];
        this.ambient = [];
        this.background = [];


        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var indexAmbient = nodeNames.indexOf("ambient");
        var indexBackground = nodeNames.indexOf("background");
        if (indexAmbient == -1) {
            this.onXMLMinorError("Ambient planes missing;");
        }
        else {
            this.ambient[0] = this.reader.getFloat(children[indexAmbient], 'r');
            this.ambient[1] = this.reader.getFloat(children[indexAmbient], 'g');
            this.ambient[2] = this.reader.getFloat(children[indexAmbient], 'b');
            this.ambient[3] = this.reader.getFloat(children[indexAmbient], 'a');
        }

        if (indexBackground == -1) {
            this.onXMLMinorError("Background planes missing;");
        }
        else {
            this.background[0] = this.reader.getFloat(children[indexBackground], 'r');
            this.background[1] = this.reader.getFloat(children[indexBackground], 'g');
            this.background[2] = this.reader.getFloat(children[indexBackground], 'b');
            this.background[3] = this.reader.getFloat(children[indexBackground], 'a');
        }
        this.log("Parsed Ambient");

        return null;
    }

    /**
     * Parses the <lights> block. 
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        this.lights = [];
        var omniElements = lightsNode.getElementsByTagName('omni');
        var spotElements = lightsNode.getElementsByTagName('spot');

        var nodeNames = [];

        for (var j = 0; j < omniElements.length; j++) {

            var omniChildren = omniElements[j].children;
            this.idOmni = this.reader.getString(omniElements[j], 'id');
            var enabledOmni = this.reader.getBoolean(omniElements[j], 'enabled');

            for (var i = 0; i < omniChildren.length; i++)
                nodeNames.push(omniChildren[i].nodeName);

            var location1 = nodeNames.indexOf('location');
            var ambient1 = nodeNames.indexOf("ambient");
            var diffuse1 = nodeNames.indexOf("diffuse");
            var specular1 = nodeNames.indexOf("specular");

            if (location1 == -1 || ambient1 == -1 || diffuse1 == -1 || specular1 == -1) {
                this.onXMLError("Omni childrens missing");
            }
            else {
                var x = this.reader.getFloat(omniChildren[location1], 'x');
                var y = this.reader.getFloat(omniChildren[location1], 'y');
                var z = this.reader.getFloat(omniChildren[location1], 'z');
                var w = this.reader.getFloat(omniChildren[location1], 'w');

                var r1 = this.reader.getFloat(omniChildren[ambient1], 'r');
                var g1 = this.reader.getFloat(omniChildren[ambient1], 'g');
                var b1 = this.reader.getFloat(omniChildren[ambient1], 'b');
                var a1 = this.reader.getFloat(omniChildren[ambient1], 'a');

                var r2 = this.reader.getFloat(omniChildren[diffuse1], 'r');
                var g2 = this.reader.getFloat(omniChildren[diffuse1], 'g');
                var b2 = this.reader.getFloat(omniChildren[diffuse1], 'b');
                var a2 = this.reader.getFloat(omniChildren[diffuse1], 'a');

                var r3 = this.reader.getFloat(omniChildren[specular1], 'r');
                var g3 = this.reader.getFloat(omniChildren[specular1], 'g');
                var b3 = this.reader.getFloat(omniChildren[specular1], 'b');
                var a3 = this.reader.getFloat(omniChildren[specular1], 'a');

                this.location = [x, y, z, w];
                this.ambient = [r1, g1, b1, a1];
                this.diffuse = [r2, g2, b2, a2];
                this.specular = [r3, g3, b3, a3];
                this.enabled = enabledOmni;

                this.lights[this.idOmni] = ["omni", this.enabled, this.location, this.ambient, this.diffuse, this.specular];

            }
        }

        nodeNames = [];

        for (var j = 0; j < spotElements.length; j++) {
            var spotChildren = spotElements[j].children;
            this.idSpot = this.reader.getString(spotElements[j], 'id');
            var enableSpot = this.reader.getBoolean(spotElements[j], 'enabled');
            var angleSpot = this.reader.getFloat(spotElements[j], 'angle');
            var exponentSpot = this.reader.getFloat(spotElements[j], 'exponent');

            for (var i = 0; i < spotChildren.length; i++)
                nodeNames.push(spotChildren[i].nodeName)

            var location2 = nodeNames.indexOf("location");
            var target2 = nodeNames.indexOf("target");
            var ambient2 = nodeNames.indexOf("ambient");
            var diffuse2 = nodeNames.indexOf("diffuse");
            var specular2 = nodeNames.indexOf("specular");

            if (location2 == -1 || target2 == -1 || ambient2 == -1 || diffuse2 == -1 || specular2 == -1) {
                this.onXMLError("Spot childrens missing");
            }
            else {
                var x1 = this.reader.getFloat(spotChildren[location2], 'x');
                var y1 = this.reader.getFloat(spotChildren[location2], 'y');
                var z1 = this.reader.getFloat(spotChildren[location2], 'z');

                var x2 = this.reader.getFloat(spotChildren[target2], 'x');
                var y2 = this.reader.getFloat(spotChildren[target2], 'y');
                var z2 = this.reader.getFloat(spotChildren[target2], 'z');

                var r1 = this.reader.getFloat(spotChildren[ambient2], 'r');
                var g1 = this.reader.getFloat(spotChildren[ambient2], 'g');
                var b1 = this.reader.getFloat(spotChildren[ambient2], 'b');
                var a1 = this.reader.getFloat(spotChildren[ambient2], 'a');

                var r2 = this.reader.getFloat(spotChildren[diffuse2], 'r');
                var g2 = this.reader.getFloat(spotChildren[diffuse2], 'g');
                var b2 = this.reader.getFloat(spotChildren[diffuse2], 'b');
                var a2 = this.reader.getFloat(spotChildren[diffuse2], 'a');

                var r3 = this.reader.getFloat(spotChildren[specular2], 'r');
                var g3 = this.reader.getFloat(spotChildren[specular2], 'g');
                var b3 = this.reader.getFloat(spotChildren[specular2], 'b');
                var a3 = this.reader.getFloat(spotChildren[specular2], 'a');

                this.location = [x1, y1, z1];
                this.target = [x2, y2, z2];
                this.ambient = [r1, g1, b1, a1];
                this.diffuse = [r2, g2, b2, a2];
                this.specular = [r3, g3, b3, a3];
                this.enabled = enableSpot;
                this.spot = [angleSpot, exponentSpot];

                this.lights[this.idSpot] = ["spot", this.enabled, this.location, this.ambient, this.diffuse, this.specular, this.target, this.spot];

            }
        }

        this.log("Parsed lights");

        return null;
    }

    /**
     * Parses the <textures> node.
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        var children = texturesNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var indexTexture = nodeNames.indexOf("texture");

        if (indexTexture == -1) {
            this.onXMLMinorError("Textures planes missing;");
        }
        else {
            var idTex = this.reader.getString(children[indexTexture], 'id');
            var fileTex = this.reader.getString(children[indexTexture], 'file');
            this.test = new CGFtexture(this.scene,fileTex);
            textureMap.set(idTex, this.test);
        }

        this.log("Parsed textures");
        return null;

    }

    /**
     * Parses the <materials> block.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var arrayMaterial = materialsNode.getElementsByTagName('material');
        var nodeNames = [];

        for (var j = 0; j < arrayMaterial.length; j++) {

            var materialsChildren = arrayMaterial[j].children;
            var idMat = this.reader.getString(arrayMaterial[j], 'id');
            var shiMat = this.reader.getFloat(arrayMaterial[j], 'shininess');

            for (var i = 0; i < materialsChildren.length; i++)
                nodeNames.push(materialsChildren[i].nodeName);

            var emission = nodeNames.indexOf("emission");
            var ambient = nodeNames.indexOf("ambient");
            var diffuse = nodeNames.indexOf("diffuse");
            var specular = nodeNames.indexOf("specular");

            if (emission == -1 || ambient == -1 || diffuse == -1 || specular == -1) {
                this.onXMLMinorError("Material childs planes missing;");
            }
            else {
                var r1 = this.reader.getFloat(materialsChildren[emission], 'r');
                var g1 = this.reader.getFloat(materialsChildren[emission], 'g');
                var b1 = this.reader.getFloat(materialsChildren[emission], 'b');
                var a1 = this.reader.getFloat(materialsChildren[emission], 'a');

                var r2 = this.reader.getFloat(materialsChildren[ambient], 'r');
                var g2 = this.reader.getFloat(materialsChildren[ambient], 'g');
                var b2 = this.reader.getFloat(materialsChildren[ambient], 'b');
                var a2 = this.reader.getFloat(materialsChildren[ambient], 'a');

                var r3 = this.reader.getFloat(materialsChildren[diffuse], 'r');
                var g3 = this.reader.getFloat(materialsChildren[diffuse], 'g');
                var b3 = this.reader.getFloat(materialsChildren[diffuse], 'b');
                var a3 = this.reader.getFloat(materialsChildren[diffuse], 'a');

                var r4 = this.reader.getFloat(materialsChildren[specular], 'r');
                var g4 = this.reader.getFloat(materialsChildren[specular], 'g');
                var b4 = this.reader.getFloat(materialsChildren[specular], 'b');
                var a4 = this.reader.getFloat(materialsChildren[specular], 'a');

                materialsMap.set(idMat, [[r1, g1, b1, a1], [r2, g2, b2, a2], [r3, g3, b3, a3], [r4, g4, b4, a4], shiMat])
            }
        }

        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */

    parseTransformations(transformationsNode) {
        // TODO: Parse block

        var arrayTransformation = transformationsNode.getElementsByTagName("transformation");

        for (var j = 0; j < arrayTransformation.length; j++) {

            var transformationChildren = arrayTransformation[j].children;
            var idTransform = this.reader.getString(arrayTransformation[j], 'id');
            var transformArray = mat4.create();

            for (var i = 0; i < transformationChildren.length; i++) {
                if (transformationChildren[i].nodeName == "translate") {
                    var tx = this.reader.getFloat(transformationChildren[i], 'x');
                    var ty = this.reader.getFloat(transformationChildren[i], 'y');
                    var tz = this.reader.getFloat(transformationChildren[i], 'z');
                    mat4.translate(transformArray, transformArray, [tx, ty, tz]);
                }
                if (transformationChildren[i].nodeName == "scale") {
                    var sx = this.reader.getFloat(transformationChildren[i], 'x');
                    var sy = this.reader.getFloat(transformationChildren[i], 'y');
                    var sz = this.reader.getFloat(transformationChildren[i], 'z');
                    mat4.scale(transformArray, transformArray, [sx, sy, sz]);
                }
                if (transformationChildren[i].nodeName == "rotate") {
                    var axis = this.reader.getString(transformationChildren[i], 'axis');
                    var angle = this.reader.getFloat(transformationChildren[i], 'angle');
                    if (axis == "x")
                        mat4.rotateX(transformArray, transformArray, angle * DEGREE_TO_RAD);
                    else if (axis == "y")
                        mat4.rotateY(transformArray, transformArray, angle * DEGREE_TO_RAD);
                    else if (axis == "z")
                        mat4.rotateZ(transformArray, transformArray, angle * DEGREE_TO_RAD);
                }

            }
            transformMap[idTransform] = transformArray;
        }
        this.log("Parsed transformations");
        return null;


    }
    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {

        var arrayPrimitive = primitivesNode.getElementsByTagName('primitive');
        

        for (var j = 0; j < arrayPrimitive.length; j++) {
            var nodeNames = [];
            var primitiveChildren = arrayPrimitive[j].children;
            var idPrimitive = this.reader.getString(arrayPrimitive[j], 'id');

            for (var i = 0; i < primitiveChildren.length; i++)
                nodeNames.push(primitiveChildren[i].nodeName);

            var rectangleIndex = nodeNames.indexOf("rectangle");
            var triangleIndex = nodeNames.indexOf("triangle");
            var cylinderIndex = nodeNames.indexOf("cylinder");
            var sphereIndex = nodeNames.indexOf("sphere");
            var torusIndex = nodeNames.indexOf("torus");

            if (rectangleIndex != -1) {
                var x1 = this.reader.getFloat(primitiveChildren[rectangleIndex], 'x1');
                var y1 = this.reader.getFloat(primitiveChildren[rectangleIndex], 'y1');
                var x2 = this.reader.getFloat(primitiveChildren[rectangleIndex], 'x2');
                var y2 = this.reader.getFloat(primitiveChildren[rectangleIndex], 'y2');
                primitivesMap.set(idPrimitive, [nodeNames[rectangleIndex], x1, y1, x2, y2]);
            }
            else if (triangleIndex != -1) {
                var x1 = this.reader.getFloat(primitiveChildren[triangleIndex], 'x1');
                var y1 = this.reader.getFloat(primitiveChildren[triangleIndex], 'y1');
                var z1 = this.reader.getFloat(primitiveChildren[triangleIndex], 'z1');
                var x2 = this.reader.getFloat(primitiveChildren[triangleIndex], 'x2');
                var y2 = this.reader.getFloat(primitiveChildren[triangleIndex], 'y2');
                var z2 = this.reader.getFloat(primitiveChildren[triangleIndex], 'z2');
                var x3 = this.reader.getFloat(primitiveChildren[triangleIndex], 'x3');
                var y3 = this.reader.getFloat(primitiveChildren[triangleIndex], 'y3');
                var z3 = this.reader.getFloat(primitiveChildren[triangleIndex], 'z3');
                primitivesMap.set(idPrimitive, [nodeNames[triangleIndex], x1, y1, z1, x2, y2, z2, x3, y3, z3]);
            }
            else if (cylinderIndex != -1) {
                var base = this.reader.getFloat(primitiveChildren[cylinderIndex], 'base');
                var top = this.reader.getFloat(primitiveChildren[cylinderIndex], 'top');
                var height = this.reader.getFloat(primitiveChildren[cylinderIndex], 'height');
                var slices = this.reader.getInteger(primitiveChildren[cylinderIndex], 'slices');
                var stacks = this.reader.getInteger(primitiveChildren[cylinderIndex], 'stacks');
                primitivesMap.set(idPrimitive, [nodeNames[cylinderIndex], base, top, height, slices, stacks]);
            }
            else if (sphereIndex != -1) {
                var base = this.reader.getFloat(primitiveChildren[sphereIndex], 'base');
                var slices = this.reader.getInteger(primitiveChildren[sphereIndex], 'slices');
                var stacks = this.reader.getInteger(primitiveChildren[sphereIndex], 'stacks');
                primitivesMap.set(idPrimitive, [nodeNames[sphereIndex], base, slices, stacks]);
            }
            else if (torusIndex != -1) {
                var inner = this.reader.getFloat(primitiveChildren[sphereIndex], 'inner');
                var outer = this.reader.getFloat(primitiveChildren[sphereIndex], 'outer');
                var slices = this.reader.getInteger(primitiveChildren[sphereIndex], 'slices');
                var loops = this.reader.getInteger(primitiveChildren[sphereIndex], 'loops');
                primitivesMap.set(idPrimitive, [nodeNames[sphereIndex], inner, outer, slices, loops]);
            }
        }
        this.log("Parsed primitives");
        return null;
    }

    /**
     * Parses the <components> block.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {

        var arrayComponents = componentsNode.getElementsByTagName('component');

        for (var j = 0; j < arrayComponents.length; j++) {
            var compo = new MyComponent(this.scene);
            var Component = arrayComponents[j];
            var idComponent = this.reader.getString(arrayComponents[j], 'id');
            var arrayCompRef = [];
            var arrayPrimRef = [];
            var transformations = Component.getElementsByTagName('transformation');
            var materials = Component.getElementsByTagName('materials');
            var textures = Component.getElementsByTagName('texture');
            var children = Component.getElementsByTagName('children');


            for (var k = 0; k < transformations.length; k++) {
                var transformationChilds = transformations[k].children;
                var transformArray = mat4.create();

                for (var i = 0; i < transformationChilds.length; i++) {
                    if (transformationChilds[i].nodeName == "translate") {
                        var tx = this.reader.getFloat(transformationChilds[i], 'x');
                        var ty = this.reader.getFloat(transformationChilds[i], 'y');
                        var tz = this.reader.getFloat(transformationChilds[i], 'z');
                        mat4.translate(transformArray, transformArray, [tx, ty, tz]);
                    }
                    else if (transformationChilds[i].nodeName == "scale") {
                        var sx = this.reader.getFloat(transformationChilds[i], 'x');
                        var sy = this.reader.getFloat(transformationChilds[i], 'y');
                        var sz = this.reader.getFloat(transformationChilds[i], 'z');
                        mat4.scale(transformArray, transformArray, [sx, sy, sz]);
                    }
                    else if (transformationChilds[i].nodeName == "rotate") {
                        var axis = this.reader.getString(transformationChilds[i], 'axis');
                        var angle = this.reader.getFloat(transformationChilds[i], 'angle');
                        if (axis == "x")
                            mat4.rotateX(transformArray, transformArray, angle * DEGREE_TO_RAD);
                        else if (axis == "y")
                            mat4.rotateY(transformArray, transformArray, angle * DEGREE_TO_RAD);
                        else if (axis == "z")
                            mat4.rotateZ(transformArray, transformArray, angle * DEGREE_TO_RAD);
                    }
                    else if (transformationChilds[i].nodeName == "transformationref") {
                        var idTref = this.reader.getString(transformationChilds[i], 'id');
                        transformArray = transformMap[idTref];
                    }

                }
                compo.transformations = transformArray;
            }
            for (var k = 0; k < materials.length; k++) {
                var materialChilds = materials[k].children;
                for (var i = 0; i < materialChilds.length; i++) {
                    var idMat = this.reader.getString(materialChilds[i], 'id');
                    compo.materials = idMat;
                }
            }
            for (var k = 0; k < textures.length; k++) {
                var idTex = this.reader.getString(textures[k], 'id');
                var length_s = this.reader.getFloat(textures[k], 'length_s');
                var length_t = this.reader.getFloat(textures[k], 'length_t');
                compo.textures = [idTex, length_s, length_t];
            }
            for (var k = 0; k < children.length; k++) {
                var childChildren = children[k].children;
                for (var i = 0; i < childChildren.length; i++) {
                    if (childChildren[i].nodeName == "primitiveref") {
                        var idPrim = this.reader.getString(childChildren[i], 'id');
                        arrayPrimRef.push(idPrim);
                    }
                    if (childChildren[i].nodeName == "componentref") {
                        var idComp = this.reader.getString(childChildren[i], 'id');
                        arrayCompRef.push(idComp);
                    }

                }
            }
            compo.primitive = arrayPrimRef;
            compo.children = arrayCompRef;
            compo.id = idComponent;

            componentMap.set(idComponent, compo);
        }
        this.log("Parsed components");
        return null;
    }



    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }
    through(node, texture, material) {

            
        var component = componentMap.get(node); //-> the node component


        if (component.materials != "inherit" && component.materials != null) {
            
            material = materialsMap.get(component.materials);
            this.material = new CGFappearance(this.scene);
            this.material.setEmission(material[0][0], material[0][1], material[0][2], material[0][3]);
            this.material.setAmbient(material[1][0], material[1][1], material[1][2], material[1][3]);
            this.material.setDiffuse(material[2][0], material[2][1], material[2][2], material[2][3]);
            this.material.setSpecular(material[3][0], material[3][1], material[3][2], material[3][3]);
            this.material.setShininess(material[4]);
        }
        else if(component.textures == "inherit")
        {
            this.material = new CGFappearance(this.scene);
            this.material.setEmission(material[0][0], material[0][1], material[0][2], material[0][3]);
            this.material.setAmbient(material[1][0], material[1][1], material[1][2], material[1][3]);
            this.material.setDiffuse(material[2][0], material[2][1], material[2][2], material[2][3]);
            this.material.setSpecular(material[3][0], material[3][1], material[3][2], material[3][3]);
            this.material.setShininess(material[4]);
        }
        else if (component.materials != "none") {
            material = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],1];
            this.material = new CGFappearance(this.scene);
            this.material.setEmission(material[0][0], material[0][1], material[0][2], material[0][3]);
            this.material.setAmbient(material[1][0], material[1][1], material[1][2], material[1][3]);
            this.material.setDiffuse(material[2][0], material[2][1], material[2][2], material[2][3]);
            this.material.setSpecular(material[3][0], material[3][1], material[3][2], material[3][3]);
            this.material.setShininess(material[4]);
        }


        if (component.textures != "inherit" && component.textures != null) {
            texture = component.textures[0];
            this.tex = textureMap.get(component.textures[0]);
            
        }
        else if(component.textures == "inherit")
        {
            this.tex = textureMap.get(texture);
        }
        else if (component.textures != "none") {
            if(this.tex != null)
            this.tex.unbind();
        }
        
        this.scene.multMatrix(component.transformations);


        
        for (var i = 0; i < componentMap.get(node).children.length + 1; i++) {
            this.scene.pushMatrix();
            if(this.material != null)
            this.material.apply();
            if(this.tex != null)
            this.tex.bind();
            for (var j = 0; j < componentMap.get(node).primitive.length ; j++) {
                var object = primitivesMap.get(componentMap.get(node).primitive[j]);
                if(object[0] == "rectangle")
                {   
                   
                    this.primitiva = new MyRectangle(this.scene,object[1],object[2],object[3],object[4]);
                }
                else if(object[0] == "triangle")
                {
                    this.primitiva = new MyTriangle(this.scene,object[1],object[2],object[3],object[4],object[5],object[6],object[7],object[8],object[9]);
                }
                if(object[0] == "cylinder")
                {
                    this.primitiva = new MyCylinderWTops(this.scene,object[1],object[2],object[3],object[4],object[5]);
                }
                if(object[0] == "sphere")
                {
                    this.primitiva = new MySphere(this.scene,object[1],object[2],object[3]);
                }
                if(object[0] == "torus")
                {
                    this.primitiva = new MyTorus(this.scene,object[1],object[2],object[3],object[4]);
                }
                this.primitiva.display();
            }
            if(componentMap.get(node).children[i] != null)
            this.through(componentMap.get(node).children[i],texture, material);
            this.scene.popMatrix();
        }
    
    //TODO: Render loop starting at root of graph 

}
    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        //-> materials, textures.
        // entry point for graph rendering
        var length_s;
        var length_t;
        this.through(this.root,null,null);
    }
        
}