
  $(function() {
    var Carousel, Timer, scroller;
    Timer = (function() {

      function Timer(scroller, wait) {
        this.scroller = scroller;
        this.wait = wait;
        this.create();
      }

      Timer.prototype.delay = function(callback) {
        return setTimeout(callback, this.wait);
      };

      Timer.prototype.create = function() {
        var _this = this;
        this.timer = this.delay(function() {
          _this.scroller.next();
          return _this.create();
        });
        return this;
      };

      Timer.prototype.destroy = function() {
        clearTimeout(this.timer);
        this.timer = null;
        return this;
      };

      Timer.prototype.running = function() {
        return this.timer;
      };

      return Timer;

    })();
    Carousel = (function() {

      function Carousel(container) {
        this.container = container;
        this.init_dom_objects();
        this.init_callbacks();
        this.init_banner_data();
        this.show_banner(0);
        this.preload_next_image();
        this.init_automatic_scrolling();
      }

      Carousel.prototype.next = function() {
        return this.show_banner(this.next_banner());
      };

      Carousel.prototype.prev = function() {
        return this.show_banner(this.prev_banner());
      };

      Carousel.prototype.preload_next_image = function() {
        var next_image;
        if (!(this.preloaded_images != null)) {
          this.preloaded_images = [this.active_banner()];
        }
        if (this.preloaded_images.length < this.banners.length) {
          next_image = this.banners[this.next_banner()];
          this.backstage.empty();
          this.html_banner(next_image.image).appendTo(this.backstage);
          return this.preloaded_images.push(next_image);
        }
      };

      Carousel.prototype.active_banner = function() {
        return this.banners[this.active_banner_id];
      };

      Carousel.prototype.show_banner = function(id) {
        this.active_banner_id = id;
        this.hide_old_banner();
        return this.show_new_banner();
      };

      Carousel.prototype.hide_old_banner = function() {
        var _this = this;
        this.backstage.empty();
        this.stage.find("a").appendTo(this.backstage).fadeOut(function() {
          return _this.preload_next_image();
        });
        this.stage.empty();
        return this.subtitle.empty();
      };

      Carousel.prototype.show_new_banner = function() {
        var alt, image, link, subtitle;
        image = this.active_banner().image;
        link = this.active_banner().link;
        alt = this.active_banner().alt;
        subtitle = this.active_banner().subtitle;
        this.html_banner(image, alt, link).appendTo(this.stage).hide().fadeIn();
        return this.html_subtitle(subtitle).appendTo(this.subtitle);
      };

      Carousel.prototype.init_dom_objects = function() {
        this.next_button = this.wrap_in_null_link(this.container.find(".controls .next"));
        this.prev_button = this.wrap_in_null_link(this.container.find(".controls .prev"));
        this.play_button = this.wrap_in_null_link(this.container.find(".controls .play"));
        this.pause_button = this.wrap_in_null_link(this.container.find(".controls .pause"));
        this.stage = this.container.find(".stage");
        this.backstage = this.container.find(".backstage");
        return this.subtitle = this.container.find(".subtitle");
      };

      Carousel.prototype.wrap_in_null_link = function($el) {
        return $el.wrap('<a />').click(function(e) {
          return e.preventDefault();
        });
      };

      Carousel.prototype.init_callbacks = function() {
        var _this = this;
        this.next_button.click(function() {
          _this.stop_automatic_scrolling();
          return _this.next();
        });
        this.prev_button.click(function() {
          _this.stop_automatic_scrolling();
          return _this.prev();
        });
        this.pause_button.click(function() {
          return _this.stop_automatic_scrolling();
        });
        return this.play_button.click(function() {
          return _this.restart_automatic_scrolling();
        });
      };

      Carousel.prototype.toggle_play_button = function() {
        if (this.play_button.hasClass("hidden")) {
          this.play_button.removeClass("hidden");
          return this.pause_button.addClass("hidden");
        } else {
          this.play_button.addClass("hidden");
          return this.pause_button.removeClass("hidden");
        }
      };

      Carousel.prototype.init_banner_data = function() {
        return this.banners = this.make_banner_list(this.container.find(".image-list input"));
      };

      Carousel.prototype.init_automatic_scrolling = function() {
        this.toggle_play_button();
        return this.timer = new Timer(this, 6000);
      };

      Carousel.prototype.stop_automatic_scrolling = function() {
        if (this.timer.running()) {
          this.toggle_play_button();
          return this.timer.destroy();
        }
      };

      Carousel.prototype.restart_automatic_scrolling = function() {
        this.toggle_play_button();
        return this.timer.destroy().create();
      };

      Carousel.prototype.make_banner_list = function(elements) {
        var data, el, list, _i, _len;
        elements = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = elements.length; _i < _len; _i++) {
            el = elements[_i];
            _results.push($(el));
          }
          return _results;
        })();
        list = [];
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          el = elements[_i];
          data = {
            image: el.attr("imgurl"),
            subtitle: el.attr("subtitle"),
            link: el.attr("link"),
            alt: el.attr("alt")
          };
          list.push(data);
        }
        return list;
      };

      Carousel.prototype.html_banner = function(image, alt, link) {
        var banner;
        if (alt == null) alt = "";
        if (link == null) link = "";
        banner = $('<a/>', {
          href: link
        });
        return banner.html($('<img/>', {
          src: image,
          alt: alt
        }));
      };

      Carousel.prototype.html_subtitle = function(subtitle) {
        return $("<span>" + subtitle + "</span>");
      };

      Carousel.prototype.prev_banner = function() {
        if (this.first_banner_is_active()) {
          return this.last_banner();
        } else {
          return this.active_banner_id - 1;
        }
      };

      Carousel.prototype.next_banner = function() {
        if (this.last_banner_is_active()) {
          return this.first_banner();
        } else {
          return this.active_banner_id + 1;
        }
      };

      Carousel.prototype.last_banner_is_active = function() {
        return this.active_banner_id === this.last_banner();
      };

      Carousel.prototype.first_banner_is_active = function() {
        return this.active_banner_id === 0;
      };

      Carousel.prototype.first_banner = function() {
        return 0;
      };

      Carousel.prototype.last_banner = function() {
        return this.banners.length - 1;
      };

      return Carousel;

    })();
    return scroller = new Carousel($(".carousel"));
  });
