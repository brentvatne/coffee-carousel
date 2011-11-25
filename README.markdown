# Simple image carousel written in CoffeeScript
Just a very simple image carousel that I needed. I couldn't find one
that worked exactly how I wanted so I made this. In particular, it lets
me add subtitles easily and preloads images, although it doesn't do so
particularly intelligently - just sequentially.

### Use it
Dependent on jQuery 1.4 or higher.

Add the following markup anywhere in your HTML file:

````html
<div class="carousel">
  <div class="scroll-container">
    <div class="stage">

    </div>

    <div class="backstage">
    </div>
  </div>


  <div class="image-list">
    <!-- add any images you want here using inputs -->
    <!-- these inputs also support a link tag and an alt tag -->
    <input type="hidden" imgurl="images/1.jpg" subtitle="Estamos de aniversario">
    <input type="hidden" imgurl="images/2.jpg" subtitle="Something about airborne">
    <input type="hidden" imgurl="images/3.jpg" subtitle="This is the third subtitle">
  </div>
  <div class="toolbar-background"></div>
  <div class="toolbar">
    <div class="subtitle">

    </div>
    <div class="controls">
      <span class="pause"></span>
      <span class="play"></span>
      <span class="prev"></span>
      <span class="next"></span>
    </div>
  </div>
</div>
````

Style the elements however you like, a good default is to have `.carousel`
be `position: relative` and both `.stage` and `.backstage` as
`position: absolute; top 0px; left: 0px` in order to allow for the
cross-fade effect.

Then simply load the javascript file:
`<script src="js/carousel.js"></script>`
