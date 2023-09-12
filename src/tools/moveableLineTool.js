/*
    every click creates a vertex and draws an edge between each vertex.
    the user can also alter the vertex position if they switch modes from
    "Add Verticies" mode to the "Edit Shape" mode.
*/
function MoveableLineTool(){
    // set the REQUIRED icon, name and manual for the tool.
    this.icon = "images/moveableLine.jpg";
    this.name = "Moveable Line";
    // this manual gets injected into the tool help for each tool, it must
    // be written in valid html
    this.manual = 
        `
        <ol>
            <li>Click on the screen to place a vertex at the clicked location</li>
            <li>Keep on clicking until you added the desired amount of vertices</li>
            <li>You can swap between adding vertices, and moving vertices with the "Edit shape" button</li>
            <li>Once you have finished adding vertices and are in Add Verticies mode click the "finishShape" button</li>
        </ol>
        `;

    this.grabbedVertex = null; // the currently grabbed point
    this.currentShape = [];    // an array to maintain the current shape of the moveable line
    this.editMode = false;     // are we currently editing verticies or not?
    this.mouseLocked = false;  // if we have locked the mouse

    // the click handler we  use for the buttons cannot access this so we will
    // save it here so it can later
    const self = this;
    this.draw = () => {
        updatePixels(); // update the pixels so we don't have old lines on the canvas
        cursor("auto"); // by default the cursor will be the default "auto"

        if (this.editMode) {
            // we iterate over each vertex in the shape
            for (let [idx, vertex] of Object.entries(this.currentShape)) {
                // if we are close (20px) to the vertex
                if (dist(vertex.x, vertex.y, mouseX, mouseY) < 20) {
                    // we set the cursor to grab to show the user they can grab it
                    cursor("grab"); 
                    if (this.grabbedVertex == null) {
                        this.grabbedVertex = idx;
                    }
                }
            }
        }

        if (MOUSE_ON_CANVAS && mouseIsPressed) {
            if (!this.editMode && !this.mouseLocked) {
                // we set mouselocked to true to prevent adding another vertex
                // until the user lifted their mouse
                this.mouseLocked = true; 
                this.currentShape.push({x: mouseX, y: mouseY});
            } else if (this.editMode && this.grabbedVertex) {
                cursor("grabbing");
                this.currentShape[this.grabbedVertex].x = mouseX;
                this.currentShape[this.grabbedVertex].y = mouseY;
            } 
        } else {
            this.mouseLocked = false;
            this.grabbedVertex = null;
        }

        loadPixels(); // we save the current pixel state before we draw the shape
        push();
        noFill();
        beginShape();
        // we iterate over all the vertices and draw the shape from the points
        for(let i = 0; i < this.currentShape.length; i++){
            vertex(this.currentShape[i].x, this.currentShape[i].y);
        }
        endShape();

        // if we are in edit mode we want to draw an ellipse on each vertex
        if(this.editMode){
            noStroke();
            fill(255, 0, 0, 180);
            for(let i = 0; i < this.currentShape.length; i++){
                ellipse(this.currentShape[i].x, this.currentShape[i].y, 20);
            }
        }
        pop();
    };

    // when we select another tool
    this.unselectTool = () => {
        // reset the edit mode to false before we save the drawing, to remove
        // the ellipses on the vertices
        this.editMode = false; 
        this.draw();           
        this.currentShape = []; // then we can empty the current shape
    };

    // this is used to disable elements that should not be saved to the canvas
    this.tempDisable = () => {
        const oldMode = this.editMode;
        const oldPoints = this.currentShape;
        this.editMode = false;
        this.currentShape = [];
        setTimeout(() => {
            this.editMode = oldMode;
            this.currentShape = oldPoints;
        }, 1);
    }

    // popoulate the options of the given tool
    this.populateOptions = () => {
        select(".tempOptions").html(`
            <button id='changingVerticies'>Edit shape</button>
            <button id='finishShape'>Finish shape</button>
            `);

        select("#changingVerticies").mouseClicked(function() {
            const button = select("#" + this.elt.id);
            // flip the current edit mode and the html in the button
            button.html(self.editMode ? "Edit Shape" : "Add Verticies");
            self.editMode = !self.editMode;
        });

        select("#finishShape").mouseClicked(() => { 
            this.editMode = false;
            this.draw();
            loadPixels();
            this.currentShape = [];
        });
    };
}
