(function() {
  var scroller;

  window.Timer = (function() {

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
        _this.scroller.show_next();
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

  window.ImageQueue = (function() {

    function ImageQueue() {
      this.images = [];
    }

    ImageQueue.prototype.length = function() {
      return this.images.length;
    };

    ImageQueue.prototype.add = function(image_url, link, alt, subtitle) {
      return this.images.push({
        url: image_url,
        link: link,
        alt: alt,
        subtitle: subtitle
      });
    };

    ImageQueue.prototype.first = function() {
      return this.images[0];
    };

    ImageQueue.prototype.last = function() {
      return this.images[this.images.length - 1];
    };

    ImageQueue.prototype.prev = function() {};

    ImageQueue.prototype.next = function() {};

    ImageQueue.prototype.active = function() {};

    return ImageQueue;

  })();

  window.Carousel = (function() {

    function Carousel(container) {
      this.container = container;
      this.init_dom_references();
      this.init_controls();
      this.init_image_data();
      this.fade_in_new(this.first_image());
      this.preload_next_image();
      this.start_automatic_scrolling();
    }

    Carousel.prototype.rotate_to = function(id) {
      return this.fade_out_active() && this.fade_in_new(id);
    };

    Carousel.prototype.fade_out_active = function() {
      var _this = this;
      this.backstage.empty();
      this.stage.find("a").appendTo(this.backstage).fadeOut(function() {
        return _this.preload_next_image();
      });
      return this.stage.empty() && this.subtitle.empty();
    };

    Carousel.prototype.fade_in_new = function(id) {
      var alt, image_url, link, subtitle;
      this.active_image_id = id;
      image_url = this.active_image().image_url;
      link = this.active_image().link;
      alt = this.active_image().alt;
      subtitle = this.active_image().subtitle;
      this.image_tag(image_url, alt, link).appendTo(this.stage).hide().fadeIn();
      return this.subtitle_tag(subtitle).appendTo(this.subtitle);
    };

    Carousel.prototype.init_controls = function() {
      var _this = this;
      this.next_button.click(function() {
        _this.stop_automatic_scrolling();
        return _this.show_next();
      });
      this.prev_button.click(function() {
        _this.stop_automatic_scrolling();
        return _this.show_prev();
      });
      this.pause_button.click(function() {
        return _this.stop_automatic_scrolling();
      });
      return this.play_button.click(function() {
        return _this.start_automatic_scrolling();
      });
    };

    Carousel.prototype.show_next = function() {
      return this.rotate_to(this.next_image());
    };

    Carousel.prototype.show_prev = function() {
      return this.rotate_to(this.prev_image());
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

    Carousel.prototype.start_automatic_scrolling = function() {
      if (this.timer) {
        this.toggle_play_button();
        return this.timer.destroy().create();
      } else {
        this.toggle_play_button();
        return this.timer = new Timer(this, 6000);
      }
    };

    Carousel.prototype.stop_automatic_scrolling = function() {
      if (this.timer.running()) {
        this.toggle_play_button();
        return this.timer.destroy();
      }
    };

    Carousel.prototype.image_tag = function(image_url, alt, link) {
      var image;
      if (alt == null) alt = "";
      if (link == null) link = "";
      image = $('<a/>', {
        href: link
      });
      return image.html($('<img/>', {
        src: image_url,
        alt: alt
      }));
    };

    Carousel.prototype.subtitle_tag = function(subtitle) {
      return $("<span>" + subtitle + "</span>");
    };

    Carousel.prototype.preload_next_image = function() {
      var next_image;
      if (!(this.preloaded_images != null)) {
        this.preloaded_images = [this.active_image()];
      }
      if (this.preloaded_images.length < this.images.length) {
        next_image = this.images[this.next_image()];
        this.backstage.empty();
        this.image_tag(next_image.image).appendTo(this.backstage);
        return this.preloaded_images.push(next_image);
      }
    };

    Carousel.prototype.init_dom_references = function() {
      this.next_button = this.container.find(".controls .next");
      this.prev_button = this.container.find(".controls .prev");
      this.play_button = this.container.find(".controls .play");
      this.pause_button = this.container.find(".controls .pause");
      this.stage = this.container.find(".stage");
      this.backstage = this.container.find(".backstage");
      return this.subtitle = this.container.find(".subtitle");
    };

    Carousel.prototype.init_image_data = function() {
      var data, el, elements, _i, _len, _results;
      elements = (function() {
        var _i, _len, _ref, _results;
        _ref = this.container.find(".image-list input");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          el = _ref[_i];
          _results.push($(el));
        }
        return _results;
      }).call(this);
      this.images = [];
      _results = [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        el = elements[_i];
        data = {
          image_url: el.attr("imgurl"),
          subtitle: el.attr("subtitle"),
          link: el.attr("link"),
          alt: el.attr("alt")
        };
        _results.push(this.images.push(data));
      }
      return _results;
    };

    return Carousel;

  })();

  scroller = new Carousel($(".carousel"));

}).call(this);
