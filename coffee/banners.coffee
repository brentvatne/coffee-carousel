# Features remaining:
# - Loading before and after image after first is loaded

$ ->
  class AutomaticScroller
    constructor: (@scroller, @wait) ->
      @create()

    delay: (callback) ->
      setTimeout callback, @wait

    create: ()->
      @timer = @delay(=>
        @scroller.next()
        @create()
      )
      this

    destroy: ->
      clearTimeout(@timer)
      @timer = null
      this

    running: ->
      @timer

  class BannerScroller
    # Accepts a container that is a jQuery object containing all required components
    constructor: (@container) ->
      @init_dom_objects()
      @init_callbacks()
      @init_banner_data()
      @show_banner 0
      @preload_next_image()
      @init_automatic_scrolling()

    next: ->
      @show_banner @next_banner()

    prev: ->
      @show_banner @prev_banner()

    preload_next_image: () ->
      @preloaded_images = [@active_banner()] if not @preloaded_images?

      if @preloaded_images.length < @banners.length
        next_image = @banners[@next_banner()]
        @html_banner(next_image.image).appendTo(@backstage)
        @preloaded_images.push next_image

    active_banner: () ->
      @banners[@active_banner_id]

    show_banner: (id) ->
      @active_banner_id = id
      @hide_old_banner()
      @show_new_banner()

    # moves staged image to backstage and begins to fade it out
    # also removes the subtitle
    hide_old_banner: () ->
      @backstage.empty()
      old_banner = @stage.find("a")
      old_banner.appendTo(@backstage)
      old_banner.fadeOut(=> @preload_next_image())
      @stage.empty()
      @subtitle.empty()

    # adds new image to stage and begins to fade it in
    show_new_banner: () ->
      image    = @active_banner().image
      link     = @active_banner().link
      subtitle = @active_banner().subtitle

      @html_banner(image, link).appendTo(@stage).hide().fadeIn()
      @html_subtitle(subtitle).appendTo(@subtitle)

    #initialization methods
    init_dom_objects: ->
      @next_button   = @container.find(".controls .next")
      @prev_button   = @container.find(".controls .prev")
      @play_button   = @container.find(".controls .play")
      @pause_button  = @container.find(".controls .pause")
      @stage         = @container.find(".stage")
      @backstage     = @container.find(".backstage")
      @subtitle      = @container.find(".subtitle")

    init_callbacks: ->
      @next_button.click =>
        @stop_automatic_scrolling()
        @next()

      @prev_button.click =>
        @stop_automatic_scrolling()
        @prev()

      @pause_button.click =>
        @stop_automatic_scrolling()

      @play_button.click =>
        @restart_automatic_scrolling()

    toggle_play_button: ->
      if @play_button.hasClass "hidden"
        @play_button.removeClass "hidden"
        @pause_button.addClass "hidden"
      else
        @play_button.addClass "hidden"
        @pause_button.removeClass "hidden"

    init_banner_data: ->
      @banners = @make_banner_list @container.find(".banner-list input")

    #automatic scrolling helpers
    init_automatic_scrolling: ->
      @toggle_play_button()
      @timer = new AutomaticScroller this, 2000

    stop_automatic_scrolling: ->
      if @timer.running()
        @toggle_play_button()
        @timer.destroy()

    restart_automatic_scrolling: ->
      @toggle_play_button()
      @timer.destroy().create()

    #lower-level utility methods
    make_banner_list: (elements) ->
      elements = ($ el for el in elements)
      list = []
      for el in elements
        data =
          image:    el.attr "imgurl"
          subtitle: el.attr "subtitle"
          link:     el.attr "link"
        list.push(data)
      list

    #creates and returns a new anchor element containing the banner image
    html_banner: (image, link = "") ->
      banner = $('<a/>', href: link)
      banner.html($('<img/>', src: image))

    html_subtitle: (subtitle) ->
      $("<span>#{subtitle}</span>")

    prev_banner: ->
      if @first_banner_is_active() then @last_banner() else @active_banner_id - 1

    next_banner: ->
      if @last_banner_is_active() then @first_banner() else @active_banner_id + 1

    last_banner_is_active: ->
      @active_banner_id == @last_banner()

    first_banner_is_active: ->
      @active_banner_id == 0

    first_banner: () ->
      0

    last_banner: () ->
      @banners.length - 1

  scroller = new BannerScroller($(".banners"))
