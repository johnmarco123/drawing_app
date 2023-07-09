// All functions in here edit a text string based on a given keystroke
class VimEdit {
    constructor(data) {
        // modes are normal, visual, insert, command mode is ambitious
        this.mode = "NORMAL"
        this.state = data;
        this.cursor_idx = -1;
        this.num_multiplier = "1"
    }

    cursor() {
        if (this.cursor_idx === -1) {
            this.cursor_idx = this.state.txt.length;
            this.state.txt.push("|");
        }

    }

    draw() {
        this.cursor();
        textSize(35);
        text(this.mode, 50, 50);
    }

    move_one_char(dir) {
        if (dir === "left" && this.cursor_idx > 0) {
            this.state.txt[this.cursor_idx] = this.state.txt[this.cursor_idx - 1];
            this.state.txt[this.cursor_idx - 1] = "|";
            this.cursor_idx--;
        } else if (dir === "right" && this.cursor_idx < this.state.txt.length - 1) {
            this.state.txt[this.cursor_idx] = this.state.txt[this.cursor_idx + 1];
            this.state.txt[this.cursor_idx + 1] = "|";
            this.cursor_idx++;
        }
    }

    move_one_word(dir) {
        //TODO
        if (dir === "right") { }
        else if (dir === "left") { }
    }

    normal_mode(key) {
        if (typeof key === "number") {
            this.num_multiplier += String(key);
        } else {
            this.num_multiplier = Math.min(this.num_multiplier, 100);
            for (let i = 0; i < Number(this.num_multiplier); i++) { 
                if (key === "i") this.mode = "INSERT";
                else if (key === "v") this.mode = "VISUAL";

                else if (key === "h") this.move_one_char("left");
                else if (key === "j") this.move_one_char("down");
                else if (key === "k") this.move_one_char("up");
                else if (key === "l") this.move_one_char("right");

                else if (key === "w") this.move_one_word("right");
                else if (key === "b") this.move_one_word("left");
            }
            this.num_multiplier = "1";
        }
    }

    visual_mode(key) {
        if (key === 27) this.mode = "NORMAL";
    }

    // array data structure may slowly suck in walls of text...
        add_text(char) {
            this.cursor_idx++;
            this.state.txt.splice(this.cursor_idx - 1, 0, char);
        }

    insert_mode(key) {
        if (key === 27) this.mode = "NORMAL";
        else if (typeof key == "string") {
            this.add_text(key);
        }

    }

    handle_keystrokes(key) {
        console.log(key);
        if (this.mode == "NORMAL") this.normal_mode(key);
        else if (this.mode == "INSERT") this.insert_mode(key);
        else if (this.mode == "VISUAL") this.visual_mode(key);
    }

    save_text() {

    }
}
