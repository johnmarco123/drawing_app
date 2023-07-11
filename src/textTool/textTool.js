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
    }
    this.eval_on = false;
    this.typing_mode = "vim"
    let self = this;
    // Both of these need the text array, and the state of typing
    // We pass a REFERENCE to this classes data
    let normalEdit = new NormalEdit(this.state); 
    let vimEdit = new VimEdit(this.state); 

    const MAXTEXTSIZE = 30;
    const MINTEXTSIZE = 20;

    this.recieve_keystrokes = function(key) {
        if (self.typing_mode == "vim") {
            vimEdit.handle_keystrokes(key);
        } else {
            normalEdit.handle_keystrokes(key);
        }
    }

    this.render_text = function() {
        push()
        stroke(1);
        updatePixels();
        let sizeOfText = select("#textSize").value();
        global_text_size = constrain(sizeOfText, MINTEXTSIZE, MAXTEXTSIZE);
        textFont("monospace", global_text_size);
        text(self.state.txt.join(""), self.state.txt_pos.x, self.state.txt_pos.y);


        self.move_text();
        if (self.eval_on) {
            try {
                self.state.result = eval(self.state.txt.join(""));
            } catch(err) {
                self.state.result = `You got an error!\n ${err}`;
            } finally {
                if (self.state.result) {
                    text(`Your code returned:\n ${self.state.result}`,
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
        ellipse(self.state.txt_pos.x, self.state.txt_pos.y - 30, 20);
        if (self.eval_on) {
            fill(0, 255, 0);
            ellipse(self.state.result_pos.x, self.state.result_pos.y - 30, 20);
        }

        if (mouseIsPressed && mouseOnCanvas()) {
            let x1 = mouseX; let y1 = mouseY;
            let x2 = self.state.txt_pos.x; let y2 = self.state.txt_pos.y - 30;
            let x3 = self.state.result_pos.x; let y3 = self.state.result_pos.y - 30;

            if (dist(x1, y1, x2, y2) < 30) {
                self.state.txt_pos.x = mouseX;
                self.state.txt_pos.y = mouseY + 30;
            } else if (dist(x1, y1, x3, y3) < 30) {
                self.state.result_pos.x = mouseX;
                self.state.result_pos.y = mouseY + 30;
            } 
        }
        pop();
    }

    this.handle_text_state = function() {
        if (mouseOnCanvas() && mouseIsPressed && self.state.txt_pos.x == -1) {
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
            self.typing_mode == "vim" ? vimEdit.draw() : normalEdit.draw();
        }
    }

    function save_typing() {
        if (self.state.typing) {
            if (self.typing_mode == "normal") normalEdit.save_text();
            else vimEdit.save_text();
            self.draw();
            loadPixels();
            updatePixels();
            self.state.txt = [];
            self.state.txt_pos.x = self.state.txt_pos.y = -1;
            self.state.typing = false;
            cursor(TEXT);
        }
    }

    this.unselectTool = function() {
        save_typing();
        self.typing_mode = "normal"
        clearOptions();
        cursor(ARROW);
    };

    this.populateOptions = function() {
        cursor(TEXT);
        select(".tempOptions").html(
            `Text size: <input type="number"
            name="textSize" id="textSize" 
            min="${MINTEXTSIZE}" max="${MAXTEXTSIZE}" 
            value=${global_text_size}>
            <button id='save'>Save Typing</button>
            <button id='typing_mode'>${this.typing_mode} mode</button>
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
            if (self.typing_mode == "normal") {
                normalEdit.shut_off_blink();
                self.typing_mode = "vim";
            } else {
                self.typing_mode = "normal";
            }
            button.html(`${self.typing_mode} mode`);
        });
    };
}

function keyPressed() {
    // We only want control characters for keypressed
    if (keyCode < 32 && toolbox.selectedTool.name == "text") {
        toolbox.selectedTool.recieve_keystrokes(keyCode);
    }
}

function keyTyped () {
    // All ascii chracters we want from key typed.
        // We also want to disable the enter key, as we will handle 
    // this seperately
    if (toolbox.selectedTool.name == "text") { 
        if (key !== "\r" && key !== "\x7F" &&  key !== "|") {
            toolbox.selectedTool.recieve_keystrokes(key);
        }
    }
}
document.addEventListener('contextmenu', event => event.preventDefault());
