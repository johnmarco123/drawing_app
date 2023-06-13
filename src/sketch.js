//global variables that will store the toolbox colour palette
//and the helper functions
var toolbox = null;
var colourP = null;
var helpers = null;
var star;
// var starSizeSlider
// var nStarSlider;
var c; 

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

    //create helper functions and the colour palette
    helpers = new HelperFunctions();
    colourP = new ColourPalette();

    //create a toolbox for storing the tools
    toolbox = new Toolbox();

    //add the tools to the toolbox.
    toolbox.addTool(new FreehandTool());
    toolbox.addTool(new LineToTool());
    toolbox.addTool(new SprayCanTool());
    toolbox.addTool(new mirrorDrawTool());
    toolbox.addTool(new ellipseTool());
    toolbox.addTool(new rectTool());
    toolbox.addTool(new starTool());
    toolbox.addTool(new moveableLineTool());
    toolbox.addTool(new scissorsTool());
    background(255);

}

function draw() {
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
