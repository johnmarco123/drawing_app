class Line {
    constructor (x, y, vel_x, vel_y, w, h, color) {
        this.location = createVector(x, y);
        this.velocity = createVector(vel_x,vel_y);
        this.width = w;
        this.height = h;
        this.color = color;
    }

    draw() {
        push();
        this.update();
        noStroke();
        fill(this.color);
        rect(this.location.x, this.location.y, this.width, this.height);
        pop();
    }

    update() {
        this.location.add(this.velocity.x, this.velocity.y);
    }
}

class BoxOfLines {
    constructor(x, y, w, h, color) {
        this.location = createVector(x, y);
        this.width = w;
        this.height = h;
        this.top = [];
        this.bot = [];
        this.left = [];
        this.right = [];
        // The bigger number is the longest side of the line that will be
        // created
        this.line_size = createVector(8, 2);
        this.dist_between_lines = this.line_size.x;
        this.speed = 1;
        this.color = color;
        this.disabled = false;
    }

    temp_disable() {
        this.top = [];
        this.bot = [];
        this.left = [];
        this.right = [];
        this.disabled = true;
        setTimeout(() => {this.disabled = false}, 1);
    }

    update_size(x, y, w, h) {
        this.location.x = x;
        this.location.y = y;
        this.width = w;
        this.height = h;
    }

    add_line(side, direction) {

        if (side == "front" ) {
            if (direction == "top") {
                this.top.unshift(
                    new Line(
                        this.location.x,
                        this.location.y,
                        this.speed,
                        0,
                        this.line_size.x,
                        this.line_size.y,
                        this.color,
                    )
                ) 
            } else if (direction == "right") {
                this.right.unshift(
                    new Line(
                        this.location.x + this.width - this.line_size.y,
                        this.location.y,
                        0,
                        this.speed,
                        this.line_size.y,
                        this.line_size.x,
                        this.color,
                    )

                ) 
            } else if (direction == "bot" ) {
                this.bot.unshift(
                    new Line(
                        this.location.x + this.width - this.line_size.x,
                        this.location.y + this.height - this.line_size.y,
                        -this.speed,
                        0,
                        this.line_size.x,
                        this.line_size.y,
                        this.color,
                    )
                ) 
            } else if (direction == "left") {
                this.left.unshift(
                    new Line(
                        this.location.x,
                        this.location.y + this.height - this.line_size.y,
                        0,
                        -this.speed,
                        this.line_size.y,
                        this.line_size.x,
                        this.color,
                    )
                ) 
            }
        } else if (side == "back" ) {
            if (direction == "top") {
                this.top.push(
                    new Line(
                        this.top.at(-1).location.x + this.top.at(-1).width + this.dist_between_lines,
                        this.top.at(-1).location.y,
                        this.speed,
                        0,
                        this.line_size.x,
                        this.line_size.y,
                        this.color,
                    )
                );

            } else if (direction == "right") {
                this.right.push(
                    new Line(
                        this.right.at(-1).location.x,
                        this.right.at(-1).location.y + this.right.at(-1).height + this.dist_between_lines,
                        0,
                        this.speed,
                        this.line_size.y,
                        this.line_size.x,
                        this.color,
                    )
                );

            } else if (direction == "bot" ) {
                this.bot.push( 
                    new Line(
                        this.bot.at(-1).location.x - this.bot.at(-1).width - this.dist_between_lines,
                        this.bot.at(-1).location.y,
                        -this.speed,
                        0,
                        this.line_size.x,
                        this.line_size.y,
                        this.color,
                    )
                )
            } else if (direction == "left") {
                this.left.push(
                    new Line(
                        this.left.at(-1).location.x,
                        this.left.at(-1).location.y - this.left.at(-1).height - this.dist_between_lines,
                        0,
                        -this.speed,
                        this.line_size.y,
                        this.line_size.x,
                        this.color,
                    )
                )

            }
        } else {
            alert("ERROR, ADD LINE REQUIRES BACK OR FRONT AS ITS SIDE");
        }
    }

