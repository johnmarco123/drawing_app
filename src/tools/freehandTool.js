/*
    the user can click and drag to draw whatever they want, there is also
    a graph mode which snapes the start and end positions of a hand drawn line
    to the closest vertex in the graph
*/
function FreehandTool(){
    // set the REQUIRED icon, name and manual for the tool.
    this.icon = "images/freehand.jpg";
    this.name = "Free-hand";
    // this manual gets injected into the tool help for each tool, it must
    // be written in valid html
    this.manual = 
        `
        <ol>
            <li>Click on the canvas.</li>
            <li>Drag whilst holding the mouse down to draw!</li>
            <li>You can also have your lines snap to the nearest vertex with the "Graph Mode" button, located in the bottom bar</li>
        </ol>
        `;

    this.mode = "normal";


    // the click handler we  use for the buttons cannot access this so we will
    // save it here so it can later
    const self = this;

    // the graph points that we use to display the graph when in graph mode
    let graphPoints = [];

    // initialize the graph
    const BOXDIMS = width / 60;
    for(let x = 0; x < width; x += BOXDIMS) {
        for(let y = 0; y < width; y += BOXDIMS) {
            graphPoints.push([x, y]);
        }
    }


    // to smoothly draw we'll draw a line from the previous mouse location
    // to the current mouse location. The following values store
    // the locations from the last frame. They are -1 to start with because
    // we haven't started drawing yet

    let tempLinePoints = [];
    let [previousMouseX, previousMouseY] = [-1, -1];


    // draws all the temporary line points before they get saved to the canvas
    this.drawTempPoints = () => {
        for(let i = 0; i < tempLinePoints.length - 1; i++) {
            let [x1, y1] = tempLinePoints[i];
            let [x2, y2] = tempLinePoints[i + 1];
            line(x1, y1, x2, y2);
        }
    }

    // draws the background graph used in graph mode
    this.drawGraph = () => {
        push();
        strokeWeight(1);
        stroke(60, 60, 60);
        for(let i = 0; i < width; i += BOXDIMS) {
            line(i, 0, i, height);
            line(0, i, width, i);
        }
        pop();
    }

    // snaps the vertecies that are at the front and end of the line to the
    // nearest vertex on the graph
    this.snapLineToPoint = (x1, y1, x2, y2) => {
        let [smallestDist1, smallestDist2] = [Infinity, Infinity];
        let nearestToX1, nearestToY1, nearestToX2, nearestToY2;

        for(let [x, y] of graphPoints) {
            const distance1 = dist(x, y, x1, y1);
            if (distance1 < smallestDist1) {
                smallestDist1 = distance1;
                [nearestToX1, nearestToY1] = [x, y];
            }

            const distance2 = dist(x, y, x2, y2);
            if (distance2 < smallestDist2) {
                smallestDist2 = distance2;
                [nearestToX2, nearestToY2] = [x, y];
            }

        }
        // we return the nearest vertices for pointA and pointB
        return [
            Math.floor(nearestToX1),
            Math.floor(nearestToY1),
            Math.floor(nearestToX2),
            Math.floor(nearestToY2),
        ];
    }


    this.draw = () => {
        updatePixels(); // we update pixels to not display old frames
        push();
        if (self.mode === "normal") {
            if(mouseIsPressed && MOUSE_ON_CANVAS){
                if (previousMouseX != -1){
                    // if we already have values for previousX and Y we can draw a line from 
                    // there to the current mouse location
                    line(previousMouseX, previousMouseY, mouseX, mouseY);
                    loadPixels();
                } 
                [previousMouseX, previousMouseY] = [mouseX, mouseY];
            } else {
                // if the user has released the mouse we want to set the
                // previousMouse values back to -1
                previousMouseX = previousMouseY =  -1;
            }

        } else if (self.mode === "graph") {
            if(mouseIsPressed && MOUSE_ON_CANVAS){
                // if we dont yet have a previous mouseX and mouseY
                // we set one
                if (previousMouseX == -1){
                    [previousMouseX, previousMouseY] = [mouseX, mouseY];
                } else { 
                    // otherwise we push the current mouse location and draw
                    // the points
                    tempLinePoints.push([mouseX, mouseY]); 
                    self.drawTempPoints(); 
                }
            } else if (previousMouseX != -1) {
                // the mouse is not pressed, so we can snap the current line
                // to the nearest graph vertices and save the line
                tempLinePoints = []; 
                const [x1, y1, x2, y2] = this.snapLineToPoint(previousMouseX, previousMouseY, mouseX, mouseY);
                line(x1, y1, x2, y2);
                loadPixels();
                previousMouseX = previousMouseY =  -1;
            }
            this.drawGraph();
        }
        pop();
    }

    // disables items that should not be saved to canvas, so that when the user
    // leaves we can save the state at which they left off
    this.tempDisable = () => {
        if (this.mode == "graph") {
            this.mode = "normal"
            setTimeout(() => this.mode = "graph", 1);
        }
    }

    // when we select a new tool
    this.unselectTool = () => {
        // we update pixels to remove the grid before we leave the tool
        updatePixels(); 
        this.mode = "normal";
    };

    this.populateOptions = function() {
        select(".tempOptions").html(
            `<button 
            id='gridMode'>
            Graph Mode</button>`);
        // click handler
        select("#gridMode").mouseClicked(function() {
            var button = select("#" + this.elt.id);
            if (self.mode == "graph") {
                self.mode = "normal";
                button.html('Graph Mode');
            } else {
                self.mode = "graph";
                button.html('Normal Mode');
            }
            self.draw();
        });
    };
}
