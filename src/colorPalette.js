function ColorPalette() {
    this.pos = createVector(80, innerHeight - 70);
    this.color_picker = createColorPicker('#ffffff');
    this.color_picker.position(this.pos.x, this.pos.y);
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
    this.capacity = 5; // the max allowed colors in our LRU cache this.colors
    CURRENT_COLOR = this.colors[0];
    fill(CURRENT_COLOR);
    stroke(CURRENT_COLOR);
    let self = this;

    let color_picker_changed_color = detect_maker();
    let swatch_changed = true; // by default we want to use the most recent swatch color

    this.draw = function() {
        handle_color_picker();
    }

    // every mousepress we check to see if the color pickers color
    // changed, if so we update the color being used
    function handle_color_picker() {
        if (mouseIsPressed && color_picker_changed_color()) {
            self.change_color();
        }
    }

    function detect_maker() {
        let old = self.color_picker.value(); 
        return () => {
            let curr = self.color_picker.value();
            let changed = curr != old;
            if (changed) {
                old = curr;
                CURRENT_COLOR = curr;
            }
            return changed;
        }
    }

    this.draw_swatches = function() {
        for (let i = 0; i < self.colors.length; i++) {
            let colorID = `color-${i}`;
            let curr = select("#" + colorID);
            curr.style("background-color", self.colors[i]);
            if (i == 0) {
                curr.style("border", "2px solid blue"); 
            }
        }
    }

    this.LRU_get_most_recent = () => this.colors[0]; 

    this.LRU_update = function(color) {
        // If color is already in the cache, move it to the front
        if (self.colors.includes(color)) { 
            let index = self.colors.indexOf(color);
            let value = self.colors.splice(index, 1);
            self.colors.unshift(value[0]); 
        } else {
            // if we are at capacity, remove the last element
            if (self.colors.length >= self.capacity) { 
                self.colors.pop();
            } 
            self.colors.unshift(color);
        }
        self.draw_swatches();
    }


    this.change_color = function() {
        if (String(CURRENT_COLOR) != String(self.LRU_get_most_recent())) {
            fill(CURRENT_COLOR);
            stroke(CURRENT_COLOR);
            self.LRU_update(CURRENT_COLOR);
        }
    }

    function colorClick() {
        let idx = this.id().split("color-")[1];
        CURRENT_COLOR = self.colors[idx];
        swatch_changed = true;
        self.change_color();
    }

    function initialize_swatches() {
        //for each color create a new div in the html for the colorSwatches
        for (let i = self.capacity - 1; i >= 0; i--) {
            let colorID = `color-${i}`; // rightmost color should be most recent
            //using p5.dom add the swatch to the palette and set its background color
            //to be the color value
            let color_swatch = createDiv()
            color_swatch.class('colorSwatches');
            color_swatch.id(colorID);
            select(".colorPalette").child(color_swatch);
            color_swatch.mouseClicked(colorClick);
        }
        self.draw_swatches();

    };
    initialize_swatches();
}
