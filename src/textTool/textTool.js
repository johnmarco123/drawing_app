function TextTool() {
    this.name = "text";
    this.icon = "images/text.jpg";
    // We store this as an object so we can pass a reference of it to our
    // different text editors
    this.state = {
        typing: false,
        txt: [],
        result: "Type some valid code and i will change!",
        txt_pos: {x: -1, y: -1},
        result_pos: {x: width/2, y: height/2},
        txt_size: 25,
    }
    this.eval_on = false;
    this.typing_mode = "Normal";

    let self = this;
    // Both of these need the text array, and the state of typing
    // We pass a REFERENCE to this classes data
    let normalEdit = new NormalEdit(this.state); 
    let vimEdit = new VimEdit(this.state); 
    let text1_selected = false;
    let text2_selected = false;

    this.recieve_keystrokes = function(key) {
        if (self.typing_mode == "Vim") {
            vimEdit.handle_keystrokes(key);
        } else {
            normalEdit.handle_keystrokes(key);
        }
    }

    this.render_text = function() {
        push()
        stroke(1);
        strokeWeight(1)
        updatePixels();
        textFont("monospace", self.state.txt_size);
        text(self.state.txt.join(""), self.state.txt_pos.x, self.state.txt_pos.y);


        self.move_text();
        if (self.eval_on && self.state.typing) {
            try {
                let txt = self.state.txt;
                // remove cursor before evaluating if it is there
                if (self.state.txt[self.state.txt.length - 1] == "|") {
                    txt = txt.slice(0, self.state.txt.length - 1);
                }
                self.state.result = eval(txt.join(""));
            } catch(err) {
                self.state.result = `You got an error!\n ${err}`;
            } finally {
                if (self.state.result) {

                    text(`Your code returned:\n ${self.state.result}`,
                        self.state.result_pos.x,
                        self.state.result_pos.y);
                } else {
                    text(`Write more code to see it evaluated!:\n
                        ${self.state.result}`,
                        self.state.result_pos.x,
                        self.state.result_pos.y);
                }
            };
        }
        pop();
    }

    this.move_text = function() {
        push()
        noStroke();
        fill(255, 0, 0);
        if (self.state.typing) {
            ellipse(self.state.txt_pos.x - 15, self.state.txt_pos.y - 30, 20);
            if (self.eval_on) {
                fill(0, 255, 0);
                ellipse(self.state.result_pos.x - 15, self.state.result_pos.y - 30, 20);
            }
        }

        if (mouseIsPressed && MOUSE_ON_CANVAS) {
            let x1 = mouseX; let y1 = mouseY;
            let x2 = self.state.txt_pos.x - 15; let y2 = self.state.txt_pos.y - 30;
            let x3 = self.state.result_pos.x - 15; let y3 = self.state.result_pos.y - 30;

            if (dist(x1, y1, x2, y2) < 30) {
                text1_selected = true;
            } else if (dist(x1, y1, x3, y3) < 30) {
                text2_selected = true;
            }

            if (text1_selected) {
                self.state.txt_pos.x = mouseX + 15;
                self.state.txt_pos.y = mouseY + 30;
            } else if (text2_selected) {
                self.state.result_pos.x = mouseX + 15;
                self.state.result_pos.y = mouseY + 30;
            }
        } else {
            text1_selected = false;
            text2_selected = false;
        }
        pop();
    }

    this.handle_text_state = function() {
        if (MOUSE_ON_CANVAS && mouseIsPressed && self.state.txt_pos.x == -1) {
            cursor(ARROW);
            self.state.typing = true;
            self.state.txt_pos.x = mouseX
            self.state.txt_pos.y = mouseY
        }
    }

    this.draw = function() {
        self.render_text();
        self.handle_text_state();
        if (self.state.typing) {
            self.typing_mode == "Vim" ? vimEdit.draw() : normalEdit.draw();
        }
    }

    function save_typing() {
        if (self.state.typing) {
            if (self.typing_mode == "Normal") normalEdit.save_text();
            else vimEdit.save_text();
            self.state.typing = false;
            self.draw();
            loadPixels();
            updatePixels();
            self.state.txt = [];
            self.state.txt_pos.x = self.state.txt_pos.y = -1;
            cursor(TEXT);
        }
    }

    this.unselectTool = function() {
        save_typing();
        clearOptions();
        cursor(ARROW);
    };

    this.populateOptions = function() {
        cursor(TEXT);
        select(".tempOptions").html(
            `<button id='save'>Save Typing</button>
            <button id='typing_mode'>
            ${self.typing_mode == "Normal" ? "Vim" : "Normal"} mode</button>
            <button id='eval'>Evaluate JS</button>
            `);

        select("#save").mouseClicked(() => save_typing());
        select("#eval").mouseClicked(function() {
            var button = select("#" + this.elt.id);
            if (self.eval_on) {
                button.html(`Evaluate JS`);
            } else {
                button.html(`Evaluate Off`);
            }
            self.eval_on = !self.eval_on
        });
        select("#typing_mode").mouseClicked(function() {
            var button = select("#" + this.elt.id);
            if (self.typing_mode == "Normal") {
                normalEdit.shut_off_blink();
                self.typing_mode = "Vim";
                button.html("Normal mode")
            } else {
                self.typing_mode = "Normal";
                button.html("Vim mode")
            }
        });
    };
}
