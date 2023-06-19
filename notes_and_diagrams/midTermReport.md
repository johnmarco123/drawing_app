Originally i started out with the music visualizer and made a lot of progress,
however, I found myself constantly using a simple, old drawing
application i made to help me in computational mathematics last semester. Upon
realizing that i already use drawing applications extensively to help with my
studies, I thought it would be most beneficial to make my own drawing
application, and therefore, the drawing application has been my choice. 

The extensions below will be written in order of complexity to implament.

# Stamp tool 
  This Tool will have a slider to control the amount of stamps per
  frame, as well as their size. For the stamps per frame we will need a for
  loop, and for the size we can simply upscale the stamp image. 

Implamentation level: Very easy, no challenges expected


# Ellipse Tool 
  Will simply use the p5.js build in ellipse function and allow
  dynamic resizing using loadPixels() and updatePixels()

Implamentation level: Easy, I expect to be some challenges with using
loadPixels() and updatePixels() as i have found it confusing how those
functions interact with one another


# Rect Tool
  The same approach to the ellipse tool will be used, however to
  enable the user to dynamically resize the rect i'll likely have to set
  rectmode to the CORNERS mode 
  
  All the same problems for the ellipse tool also
  apply to this tool and any further extension to any shape tool

Implamentation level: Easy, I expect the same issues as the ellipse tool for
implamenting the rect tool


# Moveable Line Tool 
  Must keep track of the two states of the moveable line (
  add vertices and edit shape) and allow editing of the shapes size.

Implamentation level: Easy, I expect there to be a challenge in trying to
figure out how to keep track of the shape, but i think that will be easily
solved by just storing the vertexes in an array until we must finish the shape


# Scissor Tool 
  Will have to keep track of multiple states, cutting, pasting and
  also saving the cut image for pastes

Implamentation level: medium, Allowing dynamic moving of the scissor paste may
be challenging, but the initial implamentation of the tool will likely be quite
easy


# Fill Tool 
  This problem will require dynamic programming to implament. Will
  have to utilize recursian/iteration  to check pixels around the given pixel
  and then paint them

Implamentation level: hard, Will have to be very efficient with the algorithm i
implament to allow the fill tool to fill an area quickly. Also, since the pixels
array is usually over 3,000,000 pixels long, this may cause stack overflows
if i use recursian.

