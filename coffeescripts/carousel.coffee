$ ->
  class Timer
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

  class Carousel
    # Public: Initializes the Carousel instance
    #
    # @container - A jQuery element
    constructor: (@container) ->
      @init_dom_references()
      @init_controls()
      @init_image_data()
      @start(0)
      @preload_next_image()
      @start_automatic_scrolling()

    # What is the difference between show_image and show_new_image??
    show_image: (id) ->
      @active_image_id = id
      @fade_out_active_image() and @fade_in_new_image()

    fade_out_active_image: () ->
      @backstage.empty()
      @stage.find("a").appendTo(@backstage).fadeOut(=> @preload_next_image())
      @stage.empty() and @subtitle.empty()

    fade_in_new_image: () ->
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

    show_next: -> @show_image @next_image()

    show_prev: -> @show_image @prev_image()

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
      # if no link, don't put a
      image = $('<a/>', href: link)
      image.html($('<img/>', src: image_url, alt: alt))

    subtitle_tag: (subtitle) -> $("<span>#{subtitle}</span>")


    # *************************************************************************
    # Utility methods for querying state carousel
    # *************************************************************************

    first_image: () -> 0

    last_image: () -> @images.length - 1

    prev_image: -> if @first_image_is_active() then @last_image() else @active_image_id - 1

    next_image: -> if @last_image_is_active() then @first_image() else @active_image_id + 1

    active_image: () -> @images[@active_image_id]

    last_image_is_active: -> @active_image_id == @last_image()

    first_image_is_active: -> @active_image_id == 0


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

    start: (first_image = 0) ->
      @show_image first_image

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
