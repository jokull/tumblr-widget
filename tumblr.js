(function() {
  var root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.NextPage = (function(_super) {

    __extends(NextPage, _super);

    function NextPage() {
      this.click = __bind(this.click, this);
      this.hide = __bind(this.hide, this);
      NextPage.__super__.constructor.apply(this, arguments);
    }

    NextPage.prototype.el = ".pagination .next";

    NextPage.prototype.events = {
      "click": "click"
    };

    NextPage.prototype.initialize = function(options) {
      return this.collection.bind("last", this.hide);
    };

    NextPage.prototype.hide = function() {
      return ($(this.el)).hide();
    };

    NextPage.prototype.click = function(e) {
      e.preventDefault();
      return this.collection.page();
    };

    return NextPage;

  })(Backbone.View);

  root.TumblrPost = (function(_super) {

    __extends(TumblrPost, _super);

    function TumblrPost() {
      TumblrPost.__super__.constructor.apply(this, arguments);
    }

    return TumblrPost;

  })(Backbone.Model);

  root.Tumblr = (function(_super) {

    __extends(Tumblr, _super);

    function Tumblr() {
      this.page = __bind(this.page, this);
      Tumblr.__super__.constructor.apply(this, arguments);
    }

    Tumblr.prototype.model = TumblrPost;

    Tumblr.prototype.endpoint = 'http://api.tumblr.com/v2/blog/';

    Tumblr.prototype.params = {
      limit: 1
    };

    Tumblr.prototype.initialize = function(options) {
      this.endpoint = this.endpoint + options.hostname;
      return this.params = _.extend(this.params, options.params || {});
    };

    Tumblr.prototype.page = function() {
      var params,
        _this = this;
      params = _.extend(this.params, {
        offset: this.length - 1
      });
      console.log(this.endpoint + '/posts/json?' + ($.param(params)));
      return $.ajax({
        url: this.endpoint + '/posts/json?' + ($.param(params)),
        dataType: "jsonp",
        jsonp: "jsonp",
        success: function(data, status) {
          _this.add(data.response.posts);
          _this.trigger("paged");
          if (data.response.total_posts === _this.length) {
            return _this.trigger("last");
          }
        }
      });
    };

    return Tumblr;

  })(Backbone.Collection);

  root.TumblrPostView = (function(_super) {

    __extends(TumblrPostView, _super);

    function TumblrPostView() {
      this.render = __bind(this.render, this);
      TumblrPostView.__super__.constructor.apply(this, arguments);
    }

    TumblrPostView.prototype.className = "tumblr-post";

    TumblrPostView.prototype.initialize = function(options) {
      if (this.model) return this.model.bind("change", this.render);
    };

    TumblrPostView.prototype.render = function() {
      var tpl;
      tpl = _.template(($("#tpl-tumblr-post")).html());
      ($(this.el)).html(tpl(this.model.toJSON()));
      return this;
    };

    return TumblrPostView;

  })(Backbone.View);

  root.TumblrView = (function(_super) {

    __extends(TumblrView, _super);

    function TumblrView() {
      this.add = __bind(this.add, this);
      this.all = __bind(this.all, this);
      TumblrView.__super__.constructor.apply(this, arguments);
    }

    TumblrView.prototype.initialize = function(options) {
      this.collection.bind("reset", this.all);
      return this.collection.bind("add", this.add);
    };

    TumblrView.prototype.all = function() {
      ($(this.el)).html("");
      return this.collection.each(this.add);
    };

    TumblrView.prototype.add = function(model) {
      model.view = new TumblrPostView({
        model: model
      });
      return ($(this.el)).append(model.view.render().el);
    };

    return TumblrView;

  })(Backbone.View);

}).call(this);
