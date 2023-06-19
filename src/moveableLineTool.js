function MoveableLineTool(){
    //set an icon and a name for the object
    this.icon = "assets/moveableLine.jpg";
    this.name = "moveableLine";
    this.editMode = false;
    this.currentPoint = null;
    this.currentShape = [];
    this.mouseLocked = false;

    var self = this

    this.draw = function(){
        updatePixels();

        if(mousePressOnCanvas() && mouseIsPressed ){

            if(!self.editMode && !self.mouseLocked){
                self.mouseLocked = true;
                self.currentShape.push({
                    x:mouseX, 
                    y:mouseY
                })
            } else {
                if (self.currentPoint !== null) {
                        self.currentShape[self.currentPoint].x = mouseX;
                        self.currentShape[self.currentPoint].y = mouseY
                } else {
                    for(let i = 0; i < self.currentShape.length; i++){
                        if(dist(self.currentShape[i].x, self.currentShape[i].y,
                            mouseX, mouseY) < 20){
                            self.currentPoint = i;
                        }
                    }
                }
            }
        } else {
            self.currentPoint = null;
            self.mouseLocked = false;
        }

        loadPixels();
        push();
        noFill();
        beginShape();

        for(var i = 0; i < self.currentShape.length; i++){
            vertex(self.currentShape[i].x,
                self.currentShape[i].y);
        }
        endShape();
        pop();
        if(self.editMode){
        for(var i = 0; i < self.currentShape.length; i++){
                push();
                fill(255, 0, 0);
                ellipse(self.currentShape[i].x, self.currentShape[i].y, 20);
                pop();
            }
        }
    };

    this.unselectTool = function() {
        updatePixels();
        self.editMode = false;
        draw();
        self.currentShape = [];
        //clear options
        select(".options").html("");
    };

    this.populateOptions = function() {
        select(".options").html(
            "<button id='changingVerticies'>Edit shape</button> <button id='finishShape'>Finish shape</button>");
        // 	//click handler
        select("#changingVerticies").mouseClicked(function() {
            var button = select("#" + this.elt.id);
            if (self.editMode) {
                self.editMode = false;
                self.draw();
                button.html("Edit Shape");
            } else {
                self.editMode = true;
                self.draw();
                button.html("Add Verticies");
            }
        });

        select("#finishShape").mouseClicked(function() {
            self.editMode = false;
            self.draw();
            loadPixels();
            self.currentShape = [];
        });
    };
}
