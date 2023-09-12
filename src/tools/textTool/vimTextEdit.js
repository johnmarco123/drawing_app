// a mode similar to vim with most of the essential vim macros.
class VimEdit {
    constructor(data, cursor) {
        // modes are normal, insert, command mode is ambitious
        this.mode = "NORMAL";          // the current mode (NORMAL or INSERT)
        this.state = data;             // the state from textTool.js
        this.numMultiplier = "1";      // the current multiplier for repeating actions
        // prefix for actions such as w (moves a word) can be prepended by d
        // (which which means delete) and we will therefore delete the next
        // word
        this.prefix = "";              
        // the last character that was searched for using the vim "f" command
        this.lastSearchedChar = null; 
        // the last search prefix can be (t, T, f, F) which determine direction
        // of the search
        this.lastSearchPrefix = "";
        // all the cursor data from textTool.js
        this.cursor = cursor
    }

    // the main draw function for this function that calls everything neccacary
    // except for keys.
    draw() {
        // only allow the draw loop if we are in the typing state
        if (this.state.typing) {
            push();

            if (this.mode == "NORMAL") { 
                this.cursor.width = 12;
                this.cursor.opacity = 150;
            } else if (this.mode == "INSERT") {
                this.cursor.width = 4;
                this.cursor.opacity = 255;
            }

            noStroke();
            textSize(35);
            text(this.mode, 50, 50); // displays the current mode we are in
            pop();
        }
    }

    // allows pasting into the text box
    paste(data) {
        this.state.txt.splice(this.cursor.idx + 1, 0, ...data);
    }


    // handles all key inputs we need for insert mode
    insertMode(key) {
        if (typeof key == "number") { // command keys
            if (key == 27) { // ESC
                this.mode = "NORMAL"; 
                this.moveOneChar("left");

            } else if (key == 13) { // enter
                this.addText("\n"); 

            } else if (key == 8) { // backspace
                this.delete(this.cursor.idx - 1, 1); 

            }
        } else { // Non command keys
            this.addText(key);
        }
    }

    // returns the index of the first character on the current "idx's" line
    firstCharOnLineIdx(idx) {
        const txt = this.state.txt;
        let i = idx;
        while (i > 0) {
            if (txt[i - 1] == "\n") {
                break; 
            }
            i--;
        }
        return i;
    }

    // returns the index of the last character on the current "idx's" line
    lastCharOnLineIdx(idx) {
        let txt = this.state.txt;
        let i = idx;
        while (i < txt.length - 1) { 
            if (txt[i + 1] == "\n") break;
            i++
        }
        return i;
    }

    // this function is used for searching for a character forward or backward
    // given a char and a direction it will search in the given direction
    // for that char.
    findChar(char, direction) {
        const txt = this.state.txt;
        let i = this.cursor.idx;
        if (direction == "forward") {
            i++; // skip current occurance incase if on the same char
            while (i < txt.length) {
                let curr = txt[i];
                if (curr == "\n") {
                    return -1;
                } else if (curr == char) {
                    break;
                }
                i++;
            }
        } else if (direction == "backward") {
            i--; 
            while (i >= 0) {
                let curr = txt[i];
                if (curr == char) {
                    break;
                } else if (curr == "\n" || i == 0) {
                    return -1;
                }
                i--;
            }
        }
        return i;
    }

    // returns whether the adjacent character in either direction is equal to 
    // the current char
    adjCharIs(char) {
        return this.state.txt[this.cursor.idx + 1] == char || 
               this.state.txt[this.cursor.idx - 1] == char;
    }

    // calls the appropriate functions for finding a char given the char and
    // the prefix
    handleSearching(char, prefix) {
        let add = 0;
        let direction = "forward"
        if (prefix == "F") {
            direction = "backward";
        } else if (prefix == "T") {
            if (this.adjCharIs(char)) {
                this.moveOneChar("left");
            }
            direction = "backward";
            add = 1;
        } else if (prefix == "t") {
            if (this.adjCharIs(char)) {
                this.moveOneChar("right");
            }
            add = -1;
        } 
        let idx = this.findChar(char, direction);
        if (idx != -1) {
            this.findLocationAnd("move", ...this.getRowCol(idx + add));
        } else {
        }
    }

    // repeat the last search that was done on the same char that was searched
    // for
    repeatLastSearch(str) {
        if (str == "reversed") {
            let newPrefix = this.invertCapitalization(this.lastSearchPrefix);
            this.handleSearching(this.lastSearchedChar, newPrefix);
        } else {
            this.handleSearching(this.lastSearchedChar, this.lastSearchPrefix);
        }
    }

