class UndoManager {
    constructor() {
        this.undo_stack = [];
        this.idx = 0;
        this.ctrl_z_locked = false;
        this.ctrl_r_locked = false;
    }
    // every time the user lets go of left click, if there is any
    // difference between the current pixel array and the one before
    // out pointer, we save the state
    draw() {
        let ctrl_z = keyIsDown(CONTROL) && keyIsDown(90);
        let ctrl_r = keyIsDown(CONTROL) && keyIsDown(82);
        // add the blank screen at the start of the program
        if (this.undo_stack.length == 0) {
            this.add_state();
        }
        if (ctrl_z && !this.ctrl_z_locked) { 
            this.go_back();
        } else if (ctrl_r && !this.ctrl_r_locked) {
            this.go_forward();
        }
    }

    add_state() {
        let state = get(0, 0, canv.width, canv.height);
        if (this.idx != this.undo_stack.length - 1) {
            // if we are not at the end of the stack, we need to remove
            // all the states after the current one
            this.undo_stack.splice(this.idx + 1);
        } 
        this.undo_stack.push(state);
        this.idx++;
    }

    // updates the canvas with the canvas provided
    update_canvas(canvas) {
        image(canvas, 0, 0);
        loadPixels();
        updatePixels();
    }

    go_back() {
        this.ctrl_z_locked = true;
        this.idx = Math.max(this.idx - 1, 0);
        this.update_canvas(this.undo_stack[this.idx]);
        // delay between ctrl-u's (undos)
        setTimeout(() => this.ctrl_z_locked = false, 200);
    }


    go_forward() {
        this.ctrl_r_locked = true;
        this.idx = Math.min(this.idx + 1, this.undo_stack.length - 1);
        this.update_canvas(this.undo_stack[this.idx]);
        // delay between ctrl-r's (redos)
        setTimeout(() => this.ctrl_r_locked = false, 200);
    }
}
