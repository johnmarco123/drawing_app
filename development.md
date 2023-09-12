# This document kept track of various features and bugs that i have fixed
# and have been kept here for documentation sake;

# New features:
++ Added a way to CTRL Z and CTRL R to undo and redo
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
++ Add a way to grab a a box of "elements" and move them
++ Added a manual for each tool and made it manditory for any new tools


    # Bugs Fixed: 
++ Made resizable line not add multiple dots unless clicked multiple times 
++ Fixed scissors bug where it leaves a border around where it cut after cutting 
++ Fixed bug where the circles for the movable line tool would be misplaced 
++ Fixed the canvas being misaligned. It didn't not match what is shown on screen 
++ Fixed moveable line tool where it would finish showing the red moveable dot. 
++ Fixed bug where the button for ellipse tool needs to be clicked twice at the
beginning for some reason 
++ Fill bucket tool now works with all browsers 
++ Scissor tool now has no bugs, fixed bug where it would occasionally fail to paste


    # Major bugs fixed: 
 +++ Added a way to detect if mouse is actually on the canvas (AND HAVE THIS
 ONLY STOP FROM DRAWING, this.draw on every tool should still work, but the act
 of actually drawing must be ignored) 


===============================================================================

# MAJOR BUGS TO FIX

# Last bug tested date: 2023/08/06
    * drawing tool: no bugs
    * line tool: no bugs
    * moveable line tool: no bugs
    * ellipse tool: no bugs
    * rectangle tool: no bugs
    * mirror tool: no bugs
    * scissors tool: no bugs
    * graph tool: no bugs
    * fill bucket tool: no bugs
    * text tool: no bugs
    * vim mode: no bugs

# Currently working on: 

    
# Things to do: 
    * Remove ".git" and files like this before uploading
