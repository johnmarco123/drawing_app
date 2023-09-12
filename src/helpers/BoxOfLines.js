// creates the line particle used in the box of lines class
class Line {
    constructor (x, y, velX, velY, w, h, color) {
        // the position of the top left corner of the lin
        this.location = createVector(x, y);
        this.velocity = createVector(velX,velY); // velocity of the line
        this.width = w; // the width (left to right) of the line
        this.height = h; // the height (top to bottom) of the line
        this.color = color; // the color of the line
    }

    draw() {
        this.update(); // update the lines position 
        this.show();   // and draw the line
    }

    // draws the line
    show() {
        push();
        noStroke();
        fill(this.color);
        rect(this.location.x, this.location.y, this.width, this.height);
        pop();

    }
    // updates the lines position
    update() {
        // we add the velocity to the location which is what causes the lines
        // to move
        this.location.add(this.velocity.x, this.velocity.y);
    }
}

// draws a box with moving lines on each edge given x, y, w, h coordinates
class BoxOfLines {
    constructor(x, y, w, h, color) {
        // the position of the top left corner of the box
        this.location = createVector(x, y); 
        this.width = w;  // the width (left to right) of the line
        this.height = h; // the height (top to bottom) of the line
        // the lines at the top of the box go in this.top, the lines at the
        // bottom of the box goes in this.bot, etc.
        this.top = [];   
        this.bot = [];
        this.left = [];
        this.right = [];

        // The bigger number is the longest side of the line that will be
        // created, so if it is a top line, it will have a bigger width, whilst
        // if it is a right side, it will have a bigger height
        this.lineSize = createVector(8, 2);
        this.distBetweenLines = this.lineSize.x; // the distance between each pair of lines
        this.speed = 1;                          // the speed the lines move at
        this.color = color;                      // the color of the lines
        this.disabled = false;                   // if the box is currently being hidden
    }

    // temporarily disable the animation for the box of lines
    tempDisable() {
        // we reset all of the arrays
        this.top = [];
        this.bot = [];
        this.left = [];
        this.right = [];
        // set disabled to true, which prevents the box from being drawn
        this.disabled = true; 
        // we only disable it for 10 miloseconds as we usually only use this
        // function to quickly save something to canvas
        setTimeout(() => {this.disabled = false}, 10); 
    }

    // updates the size of the box when given coordinates
    updateSize(x, y, w, h) {
        this.location = createVector(x, y);
        this.location.x = x;
        this.location.y = y;
        this.width = w;
        this.height = h;
    }

    // adds a line on the paramater: "side" side of the box at the paramater
    // "position". For example, if we have position = front and side = left
    // this means we add a line to the left side of the box at the front of
    // the array.
    addLine(position, side) {
        if (position == "front" ) {
            if (side == "top") {
                this.top.unshift(
                    new Line(
                        this.location.x,
                        this.location.y,
                        this.speed,
                        0,
                        this.lineSize.x,
                        this.lineSize.y,
                        this.color,
                    )
                ) 
            } else if (side == "right") {
                this.right.unshift(
                    new Line(
                        this.location.x + this.width - this.lineSize.y,
                        this.location.y,
                        0,
                        this.speed,
                        this.lineSize.y,
                        this.lineSize.x,
                        this.color,
                    )

                ) 
            } else if (side == "bot" ) {
                this.bot.unshift(
                    new Line(
                        this.location.x + this.width - this.lineSize.x,
                        this.location.y + this.height - this.lineSize.y,
                        -this.speed,
                        0,
                        this.lineSize.x,
                        this.lineSize.y,
                        this.color,
                    )
                ) 
            } else if (side == "left") {
                this.left.unshift(
                    new Line(
                        this.location.x,
                        this.location.y + this.height - this.lineSize.y,
                        0,
                        -this.speed,
                        this.lineSize.y,
                        this.lineSize.x,
                        this.color,
                    )
                ) 
            }
        } else if (position == "back" ) {
            if (side == "top") {
                this.top.push(
                    new Line(
                        this.top.at(-1).location.x + this.top.at(-1).width + this.distBetweenLines,
                        this.top.at(-1).location.y,
                        this.speed,
                        0,
                        this.lineSize.x,
                        this.lineSize.y,
                        this.color,
                    )
                );

            } else if (side == "right") {
                this.right.push(
                    new Line(
                        this.right.at(-1).location.x,
                        this.right.at(-1).location.y + this.right.at(-1).height + this.distBetweenLines,
                        0,
                        this.speed,
                        this.lineSize.y,
                        this.lineSize.x,
                        this.color,
                    )
                );

            } else if (side == "bot" ) {
                this.bot.push( 
                    new Line(
                        this.bot.at(-1).location.x - this.bot.at(-1).width - this.distBetweenLines,
                        this.bot.at(-1).location.y,
                        -this.speed,
                        0,
                        this.lineSize.x,
                        this.lineSize.y,
                        this.color,
                    )
                )
            } else if (side == "left") {
                this.left.push(
                    new Line(
                        this.left.at(-1).location.x,
                        this.left.at(-1).location.y - this.left.at(-1).height - this.distBetweenLines,
                        0,
                        -this.speed,
                        this.lineSize.y,
                        this.lineSize.x,
                        this.color,
                    )
                )

            }
        }
    }

