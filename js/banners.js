
  $(function() {
    var AutomaticScroller, BannerScroller, ImagePreloader, scroller;
    ImagePreloader = (function() {

      function ImagePreloader(images, container) {}

      return ImagePreloader;

    })();
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
        return this;
      };

      return AutomaticScroller;

    })();
    BannerScroller = (function() {

      function BannerScroller(container) {
        this.container = container;
        this.initialize_dom_objects();
        this.initialize_callbacks();
        this.get_banner_data();
        this.show_banner(0);
        this.create_timer();
      }

      BannerScroller.prototype.next = function() {
        return this.show_banner(this.next_banner());
      };

      BannerScroller.prototype.prev = function() {
        return this.show_banner(this.prev_banner());
      };

      BannerScroller.prototype.create_timer = function() {
        return this.timer = new AutomaticScroller(this, 2000);
      };

      BannerScroller.prototype.restart_timer = function() {
        return this.timer.destroy().create();
      };

      BannerScroller.prototype.show_banner = function(id) {
        this.hide_old_banner();
        this.show_new_banner(id);
        return this.active_banner = id;
      };

      BannerScroller.prototype.hide_old_banner = function() {
        this.backstage.empty();
        return this.stage.find("a").appendTo(this.backstage).fadeOut();
      };

      BannerScroller.prototype.show_new_banner = function(id) {
        this.draw_html_banner(this.banners[id].image, this.banners[id].link).hide().fadeIn();
        return this.draw_html_subtitle(this.banners[id].subtitle);
      };

      BannerScroller.prototype.initialize_dom_objects = function() {
        this.next_button = this.container.find(".controls .next");
        this.prev_button = this.container.find(".controls .prev");
        this.stage = this.container.find(".stage");
        this.backstage = this.container.find(".backstage");
        return this.subtitle = this.container.find(".subtitle");
      };

      BannerScroller.prototype.initialize_callbacks = function() {
        var _this = this;
        this.next_button.click(function() {
          _this.timer.destroy();
          return _this.next();
        });
        return this.prev_button.click(function() {
          _this.timer.destroy();
          return _this.prev();
        });
      };

      BannerScroller.prototype.get_banner_data = function() {
        return this.banners = this.make_banner_list(this.container.find(".banner-list input"));
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

      BannerScroller.prototype.draw_html_banner = function(image, link) {
        this.stage.html("<a>").find("a").attr("href", link);
        this.stage.find("a").html("<img>").find("img").attr("src", image);
        return this.stage.find("a");
      };

      BannerScroller.prototype.draw_html_subtitle = function(subtitle) {
        return this.subtitle.html(subtitle);
      };

      BannerScroller.prototype.prev_banner = function() {
        if (this.first_banner_is_active()) {
          return this.last_banner();
        } else {
          return this.active_banner - 1;
        }
      };

      BannerScroller.prototype.next_banner = function() {
        if (this.last_banner_is_active()) {
          return this.first_banner();
        } else {
          return this.active_banner + 1;
        }
      };

      BannerScroller.prototype.last_banner_is_active = function() {
        return this.active_banner === this.last_banner();
      };

      BannerScroller.prototype.first_banner_is_active = function() {
        return this.active_banner === 0;
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
