// All functions in here edit a text string based on a given keystroke
class VimEdit {
    constructor(data) {
        // modes are normal, visual, insert, command mode is ambitious
        this.mode = "NORMAL"
        this.state = data;
        this.cursor_idx = -1;
        this.cursor_color = [0, 180, 0];
        this.num_multiplier = "1"
        this.cursor_char = "_"
    }

    // cursor() {
        //     if (this.cursor_idx === -1) {
            //         this.cursor_idx = this.state.txt.length;
            //         this.state.txt.push("_");
            //     }
        // }

    cursor() {
        if (this.cursor_idx == -1) {
            this.cursor_idx = this.state.txt.length;
            push()
            fill([...this.cursor_color, 20]);
            rect(this.state.txt_pos.x, this.state.txt_pos.y, 10, 15) 
            pop();
        }
    }




    draw() {
        push()
        this.cursor();
        stroke(1);
        textSize(35);
        text(this.mode, 50, 50);
        pop();
    }

    move_one_char(dir) {
        if (dir === "left" && this.cursor_idx > 0) {
            this.state.txt[this.cursor_idx] = this.state.txt[this.cursor_idx - 1];
            this.state.txt[this.cursor_idx - 1] = this.cursor_char;
            this.cursor_idx--;
        } else if (dir === "right" && this.cursor_idx < this.state.txt.length - 1) {
            this.state.txt[this.cursor_idx] = this.state.txt[this.cursor_idx + 1];
            this.state.txt[this.cursor_idx + 1] = this.cursor_char;
            this.cursor_idx++;
        }
    }

    move_one_word(dir) {
        //TODO
        if (dir === "right") { }
        else if (dir === "left") { }
    }

    // All strings are non control characters
    // All numbers are control characters
    normal_mode(key) {
        if (typeof key == "string" && key >= 0) {
            this.num_multiplier += String(key);
            console.log(this.num_multiplier);
        } else {
            this.num_multiplier = Math.min(this.num_multiplier, 100);
            let amt = this.num_multiplier || 1;
            for (let i = 0; i < Number(amt); i++) { 
                if (key === "i") this.mode = "INSERT";
                else if (key === "v") this.mode = "VISUAL";

                else if (key === "h") this.move_one_char("left");
                else if (key === "j") this.move_one_char("down");
                else if (key === "k") this.move_one_char("up");
                else if (key === "l") this.move_one_char("right");

                else if (key === "w") this.move_one_word("right");
                else if (key === "b") this.move_one_word("left");
            }
            this.num_multiplier = "";
        }
    }

    visual_mode(key) {
        if (key === 27) this.mode = "NORMAL";
    }

    // array data structure may slowly suck in walls of text
    add_text(char) {
        this.cursor_idx++;
        this.state.txt.splice(this.cursor_idx - 1, 0, char);
    }

    remove_text(start, amt) {
        if (start < this.cursor_idx) {
            this.state.txt.splice(start, amt);
            this.cursor_idx--;
        }
    }

    insert_mode(key) {
        if (typeof key == "number") {
            if (key == 27) this.mode = "NORMAL";
            else if (key == 8) this.remove_text(this.cursor_idx - 1, 1);
            else console.log("Unregistered control key: " + key);
        } else { 
            this.add_text(key);
        }
    }

    handle_keystrokes(key) {
        console.log(`vim key: ${key}`);
        if (this.mode == "NORMAL") this.normal_mode(key);
        else if (this.mode == "INSERT") this.insert_mode(key);
        else if (this.mode == "VISUAL") this.visual_mode(key);
    }

    save_text() {
        // this should save the text as it should be rendered (remove all
            // vim things)
    }
}
