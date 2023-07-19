function HelperFunctions() {

    //p5.dom click click events. Notice that there is no this. at the
    //start we don't need to do that here because the event will
    //be added to the button and doesn't 'belong' to the object

    select("#clearButton").mouseClicked(function() {
        background(0);

        //call loadPixels to update the drawing state
        //this is needed for the mirror tool
        loadPixels();
    });

    //event handler for the save image button. saves the canvsa to the
    //local file system.
        select("#saveImageButton").mouseClicked(function() {
            saveCanvas();	
        });

    select("#fullscreen").mouseClicked(function() {
        let fs = fullscreen();
        fullscreen(!fs);
        windowResized();
    })
    // ================================================================= 
    // =================CURRENTLY DISABLED FOR BUG FIXING===============
    // ================================================================= 
    select("#dropDown").mouseClicked(function() {
        alert("CURRENTLY DISABLED FOR BUG FIXING!");
        // if (hidden) {
        //     select('#sidebar').show();
        //     select('.colorPalette').show();
        //     select('.options').show();
        //     select('.colorPalette').style("display", "flex");
        //     select('.wrapper').style( "grid-template-areas",
        //         '"header header header" "sidebar content content" "colorP colorP options"');
        // } else {
        //     // select('#sidebar').hide();
        //     select('.colorPalette').hide();
        //     select('.options').hide();
        //     select('.wrapper').style('grid-template-areas',
        //         '"header header header" "content content content" "content content content"')
        // }
        // windowResized()
        // hidden = !hidden;
    });
}

const mouseOnCanvas = () => mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height

function clearOptions() {
    select(".tempOptions").html("")
}
