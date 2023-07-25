const mouseOnCanvas = () => mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height

const clearOptions = () => select(".tempOptions").html("");

const update_canvas = canvas => {
    image(canvas, 0, 0);
    loadPixels();
    updatePixels();
}
