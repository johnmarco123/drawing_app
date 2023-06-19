// Manages the pages that the user has created
function PageBook() {

    // this.savedPages = [];
    this.selectedPage = null;
    this.currentPage = 1;
    let self = this;

    let loadPixelFromPage = function(pagedata) {
        loadPixels();
        pixels = pagedata;
        updatePixels();
    }

    let pageClicked = function() {
        // remove the old border
        let current = select(`#page${currentPage}`);
        current.style("border", "0");

        // get the pixel array from the page
        let page = this.pixels;

        // set the selected page
        self.selectedPage = page;

        loadPixelFromPage(page);

        //add a new border to the selected page
        this.style("border", "2px solid blue");
    }


    // load in the pages
    this.loadPages = function() {
        // const pageID = `page1`;
        // const page = createDiv();
        // const num = createP(0);
        //
        // loadPixels();
        // page.pixels = pixels;
        // page.class('pages');
        // page.id(pageID);
        // page.child(num);
        // page.mouseClicked(pageClicked)
        //
        // select("#pageBook").child(page);
        //
        //
        // select(".pages").style("border", "2px solid blue");
    };
    //call the loadcolors function now it is declared
    this.loadPages();
}
