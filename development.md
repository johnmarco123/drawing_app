    # New features:
+ Added a stroke weight bar
+ Added window resizing capability
+ Added fill bucket tool
+ Added a graph mode where lines will snap to the nearest corner
+ Added a full screen mode 
+ Added a drop down/hide menu
+ Added a global stroke size so you don't have to keep selecting one when you 
switch off the freehand tool
+ Added a fill/nofill button for the ellipse shape
+ Added a text input feature
+ Added a clear screen shortcut keypress by pressing ESC

    # Bugs Fixed:
+ Made resizable line not add multiple dots unless clicked multiple times
+ Fixed scissors bug where it leaves a border around where it cut after cutting
+ Fixed bug where the circles for the movable line tool would be misplaced
+ Fixed the canvas being misaligned. It didn't not match what is shown on screen 
+ Fixed moveable line tool where it would finish showing the red moveable dot. 
+ Fixed bug where the button for ellipse tool needs to be clicked twice at the
beginning for some reason

    # Major bugs fixed:
- Add a way to detect if mouse is actually on the canvas (AND HAVE THIS
      ONLY STOP FROM DRAWING, this.draw on every tool should still work, but
      the act of actually drawing must be ignored)


===============================================================================

# MAJOR BUGS TO FIX

# Currently working on: 
* Adding a text feature which allows you to type whatever you want

 
# Current Bugs:
* for some reason on resizing, we now cause painting even though we dont want
  to underneath the bottom option menu
* Scissor tool sometimes does not paste!
* Fix weird outlining from the fillbucket tool
* Stuff breaks on resizing... currently i know that the graph breaks but maybe
more does as well



# Features to add:
    * vim mode to text tool 
    * Add more room for more tools
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

