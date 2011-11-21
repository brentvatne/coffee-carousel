
  $(function() {
    var AutomaticScroller, BannerScroller, scroller;
    AutomaticScroller = (function() {

      function AutomaticScroller(scroller, wait) {
        this.scroller = scroller;
        this.wait = wait;
        this.create();
      }

      AutomaticScroller.prototype.delay = function(callback) {
        return setTimeout(callback, this.wait);
      };

      AutomaticScroller.prototype.create = function() {
        var _this = this;
        this.timer = this.delay(function() {
          _this.scroller.next();
          return _this.create();
        });
        return this;
      };

      AutomaticScroller.prototype.destroy = function() {
        clearTimeout(this.timer);
        this.timer = null;
        return this;
      };

      AutomaticScroller.prototype.running = function() {
        return this.timer;
      };

      return AutomaticScroller;

    })();
    BannerScroller = (function() {

      function BannerScroller(container) {
        this.container = container;
        this.init_dom_objects();
        this.init_callbacks();
        this.init_banner_data();
        this.show_banner(0);
        this.preload_next_image();
        this.init_automatic_scrolling();
      }

      BannerScroller.prototype.next = function() {
        return this.show_banner(this.next_banner());
      };

      BannerScroller.prototype.prev = function() {
        return this.show_banner(this.prev_banner());
      };

      BannerScroller.prototype.preload_next_image = function() {
        var next_image;
        if (!(this.preloaded_images != null)) {
          this.preloaded_images = [this.active_banner()];
        }
        if (this.preloaded_images.length < this.banners.length) {
          next_image = this.banners[this.next_banner()];
          this.html_banner(next_image.image).appendTo(this.backstage);
          return this.preloaded_images.push(next_image);
        }
      };

      BannerScroller.prototype.active_banner = function() {
        return this.banners[this.active_banner_id];
      };

      BannerScroller.prototype.show_banner = function(id) {
        this.active_banner_id = id;
        this.hide_old_banner();
        return this.show_new_banner();
      };

      BannerScroller.prototype.hide_old_banner = function() {
        var old_banner;
        var _this = this;
        this.backstage.empty();
        old_banner = this.stage.find("a");
        old_banner.appendTo(this.backstage);
        old_banner.fadeOut(function() {
          return _this.preload_next_image();
        });
        this.stage.empty();
        return this.subtitle.empty();
      };

      BannerScroller.prototype.show_new_banner = function() {
        var image, link, subtitle;
        image = this.active_banner().image;
        link = this.active_banner().link;
        subtitle = this.active_banner().subtitle;
        this.html_banner(image, link).appendTo(this.stage).hide().fadeIn();
        return this.html_subtitle(subtitle).appendTo(this.subtitle);
      };

      BannerScroller.prototype.init_dom_objects = function() {
        this.next_button = this.container.find(".controls .next");
        this.prev_button = this.container.find(".controls .prev");
        this.play_button = this.container.find(".controls .play");
        this.pause_button = this.container.find(".controls .pause");
        this.stage = this.container.find(".stage");
        this.backstage = this.container.find(".backstage");
        return this.subtitle = this.container.find(".subtitle");
      };

      BannerScroller.prototype.init_callbacks = function() {
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

      BannerScroller.prototype.toggle_play_button = function() {
        if (this.play_button.hasClass("hidden")) {
          this.play_button.removeClass("hidden");
          return this.pause_button.addClass("hidden");
        } else {
          this.play_button.addClass("hidden");
          return this.pause_button.removeClass("hidden");
        }
      };

      BannerScroller.prototype.init_banner_data = function() {
        return this.banners = this.make_banner_list(this.container.find(".banner-list input"));
      };

      BannerScroller.prototype.init_automatic_scrolling = function() {
        this.toggle_play_button();
        return this.timer = new AutomaticScroller(this, 2000);
      };

      BannerScroller.prototype.stop_automatic_scrolling = function() {
        if (this.timer.running()) {
          this.toggle_play_button();
          return this.timer.destroy();
        }
      };

      BannerScroller.prototype.restart_automatic_scrolling = function() {
        this.toggle_play_button();
        return this.timer.destroy().create();
      };

      BannerScroller.prototype.make_banner_list = function(elements) {
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
            link: el.attr("link")
          };
          list.push(data);
        }
        return list;
      };

      BannerScroller.prototype.html_banner = function(image, link) {
        var banner;
        if (link == null) link = "";
        banner = $('<a/>', {
          href: link
        });
        return banner.html($('<img/>', {
          src: image
        }));
      };

      BannerScroller.prototype.html_subtitle = function(subtitle) {
        return $("<span>" + subtitle + "</span>");
      };

      BannerScroller.prototype.prev_banner = function() {
        if (this.first_banner_is_active()) {
          return this.last_banner();
        } else {
          return this.active_banner_id - 1;
        }
      };

      BannerScroller.prototype.next_banner = function() {
        if (this.last_banner_is_active()) {
          return this.first_banner();
        } else {
          return this.active_banner_id + 1;
        }
      };

      BannerScroller.prototype.last_banner_is_active = function() {
        return this.active_banner_id === this.last_banner();
      };

      BannerScroller.prototype.first_banner_is_active = function() {
        return this.active_banner_id === 0;
      };

      BannerScroller.prototype.first_banner = function() {
        return 0;
      };

      BannerScroller.prototype.last_banner = function() {
        return this.banners.length - 1;
      };

      return BannerScroller;

    })();
    return scroller = new BannerScroller($(".banners"));
  });
