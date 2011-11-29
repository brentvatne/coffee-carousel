class window.Timer
  constructor: (@scroller, @wait) ->
    @create()

  delay: (callback) -> setTimeout callback, @wait

  create: ()->
    @timer = @delay(=>
      @scroller.show_next()
      @create()
    )
    this

  destroy: ->
    clearTimeout(@timer)
    @timer = null
    this

  running: -> @timer

# Internal: Knows about the images for the Carousel, including which is active
class window.ImageQueue
  constructor: -> @images = []

  length: -> @images.length

  add: (image_url, link, alt, subtitle) ->
    @images.push url: image_url, link: link, alt: alt, subtitle: subtitle

  first: -> @images[0]

  last: -> @images[@images.length - 1]

  prev: ->

  next: ->

  active: ->


class window.Carousel
  # Public: Initializes the Carousel instance
  #
  # @container - A jQuery element
  constructor: (@container) ->
    @init_dom_references()
    @init_controls()
    @init_image_data()

    @fade_in_new @first_image()
    @preload_next_image()
    @start_automatic_scrolling()

  # Public: 
  rotate_to: (id) ->
    @fade_out_active() and @fade_in_new(id)

  # Internal: Fades out the currently visible image.
  fade_out_active: () ->
    @backstage.empty()
    @stage.find("a").appendTo(@backstage).fadeOut(=> @preload_next_image())
    @stage.empty() and @subtitle.empty()

  # Internal: Fades in a new image.
  fade_in_new: (id) ->
    @active_image_id = id

    image_url = @active_image().image_url
    link      = @active_image().link
    alt       = @active_image().alt
    subtitle  = @active_image().subtitle

    @image_tag(image_url, alt, link).appendTo(@stage).hide().fadeIn()
    @subtitle_tag(subtitle).appendTo(@subtitle)

  # *************************************************************************
  # Image Scrolling Controls: Play, Pause, Next, Previous
  # *************************************************************************

  init_controls: ->
    @next_button.click =>
      @stop_automatic_scrolling()
      @show_next()

    @prev_button.click =>
      @stop_automatic_scrolling()
      @show_prev()

    @pause_button.click => @stop_automatic_scrolling()

    @play_button.click => @start_automatic_scrolling()

  show_next: -> @rotate_to @next_image()

  show_prev: -> @rotate_to @prev_image()

  toggle_play_button: ->
    if @play_button.hasClass    "hidden"
      @play_button.removeClass  "hidden"
      @pause_button.addClass    "hidden"
    else
      @play_button.addClass     "hidden"
      @pause_button.removeClass "hidden"


  # *************************************************************************
  # Scrolling Behaviour
  # *************************************************************************

  start_automatic_scrolling: ->
    if @timer
      @toggle_play_button()
      @timer.destroy().create()
    else
      @toggle_play_button()
      @timer = new Timer this, 6000

  stop_automatic_scrolling: ->
    if @timer.running()
      @toggle_play_button()
      @timer.destroy()


  # *************************************************************************
  # HTML Tag Generator Methods
  # *************************************************************************

  image_tag: (image_url, alt = "", link = "") ->
    image = $('<a/>', href: link)
    image.html($('<img/>', src: image_url, alt: alt))

  subtitle_tag: (subtitle) -> $("<span>#{subtitle}</span>")



  # *************************************************************************
  # Preloading Behaviour (this will be extracted to another class)
  # *************************************************************************

  preload_next_image: () ->
    @preloaded_images = [@active_image()] if not @preloaded_images?

    if @preloaded_images.length < @images.length
      next_image = @images[@next_image()]
      @backstage.empty()
      @image_tag(next_image.image).appendTo(@backstage)
      @preloaded_images.push next_image


  # *************************************************************************
  # Initialization methods
  # *************************************************************************

  init_dom_references: ->
    @next_button   = @container.find(".controls .next")
    @prev_button   = @container.find(".controls .prev")
    @play_button   = @container.find(".controls .play")
    @pause_button  = @container.find(".controls .pause")
    @stage         = @container.find(".stage")
    @backstage     = @container.find(".backstage")
    @subtitle      = @container.find(".subtitle")

  init_image_data: ->
    elements = ($ el for el in @container.find(".image-list input"))
    @images = []
    for el in elements
      data =
        image_url: el.attr "imgurl"
        subtitle:  el.attr "subtitle"
        link:      el.attr "link"
        alt:       el.attr "alt"
      @images.push(data)

scroller = new Carousel($(".carousel"))
