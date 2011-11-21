
  $(function() {
    var BannerScroller, scroller;
    BannerScroller = (function() {

      function BannerScroller(container) {
        this.next_button = container.find(".controls .next");
        this.prev_button = container.find(".controls .prev");
        this.stage = container.find(".stage");
        this.greenroom = container.find(".greenroom");
        this.subtitle = container.find(".subtitle");
        this.banners = this.make_banner_list(container.find(".banner-list input"));
        console.log(this.banners);
        this.initialize_callbacks();
        this.current_banner_id = 0;
        this.show_banner(this.current_banner_id);
      }

      BannerScroller.prototype.initialize_callbacks = function() {
        var scroller;
        scroller = this;
        this.next_button.click(function() {
          return scroller.next();
        });
        return this.prev_button.click(function() {
          return scroller.prev();
        });
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

      BannerScroller.prototype.next = function() {
        return this.show_banner(this.get_next_banner());
      };

      BannerScroller.prototype.prev = function() {
        return this.show_banner(this.get_previous_banner());
      };

      BannerScroller.prototype.show_banner = function(id) {
        this.fade_out_old_banner();
        this.fade_in_new_banner(id);
        return this.current_banner_id = id;
      };

      BannerScroller.prototype.fade_out_old_banner = function() {};

      BannerScroller.prototype.fade_in_new_banner = function(id) {
        var image, link, subtitle;
        image = this.banners[id].image;
        subtitle = this.banners[id].subtitle;
        link = this.banners[id].link;
        this.draw_html_banner(image, link);
        this.draw_html_subtitle(subtitle);
        return this.current_banner = id;
      };

      BannerScroller.prototype.draw_html_banner = function(image, link) {
        this.stage.html("<a>").find("a").attr("href", link);
        return this.stage.find("a").html("<img>").find("img").attr("src", image);
      };

      BannerScroller.prototype.draw_html_subtitle = function(subtitle) {
        return this.subtitle.html(subtitle);
      };

      BannerScroller.prototype.get_previous_banner = function() {
        this.current_banner_id -= 1;
        if (this.current_banner_id < 0) {
          this.current_banner_id = this.banners.length - 1;
        }
        return this.current_banner_id;
      };

      BannerScroller.prototype.get_next_banner = function() {
        this.current_banner_id += 1;
        if (this.current_banner_id >= this.banners.length) {
          this.current_banner_id = 0;
        }
        return this.current_banner_id;
      };

      return BannerScroller;

    })();
    return scroller = new BannerScroller($(".banners"));
  });
