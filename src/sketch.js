// global variables that will store the toolbox color palette, pages
// and the helper functions
let helpers = colorP = pageB = toolbox = null;
let star, c;
let scrollAmount = 0;

function preload() {
    star = loadImage('assets/star.png')
}

function setup() {

    // create a canvas to fill the content div from index.html
    canvasContainer = select('#content');
    c = createCanvas(canvasContainer.size().width, canvasContainer.size().height);
    c.parent("content");

    // create helper functions and the color palette
    helpers = new HelperFunctions();
    colorP = new ColorPalette();
    pageB = new PageBook();

    // create a toolbox for storing the tools
    toolbox = new Toolbox();

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
    ]);
}

function draw() {
    // call the draw function from the selected tool.
        // hasOwnProperty is a javascript function that tests
    // if an object contains a particular method or property
    // if there isn't a draw method the app will alert the user
    if (toolbox.selectedTool.hasOwnProperty("draw")) { 
        if (mousePressOnCanvas(c)) {
            toolbox.selectedTool.draw();
        }

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
