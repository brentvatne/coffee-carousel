$ ->
  class BannerScroller
    # Accepts a container that is a jQuery object containing all required components
    constructor: (@container) ->
      @next_button = @container.find(".controls .next")
      @prev_button = @container.find(".controls .prev")
      @stage       = @container.find(".stage")
      @greenroom   = @container.find(".greenroom")
      #convert this to a hash
      @banner_list = @build_list(@container.find(".banner-list input"))

      console.log @banner_list

      @show_banner(1)
      @initialize_callbacks()

    initialize_callbacks: ->
      scroller = @
      @next_button.click ->
        scroller.next()

      @prev_button.click ->
        scroller.prev()

    build_list: (elements) ->
      banners = {}
      for el in elements
        el = $(el)
        banners[el.attr("bannerId")] =
          image:    el.attr("bannerUrl")
          subtitle: el.attr("subtitle")
          link:     el.attr("link")

    next: ->
      alert "next"

    prev: ->
      alert "prev"

    show_banner: (id) ->
      @stage.html(@banner_list[id])

    set_current_banner: (id) ->

    get_next_banner: ->

  scroller = new BannerScroller($(".banners"))
