// global variables that will store the toolbox color palette
// and the helper functions
let helpers = colorP = toolbox = null;
let star, c;
let scrollAmount = 0;
let hidden;
let global_stroke_weight = 3;
let global_text_size = 25;

function preload() {
    star = loadImage('assets/star.png')
}

function setup() {

    // is the side bar and bottom menu hidden
    hidden = false;

    // create a canvas to fill the content div from index.html
    canvasContainer = select('#content');

    c = createCanvas(canvasContainer.size().width, canvasContainer.size().height);
    c.parent("content");

    // create helper functions and the color palette
    helpers = new HelperFunctions();
    colorP = new ColorPalette();

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
            TextTool,
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

// TODO FIND A WAY TO DO THIS WITHOUT ACCESSING TOOLBOX DIRECTLY
function keyPressed() {
    if (toolbox.selectedTool.name == "text") {
        let txt = toolbox.selectedTool;
        if(txt.typing === true) {
            // Enter
            if (keyCode === 13) {
                txt.add_letter("\n");
            }
            // Backspace
            if (keyCode === 8) {
                // Delete char from string
                txt.delete_text();
            }
        }
    }
}

function keyTyped() {
    if (toolbox.selectedTool.name == "text" && key !== "\r") {
        let txt = toolbox.selectedTool;
        if(txt.typing === true) {
            toolbox.selectedTool.add_letter(key);
        }
    }
}
