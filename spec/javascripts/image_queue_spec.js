
  describe("ImageQueue", function() {
    beforeEach(function() {
      console.log(window);
      return this.images = new window.ImageQueue;
    });
    describe("initialize", function() {
      return it("should start with an empty list", function() {
        return expect(this.images.length()).toEqual(0);
      });
    });
    describe("add", function() {
      return it("should add a new item to the list", function() {
        this.images.add("url", "link", "alt", "subtitle");
        return expect(this.images.length()).toEqual(1);
      });
    });
    return describe("first", function() {
      return it("should return the first image", function() {
        this.images.add("first_url", "link", "alt", "subtitle");
        this.images.add("second_url", "link", "alt", "subtitle");
        return expect(this.images.first().url).toEqual("first_url");
      });
    });
  });
