  class NasaApp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            speed: "",
            hazard: "No",
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
        // this.setState({retrievedObjects:[] });
        var unfilteredObjects = objects.near_earth_objects        
        for (var date in unfilteredObjects){
            for (var object in unfilteredObjects[date]){
                if (this.state.hazard === "Yes") {
                    if (unfilteredObjects[date][object].is_potentially_hazardous_asteroid && unfilteredObjects[date][object].close_approach_data[0].relative_velocity.miles_per_hour > this.state.speed) {
                        let approachDate = date;
                        let hazardous = this.state.hazard;
                        let speed = unfilteredObjects[date][object].close_approach_data[0].relative_velocity.miles_per_hour;
                        let diameter = unfilteredObjects[date][object].estimated_diameter.feet.estimated_diameter_max;
    
                        this.setState({retrievedObjects: this.state.retrievedObjects.concat({approachDate, hazardous, speed, diameter})})
                        console.log("new retrievedObjects array:")
                        console.log(this.state.retrievedObjects);
                    }
                } else if (this.state.hazard === "No"){
                    if (unfilteredObjects[date][object].close_approach_data[0].relative_velocity.miles_per_hour > this.state.speed) {
                        let approachDate = date;
                        let hazardous = this.state.hazard;
                        let speed = unfilteredObjects[date][object].close_approach_data[0].relative_velocity.miles_per_hour;
                        let diameter = unfilteredObjects[date][object].estimated_diameter.feet.estimated_diameter_max;
    
                        this.setState({retrievedObjects: this.state.retrievedObjects.concat({approachDate, hazardous, speed, diameter})})                        
                        // this.state.retrievedObjects.push({approachDate, hazardous, speed, diameter})
                        console.log("new retrievedObjects array:")
                        console.log(this.state.retrievedObjects);
                    }
                }
            }
        }
    }

    handleSliderChange = (event) => {
        this.setState({ speed: event.target.value });
        this.updateObjectsUrl();
    }

    handleCheckboxChange = (event) => {
        if (this.state.hazard === "No"){
            this.setState({hazard: "Yes"})
        } else {
            this.setState({hazard: "No"})
        }

        this.updateObjectsUrl();
    }

    render() {
        return (
            <div className="row">
                <input class="form-check-input" type="checkbox" name="hazard" value="on" onChange={this.handleCheckboxChange}/>
                <div class="row"><input step="1000" type="range" value={this.state.speed} min="0" max="60000" onChange={this.handleSliderChange} />
                </div>
                <SpeedLabel speed={this.state.speed}/>

                <div className="row">
                    <div className="col-sm-12 mt-3">
                        <h3 className="text-secondary mb-3"><span>87</span> objects found.</h3>
                        <table className="table table-responsive table-striped">
                            <thead className="thead-inverse">
                                <tr>
                                    <th>Approach Date</th>
                                    <th>Hazardous?</th>
                                    <th>Speed (mph)</th>
                                    <th>Max. Diameter (feet)</th>
                                </tr>
                            </thead>
                            <ObjectTable objects={this.state.retrievedObjects} />
                        </table>
                    </div>
                </div>
            </div>   
        )
      }
}

class SpeedLabel extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="row">Minimum Speed: {this.props.speed} mph
            </div>
        )
      }
}

class ObjectTable extends React.Component {
    constructor(props) {
        super(props)

    }

    render() {
        return (
            <tbody>
            <tr>
            <td>2017-10-20</td>
            <td>No</td>
            <td>15,267</td>
            <td>250</td>
            </tr>
            {this.props.objects.map(object => {
                return (
                    <tr>
                    <td>{object.approachDate}</td>
                    <td>{object.hazardous}</td>
                    <td>{object.speed}</td>
                    <td>{object.diameter}</td>
                    </tr>
                )
            })}
            </tbody>
        )
      }
}
