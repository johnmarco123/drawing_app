function starTool(){
	this.icon = "assets/star.png";
	this.name = "star";
	this.draw = function(){
        let starSize = select("#starSize").value()
        let numStars = select("#numStars").value()
        if(mouseIsPressed){
            for(var i = 0; i < numStars; i++){
                var starX = random(mouseX - starSize/2 - 10,
                    mouseX - starSize/2 + 10)

                var starY = random(mouseY - starSize/2 - 10,
                    mouseY - starSize/2 + 10)
                image(star, starX, starY, starSize, starSize);
            }
        }
    };
	this.unselectTool = function() {
		//clear options
        // updatePixels()
		select(".options").html("");
	};
	this.populateOptions = function() {
		select(".options").html(
            `Star size: 
            <input type='range'
            min='5' max='50' 
            value='20' class='slider'
            id='starSize'>

            Number of stars:
            <input type='range'
            min='1' max='20'
            value='5' class='slider'
            id='numStars'>
            `);
	};
}
