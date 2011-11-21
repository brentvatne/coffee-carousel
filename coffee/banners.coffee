# Features remaining:
# - Loading before and after image after first is loaded
# - Option to switch to particular slide?
#
# Done:
# - Fade out
# - Timer for automatically rotating
# - Pause button

$ ->
  class ImagePreloader
    constructor: (images, container) ->

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
      this

  class BannerScroller
    # Accepts a container that is a jQuery object containing all required components
    constructor: (@container) ->
      @initialize_dom_objects()
      @initialize_callbacks()
      @get_banner_data()
      @show_banner 0
      @start_automatic_scrolling()

    next: ->
      @show_banner @next_banner()

    prev: ->
      @show_banner @prev_banner()

    show_banner: (id) ->
      @hide_old_banner()
      @show_new_banner(id)
      @active_banner = id

    # moves staged image to backstage and begins to fade it out
    hide_old_banner: () ->
      @backstage.empty()
      @stage.find("a").appendTo(@backstage).fadeOut()

    # adds new image to stage and begins to fade it in
    show_new_banner: (id) ->
      @draw_html_banner(@banners[id].image, @banners[id].link).hide().fadeIn()
      @draw_html_subtitle(@banners[id].subtitle)

    #initialization methods
    initialize_dom_objects: ->
      @next_button   = @container.find(".controls .next")
      @prev_button   = @container.find(".controls .prev")
      @play_button   = @container.find(".controls .play")
      @pause_button  = @container.find(".controls .pause")
      @stage         = @container.find(".stage")
      @backstage     = @container.find(".backstage")
      @subtitle      = @container.find(".subtitle")

    initialize_callbacks: ->
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

    get_banner_data: ->
      @banners = @make_banner_list @container.find(".banner-list input")

    start_automatic_scrolling: ->
      @timer = new AutomaticScroller this, 2000

    stop_automatic_scrolling: ->
      @timer.destroy()

    restart_automatic_scrolling: ->
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

    draw_html_banner: (image, link) ->
      @stage.html("<a>").find("a").attr("href", link)
      @stage.find("a").html("<img>").find("img").attr("src", image)
      @stage.find("a")

    draw_html_subtitle: (subtitle) ->
      @subtitle.html(subtitle)

    prev_banner: ->
      if @first_banner_is_active() then @last_banner() else @active_banner - 1

    next_banner: ->
      if @last_banner_is_active() then @first_banner() else @active_banner + 1

    last_banner_is_active: ->
      @active_banner == @last_banner()

    first_banner_is_active: ->
      @active_banner == 0

    first_banner: () ->
      0

    last_banner: () ->
      @banners.length - 1

  scroller = new BannerScroller($(".banners"))
