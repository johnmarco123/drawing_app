function ColorPalette() {
    // the color picker html element hard coded in index.html
    this.colorPicker = select("#color-picker"); 

    // We use a least recently used cache (LRU) to handle the least recently
    // used colors and discard them
    this.colors = 
        [
            color(255, 255, 255), // white
            color(255, 0, 0),     // red
            color(255, 255, 0),   // yellow
            color(0, 255, 0),     // green
            color(0, 0, 255),     // blue
        ];
    // max possible capacity is 9 as we allow quick color switching with 1-9
    this.capacity = 5; // the max allowed colors in our LRU cache this.colors

    // we keep track of the current color for the entire program here in the
    // CURRENT_COLOR global variable
    // We initially set its color to white
    CURRENT_COLOR = this.colors[0]; 
    // we set the fill color to the CURRENT_COLOR
    fill(CURRENT_COLOR);
    // and we also set the stroke weight to the CURRENT_COLOR aswell
    stroke(CURRENT_COLOR);

    // the color swatches cannot access this so we save it here so they can
    // reference it when they need it
    const self = this;

    // this is used to detect when the color gets switched. We compare the 
    // current color to the old color to see when a color switch has occured
    // and then update the global variable CURRENT_COLOR accordingly
   
    // old is the previous color that was used
    let old = this.colorPicker.value(); 
     this.colorPickerChangedColor = () => {
        const curr = this.colorPicker.value();
        const changed = curr != old;
        if (changed) {
            old = curr;
            CURRENT_COLOR = color(curr);
        }
        return changed;
    }

    // the main draw loop
    this.draw = () => {
        // it only runs when the mouse is pressed and the color is changed
        if (mouseIsPressed && this.colorPickerChangedColor()) {
            // this changes the color of the currently used color and also adds
            // it to the LRU swatches
            this.changeColor();
        }
    }

    // if the current color is not the most recent color, then we know for
    // sure that the color has been switched so we change the current color
    this.changeColor = () => {
        if (String(CURRENT_COLOR) != String(this.LRUGetMostRecent())) {
            fill(CURRENT_COLOR);
            stroke(CURRENT_COLOR);
            this.LRUUPdate(CURRENT_COLOR);
        }
    }

    // updates the LRU cache making the most recently used color in the front
    // and the least recently used color in the back. it also removes colors
    // once they have been not used for the LRU capacity limit
    this.LRUUPdate = (color) => {
        // If color is already in the cache, move it to the front
        if (this.colors.includes(color)) { 
            const index = this.colors.indexOf(color);
            const value = this.colors.splice(index, 1);
            this.colors.unshift(value[0]); 
        } else { // if the color is not in the current list of colors
            // if we are at capacity, remove the last element
            if (this.colors.length >= this.capacity) { 
                this.colors.pop();
            } 
            // we add the color to the list since it is not currently in the list
            this.colors.unshift(color); 
        }
        // we then draw the swatches again to update their order
        this.drawSwatches();
    }

    // returns the most recently used color in the LRU cache
    this.LRUGetMostRecent = () => this.colors[0]; 

    // when a color swatch is clicked it calls this function which changes
    // the current color to the color to the color that was clicked
    function colorClick() {
        const idx = this.id().split("color-")[1];
        CURRENT_COLOR = self.colors[idx];
        self.changeColor();
    }

    // this is used to draw each of the swatches
    this.drawSwatches = () =>{
        for (let i = 0; i < this.colors.length; i++) {
            const colorID = `color-${i}`;
            const curr = select("#" + colorID);
            curr.style("background-color", this.colors[i]);
            if (i == 0) {
                curr.style("border", "2px solid blue"); 
            }
        }
    }

    // this function is used to initialize the swatches
    (function initializeSwatches() {
        //for each color create a new div in the html for the colorSwatches
        for (let i = self.capacity - 1; i >= 0; i--) {
            const colorID = `color-${i}`; // rightmost color should be most recent
            //using p5.dom add the swatch to the palette and set its background color
            //to be the color value
            const colorSwatch = createDiv()
            colorSwatch.class('colorSwatches');
            colorSwatch.id(colorID);
            select(".colorPalette").child(colorSwatch);
            colorSwatch.mouseClicked(colorClick);
        }
        self.drawSwatches();

    })(); // immediately call the function once it is created
}
