function CopyTool(){
    this.name = "copyTool";
    this.icon = "images/copyTool.jpg";
    this.mode = "select";
    this.startPos = this.endPos = null;
    this.cutSection = null;
    let self = this;

    // Given two VECTORS, will output the top left corners x and y and also
    // the width and the height

    function get_coords_for_cut (start, end) {
        let [x, y] = [Math.min(start.x, end.x), Math.min(start.y, end.y)];
        let [x2, y2] = [Math.max(start.x, end.x), Math.max(start.y, end.y)];
        let w = x2 - x;
        let h = y2 - y;
        return [x, y, w, h]; 
    }

    function in_move_area(x, y, w, h) {
        return mouseX >= x && mouseX <= (x + w) && mouseY >= y && mouseY <= (y + h);
    }

    let x, y, w, h;
    let dy = -1
    let dx = -1;
    let dragging = false;
    let box = null;
    this.copy_area = function() {
        push();
        if(self.mode == "select" && mouseIsPressed){
            self.startPos = self.endPos = createVector(mouseX, mouseY);
            box = new BoxOfLines(x, y, w, h, [0, 120, 255]); // create the box for the box animation
            self.mode = "drag";
        } else if (self.mode == "drag" && mouseIsPressed) {
            self.endPos = createVector(mouseX, mouseY);
            noFill();
            [x, y, w, h] = get_coords_for_cut(self.startPos, self.endPos);
            box.animate(x, y, w, h);
        } else if (self.mode == "drag" && !mouseIsPressed){
            let image_size_is_valid = w != 0 && h != 0;
            if (image_size_is_valid) { 
                self.cutSection = get(x, y, w, h);
                self.mode = "moving";
                box.animate(x, y, w, h);
            } else {
                self.mode = "select";
            }
        } else if (self.mode == "moving") {
            if (in_move_area(x, y, w, h)) {
                if (mouseIsPressed) {
                    cursor("grabbing");
                } else {
                    cursor("grab");
                }
            } else {
                cursor("auto");
            }

            if (mouseIsPressed) {
                if (in_move_area(x, y, w, h) || dragging) {
                    dragging = true;
                    if (dy == -1) {
                        [dx, dy] = [x - mouseX, y - mouseY];
                    }
                    [x, y] = [dx + mouseX, dy + mouseY];
                } else {
                    // save the state and reset
                    self.mode = "select";
                    image(self.cutSection, x, y);
                    this.startPos = this.cutSection = this.endPos = null;
                    loadPixels(); // save the state where you left the object
                    return;
                }
            } else {
                dragging = false;
                dy = dx = -1;
            }
            image(self.cutSection, x, y);
            box.animate(x, y, w, h);
        }
        pop();
    }

    this.draw = function(){
        push();
        updatePixels();
        this.copy_area();
        pop();
    }


    this.unselectTool = function() {
        clearOptions();
        loadPixels();
        updatePixels();
        this.mode = "select";
        this.startPos = this.endPos = this.cutSection = null;
    };

}
