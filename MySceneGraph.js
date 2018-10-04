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

var red1 = 0;
var blue1 = 0;
var green1 = 0;
var ambientValue1 = 0;
var red2 = 0;
var blue2 = 0;
var green2 = 0;
var ambientValue2 = 0;

var arrayOmni =[];
var arraySpot = [];
var arrayMaterials = [];
var arrayPrimitives = [];

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

        this.log("l");

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

        this.log("assa");

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
            new CGFaxis(this.scene, this.axis_length, 0.2);
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

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        if (viewsNode == -1) {
            this.onXMLMinorError("views planes missing; assuming default = perspective1");
        }
        else {
            this.default = this.reader.getString(viewsNode, 'default');

            if (this.default == null) {
                this.default = "perspective1";
            }
            //define a default perspective id -> primary prespective
        }
        // parse children prespectives
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

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var indexAmbient = nodeNames.indexOf("ambient");
        var indexBackground = nodeNames.indexOf("background");
        if (indexAmbient == -1) {
            this.onXMLMinorError("Ambient planes missing;");
        }
        else {
            red1 = this.reader.getFloat(children[indexAmbient], 'r');
            green1 = this.reader.getFloat(children[indexAmbient], 'g');
            blue1 = this.reader.getFloat(children[indexAmbient], 'b');
            ambientValue1 = this.reader.getFloat(children[indexAmbient], 'a');
            this.log(ambientValue1);

        }

        if (indexBackground == -1) {
            this.onXMLMinorError("Background planes missing;");
        }
        else {
            red2 = this.reader.getFloat(children[indexAmbient], 'r');
            green2 = this.reader.getFloat(children[indexAmbient], 'g');
            blue2 = this.reader.getFloat(children[indexAmbient], 'b');
            ambientValue2 = this.reader.getFloat(children[indexAmbient], 'a');

        }
        this.log("Parsed Ambient");

        return null;
    }

    /**
     * Parses the <lights> block. 
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        var childs = lightsNode.children;
        var nodeNames = [];

        this.log(lightsNode.nodeName);
        this.log(childs[0].nodeName);

        for (var i = 0; i < childs.length; i++)
            nodeNames.push(childs[i].nodeName);

        var indexOmni = nodeNames.indexOf("omni");
        var indexSpot = nodeNames.indexOf("spot");

        //this.log(indexOmni.nodeName);

        //about omni
        if ( indexOmni == -1) {
            this.onXMLMinorError("Omni planes missing;");
        }
        else {
            var idOmni = this.reader.getString(childs[indexOmni], 'id');
            var enabledOmni = new Boolean(this.reader.getString(childs[indexOmni], 'enabled'));
            this.log("parse id omni");
        }

        var omniChildren = childs[indexOmni].children; /*indexOmni.children;*/
        var nodeNamesOmni = [];

        this.log("i am here");
        this.log(omniChildren.nodeName);

        for(var i =0; i < omniChildren.length; i++)
            nodeNamesOmni.push(omniChildren[i].nodeName)

        var location1 = omniChildren[1]; /*nodeNamesOmni.indexOf("location");*/
        this.log(location1.nodeName);
        var ambient1 = nodeNamesOmni.indexOf("ambient");
        this.log(ambient1.nodeName);
        var diffuse1 = nodeNamesOmni.indexOf("diffuse");
        var specular1 = nodeNamesOmni.indexOf("specular");

        if(location1 == -1 || ambient1 == -1 || diffuse1 == -1 || specular1 == -1){
            this.onXMLError("Omni childrens missing");
        }
        else{
            var x= this.reader.getFloat(omniChildren[location1], 'x');
            var y= this.reader.getFloat(omniChildren[location1], 'y');
            var z= this.reader.getFloat(omniChildren[location1], 'z');
            var w= this.reader.getFloat(omniChildren[location1], 'w');

            var r1= this.reader.getFloat(omniChildren[ambient1], 'r');
            var g1= this.reader.getFloat(omniChildren[ambient1], 'g');
            var b1= this.reader.getFloat(omniChildren[ambient1], 'b');
            var a1= this.reader.getFloat(omniChildren[ambient1], 'a');

            var r2= this.reader.getFloat(omniChildren[diffuse1], 'r');
            var g2= this.reader.getFloat(omniChildren[diffuse1], 'g');
            var b2= this.reader.getFloat(omniChildren[diffuse1], 'b');
            var a2= this.reader.getFloat(omniChildren[diffuse1], 'a');

            var r3= this.reader.getFloat(omniChildren[specular1], 'r');
            var g3= this.reader.getFloat(omniChildren[specular1], 'g');
            var b3= this.reader.getFloat(omniChildren[specular1], 'b');
            var a3= this.reader.getFloat(omniChildren[specular1], 'a');
        }

        //about spot
        if ( indexSpot == -1) {
            this.onXMLMinorError("Spot planes missing;");
        }
        else {
            var idSpot = this.reader.getString(children[indexSpot], 'id');
            var enabledSpot = new Boolean(this.reader.getString(children[indexSpot], 'enabled'));
            var angleSpot = this.reader.getFloat(children[indexSpot], 'angle');
            var exponentSpot = this.reader.getFloat(children[indexSpot], 'exponent');
        }

        var spotChildren = indexSpot.children;
        var nodeNamesSpot = [];

        for(var i =0; i < spotChildren.length; i++)
            nodeNamesSpot.push(spotChildren[i].nodeName)

        var location2 = nodeNamesSpot.indexOf("location");
        var target2 = nodeNamesSpot.indexOf("target");
        var ambient2 = nodeNamesSpot.indexOf("ambient");
        var diffuse2 = nodeNamesSpot.indexOf("diffuse");
        var specular2 = nodeNamesSpot.indexOf("specular");

        if(location2 == -1 || target2 == -1 || ambient2 == -1 || diffuse2 == -1 || specular2 == -1){
            this.onXMLError("Spot childrens missing");
        }
        else{
            var x1= this.reader.getFloat(spotChildren[location2], 'x');
            var y1= this.reader.getFloat(spotChildren[location2], 'y');
            var z1= this.reader.getFloat(spotChildren[location2], 'z');

            var x2= this.reader.getFloat(spotChildren[target2], 'x');
            var y2= this.reader.getFloat(spotChildren[target2], 'y');
            var z2= this.reader.getFloat(spotChildren[target2], 'z');

            var r1= this.reader.getFloat(spotChildren[ambient2], 'r');
            var g1= this.reader.getFloat(spotChildren[ambient2], 'g');
            var b1= this.reader.getFloat(spotChildren[ambient2], 'b');
            var a1= this.reader.getFloat(spotChildren[ambient2], 'a');

            var r2= this.reader.getFloat(spotChildren[diffuse2], 'r');
            var g2= this.reader.getFloat(spotChildren[diffuse2], 'g');
            var b2= this.reader.getFloat(spotChildren[diffuse2], 'b');
            var a2= this.reader.getFloat(spotChildren[diffuse2], 'a');

            var r3= this.reader.getFloat(spotChildren[specular2], 'r');
            var g3= this.reader.getFloat(spotChildren[specular2], 'g');
            var b3= this.reader.getFloat(spotChildren[specular2], 'b');
            var a3= this.reader.getFloat(spotChildren[specular2], 'a');
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
        
        if ( indexTexture == -1) {
            this.onXMLMinorError("Textures planes missing;");
        }
        else {
            var idTex = this.reader.getString(children[indexTexture], 'id');
            var fileTex = this.reader.getString(children[indexTexture], 'file');
        }
        
        this.log("Parsed textures");
        return null;

    }

    /**
     * Parses the <materials> block.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++){
            nodeNames.push(children[i].nodeName);
        }

        if (nodeNames == -1) {
            this.onXMLMinorError("Materials planes missing;");
            }

        else{
            for (var i= 0; i< nodeNames.length; i++){
                var indexMaterials = nodeNames.indexOf("material");

                var idMat = this.reader.getString(children[indexMaterials], 'id');
                var shiMat = this.reader.getFloat(children[indexMaterials], 'shininess');
                
                var subChildren = indexMaterials.children;
                var subNodenames = [];

                for(var j=0; j<subChildren.length; j++){
                    subNodenames.push(subChildren[j].nodeName);
                }

                var emission = subNodenames.indexOf("emission");
                var ambient = subNodenames.indexOf("ambient");
                var diffuse = subNodenames.indexOf("diffuse");
                var specular = subNodenames.indexOf("specular");

                if(emission == -1 || ambient == -1 || diffuse == -1 || specular == -1){
                    this.onXMLMinorError("Material childs planes missing;");
                }

                var r1= this.reader.getFloat(subChildren[emission], 'r');
                var g1= this.reader.getFloat(subChildren[emission], 'g');
                var b1= this.reader.getFloat(subChildren[emission], 'b');
                var a1= this.reader.getFloat(subChildren[emission], 'a');

                var r2= this.reader.getFloat(subChildren[ambient], 'r');
                var g2= this.reader.getFloat(subChildren[ambient], 'g');
                var b2= this.reader.getFloat(subChildren[ambient], 'b');
                var a2= this.reader.getFloat(subChildren[ambient], 'a');

                var r3= this.reader.getFloat(subChildren[diffuse], 'r');
                var g3= this.reader.getFloat(subChildren[diffuse], 'g');
                var b3= this.reader.getFloat(subChildren[diffuse], 'b');
                var a3= this.reader.getFloat(subChildren[diffuse], 'a');

                var r4= this.reader.getFloat(subChildren[specular], 'r');
                var g4= this.reader.getFloat(subChildren[specular], 'g');
                var b4= this.reader.getFloat(subChildren[specular], 'b');
                var a4= this.reader.getFloat(subChildren[specular], 'a');

                arrayMaterials.push([idMat, shiMat, r1, g1, b1, a1, r2, g2, b2, a2, r3, g3, b3, a3, r4, g4, b4, a3])
            }
        }

        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */


    /*
    
       var children = sceneNode.children;

       var nodeNames = [];

       for (var i = 0; i < children.length; i++)
           nodeNames.push(children[i].nodeName);

       // Frustum planes
       // (default values)
       this.near = 0.1;
       this.far = 500;
       var indexFrustum = nodeNames.indexOf("frustum");
       if (indexFrustum == -1) {
           this.onXMLMinorError("frustum planes missing; assuming 'near = 0.1' and 'far = 500'");
       }
       else {
           this.near = this.reader.getFloat(children[indexFrustum], 'near');
           this.far = this.reader.getFloat(children[indexFrustum], 'far');

           if (!(this.near != null && !isNaN(this.near))) {
               this.near = 0.1;
               this.onXMLMinorError("unable to parse value for near plane; assuming 'near = 0.1'");
           }
           else if (!(this.far != null && !isNaN(this.far))) {
               this.far = 500;
               this.onXMLMinorError("unable to parse value for far plane; assuming 'far = 500'");
           }

           if (this.near >= this.far)
               return "'near' must be smaller than 'far'";
       }

       // Checks if at most one translation, three rotations, and one scaling are defined.
       if (initialsNode.getElementsByTagName('translation').length > 1)
           return "no more than one initial translation may be defined";

       if (initialsNode.getElementsByTagName('rotation').length > 3)
           return "no more than three initial rotations may be defined";

       if (initialsNode.getElementsByTagName('scale').length > 1)
           return "no more than one scaling may be defined";

       // Initial transforms.
       this.initialTranslate = [];
       this.initialScaling = [];
       this.initialRotations = [];

       // Gets indices of each element.
       var translationIndex = nodeNames.indexOf("translation");
       var thirdRotationIndex = nodeNames.indexOf("rotation");
       var secondRotationIndex = nodeNames.indexOf("rotation", thirdRotationIndex + 1);
       var firstRotationIndex = nodeNames.lastIndexOf("rotation");
       var scalingIndex = nodeNames.indexOf("scale");

       // Checks if the indices are valid and in the expected order.
       // Translation.
       this.initialTransforms = mat4.create();
       mat4.identity(this.initialTransforms);

       if (translationIndex == -1)
           this.onXMLMinorError("initial translation undefined; assuming T = (0, 0, 0)");
       else {
           var tx = this.reader.getFloat(children[translationIndex], 'x');
           var ty = this.reader.getFloat(children[translationIndex], 'y');
           var tz = this.reader.getFloat(children[translationIndex], 'z');

           if (tx == null || ty == null || tz == null) {
               tx = 0;
               ty = 0;
               tz = 0;
               this.onXMLMinorError("failed to parse coordinates of initial translation; assuming zero");
           }
           //TODO: Save translation data
           this.initialTranslate =[tx,ty,tz];
           this.scene.translate(this.initialTranslate);
       }

       //TODO: Parse Rotations

       if (thirdRotationIndex == -1)
           this.onXMLMinorError("third rotation undefined; assuming R = (0, 1, 0, 0)");
       else {
           var axis = this.reader.getString(children[thirdRotationIndex], 'axis');
           var angle = this.reader.getFloat(children[thirdRotationIndex], 'angle');

           if (axis == null || angle == null) {
               axis = "x";
               angle = 0;
               this.onXMLMinorError("failed to parse coordinates of third rotation; assuming zero");
           }
           //TODO: Save rotation data
           else if(axis == "x")
           {
               this.initialRotations =[angle*DEGREE_TO_RAD,1,0,0];
           }
           else if(axis == "y")
           {
               this.initialRotations =[angle*DEGREE_TO_RAD,0,1,0];
           }
           else if(axis == "z")
           {
               this.initialRotations =[angle*DEGREE_TO_RAD,0,0,1];
           }
           this.scene.rotate(this.initialRotations);
       }

       if (secondRotationIndex == -1)
           this.onXMLMinorError("third rotation undefined; assuming R = (0, 1, 0, 0)");
       else {
           var axis = this.reader.getString(children[secondRotationIndex], 'axis');
           var angle = this.reader.getFloat(children[secondRotationIndex], 'angle');

           if (axis == null || angle == null) {
               axis = "x";
               angle = 0;
               this.onXMLMinorError("failed to parse coordinates of second rotation; assuming zero");
           }
           else if(axis == "x")
           {
               this.initialRotations =[angle*DEGREE_TO_RAD,1,0,0];
           }
           else if(axis == "y")
           {
               this.initialRotations =[angle*DEGREE_TO_RAD,0,1,0];
           }
           else if(axis == "z")
           {
               this.initialRotations =[angle*DEGREE_TO_RAD,0,0,1];
           }
           this.scene.rotate(this.initialRotations);
       }

       if (firstRotationIndex == -1)
           this.onXMLMinorError("third rotation undefined; assuming R = (0, 1, 0, 0)");
       else {
           var axis = this.reader.getString(children[firstRotationIndex], 'axis');
           var angle = this.reader.getFloat(children[firstRotationIndex], 'angle');

           if (axis == null || angle == null) {
               axis = "x";
               angle = 0;
               this.onXMLMinorError("failed to parse coordinates of first rotation; assuming zero");
           }
           else if(axis == "x")
           {
               this.initialRotations =[angle*DEGREE_TO_RAD,1,0,0];
           }
           else if(axis == "y")
           {
               this.initialRotations =[angle*DEGREE_TO_RAD,0,1,0];
           }
           else if(axis == "z")
           {
               this.initialRotations =[angle*DEGREE_TO_RAD,0,0,1];
           }
           this.scene.rotate(this.initialRotations);
       }
       
       //TODO: Parse Scaling

       if (scalingIndex == -1)
           this.onXMLMinorError("initial scaling undefined; assuming S = (1, 1, 1)");
       else {
           var sx = this.reader.getFloat(children[scalingIndex], 'sx');
           var sy = this.reader.getFloat(children[scalingIndex], 'sy');
           var sz = this.reader.getFloat(children[scalingIndex], 'sz');

           if (sx == null || sy == null || sz == null) {
               sx = 1;
               sy = 1;
               sz = 1;
               this.onXMLMinorError("failed to parse coordinates of initial scaling; assuming one");
           }
           //TODO: Save scaling data
           this.initialScaling =[sx,sy,sz];
           this.scene.scale(this.initialScaling);
       }
       /*
       if (scalingIndex == -1)
           this.onXMLMinorError("initial reference undefined; assuming L = 1");
       else {
           var length = this.reader.getFloat(children[scalingIndex], 'length');

           if (length == null) {
               length = 1;
               this.onXMLMinorError("failed to parse coordinates of initial length; assuming one");
           }
           //TODO: Save scaling data
           this.scene.axis();
       }
       
       //TODO: Parse Reference length

       this.log("Parsed initials");

       return null;
    */

    parseTransformations(transformationsNode) {
        // TODO: Parse block
        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {

        var children = primitivesNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++){
            nodeNames.push(children[i].nodeName);
        }

        if (nodeNames == -1) {
            this.onXMLMinorError("Primitives planes missing;");
            }

        for (var i=0; i<nodeNames.length; i++){

            var indexPermitives = nodeNames.indexOf("permitive");
            var idPermitive = this.reader.getFloat(children[indexPermitives], 'id');

            var subChildrens = indexPermitives.children;
            var subNodeNames = [];

            for (var j=0; j<subChildrens.length; j++){
                subNodeNames.push(subChildrens[j].nodeName);
            }

            var rectangle = subNodeNames.indexOf("rectangle");
            var triangle = subNodeNames.indexOf("triangle");
            var cylinder = subNodeNames.indexOf("cylinder");
            var sphere = subNodeNames.indexOf("sphere");
            var torus = subNodeNames.indexOf("torus");


        }
        this.log("Parsed primitives");
        return null;
    }

    /**
     * Parses the <components> block.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {
        // TODO: Parse block
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

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        // entry point for graph rendering
        //TODO: Render loop starting at root of graph
    }
}