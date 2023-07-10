// All functions in here edit a text string based on a given keystroke
class VimEdit {
    constructor(data) {
        // modes are normal, visual, insert, command mode is ambitious
        this.mode = "NORMAL"
        this.state = data;
        this.num_multiplier = "1"
        this.cursor = 
            {
                idx: -1, // The idx in the txt array
                width: 4,
                x: null,
                y: null,
                row: 1,
                col: 1,
                height: global_text_size * 1.15,
                color: [57, 255, 20],
                opacity: 255,
            }
    }

    debug() {
        console.log(`cursor pos: col: ${this.cursor.col}, row: ${this.cursor.row}`);
    }

    // Controls the positioning of the cursor
    render_cursor() {
        if (this.cursor.idx == -1) { // if cursor isn't yet set
            this.cursor.idx = this.state.txt.length;
        } else {
            push()
            noStroke();
            if (this.mode === "INSERT") {
                this.cursor.width = 4;
                this.cursor.opacity = 255;
            } else if (this.mode === "NORMAL") {
                this.cursor.width = 12;
                this.cursor.opacity = 150;
            }

            fill([...this.cursor.color, this.cursor.opacity]);
            this.cursor.row = Math.max(1, this.cursor.row)
            this.cursor.col = Math.max(1, this.cursor.col)

            this.cursor.height = global_text_size * 1.15;
            this.cursor.x = (
                this.state.txt_pos.x + 
                (global_text_size * 0.55) * 
                this.cursor.col - 15);

            this.cursor.y = (this.state.txt_pos.y -
                global_text_size * 0.9 + ((this.cursor.row - 1) * 32));

            rect(this.cursor.x,
                this.cursor.y,
                this.cursor.width,
                this.cursor.height);

            pop();
        }
    }

    draw() {
        push();
        this.render_cursor();
        stroke(1);
        textSize(35);
        text(this.mode, 50, 50);
        pop();
    }

    move_one_char(dir) {
        if (dir == "left" && this.cursor.idx > 0) {
            this.move_cursor_to(this.cursor.row, this.cursor.col - 1);
        } else if (dir == "right" && this.cursor.idx < this.state.txt.length - 1) {
            this.move_cursor_to(this.cursor.row, this.cursor.col + 1);
        } else if (dir == "up") {
            this.move_cursor_to(this.cursor.row - 1, this.cursor.col);
        } else { // moving down!
                this.move_cursor_to(this.cursor.row + 1, this.cursor.col);
        } 
    }

    move_one_word(dir) {
        let found_space = false;
        let [row, col] = [this.cursor.row, this.cursor.col];
        let idx = this.find_location_and("index", row, col);
        let token;

        // Walking forward
        if (dir === "right") {  
            while (idx < this.state.txt.length) {
                idx = this.find_location_and("index", row, col++);
                token = this.state.txt[idx];
                if (token == " ") found_space = true;
                if (found_space && token !== " ") {
                    break;
                } else if (token == "\n") {
                    row++;
                    col = 1;
                    break;
                }            }
            this.find_location_and("move", row, col);
        }



        // Walking backward CURRENTLY IS BROKEN! TODO
        // Walking backward CURRENTLY IS BROKEN! TODO
        // Walking backward CURRENTLY IS BROKEN! TODO
        // Walking backward CURRENTLY IS BROKEN! TODO
        // Walking backward CURRENTLY IS BROKEN! TODO
        // Walking backward CURRENTLY IS BROKEN! TODO
    //     else if (dir === "left") { 
    //         if (col == 1 && row != 1) {
    //             this.find_location_and("move", row - 1, col + 1E7); 
    //             return;
    //         }
    //
    //         let found_char;
    //         while (idx > 0) {
    //             idx = this.find_location_and("index", row, --col);
    //             token = this.state.txt[idx];
    //             if (token == undefined) return;
    //             if (token != " ") {
    //                 found_char = true;
    //             } else if (found_char && token === " ") {
    //                 break;
    //             } else if (token == "\n") {
    //                 row--;
    //                 col = 1E7;
    //                 break;
    //             } 
    //         }
    //         this.find_location_and("move", row, col + 1); 
    //     }
    }