    // when resizing, we will need to add lines to the front to keep up with resizing
    add_lines_to_front() {
         if (this.top.length == 0) {
             if (this.width >= this.dist_between_lines) {
                 this.add_line("front", "top");
             }
         } else {
             // if there is room to add a new line
             if (this.top[0].location.x - this.top[0].width >= this.dist_between_lines + this.location.x) {
                 this.add_line("front", "top");
             }
             if (this.width < this.dist_between_lines) {
                 this.top = [];
             }
         }

        if (this.bot.length == 0) {
            if (this.width >= this.dist_between_lines) {
                this.add_line("front", "bot");
            }
        } else {
            let first_bot = this.bot[0];
            if (first_bot.location.x + (first_bot.width * 2)  <= this.location.x + this.width - this.dist_between_lines) {
                this.add_line("front", "bot");
            } 

            if (this.width < this.dist_between_lines) {
                this.bot = [];
            }
        }

        if (this.left.length == 0) {
            if (this.height >= this.dist_between_lines) {
                this.add_line("front", "left");
            }
        } else {
            let first_left = this.left[0];
            if (first_left.location.y + first_left.height <= this.location.y + this.height - this.dist_between_lines) {
                this.add_line("front", "left");
            } 

            if (this.height < this.dist_between_lines) {
                this.left = [];
            }
        }

        if (this.right.length == 0) {
            if (this.height >= this.dist_between_lines) {
                this.add_line("front", "right");
            }
        } else {
            let first_right = this.right[0];
            if (first_right.location.y - first_right.height - this.location.y >= this.dist_between_lines) {
                this.add_line("front", "right");
            } 

            if (this.height < this.dist_between_lines) {
                this.right = [];
            }
        }
    }


    add_lines_between_gaps() {

        // shift back to front
        for (let i = 1; i < this.top.length; i++) {
            if (this.top[i].location.x - this.top[i - 1].location.x > this.dist_between_lines) {
                this.top[i].location.x = this.top[i - 1].location.x + this.top[i - 1].width + this.dist_between_lines;
            }
        }
        // add to back till full
        if (this.top.length > 0) {
            while (this.location.x + this.width - this.top.at(-1).location.x - this.top.at(-1).width > this.dist_between_lines * 2) {
                this.add_line("back", "top");
            }
        }
        
        for (let i = 1; i < this.right.length; i++) {
            if (this.right[i].location.y - this.right[i - 1].location.y > this.dist_between_lines) {
                this.right[i].location.y = this.right[i - 1].location.y + this.right[i - 1].height + this.dist_between_lines;
            }
        }
        if (this.right.length > 0) {
            while (this.location.y + this.height - this.right.at(-1).location.y - this.right.at(-1).height > this.dist_between_lines * 2) {
                this.add_line("back", "right");
            }
        } 

        for (let i = 1; i < this.bot.length; i++) {
            if (this.bot[i - 1].location.x - this.bot[i].location.x > this.dist_between_lines) {
                this.bot[i].location.x = this.bot[i - 1].location.x - this.bot[i - 1].width - this.dist_between_lines;
            }
        }
        if (this.bot.length > 0) {
            while (this.bot.at(-1).location.x - this.location.x > this.dist_between_lines * 2) {
                this.add_line("back", "bot");
            }
        }

        for (let i = 1; i < this.left.length; i++) {
            if (this.left[i - 1].location.y - this.left[i].location.y > this.dist_between_lines) {
                this.left[i].location.y = this.left[i - 1].location.y - this.left[i - 1].height - this.dist_between_lines;
            }
        }
        if (this.left.length > 0) {
            while (this.left.at(-1).location.y - this.location.y > this.dist_between_lines * 2) {
                this.add_line("back", "left");
            }
        } 

    }

    draw_lines() {

        for (let i = 0; i < this.top.length; i++) {
            this.top[i].location.y = this.location.y;
            this.top[i].draw();
        }

        for (let i = 0; i < this.bot.length; i++) {
            this.bot[i].location.y = this.location.y + this.height;
            this.bot[i].draw();
        }

        for (let i = 0; i < this.left.length; i++) {
            this.left[i].location.x = this.location.x;
            this.left[i].draw();
        }

        for (let i = 0; i < this.right.length; i++) {
            this.right[i].location.x = this.location.x + this.width;
            this.right[i].draw();
        }

    }

    update_size(x, y, w, h) {
        this.location = createVector(x, y);
        this.width = w;
        this.height = h;
    }

    delete_out_of_bounds_lines() {
        if (this.top.length > 0) {
            // delete excess at the end
            for (let i = 0; i < this.top.length; i++) {
                let curr = this.top[i];
                if (curr.location.x + curr.width > this.location.x + this.width) {
                    this.top.length = Math.max(i, 0);
                    break;
                }
            }
            // delete excess at the front
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

    animate(x, y, w, h) {
        push();
        if (!this.disabled) {
            noStroke();
            fill(...this.color, 50);
            rect(x, y, w, h);
        }
        this.update_size(x, y, w, h);
        this.draw_lines()
        this.add_lines_to_front();
        this.delete_out_of_bounds_lines();
        this.add_lines_between_gaps();
        pop();
    }
}
