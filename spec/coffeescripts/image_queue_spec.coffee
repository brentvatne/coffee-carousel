describe "ImageQueue", ->
  beforeEach ->
    console.log window
    @images = new window.ImageQueue

  describe "initialize", ->
    it "should start with an empty list", ->
      expect(@images.length()).toEqual(0)

  describe "add", ->
    it "should add a new item to the list", ->
      @images.add("url","link","alt","subtitle")
      expect(@images.length()).toEqual(1)

  describe "first", ->
    it "should return the first image", ->
      @images.add("first_url","link","alt","subtitle")
      @images.add("second_url","link","alt","subtitle")
      expect(@images.first().url).toEqual("first_url")
