function MirrorDrawTool() {
    // set the REQUIRED icon, name and manual for the tool.
    this.name = "Mirror Draw";
    this.icon = "images/mirrorDraw.jpg";
    // this manual gets injected into the tool help for each tool, it must
    // be written in valid html
    this.manual = 
        `
        <ol>
            <li>Draw on one side of the line, and the other side will mirror your drawing</li>
            <li>You can flip the axis in which the drawing is mirrored with the button in the bottom menu</li>
        </ol>
        `;
    // which axis is being mirrored (x or y) x is default
    this.axis = "x";
    //line of symmetry is halfway across the screen
    this.lineOfSymmetry = width / 2;
    // We cannot reference this in the click handler we use for the buttons
    // for this tool, therefore we save it now so we can reference it later
    const self = this;

    // where was the mouse on the last time draw was called
    // set it to -1 to begin with
    let [previousMouseX, previousMouseY] = [-1, -1]
    //mouse coordinates for the other side of the Line of symmetry.
    let [previousOppositeMouseX, previousOppositeMouseY] = [-1, -1]

    this.draw = () => {
        // display the last save state of pixels
        updatePixels();

        // do the drawing if the mouse is pressed
        if (mouseIsPressed) {
            // if the previous values are -1 set them to the current mouse location
            // and mirrored positions
            if (previousMouseX == -1) {
                [previousMouseX, previousMouseY] = [mouseX, mouseY];
                previousOppositeMouseX = this.calculateOpposite(mouseX, "x");
                previousOppositeMouseY = this.calculateOpposite(mouseY, "y");
            }

            // if there are values in the previous locations
            // draw a line between them and the current positions
            else {
                line(previousMouseX, previousMouseY, mouseX, mouseY);
                [previousMouseX, previousMouseY] = [mouseX, mouseY];

                // these are for the mirrored drawing the other side of the
                // line of symmetry
                const oX = this.calculateOpposite(mouseX, "x");
                const oY = this.calculateOpposite(mouseY, "y");
                line(previousOppositeMouseX, previousOppositeMouseY, oX, oY);
                [previousOppositeMouseX, previousOppositeMouseY] = [oX, oY];
            }
        }
        // if the mouse isn't pressed reset the previous values to -1
        else {
            previousMouseX = previousMouseY = -1;
            previousOppositeMouseX = previousOppositeMouseY = -1;
        }

        // after the drawing is done save the pixel state. We don't want the
        // line of symmetry to be part of our drawing

        loadPixels();

        // push the drawing state so that we can set the stroke weight and color
        push();
        strokeWeight(3);
        stroke("red");
        // draw the line of symmetry
        if (this.axis == "x") {
            this.lineOfSymmetry = width / 2;
            line(width / 2, 0, width / 2, height);
        } else if (this.axis == "y") {
            this.lineOfSymmetry = height / 2;
            line(0, height / 2, width, height / 2);
        }
        // return to the original stroke
        pop();
    };

    /*calculate an opposite coordinate the other side of the
        *symmetry line.
        *@param n number: location for either x or y coordinate
        *@param a [x,y]: the axis of the coordinate (y or y)
        *@return number: the opposite coordinate
        */
        this.calculateOpposite = function(n, a) {
            //if the axis isn't the one being mirrored return the same
            //value
            if (a != this.axis) {
                return n;
            }

            //if n is less than the line of symmetry return a coorindate
            //that is far greater than the line of symmetry by the distance from
            //n to that line.
                if (n < this.lineOfSymmetry) {
                    return this.lineOfSymmetry + (this.lineOfSymmetry - n);
                }

            //otherwise a coordinate that is smaller than the line of symmetry
            //by the distance between it and n.
                else {
                    return this.lineOfSymmetry - (n - this.lineOfSymmetry);
                }
        };


    // this is used to disable elements that should not be saved to the canvas
    this.tempDisable = () => {
        const oldAxis = this.axis;
        this.axis = null;
        setTimeout(() => this.axis = oldAxis, 1);
    }

    //when the tool is deselected update the pixels to just show the drawing and
    this.unselectTool = () => updatePixels();

    //adds a button and click handler to the.tempOptions area. When clicked
    //toggle the line of symmetry between horizonatl to vertical
    this.populateOptions = function() {
        select(".tempOptions").html(
            "<button id='directionButton'>Make Horizontal</button>");
        //click handler
        select("#directionButton").mouseClicked(function() {
            var button = select("#" + this.elt.id);
            if (self.axis == "x") {
                self.axis = "y";
                self.lineOfSymmetry = height / 2;
                button.html('Make Vertical');
            } else {
                self.axis = "x";
                self.lineOfSymmetry = width / 2;
                button.html('Make Horizontal');
            }
            self.draw();
        });
    };
}
