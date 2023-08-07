const clearOptions = () => select(".tempOptions").html("");

document.addEventListener("mousemove", e => {
    MOUSE_ON_CANVAS = e.target.id == "p5Canvas"
});
