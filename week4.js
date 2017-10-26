class MoviesApp extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        title: "",
        poster_url: "http://via.placeholder.com/300x450",
        searched: false,
        favorites: []
      }
    }
  
    handleTitleChange = (event) => {
      this.setState({ title: event.target.value });
    }
  
    handleSubmit = (event) => {
      event.preventDefault();
      // let key = 'e9743662f5a39568d8e25225f2c97e09'
      let key = 'bde024f3eb43f597aafe01ed9c9098c6'
  
      let movie_search_url = 'https://api.themoviedb.org/3/search/movie?api_key=' + key + '&language=en-US'
      movie_search_url += "&query=" + this.state.title;
      fetch(movie_search_url).then(this.parseResponse).then(this.showPoster);
      this.setState({ title: "" });
    }
  
    parseResponse = (response) => { return response.json(); }
  
    showPoster = (data) => {
      if (data.results.length > 0) {
        this.setState({ searched: true, poster_url: "http://image.tmdb.org/t/p/w300/" + data.results[0].poster_path })
      } else {
        this.setState({ searched: false })
      }
    }
  
    handleAddFavorite = (event) => {
      event.preventDefault();
      this.setState( { favorites: this.state.favorites.concat(this.state.poster_url) } );
    }
  
    render() {
      let addLink = null;
  
      if (this.state.searched) {
        addLink = <a href="#" onClick={this.handleAddFavorite} className="btn btn-primary" id="addFavorite">Add to Favorites</a>
      }
  
      return (
        <div className="row">
          <div className="col-sm-6">
            <form onSubmit={this.handleSubmit}>
              <input placeholder="Search by title..." className="form-control" onChange={this.handleTitleChange} value={this.state.title} type="text" name="title" autofocus={true} />
              <button class="btn btn-primary my-3 mr-3">Search</button>
              {addLink}
            </form>
  
            <div>
              <img id="movie" src={this.state.poster_url} />
            </div>
          </div>
  
          <div className="col-sm-6">
            <Favorites posters={this.state.favorites} />
          </div>
        </div>
      )
    }
  }
  

  class Favorites extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        image_urls: props.posters
      }
    }
  
    render() {
      return (
        <div>
          {this.props.posters.map(favorite => {
            return <img key={favorite} className="float-left thumbnail" src={favorite} />
          })}
        </div>
      )
    }
  }
  
