'use strict';

var albumURL = 'https://api.getchute.com/v2/albums/aACiujyl/assets';

var GalleryHeader = React.createClass({
  render: function(){
    return (
      <div className="gallery-header">
      </div>
    );
  }
});

var SearchInput = React.createClass({
  handleFilter: function(e){
    e.preventDefault();
    this.props.handleChange(this.refs.filterTextInput.value);
  },
  render: function(){
    return (
      <div className="search-input">
        <i className="search-icon fa-2x fa fa-hashtag"></i><input className="search-hashtag" type="search" ref="filterTextInput" placeholder="Search Hash Tags" onChange={this.handleFilter}/>
      </div>
    )
  }
});

var ThumbnailContainer = React.createClass({
  getInitialState: function(){
    return {
      almbum_info: {},
      filterText: '',
      thumbnail_data: [],
      pagination_data: {},
      isContentEmpty: false
    };
  },
  componentDidMount: function(){
    window.addEventListener('scroll', this.handleScroll);
    this.loadThumbnailsFromAPI(albumURL);
  },
  componentWillUnmount:function(){
    window.removeEventListener('scroll', this.handleScroll);
  },
  loadMore: function(){

  },
  loadThumbnailsFromAPI: function(url){
    $.ajax({
      url: url,
      dataType: 'json',
      cache: true,
      success: function(data){
        this.setState({
          almbum_info: data.response,
          thumbnail_data: this.state.thumbnail_data.concat(data.data),
          pagination_data: data.pagination
        });
      }.bind(this),
      error: function(xhr, status, err){
        console.log(status + err.toString());
      }.bind(this)

    });
  },
  handleScroll: function(e){
    var windowScroll = $(window).scrollTop();
    var documentScroll = $(document).height() - $(window).height();
    if( windowScroll === documentScroll){
      this.loadThumbnailsFromAPI(this.state.pagination_data.next_page);
    };
  },
  filterData: function(filterTextInput){
    this.setState({
      filterText: filterTextInput
    });
  },
  render: function(){
    var thumbnail_list = [];
    var regex = new RegExp(this.state.filterText, 'i')
    var _this = this;
    this.state.thumbnail_data.forEach(function(thumbnail){
      var tagCount = thumbnail.tags.filter(function(tag){
        if(tag.search(regex) > -1){
          return true;
        }
        return;
      });

      if(tagCount.length >= 1 || tagCount.length === 0 && _this.state.filterText === ''){
        thumbnail_list.push(<Thumbnail key={thumbnail.id} post={thumbnail}/>);
      }
    });
    return (
      <div id="thumbnail-container"> 
        <SearchInput handleChange={this.filterData}/>
        <div className="thumbnail-list">
          {thumbnail_list}
        </div>
      </div>
    );
  }
});

var Thumbnail = React.createClass({
  getInitialState: function(){
    return {
      display: false
    };
  },
  openLightbox: function(e){
    e.preventDefault();
    this.setState({display: true});
  },
  closeLightbox: function(e){
    e.stopPropagation();
    this.setState({display: false});
  },
  render: function(){
    var post = this.props.post;
    var thumbnail_image_size = '250x250';
    var thumbnail_image = 'https://media.getchute.com/m/' + this.props.post.shortcut + '/c/' + this.props.post.chute_asset_id + '/' + thumbnail_image_size;
    var service = this.props.post.service === 'uploaded' ? 'upload' : this.props.post.service 
    return (
      <div className="post" onClick={this.openLightbox}>
        <div className="post-content">
          <img className="post-image" src={thumbnail_image} />
          <div className="post-user-info clearfix">
            <img className="post-user-avatar" src={post.user.avatar}/>
            <span className="post-user-username"> {post.user.username} </span>
            <span className={'post-user-service fa fa-' + service}></span>

          </div>
          <p className="post-caption">
            {post.caption ? post.caption: "No Caption"}
          </p>
        </div>
        { this.state.display ? <Lightbox post={post} closeHandler={this.closeLightbox}/> : null}
      </div>
    );
  }
});

var Lightbox = React.createClass({
  render: function(){
    var lightbox_image = 'https://media.getchute.com/m/' + this.props.post.shortcut + '/c/' + this.props.post.chute_asset_id;
    return (
      <div className="lightbox">
        <div className="lightbox-background" onClick={this.props.closeHandler}></div>
        <div className="lightbox-content" onClick={this.props.closeHandler}> 
          <img src={lightbox_image} />
          <div className="lightbox-caption">
            {this.props.post.caption ? this.props.post.caption: "No Caption"}
          </div>
        </div>
      </div>
    )
  }
});

var Gallery = React.createClass({
  render: function(){
    return (
      <div id="gallery-container">
        <GalleryHeader />
        <ThumbnailContainer />
      </div>
    );
  }
});

ReactDOM.render(<Gallery />, document.getElementById('container'));