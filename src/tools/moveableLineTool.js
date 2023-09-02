function MoveableLineTool(){
    //set an icon and a name for the object
    this.icon = "images/moveableLine.jpg";
    this.name = "Moveable Line";
    this.editMode = false;
    this.currentPoint = null;
    this.currentShape = [];
    this.mouseLocked = false;
    this.manual = 
        `
        <ol>
            <li>Click on the screen to place a vertex at the clicked location</li>
            <li>Keep on clicking until you added the desired amount of vertices</li>
            <li>You can swap between adding vertices, and moving vertices with the "Edit shape" button</li>
            <li>Once you have finished adding vertices and are in Add Verticies mode click the "finishShape" button</li>
        </ol>
        `;

    var self = this

    this.draw = function(){
        updatePixels();
        if(MOUSE_ON_CANVAS && mouseIsPressed){
            if(!self.editMode && !self.mouseLocked){
                self.mouseLocked = true;
                self.currentShape.push({ x:mouseX, y:mouseY })
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
                noStroke()
                fill(255, 0, 0, 180);
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
        clearOptions();
    };

    this.populateOptions = function() {
        select(".tempOptions").html(
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