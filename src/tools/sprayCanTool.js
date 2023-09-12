/*
    Sprays a cluster of random dots around the users cursor
*/
function SprayCanTool() {
    this.name = "Spray Can Tool"
    this.icon = "images/sprayCan.jpg"
    // this manual gets injected into the tool help for each tool, it must
    // be written in valid html
    this.manual = "1. Click the mouse and drag to spray paint on the canvas"
    this.points = 13
    this.spread = 10
    this.draw = () => {
        //if the mouse is pressed paint on the canvas
        //spread describes how far to spread the paint from the mouse pointer
        //points holds how many pixels of paint for each mouse press.
        if(mouseIsPressed){
            for(var i = 0; i < this.points; i++){
                point(random(mouseX-this.spread, mouseX + this.spread), 
                    random(mouseY-this.spread, mouseY+this.spread));
            }
        }
    }
};

