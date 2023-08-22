function CopyTool(){
    this.name = "copyTool";
    this.icon = "images/copyTool.jpg";
    this.mode = "select";
    this.startPos = this.endPos = null;
    this.cutSection = null;
    let self = this;

    // Given two VECTORS, will output the top left corners x and y and also
    // the width and the height

    function get_coords_for_cut (start, end) {
        let [x, y] = [Math.min(start.x, end.x), Math.min(start.y, end.y)];
        let [x2, y2] = [Math.max(start.x, end.x), Math.max(start.y, end.y)];
        let w = x2 - x;
        let h = y2 - y;
        return [x, y, w, h]; 
    }

    function in_move_area(x, y, w, h) {
        return mouseX >= x && mouseX <= (x + w) && mouseY >= y && mouseY <= (y + h);
    }

    class Line {
        constructor (x, y, vel_x, vel_y, w, h) {
            this.location = createVector(x, y);
            this.velocity = createVector(vel_x,vel_y);
            this.width = w;
            this.height = h;
            this.color = color(0, 120, 255);
        }

        draw() {
            push();
            this.update();
            noStroke();
            fill(this.color); // TODO, CHANGE THIS TO A PERMANENT COLOR IN THE CLASS ITSELF
            rect(this.location.x, this.location.y, this.width, this.height);
            pop();
        }

        update() {
            this.location.add(this.velocity.x, this.velocity.y);
        }
    }

    class BoxOfLines {
        constructor(x, y, w, h) {
            this.location = createVector(x, y);
            this.width = w;
            this.height = h;
            this.top = [];
            this.bot = [];
            this.left = [];
            this.right = [];
            this.dist_between_lines = 10;
            this.line_size = createVector(10, 4);
            this.speed = 1;
        }

        update_size(x, y, w, h) {
            this.location.x = x;
            this.location.y = y;
            this.width = w;
            this.height = h;
        }

        add_line(direction, side) {

            if (side == "front" ) {
                if (direction == "top") {
                    this.top.unshift(
                        new Line(
                            this.location.x,
                            this.location.y,
                            this.speed,
                            0,
                            this.line_size.x,
                            this.line_size.y)
                    ) 
                } else if (direction == "right") {
                    this.right.unshift(
                        new Line(
                            this.location.x + this.width - this.line_size.y,
                            this.location.y,
                            0,
                            this.speed,
                            this.line_size.y,
                            this.line_size.x)
                    ) 
                } else if (direction == "bot" ) {
                    this.bot.unshift(
                        new Line(
                            this.location.x + this.width - this.line_size.x,
                            this.location.y + this.height - this.line_size.y,
                            -this.speed,
                            0,
                            this.line_size.x,
                            this.line_size.y)
                    ) 
                } else if (direction == "left") {
                    this.left.unshift(
                        new Line(
                            this.location.x,
                            this.location.y + this.height - this.line_size.y,
                            0,
                            -this.speed,
                            this.line_size.y,
                            this.line_size.x)
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
                    this.add_line("top", "front");
                }
            } else {
                let first_top = this.top[0];
                // if there is room to add a new line
                if (first_top.location.x - first_top.width >= this.dist_between_lines + this.location.x) {
                    this.add_line("top", "front");
                } 

                if (this.width < this.dist_between_lines) {
                    this.top = [];
                }
            }

            if (this.bot.length == 0) {
                if (this.width >= this.dist_between_lines) {
                    this.add_line("bot", "front");
                }
            } else {
                let first_bot = this.bot[0];
                if (first_bot.location.x + (first_bot.width * 2) <= this.location.x + this.width - this.dist_between_lines) {
                    this.add_line("bot", "front");
                } 

                if (this.width < this.dist_between_lines) {
                    this.bot = [];
                }
            }

            if (this.left.length == 0) {
                if (this.height >= this.dist_between_lines) {
                    this.add_line("left", "front");
                }
            } else {
                let first_left = this.left[0];
                if (first_left.location.y + first_left.height <= this.location.y + this.height - this.dist_between_lines) {
                    this.add_line("left", "front");
                } 

                if (this.height < this.dist_between_lines) {
                    this.left = [];
                }
            }

            if (this.right.length == 0) {
                if (this.height >= this.dist_between_lines) {
                    this.add_line("right", "front");
                }
            } else {
                let first_right = this.right[0];
                if (first_right.location.y - first_right.height - this.location.y >= this.dist_between_lines) {
                    this.add_line("right", "front");
                } 

                if (this.height < this.dist_between_lines) {
                    this.right = [];
                }
            }


        }

        // when there is room for another line at the front we add it
        add_lines_to_back() {
            if (this.top.length > 0) {
                let last_top = this.top.at(-1);
                if (this.location.x + this.width - last_top.location.x >= this.dist_between_lines + 15) {
                    this.add_line("top", "back"); 
                }
            } 

            if (this.right.length > 0) {
                let last_right = this.right.at(-1);
                if (this.location.y + this.height - last_right.location.y + last_right.height >= this.dist_between_lines + 20) {
                    this.add_line("right", "back"); 
                }
            } 

            if (this.bot.length > 0) {
                let last_bot = this.bot.at(-1);
                if (last_bot.location.x >= this.location.x + this.dist_between_lines + 20) {
                    this.add_line("bot", "back");
                }
            } 

            if (this.left.length > 0) {
                let last_left = this.left.at(-1);
                if (last_left.location.y - this.location.y >= this.dist_between_lines + 15) {
                    this.add_line("left", "back");
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
                let last = this.top.at(-1);
                if (last.location.x + last.width > this.location.x + this.width) {
                    this.top.pop();
                }

                let first = this.top[0];
                if (first?.location.x < this.location.x) {
                    this.top.shift();
                }
            }

            if (this.bot.length > 0) {
                let last = this.bot.at(-1);
                if (last.location.x <= this.location.x) {
                    this.bot.pop();
                }

                let first = this.bot[0];
                if (first?.location.x >= this.location.x + this.width) {
                    this.bot.shift();
                }
            }

            if (this.left.length > 0) {
                let last = this.left.at(-1);
                if (last.location.y <= this.location.y) {
                    this.left.pop();
                }

                let first = this.left[0];
                if (first?.location.y >= this.location.y + this.height) {
                    this.left.shift();
                }
            }

            if (this.right.length > 0) {
                let last = this.right.at(-1);
                if (last.location.y + last.height >= this.location.y + this.height) {
                    this.right.pop();
                }

                let first = this.right[0];
                if (first?.location.y < this.location.y) {
                    this.right.shift();
                }
            }
        }

        draw(x, y, w, h) {
            this.update_size(x, y, w, h);
            this.draw_lines()
            this.add_lines_to_front();
            this.delete_out_of_bounds_lines();
            this.add_lines_to_back();
        }
    }


    let x, y, w, h;
    let dy = -1
    let dx = -1;
    let dragging = false;
    let box = null;
    this.copy_area = function() {
        push();
        if(self.mode == "select" && mouseIsPressed){
            self.startPos = self.endPos = createVector(mouseX, mouseY);
            box = new BoxOfLines(x, y, w, h); // create the box for the box animation
            self.mode = "drag";
        } else if (self.mode == "drag" && mouseIsPressed) {
            self.endPos = createVector(mouseX, mouseY);
            noFill();
            [x, y, w, h] = get_coords_for_cut(self.startPos, self.endPos);
            box.draw(x, y, w, h);
        } else if (self.mode == "drag" && !mouseIsPressed){
            let image_size_is_valid = w != 0 && h != 0;
            if (image_size_is_valid) { 
                self.cutSection = get(x, y, w, h);
                self.mode = "moving";
                box.draw(x, y, w, h);
            } else {
                self.mode = "select";
            }
        } else if (self.mode == "moving") {
            if (in_move_area(x, y, w, h)) {
                cursor("grab");
            } else {
                cursor("pointer");
            }

            if (mouseIsPressed) {
                if (in_move_area(x, y, w, h) || dragging) {
                    dragging = true;
                    if (dy == -1) {
                        [dx, dy] = [x - mouseX, y - mouseY];
                    }
                    [x, y] = [dx + mouseX, dy + mouseY];
                } else {
                    // save the state and reset
                    self.mode = "select";
                    image(self.cutSection, x, y);
                    this.startPos = this.cutSection = this.endPos = null;
                    loadPixels(); // save the state where you left the object
                    return;
                }
            } else {
                dragging = false;
                dy = dx = -1;
            }
            image(self.cutSection, x, y);
            box.draw(x, y, w, h);
        }
        pop();
    }

    this.draw = function(){
        push();
        updatePixels();
        this.copy_area();
        pop();
    }


    this.unselectTool = function() {
        clearOptions();
        loadPixels();
        updatePixels();
        this.mode = "select";
        this.startPos = this.endPos = this.cutSection = null;
    };

}
