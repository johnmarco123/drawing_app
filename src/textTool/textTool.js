function TextTool() {
    this.name = "text";
    this.icon = "images/text.jpg";
    // We store this as an object so we can pass a reference of it to our
    // different text editors
    this.data = {
        typing: false,
        txt: [],
    }
    this.typingMode = "normal"
    let self = this;

    // Both of these need the text array, and the state of typing
    // We pass a REFERENCE to this classes data
    let normalEdit = new NormalEdit(this.data); 
    let vimEdit = new VimEdit(this.data); 

    const MAXTEXTSIZE = 40;
    const MINTEXTSIZE = 20;

    let previousMouseX = -1;
    let previousMouseY = -1;

    this.recieveKeystrokes = function(key) {
        if (self.typingMode == "vim") {
            vimEdit(key);
        } else {
            normalEdit.handleKeystrokes(key);
        }
    }

    this.renderText = function() {
        push();
        updatePixels();
        strokeWeight(1);

        let sizeOfText = select("#textSize").value();
        global_text_size = constrain(sizeOfText, MINTEXTSIZE, MAXTEXTSIZE);
        textSize(global_text_size);
        text(self.data.txt.join(""), previousMouseX, previousMouseY);
        pop();
    }

    this.handleTextState = function() {
        if (mouseIsPressed && previousMouseX == -1) {
            cursor(ARROW);
            self.data.typing = true;
            previousMouseX = mouseX;
            previousMouseY = mouseY;
        }
    }

    this.draw = function() {
        self.renderText();
        self.handleTextState();
        if (self.data.typing) {
            typingMode == "vim" ? vimEdit.draw() : normalEdit.draw();
        }
    }

    function saveTyping() {
        if (self.data.typing) {
            if (self.typingMode == "normal") {
                normalEdit.save_text();
            } else {
                vimEdit.save_text();
            }
            self.draw();
            loadPixels();
            updatePixels();
            self.data.txt = [];
            previousMouseX = previousMouseY = -1;
            self.data.typing = false;
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
            <button id='typingMode'>Vim mode</button>
            `);
        select("#typing").mouseClicked(function() {
            saveTyping();
        });
        select("#typingMode").mouseClicked(function() {
            var button = select("#" + this.elt.id);
            if (self.typingMode == "normal") {
                button.html('Normal mode');
                self.typingMode = "vim"
            } else {
                button.html('Vim mode');
                self.typingMode = "normal"
            }
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
        if (key !== "\r" && key !== "\x7F") {
            toolbox.selectedTool.recieveKeystrokes(key);
        }
    }
}
