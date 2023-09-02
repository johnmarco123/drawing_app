// edits the array in place (and it must!)
class NormalEdit {
    constructor(data) {
        this.idleTimer;
        this.state = data;
        this.blink_locked = this.blinking =  false;
    }

    handle_keystrokes(key) {
        if (typeof key == "number") { // control keys

            if (key == 8) { // Backspace
                if (keyIsPressed == CONTROL) {
                    this.delete_last_word();
                } else {
                    this.delete_text();
                }
            } 
            if (key == 13) this.add_letter("\n"); // Enter

        } else { // non control keys
            this.add_letter(key);
        }
    }

    blinkCursor() {
        if (this.blinking) {
            this.state.txt.pop();
            this.blinking = false;
        } else {
            this.state.txt.push("|");
            this.blinking = true;
        }
    }

    blink_if_user_idle() {
        this.idleTimer = setTimeout(() => {
            this.blink_locked = false;
        }, 200);
    }

    reset_blink() {
        this.blink_locked = true;
        clearTimeout(this.idleTimer);
        this.shut_off_blink();
        this.blink_if_user_idle();
    }

    shut_off_blink() {
        // If we are currently blinking, remove the blink item
        if (this.blinking) {
            this.blinking = false;
            this.state.txt.pop();
        }
    }

    delete_last_word() {
        let found_char, token;
        let word_start_idx = -1;
        for (let i = this.state.txt.length - 1; i >= 0; i--) {
            token = this.state.txt[i];
            if (found_char && (token === " " || token === "\n")) {
                word_start_idx = i;
                break;
            } else if (!found_char && token !== " ") {
                found_char = true; 
            }
        }
        let delete_length = this.state.txt.length - word_start_idx;
        for(let i = 0; i < delete_length; i++) {
            this.state.txt.pop();
        }
    }

    draw() {
        if (frameCount % 30 == 0 && !this.blink_locked && this.state.typing) {
            this.blinkCursor();
        }
    }

    save_text() {
        this.shut_off_blink();
    }

    delete_text() {
        this.reset_blink();
        if (keyIsDown(17)) {
            this.delete_last_word();
        } else if (this.state.txt[this.state.txt.length - 1] === "n" &&
            this.state.txt[this.state.txt.length - 2] === "\\") {
            this.state.txt.pop();
            this.state.txt.pop();
        } else {
            this.state.txt.pop();
        }
    }

    add_letter(letter) {
        this.reset_blink();
        this.state.txt.push(letter);
    }
}