    // when resizing, we will need to add lines to the front to ensure there is
    // enough lines when resizing to a bigger size
    addLinesToFront() {
        // if any of the arrays has no lines, we simply add one to the front
         if (this.top.length == 0) {
             if (this.width >= this.distBetweenLines) {
                 this.addLine("front", "top");
             }
         } else { // otherwise if there is room for another line, we simply add it
             if (this.top[0].location.x - this.top[0].width >= this.distBetweenLines + this.location.x) {
                 this.addLine("front", "top");
             }
             // and if the current width is smaller then the distance between
             // two pairs of lines, we can simply empty the array as it is
             // impossible to add a line within a distance this small
             if (this.width < this.distBetweenLines) {
                 this.top = [];
             }
         }

        if (this.bot.length == 0) {
            if (this.width >= this.distBetweenLines) {
                this.addLine("front", "bot");
            }
        } else {
            if (this.bot[0].location.x + (this.bot[0].width * 2)  <= this.location.x + this.width - this.distBetweenLines) {
                this.addLine("front", "bot");
            } 

            if (this.width < this.distBetweenLines) {
                this.bot = [];
            }
        }

        if (this.left.length == 0) {
            if (this.height >= this.distBetweenLines) {
                this.addLine("front", "left");
            }
        } else {
            if (this.left[0].location.y + this.left[0].height <= this.location.y + this.height - this.distBetweenLines) {
                this.addLine("front", "left");
            } 

            if (this.height < this.distBetweenLines) {
                this.left = [];
            }
        }

        if (this.right.length == 0) {
            if (this.height >= this.distBetweenLines) {
                this.addLine("front", "right");
            }
        } else {
            if (this.right[0].location.y - this.right[0].height - this.location.y >= this.distBetweenLines) {
                this.addLine("front", "right");
            } 

            if (this.height < this.distBetweenLines) {
                this.right = [];
            }
        }
    }


    /* when quickly resizing this can cause gaps between two pairs of lines that
     are larger then the "this.distBetweenLines". This function ensures that
     no two gaps are greater then this.distBetween lines, and if the distance is
     greater we move the lines so it is no longer greater

    The function does this by getting a mismade side (in this case the top side)
    and performing the following:

    1. Move the lines as far to the front of the array as they can go
    2. Add lines to the back of the array until we no longer can add any more

        before:                      1.                            2.
    _ _     _       _          _ _ _ _                    _ _ _ _ _ _ _ _ _         
    |                |         |                |         |                |
    |                |    =>   |                |  =>     |                |
    |                |         |                |         |                |
    |_ _ _ _ _ _ _ _ |         |_ _ _ _ _ _ _ _ |         |_ _ _ _ _ _ _ _ |
     */
    addLinesBetweenGaps() {


        // shift all lines that can shift, from the FRONT of the array to the BACK
        for (let i = 1; i < this.top.length; i++) {
            if (this.top[i].location.x - this.top[i - 1].location.x > this.distBetweenLines) {
                this.top[i].location.x = this.top[i - 1].location.x + this.top[i - 1].width + this.distBetweenLines;
            }
        }
        // add to back of the array until we can no longer add to the back
        if (this.top.length > 0) {
            while (this.location.x + this.width - this.top.at(-1).location.x - this.top.at(-1).width > this.distBetweenLines * 2) {
                this.addLine("back", "top");
            }
        }
        
        for (let i = 1; i < this.right.length; i++) {
            if (this.right[i].location.y - this.right[i - 1].location.y > this.distBetweenLines) {
                this.right[i].location.y = this.right[i - 1].location.y + this.right[i - 1].height + this.distBetweenLines;
            }
        }
        if (this.right.length > 0) {
            while (this.location.y + this.height - this.right.at(-1).location.y - this.right.at(-1).height > this.distBetweenLines * 2) {
                this.addLine("back", "right");
            }
        } 

        for (let i = 1; i < this.bot.length; i++) {
            if (this.bot[i - 1].location.x - this.bot[i].location.x > this.distBetweenLines) {
                this.bot[i].location.x = this.bot[i - 1].location.x - this.bot[i - 1].width - this.distBetweenLines;
            }
        }
        if (this.bot.length > 0) {
            while (this.bot.at(-1).location.x - this.location.x > this.distBetweenLines * 2) {
                this.addLine("back", "bot");
            }
        }

        for (let i = 1; i < this.left.length; i++) {
            if (this.left[i - 1].location.y - this.left[i].location.y > this.distBetweenLines) {
                this.left[i].location.y = this.left[i - 1].location.y - this.left[i - 1].height - this.distBetweenLines;
            }
        }
        if (this.left.length > 0) {
            while (this.left.at(-1).location.y - this.location.y > this.distBetweenLines * 2) {
                this.addLine("back", "left");
            }
        } 

    }

