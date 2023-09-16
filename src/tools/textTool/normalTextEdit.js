class NormalEdit {
    constructor(state, cursor) {
        this.state = state; // all the states in the normal text tool
        this.cursor = cursor; // the cursor that is 
        // all the characters that are not seperators.
        // seperators are chars like a space " ", a comma ",". Although there
        // are many more.
        this.chars = new Set("0123456789'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
    }

    // this is called with an array from the clipboard which is pasteable
    paste(data) {
        this.state.txt.splice(this.cursor.idx + 1, 0, ...data);
    }

    // returns the first character on the current cursor line
    firstCharOnLineIdx(idx) {
        let txt = this.state.txt;
        let i = idx;
        while (i > 0) {
            if (txt[i - 1] == "\n") {
                break; 
            }
            i--;
        }
        return i;
    }

    // returns the last character on the current cursor line
    lastCharOnLineIdx(idx) {
        let txt = this.state.txt;
        let i = idx;
        while (i < txt.length - 1) { 
            if (txt[i + 1] == "\n") {
                break;
            }
            i++
        }
        return i;
    }

    // moves the cursor to the given row, column.
    // if you try to access column 5000 on row 10 and there is only 50 columns
    // it will be capped to 50
    moveCursorTo(row, col) {
        let currRow = 1;
        let currCol = 1;
        let idx = 0;
        while (idx < this.state.txt.length) {
            let char = this.state.txt[idx];
            if (currRow == row && ((char == "\n" || currCol == col) || currCol >= col)) {
                this.cursor.idx = idx;
                this.cursor.row = currRow;
                this.cursor.col = currCol;
                return;
            } else if (char == "\n") {
                currRow++;
                currCol = 1;
            } else {
                currCol++;
            }
            idx++;
        }
    }

    // moves one character in either left, right up or down
    moveOneChar(dir) {
        let [idx, row, col] = [this.cursor.idx, this.cursor.row, this.cursor.col];
        if (dir == "left" && col > 1) {
            this.moveCursorTo(row, col - 1);

        } else if (dir == "right" && idx <= this.state.txt.length - 1) {
            this.moveCursorTo(row, col + 1);

        } else if (dir == "up" && row > 1) {
            this.moveCursorTo(row - 1, col);

        } else if (dir == "down" && !this.onLastRow()) {
            this.moveCursorTo(row + 1, col);

        } 
    }

    // returns [row, col] of the given index
    getRowCol(idx) {
        let txt = this.state.txt;
        let row = 1;
        let col = 1;
        for (let i = 0; i < txt.length; i++) {
            if (i == idx) return [row, col];
            if (txt[i] == "\n") {row++; col = 1}
            else col++;
        }
        throw new Error(`${idx} is not in the range 0 - ${this.state.txt.length - 1}`);
    }

    // adds text to the text array
    addText(char) {
        this.state.txt.splice(this.cursor.idx - 0, 0, char);
        this.cursor.idx++;
        if (char === "\n") { // We gotta move the cursor to the next line
            this.cursor.row++;
            this.cursor.col = 1;
        } else {
            this.cursor.col++;
        }
    }


    // returns true or false if the cursor is on the last row of the text
    onLastRow() {
        let txt = this.state.txt;
        for (let i = this.cursor.idx; i < txt.length; i++) {
            if (txt[i] == "\n") return false;
        }
        return true;
    }


    // deletes from start(inclusive) to start + amt(exclusive)
    delete(start, amt) {
        this.state.txt.splice(start, amt);
        this.cursor.idx = start;
    }

    
    // deletes one word behind the current cursor and moves the cursor
    deleteOneWordBackwards() {
        let foundChar = false;
        for (let i = this.cursor.idx, beforeCol = 0; i >= 0; i--, beforeCol++) {
            const char = this.state.txt[i];

            if (this.chars.has(char) && i != 0) {
                foundChar = true;

            } else if (foundChar) {
                // we just found the first nonchar character before the word and can end
                const start = i;
                const amt = this.cursor.idx - start;
                if (this.state.txt[start] == "\n") {
                    this.moveCursorTo(this.cursor.row, this.cursor.col - beforeCol + 1);
                    this.delete(start + 1, amt - 1);

                } else {
                    this.moveCursorTo(this.cursor.row, this.cursor.col - beforeCol);
                    this.delete(start, amt);
                }
                return;
            }
        }
    }

    // deletes one char behind the cursor and moves the cursor
    deleteOneCharBackwards() {
        const [start, amt] = [this.cursor.idx - 1, 1];
        const char = this.state.txt[start];
        if (start < this.cursor.idx) {
            if (char == "\n") {
                this.moveCursorTo(this.cursor.row - 1, 1E6);
            } else {
                this.moveCursorTo(this.cursor.row, this.cursor.col - 1);
            }
        }
        this.delete(start, amt); 
    }

    // deletes one word forward and moves the cursor forward afterwards
    deleteOneWordForwards() {
        let foundChar = false;
        for (let i = this.cursor.idx, afterCol = 0; i <= this.state.txt.length; i++, afterCol++) {
            const char = this.state.txt[i];

            if (this.chars.has(char) && i != this.state.txt.length) {
                foundChar = true;

            } else if (foundChar) {
                // we just found the first nonchar character before the word
                // and can end
                const start = this.cursor.idx;
                const end = i + 1;
                const amt = end - start;
                if (this.state.txt[end] == "\n") {
                    this.delete(start, amt - 1);
                } else {
                    this.delete(start, amt);

                }
                return;
            }
        }
    }

    // moves the cursor one word to the right
    moveOneWordLeft() {
        let charFound;
        let i = this.cursor.idx;
        while (i >= 0) {
            let char =  this.state.txt[i];
            if (charFound && !this.chars.has(this.state.txt[i -1])) {
                const [row, col] = this.getRowCol(i);
                this.moveCursorTo(row, col);
                return;
            }
            if (this.chars.has(char)) {
                charFound = true;
            }
            i--;
        }
    }

    // moves the cursor one word to the right
    moveOneWordRight() {
        let i = this.cursor.idx;
        let nonCharFound;
        while (i < this.state.txt.length) {
            let char =  this.state.txt[i];

            if (nonCharFound && 
                (!this.chars.has(char) || this.chars.has(this.state.txt[i + 1]))) {
                const [row, col] = this.getRowCol(i);
                this.moveCursorTo(row, col);
                return;
            }

            if (!this.chars.has(char)) {
                nonCharFound = true;
            }

            i++;
        }
    }

    // handles all keystrokes for the normal text editor can take in numbers
    // and/or letters which it gets from sketch.js
    handleKeystrokes(key) {
        if (typeof key == "number") { // command keys
            if (key == 8) { // BACKSPACE
                if (keyIsDown(CONTROL) && this.state.txt[this.cursor.idx - 1] != "\n") { // CTRL
                    this.deleteOneWordBackwards()
                } else {
                    this.deleteOneCharBackwards()
                }

            } else if (key == 46) { // DELETE KEY
                
                if (keyIsDown(CONTROL) && this.state.txt[this.cursor.idx] != "\n") {
                    this.deleteOneWordForwards()
                } else {
                    this.delete(this.cursor.idx, 1); // deletes one char forwards
                }

            } else if (key == 13) { // ENTER
                this.addText("\n");

            } else if (key == 35) { // END key
                const idx = this.lastCharOnLineIdx(this.cursor.idx);
                const [row, col] = this.getRowCol(idx + 1);
                this.moveCursorTo(row, col);

            } else if (key == 36) { // HOME key
                const idx = this.firstCharOnLineIdx(this.cursor.idx);
                const [row, col] = this.getRowCol(idx);
                this.moveCursorTo(row, col);

            } else if (key == 37) { // LEFT ARROW
                if (keyIsDown(CONTROL)) {
                    this.moveOneWordLeft();
                } else {
                    this.moveOneChar("left");
                }

            } else if (key == 38) { // UP ARROW
                this.moveOneChar("up");

            } else if (key == 39) { // RIGHT ARROW
                if (keyIsDown(CONTROL)) {
                    this.moveOneWordRight();
                } else {
                    this.moveOneChar("right"); 
                }

            } else if (key == 40) { // DOWN ARROW
                this.moveOneChar("down"); 

            }
        } else { // Non command keys
            this.addText(key);
        }
    }
}
