/*
    this class manages using undos and redos (ctrl-z ctrl-r)
    it achieves this by saving copies of the current canvas
*/
class UndoManager {
    constructor() {
        this.undoStack = []; // the stack of all the pixel arrays we save
        this.currentState = 0; // the current canvas we are on
        // whether or not the ctrl z or ctrl r button is not useable
        this.ctrlZLocked = false;
        this.ctrlRLocked = false;
        // when holding ctrl z or ctrl r, this is dthe delay between each undo/redo
        this.delayBetweenUndos = 200; 
    }

    // every time the user lets go of left click, if there is any
    // difference between the current pixel array and the one before
    // out pointer, we save the state

    draw() {
        const CTRL_Z = keyIsDown(CONTROL) && keyIsDown(90);
        const CTRL_R = keyIsDown(CONTROL) && keyIsDown(82);
        // add the blank screen at the start of the program
        if (this.undoStack.length == 0) {
            const URL = canv.elt.toDataURL();
            this.addState(URL);
        }
        if (CTRL_Z && !this.ctrlZLocked) { 
            this.goBack();
        } else if (CTRL_R && !this.ctrlRLocked) {
            this.goForward();
        }
    }

    addState(dataURL) {
        // if this canvas doesn't match the last one then we can add it.
        // we do this to not add unneccacary states
        if (dataURL != this.undoStack.at(-1)) {
            if (this.currentState != this.undoStack.length - 1) {
                // if we are not at the end of the stack, we need to remove
                // all the states after the current one
                this.undoStack.splice(this.currentState + 1);
            } 
            this.undoStack.push(dataURL);
            this.currentState++;
        }
    }

    // update the canvas with the given dataurl
    updateCanvas(dataURL) {
        loadImage(dataURL, canvas => {
            image(canvas, 0, 0, width, height);
            loadPixels();
        });
        updatePixels();
    }

    // we go back one state when this functio is called
    goBack() {
        // we do not allow going back before 0 so we cap it here
        this.currentState = Math.max(this.currentState - 1, 0); 
        // we update the canvas with the current state after we reduced it by one
        this.updateCanvas(this.undoStack[this.currentState]);
        this.ctrlZLocked = true; // we set ctrlZ to locked so it does not go back too fast
        setTimeout(() => this.ctrlZLocked = false, this.delayBetweenUndos);
        // delay between ctrl-u's (undos)
    }

    // we go back one state when this functio is called
    goForward() {
        // we ensure we do not go past the arrays length
        this.currentState = Math.min(this.currentState + 1, this.undoStack.length - 1);
        // and we update the canvas with this new current state
        this.updateCanvas(this.undoStack[this.currentState]);
        this.ctrlRLocked = true; // prevents going through redos too fast
        // delay between ctrl-r's (redos)
        setTimeout(() => this.ctrlRLocked = false, this.delayBetweenUndos);
    }
}