    // simply just switches from uppercase to lowercase or lowercase to uppercase
    invertCapitalization(char) {
        return String.fromCharCode(char.charCodeAt() ^ 32);
    }

    // inverts capitalization at the given index
    capitalizeChar(idx) {
        const char = this.state.txt[idx] 
        return this.invertCapitalization(char);
    }

    // handles all keystrokes for normal mode
    normalMode(key) {
        if (typeof key == "string" && key >= 0) { 
            this.numMultiplier += String(key);
        } else {
            if (this.prefix == "r") { // prefix for changing the char currently under the cursor
                this.state.txt[this.cursor.idx] = key;
                this.prefix = "";
                return;
            }
            // prefixes for searching allows searching for the next typed char
            if (this.prefix == "f" || this.prefix == "t" || this.prefix == "F" || this.prefix == "T") {
                let prefix = this.prefix;          // save prefix before deleting it
                this.lastSearchPrefix = prefix;    // we set the last search prefix
                this.prefix = "";                  // now that we have searched the prefix has been consumed
                this.lastSearchedChar = key;       // we remember the last searched for char
                this.handleSearching(key, prefix);
                return;
            }
            //
            // we dont allow multipliers over 100 as it may break the program
            this.numMultiplier = Math.min(this.numMultiplier, 100);
            const amt = this.numMultiplier || 1; // the current amount of times we will perform the given action
            for (let i = 0; i < Number(amt); i++) { 
                // ********************
                // ENTERING INSERT MODE
                // ********************
                if (key == "i") { // enters insert mode to the left of the cursor
                    this.mode = "INSERT";

                } else if (key == "I") { // enters insert mode at the first char of the current line
                    let idx = this.firstCharOnLineIdx(this.cursor.idx);
                    let [row, col] = this.getRowCol(idx);
                    this.findLocationAnd("move", row, col);
                    this.mode = "INSERT";

                } else if (key == "a") { // enters insert mode to the right of the cursor
                    this.mode = "INSERT";
                    this.moveOneChar("right");

                } else if (key == "A") { // enters insert mode after the last char on the current line
                    let idx = this.lastCharOnLineIdx(this.cursor.idx);
                    let [row, col] = this.getRowCol(idx);
                    this.findLocationAnd("move", row, col + 1);
                    this.mode = "INSERT"; 
                }

                // ************************
                // SEARCHING FOR CHARACTERS
                // ************************

                else if (key == "f") {
                    this.prefix = "f";

                } else if (key == "F") {
                    this.prefix = "F";

                } else if (key == "t") {
                    this.prefix = "t";

                } else if (key == "T") {
                    this.prefix = "T";

                } else if (key == ";" && this.lastSearchedChar) { // repeats the last search
                    this.repeatLastSearch();

                // repeats the last search inversed, so if we searched forwards
                    // this will search backwards
                } else if (key == "," && this.lastSearchedChar) { 
                    this.repeatLastSearch("reversed");
                }


                // ********************
                // REPLACING CHARACTERS
                // ********************
                else if (key == "r") {
                    this.prefix = "r";
                }


                // *************************
                // MOVING ONE CHAR AT A TIME
                // *************************
                else if (key == "h") {
                    this.moveOneChar("left");

                } else if (key == "j") {
                    this.moveOneChar("down");

                } else if (key == "k") {
                    this.moveOneChar("up");

                } else if (key == "l") {
                    this.moveOneChar("right");
                }

                // ***********************
                // CAPITALIZING CHARACTERS
                // ***********************
                else if (key == "~") { // inverts capitalization
                    const invertedChar = this.capitalizeChar(this.cursor.idx);
                    this.state.txt[this.cursor.idx] = invertedChar
                    this.moveOneChar("right");
                }

                // **********************************************
                // MOVING TO THE START OR END OF THE CURRENT LINE
                // **********************************************
                else if (key == "^") {
                    let idx = this.firstCharOnLineIdx(this.cursor.idx);
                    let [row, col] = this.getRowCol(idx);
                    this.findLocationAnd("move", row, col);
                } else if (key == "$") {
                    let idx = this.lastCharOnLineIdx(this.cursor.idx);
                    let [row, col] = this.getRowCol(idx);
                    this.findLocationAnd("move", row, col);
                }

                // **************************************
                // MOVING AND DELETING ONE WORD AT A TIME
                // **************************************

                // moves one word forward at a time ending at the first char of
                // the next word
                    else if (key == "w") { 
                        let idx = this.idxOfNextWordAt("right", "start");
                        // if the prefix is d, we delete it rather then move to
                        // it
                        if (this.prefix == "d") {
                            this.delete(this.cursor.idx, idx - this.cursor.idx);
                            this.prefix = "";
                        } else if (this.prefix == "") {
                            this.findLocationAnd("move", ...this.getRowCol(idx));
                        }

                    // moves one word forward at a time ending at the last char
                    // of the next word
                    } else if (key == "e") {
                        let idx = this.idxOfNextWordAt("right", "end");
                        // if the prefix is d, we delete it rather then move to
                        // it
                        if (this.prefix == "d") {
                            this.delete(this.cursor.idx, idx - this.cursor.idx);
                            this.prefix = "";
                        } else if (this.prefix == "") {
                            this.findLocationAnd("move", ...this.getRowCol(idx));
                        }

                    // moves one word backwards at a time and stops at the
                    // first char of the word
                    } else if (key == "b") {
                        let idx = this.idxOfNextWordAt("left", "start");
                        // if the prefix is d, we delete it rather then move to
                        // it
                        if (this.prefix == "d") {
                            this.delete(idx, this.cursor.idx - idx);
                            this.prefix = "";
                            this.findLocationAnd("move", ...this.getRowCol(idx));
                        } else if (this.prefix == "") {
                            this.findLocationAnd("move", ...this.getRowCol(idx));
                        }
                    }

                // ***************************
                // DELETING ONE CHAR AT A TIME
                // ***************************
                else if (key == "x") {
                    let endOfLineIdx = this.lastCharOnLineIdx(this.cursor.idx);
                    this.delete(this.cursor.idx, 1);
                    if (endOfLineIdx == this.cursor.idx) {
                        this.moveOneChar("left");
                    }

                }

                // *****************
                // DELETION PREFIXES
                // *****************
                else if (key == "d") {
                    this.prefix = "d";
                } else if (key == "D") {
                    let idx = this.lastCharOnLineIdx(this.cursor.idx);
                    this.delete(this.cursor.idx, idx - this.cursor.idx);
                } 

                // ***********************************************
                // INSERTING LINES BELOW OR ABOVE THE CURRENT LINE
                // ***********************************************
                else if (key == "o") {
                    this.insertLine("below")
                    this.mode = "INSERT"
                }
                else if (key == "O") {
                    this.insertLine("above")
                    this.mode = "INSERT"
                }

            }
            // after each call in normal mode we reset the number multiplier
            this.numMultiplier = "";
        }
    }

