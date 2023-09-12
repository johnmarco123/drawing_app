function HelperFunctions() {
    // p5.dom click click events. Notice that there is no this. at the
    // start we don't need to do that here because the event will
    // be added to the button and doesn't 'belong' to the object

    for (let i = 0; i < 2; i++) {
        // call loadPixels to update the drawing state
        // this is needed for the mirror tool
        selectAll(".clearButton")[i].mouseClicked(() => { 
            background(0); 
            loadPixels();
        });

        // event handler for the save image button. saves the canvas to the
        // users local file system
        selectAll(".saveImageButton")[i].mouseClicked(() => saveCanvas())

        // changes the size of the window for the user to fullscreen
        selectAll(".fullscreen")[i].mouseClicked(() => {
            const currentCanvas = get(); // we get the current canvas's state
            const fs = fullscreen();     // we gather the current fullscreen state
            fullscreen(!fs);             // and change the full screen state to the opposite
            
            // DO NOT REMOVE! THIS IS REQUIRED FOR FULLSCREEN TO FUNCTION AS THERE
            // MUST BE A DELAY PRIOR TO REFRESHING CANVAS!
                setTimeout(() => {
                    // after the delay we set the background to black
                    background(0);
                    // and add the image of the old canvas on top of that
                    image(currentCanvas, 0, 0);
                    // we then call loadPixels so it is visible
                    loadPixels();
                }, 100)
        })

        // when the tool help button is clicked we want to swap the manual to the
        // currently clicked tool
        selectAll(".tool-help")[i].mouseClicked(() => toolbox.swapManual())

        // if keybindings is clicked we want to show the keybindings for our
        // program in the same manual area
        selectAll(".Keybindings")[i].mouseClicked(() => toolbox.showKeybindings())

        selectAll(".undo")[i].mouseClicked(() => undo.goBack());
        selectAll(".redo")[i].mouseClicked(() => undo.goForward());
}

    // at the start we set hidden to false, as we show the sidebar and bottom
    // bar when the user first goes onto the program
    let hidden = false;
    // handles the drop down menu hiding and showing the side bar and bottom bar
    select("#dropDown").mouseClicked(() => {
        toolbox.tempDisableTool(); // we disable the current tool
        const currentCanvas = get(); // we save the current canvas's state
        if (hidden) { // if the menu is hidden, we reveal it
            select('#sidebar').show();
            select('.colorPalette').show();
            select('.options').show();
            select('.colorPalette').style("display", "flex");
            select('.wrapper').style( "grid-template-areas",
                '"header header header" "sidebar content content" "colorP colorP options"');
        } else { // if the menu is currently revealed we hide it
            select('#sidebar').hide();
            select('.colorPalette').hide();
            select('.options').hide();
            select('.wrapper').style('grid-template-areas',
                '"header header header" "content content content" "content content content"')
        }
        windowResized()             // we then resize the window accordingly
        background(0);              // set the background to black
        image(currentCanvas, 0, 0); // and re add the old canvas on top
        loadPixels();               // we then call loadPixels so it is all visible
        // finally we flip the hidden variable to invert the hidden status for
        // the next time the button is clicked
        hidden = !hidden;           
    });

}
