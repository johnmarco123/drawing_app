const clearOptions = () => select(".tempOptions").html("");

const update_canvas = canvas => {
    image(canvas, 0, 0);
    loadPixels();
    updatePixels();
}

document.addEventListener("mousemove", e => {
    MOUSE_ON_CANVAS = e.target.id == "p5Canvas"
});