    // inserts lines above or below the current cursor line position
    insertLine(option) {
        const txt = this.state.txt;
        if (option == "below") {
            if (this.onLastRow()) {
                txt.push("\n")
                this.moveOneChar("down");
            } else {
                for (let i = this.cursor.idx; i < txt.length; i++) {
                    const c = txt[i];
                    if (c == "\n") {
                        this.moveCursorTo(...this.getRowCol(i));
                        break;
                    }
                }
                this.addText("\n");
            }
        } else if (option == "above") {
            if (this.onTopRow()) {
                this.state.txt.unshift("\n");
                this.moveOneChar("left");
            } else {
                this.moveOneChar("up");
                this.insertLine("below");
            }
        }
    }

    // moves one character up, down, left or right
    moveOneChar(dir) {
        let [idx, row, col] = [this.cursor.idx, this.cursor.row, this.cursor.col];
        if (dir == "left" && col > 1) {
            this.moveCursorTo(row, col - 1);

        } else if (dir == "right") {
            if (this.mode == "NORMAL" && idx < this.state.txt.length - 1) {
                this.moveCursorTo(row, col + 1);
            } else if (this.mode == "INSERT" && idx < this.state.txt.length) {
                this.moveCursorTo(row, col + 1);
            }

        } else if (dir == "up" && row > 1) {
            this.moveCursorTo(row - 1, col);

        } else if (dir == "down" && !this.onLastRow()) {
            this.moveCursorTo(row + 1, col);

        } 
    }

