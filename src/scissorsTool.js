function ScissorsTool(){
    this.name= "scissorsTool";
    this.icon= "images/scissors.jpg";
    this.mode = 'cut';
    this.cutSection = this.endPos = this.startPos = null; 
    this.free_hand_cut_section = [];
    this.freehand = false;
    this.free_hand_points = [];
    let self = this;
   
    const get_coords_for_cut = (start, end) => {
        let [x, y] = [Math.min(start.x, end.x), Math.min(start.y, end.y)];
        let [x2, y2] = [Math.max(start.x, end.x), Math.max(start.y, end.y)];
        let w = x2 - x;
        let h = y2 - y;
        return [x, y, w, h]; 
    }

    // 1. cutmode pre click
    // 2. dragmode after click
    // 3. allow pasting from here
    // 4. back to cutmode again with fully reset setgings after click
    this.draw = function(){
        if (MOUSE_ON_CANVAS) {
            push();
            strokeWeight(2);
            updatePixels();
            if (self.freehand) {
                self.handle_free_hand();
            } else {
                self.handle_box_cut();
            }
            pop();
        }
    }

    // pixels array is a 1d array of color values, 
    function get_cut_section() {
        // capture the leftmost x and topmost y and save that as our top left
        // vertex
        let points = self.free_hand_points;
        let n = points.length;
        let x1, y1, x2, y2;
        x1 = y1 = Infinity; // top left corner
        x2 = y2 = -Infinity // bottom right corner
        for (let i = 0; i < n; i++) {
            let [x, y] = points[i];
            x1 = Math.min(x, x1);
            y1 = Math.min(y, y1);
            x2 = Math.max(x, x2);
            y2 = Math.max(y, y2);
        }
        let w = x2 - x1;
        let h = y2 - y1;
        return [x1, y1, w, h];
    }

    function remove_cut_section() {
        noStroke();
        fill(0);
        beginShape();
        for (let i = 0; i < self.free_hand_points.length; i++) {
            let [x, y] = self.free_hand_points[i]
            vertex(x, y);
        }
        endShape(CLOSE);
        loadPixels();
    }

    this.handle_free_hand = function() {
        if(self.mode == 'cut' && mouseIsPressed){
            self.mode = "drag";
        } else if (self.mode == 'drag') {
            if (mouseIsPressed) {
                stroke(255);
                fill(255, 0, 0, 80);
                beginShape();
                for (let i = 0; i < self.free_hand_points.length; i++) {
                    let [x, y] = self.free_hand_points[i]
                    vertex(x, y);
                }
                endShape(CLOSE);
                self.free_hand_points.push([mouseX, mouseY])
            } else {
                [x, y, w, h] = get_cut_section();
                self.free_hand_cut_section = get(x, y, w, h);
                remove_cut_section() ;
                self.free_hand_points = [];
                self.mode = 'cut';
            }
        } else if (self.mode == 'paste' && mouseIsPressed) {
            let image_size_is_valid = w != 0 && h != 0;
            if (image_size_is_valid) { 
                image(self.free_hand_cut_section , mouseX, mouseY) 
                loadPixels();
            }
        }
    }

    let x, y, w, h;
    this.handle_box_cut = function() {
        push();
        if(self.mode == 'cut' && mouseIsPressed){
            self.startPos = self.endPos = createVector(mouseX, mouseY);
            self.mode = 'drag';
        } else if (self.mode == 'drag' && mouseIsPressed) {
            self.endPos = createVector(mouseX, mouseY);
            stroke(255);
            fill(255, 0, 0, 80);
            [x, y, w, h] = get_coords_for_cut(self.startPos, self.endPos);
            rect(x, y, w, h);
        } else if (self.mode == 'drag' && !mouseIsPressed){
            self.mode = 'cut';
            self.cutSection = get(x, y, w, h);
            noStroke();
            fill(0);
            rect(x, y, w, h); 
            loadPixels();
        } else if (self.mode == 'paste' && mouseIsPressed){
            let image_size_is_valid = w != 0 && h != 0;
            if (image_size_is_valid) { 
                image(self.cutSection, mouseX, mouseY) 
                loadPixels();
            }
        }
        pop();
    }

    this.unselectTool = function() {
        clearOptions();
        self.mode = 'cut';
    };

    this.populateOptions = function() {
        select(".tempOptions").html(
            `<button id='mode'>paste</button>
            <button id='freehand'>freehand</button>
            `);
        //click handler
        select("#freehand").mouseClicked(function() {
            var button = select("#" + this.elt.id);
            self.mode = 'cut';
            select("#mode").html('paste');
            if (self.freehand) {
                button.html('freehand');
            } else {
                button.html('box mode');
            }
            x = y = w = h = 0;
            self.freehand = !self.freehand
        });

        select("#mode").mouseClicked(function() {
            if (self.cutSection !== null) {
                var button = select("#" + this.elt.id);
                if (self.mode != 'paste') {
                    self.mode = 'paste';
                    button.html('edit');
                } else {
                    self.mode = 'cut';
                    button.html('paste');
                }
            }
        });
    };
}
