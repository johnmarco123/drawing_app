    # New features:
++ Added a stroke weight bar
++ Added window resizing capability
++ Added fill bucket tool
++ Added a graph mode where lines will snap to the nearest corner
++ Added a full screen mode 
++ Added a drop down/hide menu
++ Added a global stroke size so you don't have to keep selecting one when you 
switch off the freehand tool
++ Added a fill/nofill button for the ellipse shape
++ Added a text input feature
++ Added a clear screen shortcut keypress by pressing ESC
++ Fill bucket works 5 fold faster, at the cost of reduced accuracy
++ Made the fill bucket have a fast mode and an accurate mode
++ Constrained text size so it will not 
++ Added two modes for the typing tool
++ made vim mode pretty functional but still has massive bugs

    # Bugs Fixed:
++ Made resizable line not add multiple dots unless clicked multiple times
++ Fixed scissors bug where it leaves a border around where it cut after cutting
++ Fixed bug where the circles for the movable line tool would be misplaced
++ Fixed the canvas being misaligned. It didn't not match what is shown on screen 
++ Fixed moveable line tool where it would finish showing the red moveable dot. 
++ Fixed bug where the button for ellipse tool needs to be clicked twice at the
beginning for some reason

    # Major bugs fixed:
+++ Added a way to detect if mouse is actually on the canvas (AND HAVE THIS
      ONLY STOP FROM DRAWING, this.draw on every tool should still work, but
      the act of actually drawing must be ignored)


===============================================================================

# MAJOR BUGS TO FIX
 * CURRENTLY DISABLED THIS FEATURE TILL I FIGURE OUT WHAT I AM GONNA DO
 * After resizing, the bottom menu no longer blocks drawing...
* When the user hides the side and bottom bar, it causes the mouseoncanvas
  function to fail to detect where the bottom bar is

# Currently working on: 

 
# Current Bugs:
* Scissor tool sometimes does not paste!
* Fix weird outlining from the fillbucket tool



# Features to add:
    * vim mode to text tool 
    * Make all current vim features work as intended
    * Add a way to CTRL Z (save each state when the user releases their mouse?
    * Add more room for more tools
    * Add infinite scrolling (or a math mode maybe?)
    * Add a way to grab a a box of "elements" and move them
    * Add a transition between css buttons so it isn't instant.
    * Add an eraser (for object mode & normal eraser)
    * Add a way to quickly create binary trees or any tree
 
# Brain storming
    What do i want? do i want to have a zoom/pan, or a simple scrolling?
    * Add a color wheel...? This is where we left off on implamenting that...
    ```
     
     <input type="color" id="color-picker">
     let colorPicker = document.getElementById('color-picker');
     let hex = colorPicker.value.replace('#', '');
     hex = parseInt(hex, 16);
     # let col = [hex >> 16 & 255, hex >> 8 & 255, hex & 255];
     select(".colorPalette").child(colorPicker);
     self.selectedcolor = col;
     
    ```