    // given an index, returns the row and column that this index is on
     getRowCol(idx) {
        let txt = this.state.txt;
        let row = 1; let col = 1;
        for (let i = 0; i < txt.length; i++) {
            if (i == idx) {
                return [row, col];
            } else if (txt[i] == "\n") {
                row++;
                col = 1;
            }
            else col++;
        }
         // if we rreach here we want to throw an error so that we know we went
         // out of bounds and so we stop the execution of the function that
         // called this
        throw new Error(`${idx} is not in the range 0 - ${this.state.txt.length - 1}`);
    }

    // get the idx of the start, or end of the word before or after the cursors
    // current location
    idxOfNextWordAt(dir, loc = "start") {
        let spaceFound = false;
        let txt = this.state.txt;
        let i = this.cursor.idx;
        let charFound;
        if (dir === "right") {
            if (loc == "start") {
                while (i < txt.length) {
                    let c =  txt[i];
                    if ((spaceFound && c != "\n" && c != " ") ||
                        (txt[i + 1] == undefined)) {
                        return i;
                    }
                    if (c == " ") spaceFound = true;
                    i++;
                }

            } else if (loc == "end") {
                while (i < txt.length) {
                    let c =  txt[i];
                    if (charFound && (txt[i+1] == "\n" ||
                        txt[i+1] == " " ||
                        !txt[i+1])) {
                        return i ;
                    }
                    if (c != " " && c != "\n") charFound = true;
                    i++;
                }

            }
        }
        else if (dir === "left") {
            let charFound
            while (i >= 0) {
                let c =  txt[i];
                if (charFound && (txt[i-1] == "\n" ||
                    txt[i - 1] == " " ||
                    !txt[i-1])) {
                    return i;
                }
                if (c != " " && c != "\n") charFound = true;
                i--;
            }
        } 
    }

    // adds text to the text array
    addText(char) {
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

    // finds the location of the given row, col and performs the given action
    // of either 
    // index: returns the index
    // or
    // move: moves to the location
    findLocationAnd(action, row, col) {
        let token;
        let currCol = 1; // We start on col 1, but we initiate it in the loop
        let currRow = 1; 
        let i = 0;
        for (; i < this.state.txt.length; i++) {
            token = this.state.txt[i]; // the current char at the given idx
            if (currRow == row) {
                if (token == "\n" && this.mode == "NORMAL") {
                    break;
                } else if (currCol === col) { 
                    break;
                } 
            } else {
                if (token == "\n") {
                    currRow++;   // found new line, therefore,  we are on a new row
                    currCol = 0; // reset column every time we go to new line
                }
            }
            currCol++;
        }

        if (action == "index") {
            return match ? token : null;
        } else if (action == "move") {
            this.cursor.row = currRow;
            this.cursor.col = currCol;
            this.cursor.idx = i;
        }
    }

    // whether or not the current cursor position is on the top row of the text
    // area
    onTopRow() {
        return this.getRowCol(this.cursor.idx)[0] == 1;
    }

    // whether or not the current cursor position is on the last row of the text
    // area
    onLastRow() {
        let txt = this.state.txt;
        for (let i = this.cursor.idx; i < txt.length; i++) {
            if (txt[i] == "\n") return false;
        }
        return true;
    }

    // gets the character at the given row, col
    getCharAt(row, col) {
        return this.findLocationAnd("index", row, col);
    }

    // moves to the given row, col
    moveCursorTo(row, col) {
        this.findLocationAnd("move", row, col);
    }

    // deletes from start to start + amt
    delete(start, amt) {
        // Avoid undefined pointers
        if (start >= 0 && start <= this.state.txt.length) {
            if (this.mode == "NORMAL") {
                if (this.state.txt[start] != "\n") {
                    this.state.txt.splice(start, amt);
                }
            } else if (this.mode == "INSERT") {

                if (this.state.txt[start] == "\n") {
                    this.moveCursorTo(this.cursor.row - 1, 1E7);  

                } else if (start < this.cursor.idx) {
                    this.cursor.idx--; this.cursor.col--;
                }

                this.state.txt.splice(start, amt);
            } else {
                alert("TODO IN DELETE")
            }

        }
    }

    // sends the keystrokes recieves to the appropriate functions depending
    // upon what mode the user is currently in
    handleKeystrokes(key) {
        if (this.mode == "NORMAL") this.normalMode(key);
        else if (this.mode == "INSERT") this.insertMode(key);
    }

    // when saving text we need to reset our variables for the next time the
    // user enters vim mode
    saveText() {
        this.mode = "NORMAL"
        this.numMultiplier = "1"
    }
}
