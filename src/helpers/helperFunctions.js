function HelperFunctions() {

    // p5.dom click click events. Notice that there is no this. at the
    // start we don't need to do that here because the event will
    // be added to the button and doesn't 'belong' to the object

    // call loadPixels to update the drawing state
    // this is needed for the mirror tool
    select("#clearButton").mouseClicked(() => { 
        background(0); 
        loadPixels();
    });

    // event handler for the save image button. saves the canvsa to the
    // local file system
    select("#saveImageButton").mouseClicked(() => saveCanvas())

    // handles updating the canvas when the user goes fullscreen
    select("#fullscreen").mouseClicked(() => {
        let fs = fullscreen();
        windowResized();
        fullscreen(!fs);
        let current_canvas = get();
        // REQUIRED FOR FULLSCREEN TO FUNCTION THERE MUST BE A DELAY PRIOR TO
        // REFRESHING CANVAS!
            setTimeout(() => {
                background(0);
                image(current_canvas, 0, 0);
                loadPixels();
            }, 100)
    })

    // handles the drop down menu hiding and showing the side bar and bottom bar
    let hidden = false;
    select("#dropDown").mouseClicked(() => {
        let current_canvas = get();
        if (hidden) {
            select('#sidebar').show();
            select('.colorPalette').show();
            select('.options').show();
            select('.colorPalette').style("display", "flex");
            select('.wrapper').style( "grid-template-areas",
                '"header header header" "sidebar content content" "colorP colorP options"');
        } else {
            select('#sidebar').hide();
            select('.colorPalette').hide();
            select('.options').hide();
            select('.wrapper').style('grid-template-areas',
                '"header header header" "content content content" "content content content"')
        }
        windowResized()
        background(0);
        image(current_canvas, 0, 0);
        loadPixels();
        hidden = !hidden; // flip the hidden state
    });

    select("#tool-help").mouseClicked(() => {
        toolbox.swap_manual()
    })
}