    // for each array we ensure the coordinates for each line are correct and
    // we draw each line
     drawLines() {
        for (let line of this.top) {
            line.location.y = this.location.y;
            line.draw();
        }
        for (let line of this.bot) {
            line.location.y = this.location.y + this.height;
            line.draw();
        }
        for (let line of this.left) {
            line.location.x = this.location.x;
            line.draw();
        }
        for (let line of this.right) {
            line.location.x = this.location.x + this.width;
            line.draw();
        }
    }

    // any lines that go past the limit of the box get deleted with this
    // function
    deleteOutOfBoundsLines() {
        // we first make sure that there is any lines at all in the given side
        // array
        if (this.top.length > 0) {
            // if there is any excess lines at the END of the given side we
            // remove it
            for (let i = 0; i < this.top.length; i++) {
                let curr = this.top[i];
                if (curr.location.x + curr.width > this.location.x + this.width) {
                    this.top.length = Math.max(i, 0);
                    break;
                }
            }
            // if there is excess lines at the front of the side we remove them
            // as well. (this occurs when resizing)
            for (let i = this.top.length - 1; i >= 0; i--) {
                let curr = this.top[i];
                if (curr.location.x < this.location.x) {
                    this.top.splice(0, i);
                    break;
                }
            }
        }

        if (this.bot.length > 0) {
            for (let i = 0; i < this.bot.length; i++) {
                let curr = this.bot[i];
                if (curr.location.x <= this.location.x) {
                    this.bot.length = Math.max(i, 0);
                    break;
                }
            }
            for (let i = this.bot.length - 1; i >= 0; i--) {
                let curr = this.bot[i];
                if (curr.location.x >= this.location.x + this.width) {
                    this.bot.splice(0, i);
                    break;
                }
            }
        }

        if (this.left.length > 0) {
            for (let i = 0; i < this.left.length; i++) {
                let curr = this.left[i];
                if (curr.location.y <= this.location.y) {
                    this.left.length = Math.max(i, 0);
                    break;
                }
            }
            for (let i = this.left.length - 1; i >= 0; i--) {
                let curr = this.left[i];
                if (curr.location.y >= this.location.y + this.height) {
                    this.left.splice(0, i);
                    break;
                }
            }
        }

        if (this.right.length > 0) {
            for (let i = 0; i < this.right.length; i++) {
                let curr = this.right[i];
                if (curr.location.y + curr.height >= this.location.y + this.height) {
                    this.right.length = Math.max(i, 0);
                    break;
                }
            }
            for (let i = this.right.length - 1; i >= 0; i--) {
                let curr = this.right[i];
                if (curr.location.y < this.location.y) {
                    this.right.splice(0, i);
                    break;
                }
            }
        }
    }

    drawBox(x, y, w, h) {
        push();
        noFill();
        noStroke();
        fill(...this.color, 50);
        rect(x, y, w, h);
        pop();
    }

    // this function is used to animate the box and is the main function for
    // running the BoxOfLines class
    animate(x, y, w, h) {
        if (!this.disabled) {
            this.drawBox(x, y, w, h)
        }
        this.updateSize(x, y, w, h);
        this.drawLines()
        this.addLinesToFront();
        this.deleteOutOfBoundsLines();
        this.addLinesBetweenGaps();
    }
}
