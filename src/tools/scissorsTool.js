function ScissorsTool(){
    this.name= "Scissors";
    this.icon= "images/scissors.jpg";
    this.mode = 'cut';
    this.cutSection = this.endPos = this.startPos = null; 
    this.first_cut = true;
    this.manual = 
        `
        <ol>
            <li>Click and drag to select an area to cut</li>
            <li>Release the mouse to cut the selected area</li>
            <li>Click the paste button to paste the contents you copied</li>
            <li>You can then click within the pasted contents to move it around</li>
            <li>Click outside of the copied area to unselect it</li>
            <li>You can continue to paste as many copies as you'd like and repeat steps 3 to 5</li>
        </ol>
        `;
    let self = this;

    const get_coords_for_cut = (start, end) => {
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
    this.handle_box_cut = function() {
        if(self.mode == "cut" && mouseIsPressed && MOUSE_ON_CANVAS){
            self.startPos = self.endPos = createVector(mouseX, mouseY);
            box = new BoxOfLines(x, y, w, h, [255, 0, 0]); // create the box for the box animation
            self.mode = "drag";
        } else if (self.mode == "drag" && mouseIsPressed && MOUSE_ON_CANVAS) {
            self.first_cut = true;
            self.endPos = createVector(mouseX, mouseY);
            noFill();
            [x, y, w, h] = get_coords_for_cut(self.startPos, self.endPos);
            box.animate(x, y, w, h);
        } else if (self.mode == "drag" && !mouseIsPressed){
            let image_size_is_valid = w != 0 && h != 0;
            if (image_size_is_valid) { 
                self.cutSection = get(x, y, w, h);
                fill(0, 0, 0);
                noStroke();
                rect(x, y, w, h);
                loadPixels();
                self.mode = "cut";
            }
        } else if (self.mode == "move") {

            if (in_move_area(x, y, w, h)) {
                if (mouseIsPressed) {
                    cursor("grabbing");
                } else {
                    cursor("grab");
                }
            } else {
                cursor("auto");
            }

            if (MOUSE_ON_CANVAS) {
                if (mouseIsPressed) {
                    if (in_move_area(x, y, w, h) || dragging) {
                        dragging = true;
                        if (dy == -1) {
                            [dx, dy] = [x - mouseX, y - mouseY];
                        }
                        [x, y] = [dx + mouseX, dy + mouseY];
                    } else {
                        // save the state and reset
                        self.mode = "cut";
                        image(self.cutSection, x, y);
                        this.startPos = this.cutSection = this.endPos = null;
                        loadPixels(); // save the state where you left the object
                        return;
                    }
                } else {
                    dragging = false;
                    dy = dx = -1;
                }
            }
            image(self.cutSection, x, y);
            box.animate(x, y, w, h);
        }
    }

    this.draw = function(){
        push();
        updatePixels();
        self.handle_box_cut();
        pop();
    }

    this.unselectTool = function() {
        clearOptions();
        if (box != null) {
            box.temp_disable();
        }
        self.draw();
        loadPixels();
        this.startPos = this.endPos = this.cutSection = null;
        self.mode = 'cut';
    };

    function paste() {
        if (self.cutSection !== null) {
            if (!self.first_cut) {
                box.temp_disable();
                self.draw();
            }
            self.first_cut = false;
            self.mode = "move";
            x = y = 0;
            loadPixels();
        }
    }

    this.populateOptions = function() {
        select(".tempOptions").html(`<button id='mode'>paste</button>`);
        select("#mode").mouseClicked(function() {
            paste();
        });
    };
}
