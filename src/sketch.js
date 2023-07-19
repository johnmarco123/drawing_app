// global variables that will store the toolbox color palette
// and the helper functions
let helpers = colorP = toolbox = null;
let star, canv;
let global_stroke_weight = 3;

function preload() {
    star = loadImage('images/star.png');
}

function setup() {

    // is the side bar and bottom menu hidden
    canvasContainer = select('#content'); // create canvas to fill content  div from index.html

    canv = createCanvas(canvasContainer.size().width, canvasContainer.size().height);
    canv.parent("content");

    helpers = new HelperFunctions(); // create helper functions
    colorP = new ColorPalette(); // create color palette
    toolbox = new Toolbox(); // create a toolbox for storing the tools

    background(0);
    loadPixels();

    // add the tools to the toolbox.
        toolbox.addTools([
            FreehandTool,
            LineToTool,
            MoveableLineTool,
            MirrorDrawTool,
            RectTool,
            EllipseTool,
            StarTool,
            SprayCanTool,
            ScissorsTool,
            FillBucketTool,
            TextTool,
            GraphMakerTool
        ]);
}

function draw() {
    // call the draw function from the selected tool.
    // hasOwnProperty is a javascript function that tests
    // if an object contains a particular method or property
    // if there isn't a draw method the app will alert the user
    if (toolbox.selectedTool.hasOwnProperty("draw")) { 
        strokeWeight(select('#strokeSize').value());
        toolbox.selectedTool.draw();

    } else {
        alert("it doesn't look like your tool has a draw method!");
    }
}

function windowResized(){
    loadPixels();
    resizeCanvas(windowWidth, windowHeight);
    background(0)
    updatePixels();
}
