// the currently used color (mainly used by color palette);
let CURRENT_COLOR = null; 
let MOUSE_ON_CANVAS = false;
let global_stroke_weight = 3;

// global variables that will store the toolbox color palette
// and the helper functions
let helpers, colorP, toolbox, undo;
let canv;

function preload() {
}

function setup() {
    pixelDensity(1);
    // is the side bar and bottom menu hidden
    canvasContainer = select('#content'); // create canvas to fill content  div from index.html

    canv = createCanvas(canvasContainer.size().width, canvasContainer.size().height);
    canv.id("p5Canvas");
    canv.parent("content");


    helpers = new HelperFunctions(); // create helper functions

    colorP = new ColorPalette(); // create color palette

    toolbox = new Toolbox(); // create a toolbox for storing the tools

    undo = new UndoManager();


    background(0);
    loadPixels();

    // add the tools to the toolbox.
        toolbox.addTools([
            FreehandTool,
            LineToTool,
            CopyTool,
            ScissorsTool,
            TextTool,
            GraphMakerTool,
            FillBucketTool,
            MoveableLineTool,
            MirrorDrawTool,
            RectTool,
            EllipseTool,
        ]);
}

function draw() {
    // call the draw function from the selected tool.
    // hasOwnProperty is a javascript function that tests
    // if an object contains a particular method or property
    // if there isn't a draw method the app will alert the user
    colorP.draw();
    undo.draw();
    if (toolbox.selectedTool.hasOwnProperty("draw")) { 
        strokeWeight(select('#strokeSize').value());
        toolbox.selectedTool.draw();
    } else {
        alert("it doesn't look like your tool has a draw method!");
    }
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
    // We only want control characters for keypressed
    if (keyCode < 32 && toolbox.selectedTool.name == "text") {
        toolbox.selectedTool.recieve_keystrokes(keyCode);
    } else {
        if (keyCode == 27) { // clear the screen with ESC when not in text mode
            background(0);
            loadPixels();
        }
    }
}

function keyTyped () {
    // All ascii chracters we want from key typed.
    // We also want to disable the enter key, as we will handle 
    // this seperately
    let banned_words = ["\r", "\x7F", "|", "Enter"]
    if (toolbox.selectedTool.name == "text") { 
        if (!banned_words.includes(key)) {
            toolbox.selectedTool.recieve_keystrokes(key);
        }
    }
}

function mouseReleased() {
    undo.add_state();
}

// prevent the user from refreshing the page using ctrl r
window.addEventListener("keydown", function(e) {
    if (e.key == "r" && e.ctrlKey) {
        e.preventDefault();
    } 
})
