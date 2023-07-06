function TextTool() {
    this.name = "text";
    this.icon = "images/text.jpg";
    this.typing = false;
    this.txt = [];
    this.blinking = false;
    this.blink_locked = false;
    let self = this;

    let previousMouseX = -1;
    let previousMouseY = -1;

    function blinkCursor() {
        if (!self.blinking) {
            self.txt.push("|");
            self.blinking = true;
        } else {
            self.txt.pop();
            self.blinking = false;
        }
    }


    let result;
    function blink_if_user_idle() {
        result = setTimeout(() => {
            self.blink_locked = false;
        }, 200);
    }

    function reset_blink() {
        self.blink_locked = true;
        clearTimeout(result);
        shut_off_blink();
        blink_if_user_idle();
    }

    function shut_off_blink() {
        // If we are currently blinking, remove the blink item
        if (self.blinking) {
            self.blinking = false;
            self.txt.pop();
        }
    }

    function delete_last_word() {
        let found_char, token;
        let word_start_idx = -1;
        for (let i = self.txt.length - 1; i >= 0; i--) {
            token = self.txt[i]
            if (found_char && token === " ") {
                word_start_idx = i;
                break;
            } else if (!found_char && token !== " ") {
                found_char = true; 
            }
        }
        let delete_length = self.txt.length - word_start_idx;
        for(let i = 0; i < delete_length; i++) {
            self.txt.pop();
        }
    }

    this.delete_text = function() {
        reset_blink() 
        if (keyIsDown(17)) {
            delete_last_word();
        } else if (self.txt[self.txt.length - 1] === "n" &&
            self.txt[self.txt.length - 2] === "\\") {
            self.txt.pop();
            self.txt.pop();
        } else {
            self.txt.pop();
        }
    }

    this.add_letter = function(letter) {
        reset_blink();
        self.txt.push(letter);
    }

    this.draw = function() {
        push()
        updatePixels();
        strokeWeight(1);
        global_text_size = select("#textSize").value();
        textSize(global_text_size);
        text(self.txt.join(""), previousMouseX, previousMouseY);

        if (mouseIsPressed && previousMouseX === -1) {
            cursor(ARROW);
            self.typing = true;
            previousMouseX = mouseX;
            previousMouseY = mouseY;
        }

        if (frameCount % 30 === 0 && !self.blink_locked && self.typing) {
            blinkCursor()
        }

        pop();
    };

    function saveTyping() {
        if (self.typing) {
            shut_off_blink();
            self.draw();
            loadPixels();
            updatePixels();
            self.txt = [];
            previousMouseX = previousMouseY = -1;
            self.typing = false;
            cursor(TEXT);
        }
    }

    this.unselectTool = function() {
        saveTyping();
        clearOptions();
        cursor(ARROW);
    };

    this.populateOptions = function() {
        cursor(TEXT);
        select(".tempOptions").html(
            // TODO CAP THIS PROPERLY SO YOU CANT HAVE A BAJILLION TEXT SIZE
            `Text size: <input type="number" name="textSize" id="textSize" min="25" max="40" value=${global_text_size}>
            <button id='typing'>Save Typing</button>
            `
        );
        select("#typing").mouseClicked(function() {
            saveTyping();
        });
    };
}
