function FreehandTool(){
    // set an icon and a name for the object
    this.icon = "assets/freehand.jpg";
    this.name = "freehand";
    this.mode = "normal";
    
    let graphPoints = [];
    const BOXDIMS = width / 60;
    for(let x = 0; x < width; x += BOXDIMS) {
        for(let y = 0; y < width; y += BOXDIMS) {
            graphPoints.push([x, y]);
        }
    }

    const self = this;

    // to smoothly draw we'll draw a line from the previous mouse location
    // to the current mouse location. The following values store
    // the locations from the last frame. They are -1 to start with because
    // we haven't started drawing yet.

    let tempLinePoints = [];
    let previousMouseX = -1;
    let previousMouseY = -1;

    this.drawTempPoints = function(){
        for(let i = 0; i < tempLinePoints.length - 1; i++) {
            line(tempLinePoints[i][0],
                tempLinePoints[i][1],
                tempLinePoints[i + 1][0],
                tempLinePoints[i + 1][1] )
        }
    }

    function drawGraph() {
        for(let i = 0; i < width; i += BOXDIMS) {
            line(i, 0, i, height);
            line(0, i, width, i);
        }
    }

    function snapLineToPoint(pointA, pointB) {
        let smallestA = Infinity;
        let smallestB = Infinity;
        let outPointA = [];
        let outPointB = [];
        let [aX, aY] = pointA;
        let [bX, bY] = pointB;

        // let d = Math.floor(dist(aX, aY, graphX, graphY))

        for(let i = 0; i < graphPoints.length; i++) {
            let graphX = graphPoints[i][0];
            let graphY = graphPoints[i][1];

            let disA = dist(aX, aY, graphX, graphY);
            if (disA < smallestA) {
                smallestA = disA
                outPointA[0] = graphX;
                outPointA[1] = graphY;
            }

            let disB = dist(bX, bY, graphX, graphY);
            if (disB < smallestB) {
                smallestB = disB
                outPointB[0] = graphX;
                outPointB[1] = graphY;
            }

        }
        return [
            Math.floor(outPointA[0]),
            Math.floor(outPointA[1]),
            Math.floor(outPointB[0]),
            Math.floor(outPointB[1])
        ]
    }


    this.draw = function(){
        updatePixels();
        global_stroke_weight = select("#strokeSize").value();
        push();
        strokeWeight(global_stroke_weight);
        // if the mouse is pressed
        if (self.mode === "normal") {
            if(mouseIsPressed){
                // check if they previousX and Y are -1. set them to the current
                // mouse X and Y if they are.
                    if (previousMouseX == -1){
                        previousMouseX = mouseX;
                        previousMouseY = mouseY;
                    } else {
                        // if we already have values for previousX and Y we can draw a line from 
                        // there to the current mouse location
                        line(previousMouseX, previousMouseY, mouseX, mouseY);
                        previousMouseX = mouseX;
                        previousMouseY = mouseY;
                        loadPixels();
                    }
            } else {
                // if the user has released the mouse we want to set the previousMouse values 
                // back to -1.
                    previousMouseX = -1;
                    previousMouseY = -1;
            }

        } else if (self.mode === "graph") {
            if(mouseIsPressed){
                if (previousMouseX == -1){
                    previousMouseX = mouseX;
                    previousMouseY = mouseY;
                } else {
                    tempLinePoints.push([mouseX, mouseY]);
                    self.drawTempPoints();
                }
            } else {
                if (previousMouseX !== -1) {
                    tempLinePoints = [];
                    const previousCoords = [previousMouseX, previousMouseY]
                    const currCoords = [mouseX, mouseY]

                    let lineCoords = snapLineToPoint(previousCoords, currCoords);
                    line(lineCoords[0],
                        lineCoords[1],
                        lineCoords[2],
                        lineCoords[3]
                    );
                    loadPixels();
                    previousMouseX = -1;
                    previousMouseY = -1;
                }
            } 

            push();
            strokeWeight(1);
            stroke(60, 60, 60);
            drawGraph();
            pop();
        }

        pop();
    };

    this.unselectTool = function() {
        // clear options
        updatePixels();
        self.mode = "normal";
        select(".options").html("");
    };

    this.populateOptions = function() {
        select(".options").html(
            `Stroke weight: 
            <input type='range'
            min='3' max='15' 
            value='${global_stroke_weight}' class='slider'
            id='strokeSize'>

            <button 
            id='gridMode'>
            Graph Mode</button>`);
        // click handler
        select("#gridMode").mouseClicked(function() {
            var button = select("#" + this.elt.id);
            if (self.mode == "graph") {
                self.mode = "normal";
                self.draw();
                button.html('Graph Mode');
            } else {
                self.mode = "graph";
                self.draw();
                button.html('Normal Mode');
            }
        });
    };
}
