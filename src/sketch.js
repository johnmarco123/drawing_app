// the currently used color (mainly used by color palette);
let CURRENT_COLOR = null; 

// global variable for whether or not the mouse is on the p5.js canvas
let MOUSE_ON_CANVAS = false;

let STROKE_WEIGHT = 3;

// global variables that will store the toolbox color palette
// and the helper functions
let helpers, colorP, toolbox, undo, canv;
let recovered_canvas = null;

function setup() {
    pixelDensity(1);
    // is the side bar and bottom menu hidden

    const canvasContainer = select('#content'); // create canvas to fill content  div from index.html
    canv = createCanvas(canvasContainer.size().width, canvasContainer.size().height);
    canv.id("p5Canvas");
    canv.parent("content");


    helpers = new HelperFunctions();  // create helper functions
    colorP = new ColorPalette();      // create color palette
    toolbox = new Toolbox();          // create a toolbox for storing the tools
    undo = new UndoManager();         // Creates a tool to allow undos and redos

    background(0);
    loadPixels();

    //recovered_canvas = getItem("saved_canvas");

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
    recover_canvas(); // recovers canvas from previous sessions if possible
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
        alert("It doesn't look like your tool has a draw method!");
    }
    

    if (frameCount % 60 == 0) { // save the current canvas every second
        console.log(`saved to local storage`);
        save_to_local_storage();
    }
}

function recover_canvas() {
    let data = getItem("saved_canvas");
    loadImage(data, function(img) {
        image(img, 0, 0, width, height);
        loadPixels();
    })
}

function save_to_local_storage() {
    storeItem("saved_canvas", canv.elt.toDataURL());
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
    // We only want control characters for keypressed
    if (keyCode < 32 && toolbox.selectedTool.hasOwnProperty("recieve_keystrokes")) {
        toolbox.selectedTool.recieve_keystrokes(keyCode);
    } else if (toolbox.selectedTool.name != "text") {
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
    if (toolbox.selectedTool.hasOwnProperty("recieve_keystrokes")) {
        if (!banned_words.includes(key)) {
            toolbox.selectedTool.recieve_keystrokes(key);
        }
    }
}

function mouseReleased() {
    undo.add_state();
}

// prevent the user from refreshing the page using ctrl r as we use this for undo tool
window.addEventListener("keydown", e => (e.key == "r" && e.ctrlKey) ? e.preventDefault : null);
