// container object for storing the tools
// Functions to add new tools, select a new tool 
// and display the manual for the selected tool
function Toolbox() {
    this.tools = [];
    this.selectedTool = null;
    this.transitioning = false;
    this.visible = false;
    this.manual = null;
    this.fade_time = 5;
    let self = this;

    function toolbarItemClick() {
        // remove any existing borders
        var items = selectAll(".sideBarItem");
        for (var i = 0; i < items.length; i++) {
            items[i].style('border', '0')
        }

        var toolName = this.id().split("sideBarItem")[0];
        self.selectTool(toolName);
        update_manual_contents();

        // call loadPixels to make sure most recent changes are saved to pixel array
        loadPixels();

    }

    // add a new tool icon to the html page
    function addToolIcon(icon, name) {
        var sideBarItem = createDiv("<img src='" + icon + "'></div>");
        sideBarItem.class('sideBarItem')
        sideBarItem.id(name + "sideBarItem")
        sideBarItem.parent('sidebar');
        sideBarItem.mouseClicked(toolbarItemClick);
    };

    // add a tool to the tools array
    this.addTool = tool => {
        //check that the object tool has an icon and a name
        if (!tool.hasOwnProperty("icon") ||
            !tool.hasOwnProperty("name") ||
            !tool.hasOwnProperty("manual")) {

            alert("make sure your tool has a name an icon and a manual!");
        }
        this.tools.push(tool);
        addToolIcon(tool.icon, tool.name);
        // if no tool is selected (ie. none have been added so far)
        // make this tool the selected one.
            if (!this.selectedTool) {
                this.selectTool(tool.name);
            }
    };

    // add an array of tools to the toolbox
    this.addTools = (tools) => {
        for (let tool of tools) {
            self.addTool(new tool()); 
        }
    }


    this.selectTool = function(toolName) {
        //search through the tools for one that's name matches
        //toolName
        for (var i = 0; i < this.tools.length; i++) {
            if (this.tools[i].name == toolName) {
                //if the tool has an unselectTool method run it.
                    if (this.selectedTool != null && this.selectedTool.hasOwnProperty(
                        "unselectTool")) {
                        this.selectedTool.unselectTool();
                    }
                //select the tool and highlight it on the toolbar
                this.selectedTool = this.tools[i];
                select("#" + toolName + "sideBarItem").style("border", "2px solid blue");

                //if the tool has an .tempOptions area. Populate it now.
                    if (this.selectedTool.hasOwnProperty("populateOptions")) {
                        this.selectedTool.populateOptions();
                    }
            }
        }
    };

    // initializes the manual div and hides it
    function initialize_manual() {
        self.manual = createDiv()
        self.manual.id("manual");
        self.manual.style("opacity", "0");
        self.manual.style("display", "none");
    }
    initialize_manual();

    /// updates the contents of the manual to match the selected tool
    function update_manual_contents() {
        if (self.transitioning) return;
        self.transitioning = true;
        let fading_in = false;
        let x = -0.01;
        let fade = setInterval(() => {
            let [r, g, b, a] = self.manual.style("color").
                split("").
                filter(x => x == "." || !isNaN(x)).
                join("").
                split(" ");

            if (a <= 0 && !fading_in) {
                fading_in = true;
                self.manual.html(`
                    <h2>${self.selectedTool.name} tool </h2>
                    <p>${self.selectedTool.manual}</p>
                    `);
                x *= -1;

            } else if (fading_in && a >= 0.99) {
                self.transitioning = false;
                clearInterval(fade);

            } else {
                self.manual.style("color", `rgba(${r}, ${g}, ${b}, ${+a + x})`);
            }
        }, self.fade_time);
}

// toggles between hiding and showing the manual
this.swap_manual = () => {
    if (!self.visible) {
        display_manual();
        self.visible = true;
    } else {
        hide_manual();
        self.visible = false;
    }
}

// displays the manual for the selected tool
function display_manual() {
    self.manual.html(`
        <h2>${self.selectedTool.name} tool </h2>
        <p>${self.selectedTool.manual}</p>
        `);
    self.manual.style("display", "block");
    let opacity_timer = setInterval(() => {
        let curr = self.manual.style("opacity");
       if (curr >= 0.9) {
            clearInterval(opacity_timer);
        } else {
            self.manual.style("opacity", Number(curr) + 0.01);
        }

    }, self.fade_time);

}

// hides the manual for the selected tool
function hide_manual() {
    let opacity_timer = setInterval(() => {
        let curr = self.manual.style("opacity");
        if (curr <= 0) {
            self.manual.style("display", "none");
            clearInterval(opacity_timer);
        } else {
            self.manual.style("opacity", Number(curr) - 0.01);
        }

    }, self.fade_time);
}
}
