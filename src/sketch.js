// our global variables that we use amongst all the functions

let CURRENT_COLOR = null;  // the currently used color
let MOUSE_ON_CANVAS = false; // if the mouse is on the canvas
let STROKE_WEIGHT = 3; // the current stroke weight

// global variables that will store the toolbox color palette
// and the helper functions
let helpers, colorP, toolbox, undo, canv;
let recoveredCanvas = null;

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


    // add the tools to the toolbox.
        toolbox.addTools(   
            FreehandTool,
            LineToTool,
            SprayCanTool,
            MirrorDrawTool,
            SelectTool,
            ScissorsTool,
            TextTool,
            GraphMakerTool,
            FillBucketTool,
            MoveableLineTool,
            RectTool,
            EllipseTool,
            StarTool,
        );
    recoverLocalStorage(); // recovers canvas from previous sessions if possible
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
}

// recoveres a saved canvas from local storage
function recoverLocalStorage() {
    const data = getItem("savedCanvas");
    loadImage(data, img => {
        image(img, 0, 0, width, height);
        loadPixels();
    })
   
    // if the manual was hidden before we want to keep it hidden, otherwise we
    // want to display it
    const manualState = getItem("isManualVisible");

    let manualVisible = false;

    // since maual state is undefined, this means that nothing is in local
    // storage, therefore this is the first time the user has used the
    // application and we want to show the manual
    if (manualState === undefined) { 
        manualVisible = true;

    // if the manual state is false, then the use closed the manual in the last
    // session, therefore we will not show the manual
    } else if (manualState === false) {
        manualVisible = false;
        
    // the user had the manual open in the last session so we show it
    } else if (manualState === true) {
        manualVisible = true;

    }
    toolbox.initializeManual(manualVisible);
}

// saves a canvas to local storage
function saveToLocalStorage() {
    // when saving the canvas we want to ensure we disable features that we do
    // not want saved on the canvas
    toolbox.tempDisableTool();
    storeItem("savedCanvas", canv.elt.toDataURL());
    // we want the manual to be shown by default, so we will save the opposite
    storeItem("isManualVisible", toolbox.visible);
}

// resize the canvas and update the canvas appropriately
function windowResized(){
    // when resizing we want to ensure we disable features that we do not want
    // saved to the canvas
    toolbox.tempDisableTool();
    const oldCanvas = get();                 // first we gather the old canvas
    resizeCanvas(windowWidth, windowHeight); // then we resize the canvas
    background(0);                           // then we set the canvas black
    image(oldCanvas, 0, 0, width, height);   // and place the old canvas on the new resized canvas
    loadPixels();                            // we then loadPixels so it is visible
}

// used for the textTool to gather keystrokes, but this is only used for control
// keys such as up arrow, ctrl, shift etc.
function keyPressed() {
    // We only want control characters for keypressed
    if (toolbox.selectedTool.hasOwnProperty("recieveKeystrokes") && keyCode <= 46) {
            toolbox.selectedTool.recieveKeystrokes(keyCode);

    } else if (toolbox.selectedTool.name != "Text") {
        if (keyCode == 27) { // clear the screen with ESC when not in text mode
            background(0);
            loadPixels();
        }
    }
}

// used to pass ascii characters to the textTool class
function keyTyped () {
    // All ascii chracters we want from key typed
    // We also want to disable the enter key, as we will handle 
    // this seperately
    // words we don't allow in keyTyped
    const bannedWords = ["\r", "\x7F", "|", "Enter", "Delete"] 
    if (toolbox.selectedTool.hasOwnProperty("recieveKeystrokes")) {
        if (!bannedWords.includes(key)) {
            toolbox.selectedTool.recieveKeystrokes(key);
        }
    }
}

// when the mouse is released we add the current state to the undo manager.
function mouseReleased() {
    // the canvas can only change if mouse is on canvas
    if (MOUSE_ON_CANVAS) {
        // we wait to allow the tools being used to save what they need to save
        // before we disable them
        setTimeout(() => {
            toolbox.tempDisableTool();
            const URL = canv.elt.toDataURL();
            undo.addState(URL);
        }, 20);
    }
}

// prevent the user from refreshing the page using ctrl r
window.addEventListener("keydown", function(e) {
    if (e.key == "r" && e.ctrlKey) {
        e.preventDefault();
    } 
})

// allows pasting text for the text tool
window.addEventListener('paste', e => {
    let data = e.clipboardData;
    if (data && toolbox.selectedTool.name == "Text") {
        toolbox.selectedTool.pasteClipboard(data.getData('text'))
    }
});

// detects and updates whether the mouse is on the canvas
window.addEventListener("mousemove", e => MOUSE_ON_CANVAS = e.target.id == "p5Canvas");

// when the user closes the window we want to save where they left off for the
// next time they use the app
window.addEventListener('beforeunload', e => {
    e.preventDefault();
    // we disable features that we do not want saved when we save the canvas
    toolbox.tempDisableTool();
    saveToLocalStorage();
});
