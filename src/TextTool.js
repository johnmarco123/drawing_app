function TextTool() {
	this.name = "text";
	this.icon = "assets/text.jpg";
    this.typing = false;
    this.text_input = [];
    this.blinking = false;
    this.blink_locked = false;
	let self = this;

	let previousMouseX = -1;
	let previousMouseY = -1;

    function blinkCursor() {
        if (self.blinking) {
            self.text_input.push("|");
            self.blinking = false;
        } else {
            self.text_input.pop();
            self.blinking = true;
        }
    }


    let result;
    function blink_if_user_idle() {
        result = setTimeout(() => {
            self.blink_locked = false;
        }, 200);
    }

    function disable_blink() {
        self.blink_locked = true;
        // If we are currently blinking, remove the blink item
        if (!self.blinking) {
            self.blinking = true;
            self.text_input.pop();
        }
        clearTimeout(result);
    }


    this.delete_text = function() {
        disable_blink() 
        blink_if_user_idle();
        if (keyIsDown(17)) {
            self.delete_last_word();
        } else if (self.text_input[self.text_input.length - 1] === "n" &&
            self.text_input[self.text_input.length - 2] === "\\") {
            self.text_input.pop();
            self.text_input.pop();
        } else {
            self.text_input.pop();
        }
    }

    this.add_letter = function(letter) {
        disable_blink();
        blink_if_user_idle();
        self.text_input.push(letter);
    }

    this.draw = function() {
        push()
        updatePixels();
        strokeWeight(1);
        global_text_size = select("#textSize").value();
        textSize(global_text_size);
        text(self.text_input.join(""), previousMouseX, previousMouseY);

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

    this.unselectTool = function() {
        updatePixels();
        //clear options
        select(".options").html("");
        cursor(ARROW);
    };

    this.populateOptions = function() {
        select(".options").html(
            // TODO CAP THIS PROPERLY SO YOU CANT HAVE A BAJILLION TEXT SIZE
            `Text size: <input type="number" name="textSize" id="textSize" min="25" max="40" value=${global_text_size}>
            <button id='typing'>Save Typing</button>
            `
        );
        select("#typing").mouseClicked(function() {
            if (self.typing) {
                disable_blink();
                loadPixels();
                updatePixels();
                self.text_input = [];
                previousMouseX = previousMouseY = -1;
                self.typing = false;
                cursor(TEXT);
            }
        });
    };

}
