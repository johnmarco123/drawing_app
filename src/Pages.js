// Manages the pages that the user has created
function PageBook() {

    this.pages = [];
    this.currentPage = 1;
	var self = this;

	var colorClick = function() {
		//remove the old border
		var current = select("#" + self.selectedPage + "page");
		current.style("border", "0");

		//get the new color from the id of the clicked element
		var c = this.id().split("page")[0];

		//set the selected color and fill and stroke
		self.selectedPage = c;
		fill(c);
		stroke(c);

		//add a new border to the selected color
		this.style("border", "2px solid blue");
	}

    function addPage() {
        console.log(pixels);
    }

	// load in the pages
	this.loadPages = function() {
        // set the canvas to be page 1 (idx 0) on startup
        addPage(0);

		//for each color create a new div in the html for the colorSwatches
		for (var i = 0; i < this.pages.length; i++) {
			var pageID = this.pages[i] + "page";

			//using p5.dom add the swatch to the palette and set its background color
			//to be the color value.
			var colorSwatch = createDiv()
			colorSwatch.class('colorSwatches');
			colorSwatch.id(colorID);

			select("#pages").child(colorSwatch);
			select("#" + colorID).style("background-color", this.colors[i]);
			colorSwatch.mouseClicked(colorClick)
		}

		select(".colorSwatches").style("border", "2px solid blue");
	};
	//call the loadcolors function now it is declared
	this.loadPages();
}
