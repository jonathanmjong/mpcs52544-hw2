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
  

  class NasaApp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            speed: "",
            hazard: "off",
            retrievedObjects: [],
        }
    }

    updateObjectsUrl = (event) => {
        let key = '3pBIfywjREpG5Qd5pav8PcP0TGwVMza7v6pv57HZ'
    
        let nasa_search_url = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=2017-10-25&api_key=' + key 
        fetch(nasa_search_url).then(this.parseResponse).then(this.retrieveObjects);
    }

    parseResponse = (response) => { return response.json(); }    
    
    retrieveObjects = (objects) => {
        this.setState({retrievedObjects:[] });
        // console.log("entire object json...")
        // console.log(objects);
        // console.log("objects.near_earth_objects...");        
        // console.log(unfilteredObjects);
        var unfilteredObjects = objects.near_earth_objects        
        for (var date in unfilteredObjects){
            // console.log("objects by date...");                   
            // console.log(unfilteredObjects[date]);
            for (var object in unfilteredObjects[date]){
                // console.log("single object...");
                // console.log(unfilteredObjects[date][object]);
                // console.log("Name:");                
                // console.log(unfilteredObjects[date][object].name);
                // console.log("Approach Date:");
                // console.log(date);
                // console.log("Hazardous:");
                // console.log(unfilteredObjects[date][object].is_potentially_hazardous_asteroid);  
                // console.log("Speed (mph):");
                // console.log(unfilteredObjects[date][object].close_approach_data[0].relative_velocity.miles_per_hour);
                // console.log("Max Diameter (feet):");
                // console.log(unfilteredObjects[date][object].estimated_diameter.feet.estimated_diameter_max);  
                
                if (this.state.hazard === "on") {
                    if (unfilteredObjects[date][object].is_potentially_hazardous_asteroid && unfilteredObjects[date][object].close_approach_data[0].relative_velocity.miles_per_hour > this.state.speed) {
                        let approachDate = date;
                        let hazardous = unfilteredObjects[date][object].is_potentially_hazardous_asteroid;
                        let speed = unfilteredObjects[date][object].close_approach_data[0].relative_velocity.miles_per_hour;
                        let diameter = unfilteredObjects[date][object].estimated_diameter.feet.estimated_diameter_max;
    
                        this.state.retrievedObjects.push({approachDate, hazardous, speed, diameter})
                        console.log("new retrievedObjects array:")
                        console.log(this.state.retrievedObjects);
                    }
                } else if (this.state.hazard === "off"){
                    if (unfilteredObjects[date][object].close_approach_data[0].relative_velocity.miles_per_hour > this.state.speed) {
                        let approachDate = date;
                        let hazardous = unfilteredObjects[date][object].is_potentially_hazardous_asteroid;
                        let speed = unfilteredObjects[date][object].close_approach_data[0].relative_velocity.miles_per_hour;
                        let diameter = unfilteredObjects[date][object].estimated_diameter.feet.estimated_diameter_max;
    
                        this.state.retrievedObjects.push({approachDate, hazardous, speed, diameter})
                        console.log("new retrievedObjects array:")
                        console.log(this.state.retrievedObjects);
                    }
                }
            }
        }
    }

    handleSliderChange = (event) => {
        this.setState({ speed: event.target.value });
        console.log(this.state.speed);
        console.log("hello");
        this.updateObjectsUrl();
    }

    handleCheckboxChange = (event) => {
        if (this.state.hazard === "off"){
            this.setState({hazard: "on"})
        } else {
            this.setState({hazard: "off"})
        }
        console.log(this.state.hazard);
        this.updateObjectsUrl();
    }


    render() {
        return (
            <div className="row">
                <input class="form-check-input" type="checkbox" name="hazard" value="on" onChange={this.handleCheckboxChange}/>
                <div class="row"><input step="1000" type="range" value={this.state.speed} min="0" max="60000" onChange={this.handleSliderChange} /></div>
                <SpeedLabel speed={this.state.speed}/>
            </div>
        )
      }
}

class SpeedLabel extends React.Component {
    constructor(props) {
        super(props)
        // this.state = {
        //     min_speed: props.speed,
        // }
    }

    render() {
        return (
            <div className="row">Minimum Speed: {this.props.speed} mph
            </div>
        )
      }
}

class ObjectLabel extends React.Component {
    constructor(props) {
        super(props)

    }

    render() {
        return (
            <div className="row">
            </div>
        )
      }
}
