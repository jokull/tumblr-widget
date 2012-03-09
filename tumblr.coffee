root = exports ? this

class root.NextPage extends Backbone.View

  el: ".pagination .next"

  events:
    "click": "click"
  
  initialize: (options) ->
    @collection.bind "last", @hide

  hide: =>
    ($ @el).hide()

  click: (e) =>
    e.preventDefault()
    @collection.page()


class root.TumblrPost extends Backbone.Model


class root.Tumblr extends Backbone.Collection

  model: TumblrPost
  endpoint: 'http://api.tumblr.com/v2/blog/'
  params: {limit: 1} # Default only one

  initialize: (options) ->
    @endpoint = @endpoint + options.hostname
    @params = _.extend @params, (options.params or {})
  
  page: =>
    params = _.extend @params, {offset: @length - 1}
    $.ajax
      url: @endpoint + '/posts/json?' + ($.param params)
      dataType: "jsonp"
      jsonp: "jsonp"
      success: (data, status) =>
        @add data.response.posts
        @trigger "paged"
        @trigger "last" if data.response.total_posts == @length


class root.TumblrPostView extends Backbone.View

  className: "tumblr-post"

  initialize: (options) ->
    @model.bind "change", @render if @model

  render: =>
    tpl = _.template ($ "#tpl-tumblr-post").html()
    ($ @el).addClass (@model.get "type")
    ($ @el).html (tpl @model.toJSON())
    return @

  
class root.TumblrView extends Backbone.View
  
  initialize: (options) ->
    @collection.bind "reset", @all
    @collection.bind "add", @add
    
  all: () =>
    ($ @el).html("")
    @collection.each @add
    
  add: (model) =>
    model.view = new TumblrPostView model: model
    ($ @el).append model.view.render().el