    // All strings are non control characters
    // All numbers are control characters
    normal_mode(key) {
        if (typeof key == "string" && key >= 0) {
            this.num_multiplier += String(key);
        } else {
            this.num_multiplier = Math.min(this.num_multiplier, 100);
            let amt = this.num_multiplier || 1;
            for (let i = 0; i < Number(amt); i++) { 
                if (key === "i") this.mode = "INSERT";
                else if (key === "v") this.mode = "VISUAL";

                // Moving one char at a time
                else if (key === "h") this.move_one_char("left");
                else if (key === "j") this.move_one_char("down");
                else if (key === "k") this.move_one_char("up");
                else if (key === "l") this.move_one_char("right");

                // Moving one word at a time
                else if (key === "w") this.move_one_word("right");
                else if (key === "b") this.move_one_word("left");

                // deleting chars
                else if (key === "x") this.delete(this.cursor.row, this.cursor.col);
            }
            this.num_multiplier = "";
        }
    }

    visual_mode(key) {
        if (key === 27) this.mode = "NORMAL";
    }

    // Array data structure may slowly suck in walls of text
    add_text(char) {
        this.state.txt.splice(this.cursor.idx - 0, 0, char);
        if (char === "\n") { // We gotta move the cursor to the next line
            this.cursor.row++;
            this.cursor.idx++;
            this.cursor.col = 1;
        } else {
            this.cursor.idx++;
            this.cursor.col++;
        }
    }

    find_location_and(action, row, col) {
        let token;
        let curr_col = 0; // We start on col 1, but we initiate it in the loop
        let curr_row = 1; 
        let i = 0;
        for (; i < this.state.txt.length; i++) {
            curr_col++;
            token = this.state.txt[i]; // the current char at the given idx
            if (curr_row == row) {
                if (token == "\n" || curr_col === col) { 
                    break;
                }
            } else {
                if (token == "\n") {
                    curr_row++; // found new line, so we are on a new row
                    curr_col = 0; // reset column every time we go to new line
                }
            }
        }
        if (action == "char") {
            return token;
        } else if (action == "move") {
            this.cursor.row = curr_row;
            this.cursor.col = curr_col;
            this.cursor.idx = i;
        } else if (action == "index") {
            return i;
        }
    }

    get_char_at(row, col) {
        return this.find_location_and("char", row, col);
    }

    move_cursor_to(row, col) {
        this.find_location_and("move", row, col);
    }

    delete(row, col) {
        let start = this.find_location_and("index", row, col);
        let amt = 1;
        // Avoid undefined pointers
        if (start >= 0 && start <= this.state.txt.length) {
            if (this.state.txt[start - 1] == "\n") {
                this.move_cursor_to(this.cursor.row - 1, 1E7);  
            } else if (start < this.cursor.idx) {
                this.cursor.idx--;
                this.cursor.col--;
            }
            this.state.txt.splice(start, amt);
        }
    }

    insert_mode(key) {
        if (typeof key == "number") { // Command keys
            if (key == 27) this.mode = "NORMAL"; // ESC
            else if (key == 13) this.add_text("\n"); // Enter
            else if (key == 8) this.delete(this.cursor.row, this.cursor.col - 1); //Backspace
            // else alert("Unregistered control key: " + key);
        } else { // Non command keys
            this.add_text(key);
        }
    }

    handle_keystrokes(key) {
        // console.log(`vim key: ${key}`);
        if (this.mode == "NORMAL") this.normal_mode(key);
        else if (this.mode == "INSERT") this.insert_mode(key);
        else if (this.mode == "VISUAL") this.visual_mode(key);
    }

    save_text() {
        // Hide cursor when saving, and then remake it 
        // also reset everything else
    }
}
