    # New features:
+ Added a stroke weight bar
+ Added window resizing capability
+ Added fill bucket tool
+ Added a graph mode where lines will snap to the nearest corner

    # Bugs Fixed:
+ Made resizable line not add multiple dots unless clicked multiple times
+ Fixed scissors bug where it leaves a border around where it cut after cutting
+ Fix bug where the circles for the movable line tool would be misplaced
+ Fixed the canvas being misaligned. It didn't not match what is shown on screen 
+ Fixed moveable line tool where it would finish showing the red moveable dot. 

===============================================================================

# MAJOR BUGS TO FIX
    Lots of issues are stemming from having to have mouse on canvas to activate
    changes i intentionally made it so the mouse must be on canvas to prevent
    painting when on an icon painting and updating should maybe be seperate to
    avoid the issues below:
    * Moveable line when changing color whist editing only updates when mouse on canvas
    * Implament tests where possible
    * When initially clicking the mirror tool, the line is not shown unless hovering the screen.

# Currently working on:
* There is so much free space at the bottom, re make the whole bottom section
  to allow for more drawing area.
* Add ways to hide the menus to allow for more drawing space.
* Add more room for more tools

 
# Current Bugs:
* Scissors tool sometimes doesn't paste? <-- FIXED I THINK?!?!?! TEST MORE
* Fix weird outlining from the fillbucket tool
* Stuff breaks on resizing... currently i know that the graph breaks but maybe
more does as well



# Features to add:
    * Add a full screen mode that basically hides all of the tools
    * Add infinite scrolling
    * In full screen mode add a way to have more than a screen size worth of 
    drawing area. 
    * Add a global stroke weight that is shared amongst any drawing tools
    * Allow all shapes to be moveable once they are created? 
    * Add a way to grab a a box of "elements" and move them
    * Add a transition between css buttons so it isn't instant.
    * Add an eraser (for object mode & normal eraser)
 
# Brain storming
    What do i want? do i want to have a zoom/pan, or a simple scrolling?
    * Add a color wheel...? This is where we left off on implamenting that...
    ```
     
     <input type="color" id="color-picker">
     let colorPicker = document.getElementById('color-picker');
     let hex = colorPicker.value.replace('#', '');
     hex = parseInt(hex, 16);
     let col = [hex >> 16 & 255, hex >> 8 & 255, hex & 255];
     select(".colorPalette").child(colorPicker);
     self.selectedcolor = col;
     
    ```

