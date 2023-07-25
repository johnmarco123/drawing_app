// All functions in here edit a text string based on a given keystroke
class VimEdit {
    constructor(data) {
        // modes are normal, visual, insert, command mode is ambitious
        this.mode = "NORMAL";
        this.state = data;
        this.num_multiplier = "1";
        this.prefix = ""; // such as d for delete, y for yank, etc;
        this.last_searched = null;
        this.cursor = 
            {
                idx: -1, // The idx in the txt array
                width: 4, 
                x: null, 
                y: null,
                row: 1,
                col: 1,
                height: this.state.txt_size * 1.15,
                color: [57, 255, 20],
                opacity: 255,
            }
    }

    draw() {
        if (this.state.typing) {
            push();
            this.render_cursor();
            stroke(1);
            textSize(35);
            text(this.mode, 50, 50);
            pop();
        }
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

            this.cursor.height = this.state.txt_size * 1.15;
            this.cursor.x = (
                this.state.txt_pos.x + 
                (this.state.txt_size * 0.55) * 
                this.cursor.col - 15);

            this.cursor.y = (this.state.txt_pos.y -
                this.state.txt_size * 0.9 + ((this.cursor.row - 1) * 31.3));

            rect(this.cursor.x,
                this.cursor.y,
                this.cursor.width,
                this.cursor.height);
            pop();
        }
    }

    insert_mode(key) {
        if (typeof key == "number") { // command keys
            if (key == 27) { // ESC
                this.mode = "NORMAL"; 
                this.move_one_char("left");
            }
            else if (key == 13) this.add_text("\n"); // enter
            else if (key == 8) this.delete(this.cursor.idx - 1, 1); // backspace
            // else alert("Unregistered control key: " + key);
        } else { // Non command keys
            this.add_text(key);
        }
    }

    start_of_line_idx(idx) {
        let txt = this.state.txt;
        let i = idx;
        while (i >= 0) {
            if (txt[i - 1] == "\n") break; 
            i--;
        }
        return i + 1;
    }

    end_of_line_idx(idx) {
        let txt = this.state.txt;
        let i = idx;
        while (i < txt.length) { 
            if (txt[i + 1] == "\n") break;
            i++
        }
        return i - 1;
    }

    search_for(char, direction) {
        let txt = this.state.txt;
        let i = this.cursor.idx;
        if (direction == "forward") {
            i += 1;
            while (i < txt.length) {
                if (txt[i] == "\n") return -1;
                if (txt[i] == char) break;
                i++;
            }
        } else if (direction == "backward") {
            i -= 1;
            while (i >= 0) {
                if (txt[i] == "\n") return -1;
                if (txt[i] == char) break;
                i--;
            }
        }
        return i;
    }

    normal_mode(key) {
        if (typeof key == "string" && key >= 0) {
            this.num_multiplier += String(key);
        } else {
            this.last_searched = key;
            if (this.prefix == "f" || this.prefix == "t") {
                let idx = this.search_for(key, "forward");
                if (idx != -1) {
                    if (this.prefix == "f") {
                        this.find_location_and("move", ...this.get_row_col(idx));
                    } else if (this.prefix == "t") {
                        this.find_location_and("move", ...this.get_row_col(idx - 1));
                    }
                }
                this.prefix = "";
                return;
            }  else if (this.prefix == "F" || this.prefix == "T") {
                let idx = this.search_for(key, "backward");
                if (idx != -1) {
                    if (this.prefix == "F") {
                        this.find_location_and("move", ...this.get_row_col(idx));
                    } else if (this.prefix == "T") {
                        this.find_location_and("move", ...this.get_row_col(idx + 1));
                    }
                }
                this.prefix = "";
                return;
            }
            this.num_multiplier = Math.min(this.num_multiplier, 100);
            let amt = this.num_multiplier || 1;
            for (let i = 0; i < Number(amt); i++) { 
                // Entering insert mode
                if (key == "i") this.mode = "INSERT";
                else if (key == "I") {
                    let idx = this.start_of_line_idx(this.cursor.idx);
                    let [row, col] = this.get_row_col(idx);
                    this.find_location_and("move", row, col);
                    this.mode = "INSERT";
                }

                else if (key == "a") {
                    this.mode = "INSERT";
                    this.move_one_char("right");
                } else if (key == "A") {
                    let idx = this.end_of_line_idx(this.cursor.idx);
                    let [row, col] = this.get_row_col(idx);
                    this.find_location_and("move", row, col + 1);
                    this.mode = "INSERT"; 
                }

                else if (key == "v") this.mode = "VISUAL";

                else if (key == "f") {
                    this.prefix = "f";
                } else if (key == "F") {
                    this.prefix = "F";
                } else if (key == "t") {
                    this.prefix = "t";
                } else if (key == "T") {
                    this.prefix = "T";
                }
                else if (key == ";" && this.last_searched) {
                    let idx = this.search_for(this.last_searched, "forward");
                    this.find_location_and("move", ...this.get_row_col(idx));
                } else if (key == "," && this.last_searched) {
                    let idx = this.search_for(this.last_searched, "backward");
                    this.find_location_and("move", ...this.get_row_col(idx));
                }
               
                // Moving one char at a time
                else if (key == "h") this.move_one_char("left");
                else if (key == "j") this.move_one_char("down");
                else if (key == "k") this.move_one_char("up");
                else if (key == "l") this.move_one_char("right");

                // Moving to start or end of line

                else if (key == "^") {
                    let idx = this.start_of_line_idx(this.cursor.idx);
                    let [row, col] = this.get_row_col(idx);
                    this.find_location_and("move", row, col);
                } else if (key == "$") {
                    let idx = this.end_of_line_idx(this.cursor.idx);
                    let [row, col] = this.get_row_col(idx);
                    this.find_location_and("move", row, col);
                }

                // TODO REMOVE REPEATED CODE!
                    else if (key == "w") {
                        let idx = this.idx_of_next_word_at("right", "start");
                        if (this.prefix == "d") {
                            this.delete(this.cursor.idx, idx - this.cursor.idx);
                            this.prefix = "";
                        } else if (this.prefix == "") {
                            this.find_location_and("move", ...this.get_row_col(idx));
                        }

                    } else if (key == "e") {
                        let idx = this.idx_of_next_word_at("right", "end");
                        if (this.prefix == "d") {
                            this.delete(this.cursor.idx, idx - this.cursor.idx);
                            this.prefix = "";
                        } else if (this.prefix == "") {
                            this.find_location_and("move", ...this.get_row_col(idx));
                        }

                    } else if (key == "b") {
                        let idx = this.idx_of_next_word_at("left", "start");
                        if (this.prefix == "d") {
                            this.delete(idx, this.cursor.idx - idx);
                            this.prefix = "";
                            this.find_location_and("move", ...this.get_row_col(idx));
                        } else if (this.prefix == "") {
                            this.find_location_and("move", ...this.get_row_col(idx));
                        }
                    }

                // Deleting
                else if (key == "x") this.delete(this.cursor.idx, 1);
                else if (key == "d") {
                    this.prefix = "d";
                } else if (key == "D") {
                    let idx = this.end_of_line_idx(this.cursor.idx);
                    this.delete(this.cursor.idx, idx - this.cursor.idx);
                } 

                // Inserting lines
                else if (key == "o") {
                    this.insert_line("below")
                    this.mode = "INSERT"
                }
                else if (key == "O") {
                    this.insert_line("above")
                    this.mode = "INSERT"
                }

            }
            this.num_multiplier = "";
        }
    }

    visual_mode(key) {
        if (key === 27) this.mode = "NORMAL";
    }

    insert_line(option) {
        let txt = this.state.txt;
        if (option == "below") {
            if (this.on_last_row()) {
                txt.push("\n")
                this.move_one_char("down");
            } else {
                for (let i = this.cursor.idx; i < txt.length; i++) {
                    let c = txt[i];
                    if (c == "\n") {
                        this.move_cursor_to(...this.get_row_col(i));
                        break;
                    }
                }
                this.add_text("\n");
            }
        } else if (option == "above") {
            if (this.on_top_row()) {
                this.state.txt.unshift("\n");
                this.move_one_char("left");
            } else {
                this.move_one_char("up");
                this.insert_line("below");
            }
        }
    }

    move_one_char(dir) {
        let [idx, row, col] = [this.cursor.idx, this.cursor.row, this.cursor.col];
        if (dir == "left" && col > 1) {
            this.move_cursor_to(row, col - 1);

        } else if (dir == "right") {
            if (this.mode == "NORMAL" && idx < this.state.txt.length - 1) {
                this.move_cursor_to(row, col + 1);
            } else if (this.mode == "INSERT" && idx < this.state.txt.length) {
                this.move_cursor_to(row, col + 1);
            }

        } else if (dir == "up" && row > 1) {
            this.move_cursor_to(row - 1, col);

        } else if (dir == "down" && !this.on_last_row()) {
            this.move_cursor_to(row + 1, col);

        } 
    }

    get_row_col(idx) {
        let txt = this.state.txt;
        let row = 1; let col = 1;
        for (let i = 0; i < txt.length; i++) {
            if (i == idx) return [row, col];
            if (txt[i] == "\n") {row++; col = 1}
            else col++;
        }
        throw new Error("Not a valid index!");
    }

    // get the idx of the start, or end of the word before or after the cursor
    idx_of_next_word_at(dir, loc = "start") {
        let space_found = false;
        let txt = this.state.txt;
        let i = this.cursor.idx;
        let char_found;
        if (dir === "right") { 
            if (loc == "start") {
                while (i < txt.length) {
                    let c =  txt[i];
                    if ((space_found && c != "\n" && c != " ") ||
                        (txt[i + 1] == undefined)) {
                        return i;
                    }
                    if (c == " ") space_found = true;
                    i++;
                }

            } else if (loc == "end") {
                while (i < txt.length) {
                    let c =  txt[i];
                    if (char_found && (txt[i+1] == "\n" ||
                        txt[i+1] == " " ||
                        !txt[i+1])) {
                        return i ;
                    }
                    if (c != " " && c != "\n") char_found = true;
                    i++;
                }

            }
        }
        else if (dir === "left") {
            let char_found
            while (i >= 0) {
                let c =  txt[i];
                if (char_found && (txt[i-1] == "\n" ||
                    txt[i - 1] == " " ||
                    !txt[i-1])) {
                    return i;
                }
                if (c != " " && c != "\n") char_found = true;
                i--;
            }
        } 
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
        let curr_col = 1; // We start on col 1, but we initiate it in the loop
        let curr_row = 1; 
        let i = 0;
        for (; i < this.state.txt.length; i++) {
            token = this.state.txt[i]; // the current char at the given idx
            if (curr_row == row) {
                if (token == "\n" && this.mode == "NORMAL") {
                    break;
                } else if (curr_col === col) { 
                    break;
                } 
            } else {
                if (token == "\n") {
                    curr_row++;   // found new line, therefore,  we are on a new row
                    curr_col = 0; // reset column every time we go to new line
                }
            }
            curr_col++;
        }

        if (action == "index") {
            return match ? token : null;
        } else if (action == "move") {
            this.cursor.row = curr_row;
            this.cursor.col = curr_col;
            this.cursor.idx = i;
        }
    }

    on_top_row() {
        return this.get_row_col(this.cursor.idx)[0] == 1;
    }

    on_last_row() {
        let txt = this.state.txt;
        for (let i = this.cursor.idx; i < txt.length; i++) {
            if (txt[i] == "\n") return false;
        }
        return true;
    }

    get_char_at(row, col) {
        return this.find_location_and("index", row, col);
    }

    move_cursor_to(row, col) {
        this.find_location_and("move", row, col);
    }

    delete(start, amt) {
        // Avoid undefined pointers
        if (start >= 0 && start <= this.state.txt.length) {
            if (this.mode == "NORMAL") {
                if (this.state.txt[start] != "\n") {
                    this.state.txt.splice(start, amt);
                }
            } else if (this.mode == "INSERT") {

                if (this.state.txt[start] == "\n") {
                    this.move_cursor_to(this.cursor.row - 1, 1E7);  

                } else if (start < this.cursor.idx) {
                    this.cursor.idx--; this.cursor.col--;
                }

                this.state.txt.splice(start, amt);
            } else {
                alert("TODO IN DELETE")
            }

        }
    }

    handle_keystrokes(key) {
        // console.log(`vim key: ${key}`);
        if (this.mode == "NORMAL") this.normal_mode(key);
        else if (this.mode == "INSERT") this.insert_mode(key);
        else if (this.mode == "VISUAL") this.visual_mode(key);
    }

    save_text() {
        this.mode = "NORMAL"
        this.num_multiplier = "1"
        this.cursor = 
            {
                idx: -1, 
                width: 4,
                x: null,
                y: null,
                row: 1,
                col: 1,
                height: this.state.txt_size * 1.15,
                color: [57, 255, 20],
                opacity: 255,
            }
    }
}
