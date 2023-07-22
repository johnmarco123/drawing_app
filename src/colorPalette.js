function ColorPalette() {
    this.pos = createVector(80, innerHeight - 70);
    this.color_picker = createColorPicker('#ffffff');
    this.color_picker.position(this.pos.x, this.pos.y);
    // We use a LRU cache to handle the least recently used colors and discard
    // them
    this.colors = 
    [
        color(255, 255, 255),
        color(255, 0, 0),
        color(255, 255, 0),
        color(0, 255, 0),
        color(0, 0, 255),
    ];
    this.capacity = 5;
    this.current_color = this.color_picker.color();
    let self = this;

    let color_picker_color_changed = detect_maker();
    let swatch_changed = false;

    // if you switch colors with the color switcher thing tool
    // and then click on the canvas right after, it should use this value
    // but if you click on a swatch it should use the swatch value instead

    // but do we determine when the user changed the color with the color picker
    this.update = function() {
        if (mouseOnCanvas() && mouseIsPressed) {
            if (swatch_changed) {
                swatch_changed = false;
            } else if (color_picker_color_changed()) {
                self.current_color = self.color_picker.color();
            }
            if (String(self.current_color) != String(self.LRU_get_most_recent())) {
                fill(self.current_color);
                stroke(self.current_color);
                self.LRU_update(self.current_color);
            }
        }
        self.draw_swatches();
    }

    function detect_maker() {
        let old = null; // cache the color the user just picked recently
        return () => {
            let curr = self.color_picker.value();
            let changed = curr != old;
            if (changed) old = curr;
            return changed ? curr : false;
        }
    }

    this.draw_swatches = function() {
        for (let i = 0; i < self.colors.length; i++) {
            let colorID = `color-${i}`;
            select("#" + colorID).style("background-color", self.colors[i]);
        }
    }

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
    }

    this.LRU_get_most_recent = function() {
        return this.colors[0];
    }

    function colorClick() {
        let idx = this.id().split("color-")[1];
        self.current_color = self.colors[idx];
        swatch_changed = true;
    }

    function initialize_swatches() {
        //for each color create a new div in the html for the colorSwatches
        for (let i = self.capacity - 1; i >= 0; i--) {
            let colorID = `color-${i}`; // rightmost color should be most recent

            // set default fill color
            fill(self.current_color);
            stroke(self.current_color);
            //using p5.dom add the swatch to the palette and set its background color
            //to be the color value
            let color_swatch = createDiv()
            color_swatch.class('colorSwatches');
            color_swatch.id(colorID);

            select(".colorPalette").child(color_swatch);
            select("#" + colorID).style("background-color", "white");
            color_swatch.mouseClicked(colorClick)
        }

        select(".colorSwatches").style("border", "2px solid blue");
    };
    initialize_swatches();
}
