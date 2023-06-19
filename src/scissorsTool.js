function ScissorsTool(){
    this.name= "scissorsTool";
    this.icon= "assets/scissors.jpg";
    this.mode = 'cut';
    this.cutSection = this.endPos = this.startPos = null; 
    let self = this;
   
    // 1. cutmode pre click
    // 2. dragmode after click
    // 3. allow pasting from here
    // 4. back to cutmode again with fully reset setgings after click
        let w; let h;
    this.draw = function(){
        push();
        strokeWeight(2);
        rectMode(CORNER);
        updatePixels();
        if(self.mode == 'cut' && mouseIsPressed){
            self.startPos = self.endPos = createVector(mouseX, mouseY);
            self.mode = 'drag';

        } else if (self.mode == 'drag' && mouseIsPressed) {
            self.endPos = createVector(mouseX, mouseY);
            stroke(255);
            fill(255, 0, 0, 80);
            w = self.endPos.x - self.startPos.x;
            h = self.endPos.y - self.startPos.y;
            rect(self.startPos.x, self.startPos.y, w, h);

        } else if (self.mode == 'drag' && !mouseIsPressed){
            self.mode = 'cut';
            self.cutSection = get(self.startPos.x, self.startPos.y, w, h);
            noStroke();
            fill(0);
            rect(self.startPos.x, self.startPos.y, w, h);
            loadPixels();

        } else if (self.mode == 'paste' && mouseIsPressed){
            image(self.cutSection, mouseX, mouseY) 
            loadPixels();
         }
        pop();
    }

    this.unselectTool = function() {
        updatePixels();
        //clear options
        select(".options").html("");
        self.mode = 'cut';
    };

    this.populateOptions = function() {
        select(".options").html(
            "<button id='mode'>paste</button>");
         	//click handler
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
