// the normal text editing that uses arrow keys, the home and end key and the
// delete key to edit text
function TextTool() {
    // set the REQUIRED icon, name and manual for the tool.
    this.name = "Text";
    this.icon = "images/text.jpg";
    this.manual = 
        `
        <ol>
            <li>Click where you would like to insert text</li>
            <li>You can then begin typing normally and click the "Save Typing" button when you are finished</li>
            <li>You can also type using some vim movements with the "Vim Mode" button</li>
            <li>If you would like to evaluate your code as javascript, click the "Evaluate JS" button. INFINITE LOOPS WILL CRASH THE PROGRAM, USE WITH CAUTION!</li>
        </ol>
        `;

    // the state that we use to keep all the text specific variables
    this.state = {
        typing: false,                                        // are we currently typing
        txtPos: {x: -1, y: -1},                               // the position of the top left corner of the text box
        txt: [],                                              // the text that is diplayed to the screen
        result: "Type some valid code and i will change!",    // the result when evaluating from javascript
        resultPos: { x: width/2, y: height/2 },               // the position of the top left corner of the result text box
        // the size of the text being displayed, this gets altered by the
        // slider at the bottom of the screen
        txtSize: 20,                                        
    }

    // all the cursors variables we store in this cursor object
    this.cursor = 
        {
            idx: -1,                            // the idx we are at in the text array 
            width: 4,                           // the width of the cursor
            x: null,                            // the x position of the top left corner of the cursor
            y: null,                            // the y position of the top left corner of the cursor
            row: 1,                             // the row that the cursor is on in the text box (1 indexed)
            col: 1,                             // the column that the cursor is on in the text box (also 1 indexed)
            height: this.state.txtSize * 1.15,  // the height of the cursor
            color: [57, 255, 20],               // the color of the cusor
            opacity: 255,                       // the opacity of the cursor
        };

    this.evalOn = false; // if the text is being evaluated as javascript or not
    this.typingMode = "Normal"; // the mode we are in (either "Normal" or "Vim")
    this.disabled = false;

    // the buttons we use in this class cannot access "this" so we save it here
    // so they can access it when they need it
    const self = this;

    // both of these subclasses require the access of the state and cursor, so we
    // pass them BY REFERENCE as we declare them
    const normalEdit = new NormalEdit(this.state, this.cursor); 
    const vimEdit = new VimEdit(this.state, this.cursor); 

    // whether or not the text is being selected and moved or the javascript
    // result text is being selected and moved
    let [textSelected, resultSelected] = [false, false];

    // recieves keystrokes from sketch.js and passes it to the appropriate 
    // mode
    this.recieveKeystrokes = key => {
        if (this.typingMode == "Vim") {
            vimEdit.handleKeystrokes(key);
        } else {
            normalEdit.handleKeystrokes(key);
        }
    }

    // renders the cursor and updates its position based upon its row and col 
    // properties
    this.renderCursor = () => {
        if (this.typingMode == "Normal") {
                this.cursor.width = 4;
                this.cursor.opacity = 255;
        }

        if (this.cursor.idx == -1) { // if cursor isn't yet set
            this.cursor.idx = this.state.txt.length;
        } else {
            push()
            noStroke();
            fill([...this.cursor.color, this.cursor.opacity]);
            this.cursor.height = this.state.txtSize * 1.15;

            this.cursor.x =  this.state.txtPos.x + this.state.txtSize * 0.55 * this.cursor.col - 11;
            this.cursor.y = (this.state.txtPos.y + this.state.txtSize * 1.25 * this.cursor.row - this.state.txtSize * 2.1);

            rect(this.cursor.x, this.cursor.y, this.cursor.width, this.cursor.height);
            pop();
        }
    }

    this.moveText = () => {
        push()
        noStroke();
        fill(255, 0, 0);
        // if we are typing then we want to show the ellipse for the text box
        // and the result text box if its being shown right now
        if (this.state.typing) {
            ellipse(this.state.txtPos.x - 15, this.state.txtPos.y - 30, 20);
            if (this.evalOn) {
                fill(0, 255, 0);
                ellipse(this.state.resultPos.x - 15, this.state.resultPos.y - 30, 20);
            }
        }

        if (mouseIsPressed && MOUSE_ON_CANVAS) {
            // the mouses position;
            let [x1, y1] = [mouseX, mouseY];
            // the text boxes position
            let [x2, y2] = [this.state.txtPos.x - 15, this.state.txtPos.y - 30];
            // the result box position
            let [x3, y3] = [this.state.resultPos.x - 15, this.state.resultPos.y - 30];

            // if the distance between the mouse and the text box is small enough
            if (dist(x1, y1, x2, y2) < 30) {
                // then we are selecting it and will allow movement for it
                textSelected = true; 

            // same thing with the reuslt text box
            } else if (dist(x1, y1, x3, y3) < 30) { 
                resultSelected = true;
            }

            // if we have selected the text box we move it relative to the mouse
            if (textSelected) {
                this.state.txtPos.x = mouseX + 15;
                this.state.txtPos.y = mouseY + 30;

            // same thing with the result text box
            } else if (resultSelected) {
                this.state.resultPos.x = mouseX + 15;
                this.state.resultPos.y = mouseY + 30;
            }
        } else {
            // if our mouse isnt pressed on the canvas, we cant be selecting
            // anything so we reset the selection variables
            textSelected = resultSelected = false;
        }
        pop();
    }

    // renders the text in the states text in the textbox
    this.renderText = () => {
        push()
        stroke(1);
        strokeWeight(1)
        // we set the text size to the text size slider
        this.state.txtSize = Number(select("#text-size").value()); 

        // we set our text font
        textFont("monospace", this.state.txtSize);

        // and we display our texte
        text(this.state.txt.join(""), this.state.txtPos.x, this.state.txtPos.y);

        this.moveText(); 

        // if we are evaluating the text and are typing
        if (this.evalOn && this.state.typing) {
            // then we try to evaluate the expression
            try {
                let txt = this.state.txt;
                // remove cursor before evaluating if it is there
                if (this.state.txt[this.state.txt.length - 1] == "|") {
                    txt = txt.slice(0, this.state.txt.length - 1);
                }
                // we save the result if it works
                this.state.result = eval(txt.join(""));
            } catch(err) {
                // if it does not work we set the result to the error
                this.state.result = `You got an error!\n ${err}`;
            } finally {
                // regardless of the reuslt if there is a result
                if (this.state.result) {

                    // we display the result if it exists
                    text(`Your code returned:\n ${this.state.result}`,
                        this.state.resultPos.x,
                        this.state.resultPos.y);
                } else {
                    // otherwise if there is nothing we show the user a nice
                    // message so they type
                    text(`Write more code to see it evaluated!:\n
                        ${this.state.result}`,
                        this.state.resultPos.x,
                        this.state.resultPos.y);
                }
            };
        }
        pop();
    }

    // when we click to decide the position of the text box this gets called
    // it sets the initial position and sets typing to true as we are nowt typing
    this.handleTextState = () => {
        if (MOUSE_ON_CANVAS && mouseIsPressed && this.state.txtPos.x == -1) {
            cursor(ARROW);
            this.state.typing = true;
            [this.state.txtPos.x, this.state.txtPos.y ] = [mouseX, mouseY]
        }
    }

    // the main draw loop for our function which calls everything for this tool
    // to function
    this.draw = () => {
        updatePixels();
        if (!this.disabled) {
            this.renderText();
            this.handleTextState();
            if (this.state.typing) { // if we are typing 
                this.renderCursor(); // we render the cursor
                if (this.typingMode == "Vim") { // and if its vim mode
                    vimEdit.draw(); // vim has its own draw function we call
                }
            }
        }
    }

    // allows pasting into the text area the users clipboard, this function
    // gets activated from sketch.js
    this.pasteClipboard = data => {
        // depending on the current mode, we call that modes paste option with
        // the array of chars
        const pasteArr = data.split("")
        if (this.typingMode == "Vim") {
            vimEdit.paste(pasteArr);
        } else {
            normalEdit.paste(pasteArr);
        }
    }

    // this function is used to reset the cursors state back to its original
    // state. we must modify each element individually as the vim and normal 
    // mode will not be able to access it otherwise
    this.resetCursor = () => {
        this.cursor.idx = -1; 
        this.cursor.width = 4;
        this.cursor.x = null;
        this.cursor.y = null;
        this.cursor.row = 1;
        this.cursor.col = 1;
        this.cursor.height = this.state.txtSize * 1.15;
        this.cursor.color = [57, 255, 20],
        this.cursor.opacity = 255;
    }

    // saves the current text to the canvas
    this.saveTyping = () => {
        if (self.state.typing) {
            // if we are in vim mode, it has to shut off its animations aswell so
            // we call vimEdits save text
            if (self.typingMode == "Vim") {
                vimEdit.saveText();
            }
            self.resetCursor();         // reseting the cursor disables it so it does not get saved to canvas
            self.state.typing = false;  // we set state.typing to false as we just saved the typing
            self.draw();                // we call this functions draw function to allow the above changes to take affect
            loadPixels();               // we then save the text to canvas
            self.state.txt = [];        // and then we reset the variables for the next time we decide to type something 
            self.state.txtPos.x = self.state.txtPos.y = -1;
            cursor(TEXT);
        }
    }

    // when we select another tool this gets called
    this.unselectTool = () => {
        // when another tool is selected we save what was being typed so its
        // not lost
        this.saveTyping();
        cursor(ARROW);
    };


    // this is used to disable elements that should not be saved to the canvas
    this.tempDisable = () => {
        this.disabled = true;
        setTimeout(() => this.disabled = false, 1);
    }

    // this function populates the options for this tool when it is selected
    // such as buttons and sliders
    this.populateOptions = function() {
        cursor(TEXT);
        select(".tempOptions").html(
            `<button id='save'>Save Typing</button>
            <button id='typingMode'>
            ${self.typingMode == "Normal" ? "Vim" : "Normal"} mode</button>
            <button id='eval'>Evaluate JS</button>
            Text size: <input type='range' min='18' max='25' value='20' class='slider' id='text-size'>
            `);

        // when the save button is clicked it will save what is currently being
        // typed
        select("#save").mouseClicked(() => self.saveTyping());

        select("#eval").mouseClicked(function() {
            const button = select("#" + this.elt.id);
            button.html(self.evalOn ? `Evaluate JS` : `Evaluate Off`);
            self.evalOn = !self.evalOn
        });



        select("#typingMode").mouseClicked(function() {
            const button = select("#" + this.elt.id);
            if (self.typingMode == "Normal") {
                self.typingMode = "Vim";
                button.html("Normal mode")
            } else {
                self.typingMode = "Normal";
                button.html("Vim mode")
            }
        });
    };
}
