  class NasaApp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            speed: "0",
            hazard: "No",
            retrievedObjects: [],
        }
        this.updateObjectsUrl();
    }

    updateObjectsUrl = (event) => {
        let key = '3pBIfywjREpG5Qd5pav8PcP0TGwVMza7v6pv57HZ'
    
        let nasa_search_url = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=2017-10-25&api_key=' + key 
        fetch(nasa_search_url)
        .then(this.detectError)
        .then(this.parseResponse)
        .then(this.retrieveObjects)
        .catch(function () {
            console.log("There was a problem with the request");
        });
    }

    detectError = (request) => {
        if(!request.ok){
            throw Error();
        }
        return request;
    }

    parseResponse = (response) => { return response.json(); }    
    
    retrieveObjects = (objects) => {
        this.setState({retrievedObjects:[] });
        // get all near earth objects from json
        var unfilteredObjects = objects.near_earth_objects   
        // get all dated objects     
        for (var date in unfilteredObjects){
            // dated objects is an array, get all objects from within array
            for (var object in unfilteredObjects[date]){
                // hazardous objects only
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
                // both non hazardous and hazardous objects
                } else {
                    if (unfilteredObjects[date][object].close_approach_data[0].relative_velocity.miles_per_hour > this.state.speed) {
                        let approachDate = date;
                        // check if hazardous
                        var hazardous = "";
                        if (!unfilteredObjects[date][object].is_potentially_hazardous_asteroid){
                            hazardous = "No";                            
                        } else if (unfilteredObjects[date][object].is_potentially_hazardous_asteroid){
                            hazardous = "Yes";
                        }
                        let speed = unfilteredObjects[date][object].close_approach_data[0].relative_velocity.miles_per_hour;
                        let diameter = unfilteredObjects[date][object].estimated_diameter.feet.estimated_diameter_max;
    
                        this.setState({retrievedObjects: this.state.retrievedObjects.concat({approachDate, hazardous, speed, diameter})})                        
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
            <div className="container">
                <div className="row">
                    <span>Hazardous Objects Only</span>
                    <input class="form-check-input" type="checkbox" name="hazard" value="on" onChange={this.handleCheckboxChange}/>
                </div>

                <hr></hr>

                <div class="row"><input step="1000" type="range" value={this.state.speed} min="0" max="60000" onChange={this.handleSliderChange} />
                </div> 
                <SpeedLabel speed={this.state.speed}/>

                <hr></hr>
                
                <ObjectCountLabel objectCount={this.state.retrievedObjects.length}/>
                <div className="row">
                    <div className="col-sm-12 mt-3">
                        <table className="table table-responsive table-striped">
                            <thead className="thead-inverse">
                                <tr>
                                    <th>Approach Date</th>
                                    <th>Hazardous?</th>
                                    <th>Speed (mph)</th>
                                    <th>Max. Diameter (feet)</th>
                                </tr>
                            </thead>
                            <ObjectTable objects={this.state.retrievedObjects} hazardBox={this.state.hazard} />
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

class ObjectCountLabel extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <h3 className="text-secondary mb-3">{this.props.objectCount} Objects Found
            </h3>
        )
      }
}
class ObjectTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hazardClassName: "",
        }
    }

    render() {
        if (this.props.hazardBox === "No"){
            this.state.hazardClassName = "hazardous-row";
        } else {
            this.state.hazardClassName = "";
        }

        return (
            <tbody>
            {this.props.objects.map(object => {
                if (object.hazardous === "Yes") {
                    return (
                    <tr className={this.state.hazardClassName}>
                        <td>{object.approachDate}</td>
                        <td>{object.hazardous}</td>
                        <td>{object.speed}</td>
                        <td>{object.diameter}</td>
                    </tr>
                )
                } else {
                    return (
                    <tr>
                        <td>{object.approachDate}</td>
                        <td>{object.hazardous}</td>
                        <td>{object.speed}</td>
                        <td>{object.diameter}</td>
                    </tr>
                )
                }

            })}
            </tbody>
        )
      }
}
