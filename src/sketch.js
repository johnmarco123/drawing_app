//global variables that will store the toolbox color palette
//and the helper functions
var toolbox = null;
var colorP = null;
var helpers = null;
var star, c;
// var starSizeSlider
// var nStarSlider;
let scrollAmount = 0;

function preload() {
    star = loadImage('assets/star.png')
}
function setup() {

    loadPixels();
    //create a canvas to fill the content div from index.html
    canvasContainer = select('#content');
    c = createCanvas(canvasContainer.size().width, canvasContainer.size().height);
    c.parent("content");

    // starSizeSlider = createSlider(5, 50, 20);
    // starSizeSlider.parent("#sizeOfStarControl")
    // nStarSlider = createSlider(1, 20, 5);
    // nStarSlider.parent("#numberOfStarsControl")

    //create helper functions and the color palette
    helpers = new HelperFunctions();
    colorP = new colorPalette();

    //create a toolbox for storing the tools
    toolbox = new Toolbox();

    //add the tools to the toolbox.
    toolbox.addTool(new FreehandTool());
    toolbox.addTool(new LineToTool());
    toolbox.addTool(new MirrorDrawTool());
    toolbox.addTool(new MoveableLineTool());
    toolbox.addTool(new RectTool());
    toolbox.addTool(new EllipseTool());
    toolbox.addTool(new StarTool());
    toolbox.addTool(new SprayCanTool());
    toolbox.addTool(new ScissorsTool());

    background(0);
}

function draw() {
    push();
    loadPixels();
    translate(0, scrollAmount);
    fill(255, 0, 0);
    ellipse(width/2, height/2, 50)
    // updatePixels();
    pop();
    //call the draw function from the selected tool.
    //hasOwnProperty is a javascript function that tests
    //if an object contains a particular method or property
    //if there isn't a draw method the app will alert the user
    if (toolbox.selectedTool.hasOwnProperty("draw")) {
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

function mouseWheel(event) {

    if(event.delta > 0 || scrollAmount < 0) {
        scrollAmount -= event.delta / 2;
    }
}
