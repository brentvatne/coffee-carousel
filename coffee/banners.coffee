$ ->
  class BannerScroller
    # Accepts a container that is a jQuery object containing all required components
    constructor: (container) ->
      @next_button = container.find(".controls .next")
      @prev_button = container.find(".controls .prev")
      @stage       = container.find(".stage")
      @greenroom   = container.find(".greenroom")
      @subtitle    = container.find(".subtitle")
      @banners     = @make_banner_list container.find(".banner-list input")

      @initialize_callbacks()
      @current_banner_id = 0
      @show_banner(@current_banner_id)

    initialize_callbacks: ->
      scroller = @
      @next_button.click ->
        scroller.next()

      @prev_button.click ->
        scroller.prev()

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

    next: ->
      @show_banner @get_next_banner()

    prev: ->
      @show_banner @get_previous_banner()

    show_banner: (id) ->
      @fade_out_old_banner()
      @fade_in_new_banner(id)

      @current_banner_id = id

    fade_out_old_banner: () ->
      #move to greenroom

    fade_in_new_banner: (id) ->
      image    = @banners[id].image
      subtitle = @banners[id].subtitle
      link     = @banners[id].link
      @draw_html_banner(image, link)
      @draw_html_subtitle(subtitle)
      @current_banner = id

    draw_html_banner: (image, link) ->
      @stage.html("<a>").find("a").attr("href", link)
      @stage.find("a").html("<img>").find("img").attr("src", image)

    draw_html_subtitle: (subtitle) ->
      @subtitle.html(subtitle)

    get_previous_banner: ->
      @current_banner_id -= 1
      @current_banner_id = @banners.length - 1 if @current_banner_id < 0
      @current_banner_id

    get_next_banner: ->
      @current_banner_id += 1
      @current_banner_id = 0 if @current_banner_id >= @banners.length
      @current_banner_id

  scroller = new BannerScroller($(".banners"))
