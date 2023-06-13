function MoveableLineTool(){
	//set an icon and a name for the object
	this.icon = "assets/moveableLine.jpg";
	this.name = "moveableLine";
    this.editMode = false;
    this.currentShape = [];
    var self = this

    this.draw = function(){
        updatePixels();
        function mousePressOnCanvas(canvas){
            if (mouseX > canvas.elt.offsetLeft &&
                mouseX < (canvas.elt.offsetLeft + canvas.width) &&
                mouseY > canvas.elt.offsetTop && 
                mouseY < (canvas.elt.offsetTop + canvas.height)
            ){
                return true
            }
            return false
        }
            if(mousePressOnCanvas(c) && mouseIsPressed){
                if(!self.editMode){
                    self.currentShape.push({
                        x:mouseX, 
                        y:mouseY
                    })
                } else {
                    for(let i = 0; i < self.currentShape.length; i++){
                        if(dist(self.currentShape[i].x, self.currentShape[i].y,
                            mouseX, mouseY) < 15){
                            self.currentShape[i].x = mouseX;
                            self.currentShape[i].y = mouseY
                        }
                    }
                }
            }

        loadPixels()
            noFill()
            beginShape();
            for(var i = 0; i < self.currentShape.length; i++){
                vertex(self.currentShape[i].x,
                    self.currentShape[i].y)
                if(self.editMode){
                    fill('red');
                    ellipse(self.currentShape[i].x,
                        self.currentShape[i].y, 10);
                    noFill();
                }
            }
            endShape()
    };

	this.unselectTool = function() {
		updatePixels();
        self.editMode = false;
        draw();
        self.currentShape = [];
		//clear options
		select(".options").html("");
	};

	this.populateOptions = function() {
        select(".options").html(
			"<button id='changingVerticies'>Edit shape</button> <button id='finishShape'>Finish shape</button>");
        // 	//click handler
        select("#changingVerticies").mouseClicked(function() {
            var button = select("#" + this.elt.id);
            if (self.editMode) {
                self.editMode = false;
                button.html("Edit Shape");
            } else {
                self.editMode = true;
                button.html("Add Verticies");
            }
        });
        select("#finishShape").mouseClicked(function() {
            self.editMode = false;
            draw();
            loadPixels();
            self.currentShape = [];
        });
    };
}
