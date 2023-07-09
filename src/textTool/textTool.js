function TextTool() {
    this.name = "text";
    this.icon = "images/text.jpg";
    // We store this as an object so we can pass a reference of it to our
    // different text editors
    this.state = {
        typing: false,
        txt: [],
        txt_pos: {x: -1, y: -1},
    }
    this.typingMode = "vim"
    let self = this;
    // Both of these need the text array, and the state of typing
    // We pass a REFERENCE to this classes data
    let normalEdit = new NormalEdit(this.state); 
    let vimEdit = new VimEdit(this.state); 

    const MAXTEXTSIZE = 40;
    const MINTEXTSIZE = 20;

    this.recieveKeystrokes = function(key) {
        if (self.typingMode == "vim") {
            vimEdit.handle_keystrokes(key);
        } else {
            normalEdit.handle_keystrokes(key);
        }
    }

    this.renderText = function() {
        push()
        stroke(1);
        updatePixels();
        let sizeOfText = select("#textSize").value();
        global_text_size = constrain(sizeOfText, MINTEXTSIZE, MAXTEXTSIZE);
        textFont("monospace", global_text_size);
        text(self.state.txt.join(""), self.state.txt_pos.x, self.state.txt_pos.y);
        pop();
    }

    this.handleTextState = function() {
        if (mouseOnCanvas() && mouseIsPressed && self.state.txt_pos.x == -1) {
            cursor(ARROW);
            self.state.typing = true;
            self.state.txt_pos.x = mouseX
            self.state.txt_pos.y = mouseY
        }
    }

    this.draw = function() {
        self.renderText();
        self.handleTextState();
        if (self.state.typing) {
            self.typingMode == "vim" ? vimEdit.draw() : normalEdit.draw();
        }
    }

    function saveTyping() {
        if (self.state.typing) {
            if (self.typingMode == "normal") normalEdit.save_text();
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
        saveTyping();
        self.typingMode = "normal"
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
            <button id='typing'>Save Typing</button>
            <button id='typingMode'>${this.typingMode} mode</button>
            `);

        select("#typing").mouseClicked(() => saveTyping());

        select("#typingMode").mouseClicked(function() {
            var button = select("#" + this.elt.id);
            if (self.typingMode == "normal") {
                normalEdit.shut_off_blink();
                self.typingMode = "vim";
            } else {
                self.typingMode = "normal";
            }
                button.html(`${self.typingMode} mode`);
        });
    };
}

function keyPressed() {
    // We only want control characters for keypressed
    if (keyCode < 32 && toolbox.selectedTool.name == "text") {
        toolbox.selectedTool.recieveKeystrokes(keyCode);
    }
}

function keyTyped () {
    // All ascii chracters we want from key typed.
        // We also want to disable the enter key, as we will handle 
    // this seperately
    if (toolbox.selectedTool.name == "text") { 
        if (key !== "\r" && key !== "\x7F" &&  key !== "|") {
            toolbox.selectedTool.recieveKeystrokes(key);
        }
    }
}
