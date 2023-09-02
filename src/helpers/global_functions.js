// clears the options for the current tool
const clearOptions = () => select(".tempOptions").html("");

// detects and updates whether the mouse is on the canvas
document.addEventListener("mousemove", e => MOUSE_ON_CANVAS = e.target.id == "p5Canvas");
