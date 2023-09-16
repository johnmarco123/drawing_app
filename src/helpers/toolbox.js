// container object for storing the tools
// Functions to add new tools, select a new tool 
// and display the manual for the selected tool
function Toolbox() {
    this.tools = [];            // this holds all the tools that the user can use
    this.selectedTool = null;   // the tool currently being used

    /* variables for the manual */
    this.transitioning = false; // if the manual is transitioning currently
    this.visible = true;        // if the manual is currently visible
    this.manual = null;         // this holds the html for the current manual

    // how long per interval tick until we increase or decrease opacity of the manual
    this.fadeTime = 5; 

    // tools dont have access to this so we save it here so they can have
    // access to it when they need to
    const self = this; 

    // the button on the manual that allows for it to close
    const escapeButton = `<button onclick="toolbox.hideManual()">X</button>`

    // when a tool is clicked this function gets fired. It highlights the
    // selected tool and also selects it
    function toolbarItemClick() {

        // remove any existing borders
        const items = selectAll(".sideBarItem");

        // we set each items border to be nothing
        items.forEach(item => item.style("border", "0"));

        // the tool that is currently being clickeds name
        const toolName = this.id().split("sideBarItem")[0];

        // we set the current tool to be the tool that currently got clicked
        self.selectTool(toolName);


        // we then update the manuals contents so that it can display the
        // information for this new tool
        updateManualContents();

        // call loadPixels to make sure most recent changes from previous tools
        // are saved to pixel array
        loadPixels();
    }

    // add a new tool icon to the html page
    function addToolIcon(icon, name) {
        const sideBarItem = createDiv("<img src='" + icon + "'></div>");
        sideBarItem.class('sideBarItem')
        sideBarItem.id(name + "sideBarItem")
        sideBarItem.parent('sidebar');
        sideBarItem.mouseClicked(toolbarItemClick);
    };

    // add a tool to the tools array
    this.addTool = tool => {
        //check that the object tool has an icon, name and a manual
        if (!tool.hasOwnProperty("icon") ||
            !tool.hasOwnProperty("name") ||
            !tool.hasOwnProperty("manual")) {

            alert("make sure your tool has a name, icon and a manual!");
        }
        this.tools.push(tool);
        addToolIcon(tool.icon, tool.name);
        // if no tool is selected (ie. none have been added so far)
        // make this tool the selected one.
            if (!this.selectedTool) {
                this.selectTool(tool.name);
            }
    };

    // adds {1, 2, ... n}  tools to the toolbox
    this.addTools = (...tools) => tools.forEach(tool => this.addTool(new tool));

    this.selectTool = function(toolName) {
        //search through the tools for one that's name matches
        //toolName
        for (let tool of this.tools) {
            if (tool.name == toolName) {
                //if the tool has an unselectTool method run it.
                    if (this.selectedTool != null && this.selectedTool.hasOwnProperty("unselectTool")) {
                        this.selectedTool.unselectTool();
                        select(".tempOptions").html("");
                    }
                //select the tool and highlight it on the toolbar
                this.selectedTool = tool;
                select("#" + toolName + "sideBarItem").style("border", "2px solid blue");

                //if the tool has a populateOptions area. Populate it now.
                    if (this.selectedTool.hasOwnProperty("populateOptions")) {
                        this.selectedTool.populateOptions();
                    }
            }
        }
    };

    // initializes the manual div and hides it
     this.initializeManual = visible => {
         // we set the visibility to the provided value
         // we create the manual
         self.manual = createDiv()
         self.manual.id("manual");
         self.manual.html(`
             ${escapeButton}
                 <h1>Welcome!</h1>
             <ol>
                 <li>If you need help using a tool, click on that tool whilst you see this clipboard.</li>
                 <li>You can toggle the visibility of this clipboard by clicking the "Tool Help" button</li>
                 <li>Enjoy using the program!</li>
             </ol>
             `);
         // if it is not visible we want to ensure we hide it
         self.visible = visible;
         if (visible) {
             self.manual.style("display", "block");
         } else {
             self.manual.style("display", "none");
             self.manual.style("opacity", 0.01);
         }
     }

    // fades out the current manual's writing and fades it back in with the new
        // tools manual
    function updateManualContents(contents) {
        // if we are transitioning between tools currently, do not allow the
        // manual update
        if (self.transitioning) {
            return;
        }
        // if we werent transitioning we are now transitioning so we set it to true
        self.transitioning = true; 
        let fadingIn = false; // variable that determins if we are currently fading in or fading out
        let x = -0.01; // the amt we change the opacity per "self.fadeTime" interval

        // controls the fading of the manual
        const fade = setInterval(() => {
            // we get the red, green blue alpha of the manuals color, which
            // we will use later for changing the opacity of the manual.
                const [r, g, b, a] = self.manual.style("color").
                split("").
                filter(x => x == "." || !isNaN(x)).
                join("").
                split(" ");

            if (a <= 0 && !fadingIn) { // if the manual is invisible and we are not fading in
                    fadingIn = true;       // then we know we just did a full cycle and faded out the old contents
                x *= -1;               // we flip the amt we change the opacity to position since we are now fading in
                    if (contents) {        // if we were provided contents we update the manual with those contents
                        self.manual.html(contents);
                    } else { // otherwise we simply supply the tools name and the tools manual
                        self.manual.html(`
                            ${escapeButton}
                            <h2>${self.selectedTool.name} tool </h2>
                            <p>${self.selectedTool.manual}</p>
                            `);
                    }

            } else if (fadingIn && a >= 0.99) { // if we are fading in and the manual is fully visible
                // then we are no longer transitioning, and have completed one
                // full cycle of fading out and then fading back in
                    self.transitioning = false; 
                // we can clear the interval and that completes the transition
                clearInterval(fade);
            } else {
                // if we havent reached full transparency or full opacity
                // then we simply update the manuals opacity till we reach
                // that point
                self.manual.style("color", `rgba(${r}, ${g}, ${b}, ${Number(a) + x})`);
            }
        }, self.fadeTime);
    }

    // toggles between hiding and showing the manual
    this.swapManual = () => {
        if (!self.visible) { // if its not visible we show it
            self.displayManual();
        } else { // otherwise we hide it
            self.hideManual();
        }
    }

    // displays the manual for the selected tool
    this.displayManual = contents => {
        self.visible = true; // the manual is now visible since we are displaying it
        // if there are contents we use those rather then creating them (mostly
            // used for when keybindings calls this)
        if (contents) { 
            self.manual.html(contents);
        } else { // otherwise we just show the tools name and its own manual
            self.manual.html(`
                ${escapeButton}
                <h2>${self.selectedTool.name} tool </h2>
                <p>${self.selectedTool.manual}</p>
                `);
        }
        self.manual.style("display", "block"); // the manual is being shown so we should now make it visible

        // we keep increasing the opacity of the manual until it is completely
        // visible 
        const opacityTimer = setInterval(() => {
            let curr = self.manual.style("opacity");
            if (curr >= 0.9) {
                clearInterval(opacityTimer);
            } else {
                self.manual.style("opacity", Number(curr) + 0.01);
            }

        }, self.fadeTime);

    }

    // hides the manual for the selected tool
    this.hideManual = () => {
        self.visible = false; // its being hidden so it is not visible

        // we keep reducing the opacity of the manual until it is not visible
        // when that occurs we set its display property to none
        const opacityTimer = setInterval(() => {
            let curr = self.manual.style("opacity");
            if (curr <= 0) {
                self.manual.style("display", "none");
                clearInterval(opacityTimer);
            } else {
                self.manual.style("opacity", Number(curr) - 0.01);
            }

        }, self.fadeTime);
    }


    this.tempDisableTool = () => {
        if (this.selectedTool.hasOwnProperty("tempDisable")) { 
            this.selectedTool.tempDisable();
            this.selectedTool.draw();
        }
    }


    // the manual we show for displaying the keybindings available
    const keybindingManual = `
    ${escapeButton}
        <h1>Keybindings</h1>
        <ul>
        <li>Ctrl + z: Undo</li>   
        <li>Ctrl + r: Redo</li>
        <li>ESC: Clear canvas</li>
        <li>Ctrl + v (when using the text tool) to paste the clipboard in the text box</li>
        </ul>
        `;
    // this is used to show all the keybindings that our program supports
    // in a sense it is its own "manual" but since we have no keybindings tool
    // we will keep the keybindings information within here
    this.showKeybindings = () => {
        // if we are currently transitioning do not allow the changing of the
        // menu to the keybindings
        if (self.transitioning) {
            return;

        // if the manual is being shown we can update its contents to the
        // key binding manual
        } else if (self.visible) { 
            updateManualContents(keybindingManual);

        // otherwise we display manual with the contents
        } else { 
            self.displayManual(keybindingManual);

        }
    }
}
