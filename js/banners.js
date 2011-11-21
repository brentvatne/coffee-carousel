
  $(function() {
    var BannerScroller, scroller;
    BannerScroller = (function() {

      function BannerScroller(container) {
        this.container = container;
        this.next_button = this.container.find(".controls .next");
        this.prev_button = this.container.find(".controls .prev");
        this.stage = this.container.find(".stage");
        this.greenroom = this.container.find(".greenroom");
        this.banner_list = this.build_list(this.container.find(".banner-list input"));
        console.log(this.banner_list);
        this.show_banner(1);
        this.initialize_callbacks();
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

      BannerScroller.prototype.build_list = function(elements) {
        var banners, el, _i, _len, _results;
        banners = {};
        _results = [];
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          el = elements[_i];
          el = $(el);
          _results.push(banners[el.attr("bannerId")] = {
            image: el.attr("bannerUrl"),
            subtitle: el.attr("subtitle"),
            link: el.attr("link")
          });
        }
        return _results;
      };

      BannerScroller.prototype.next = function() {
        return alert("next");
      };

      BannerScroller.prototype.prev = function() {
        return alert("prev");
      };

      BannerScroller.prototype.show_banner = function(id) {
        return this.stage.html(this.banner_list[id]);
      };

      BannerScroller.prototype.set_current_banner = function(id) {};

      BannerScroller.prototype.get_next_banner = function() {};

      return BannerScroller;

    })();
    return scroller = new BannerScroller($(".banners"));
  });
