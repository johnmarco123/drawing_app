/* 
     draws stars at the given cursor when the mouse is pressed 
*/
function StarTool(){
    // set the REQUIRED icon, name and manual for the tool.
	this.icon = "images/star.png";
	this.name = "Star";
    this.manual = `
        <ol>
            <li>Click and drag to place the image</li>
            <li>You can change ths slider values to alter the image size and amount</li>
            <li>You can also select your own image to place</li>
        </ol>
    `;
    this.star = null;
    loadImage('images/star.png', img =>  this.star = img);

    // the main draw function for this tool
	this.draw = () => {
        if(MOUSE_ON_CANVAS && mouseIsPressed){
            const starSize = select("#starSize").value();
            const numStars = select("#numStars").value();
            for(let i = 0; i < numStars; i++){
                const starX = random(mouseX - starSize/2 - 10, mouseX - starSize/2 + 10);
                const starY = random(mouseY - starSize/2 - 10, mouseY - starSize/2 + 10);
                image(this.star, starX, starY, starSize, starSize);
            }
        }
    };

	this.populateOptions = () => {
		select(".tempOptions").html(
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
