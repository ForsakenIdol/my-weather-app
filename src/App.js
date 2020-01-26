import React from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import citiesJSON from "./cities.json"; /* This is the file containing all the cities and their codes. */

/*
 * ---------- Buglist & TODO ----------
 * ~ The name search form needs to be 
 * submitted twice before the weather
 * forecast changes.
 */

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /* Forecast variables */
      day1: null,
      day2: null,
      day3: null,
      day4: null,
      day5: null,
      /* Weather description variables (used for icons) */
      day1Weather: null,
      day2Weather: null,
      day3Weather: null,
      day4Weather: null,
      day5Weather: null,
      /* Other variables */
      timeInc: 0, /* Navigation for the day */
      totalLines: null,
      city: null,
      country: null,
      cityCode: 2063523, /* Default city code is Perth, AU */
      forecastTime: null, /* Current time at which forecast was taken */
      cityInput: null /* State variable for the name input form */
    }
  }

  kelvinToCelsius = (kelvin) => {return (kelvin - 273.15);}

  /* 
   * Fetch API address for Perth, AU:
   * http://api.openweathermap.org/data/2.5/forecast?id=2063523&APPID=a61002d90fe4eaac824f28012985aa2c
   */
  getWeatherData = () => {
    if (!this.state.cityCode) this.setState({cityCode: 2063523}); /* Form is manually emptied, reset code to default */
    let APIAddress = "http://api.openweathermap.org/data/2.5/forecast?id=" + this.state.cityCode
                      + "&APPID=a61002d90fe4eaac824f28012985aa2c"
    fetch(APIAddress)
    .then((response) => {
      if (!response.ok) throw new Error("Weather API response was not ok");
      return response.json();
    }).then(json_result /* This is the response.json() */ => {
      /* Set misc. state data */
      this.setState({city: json_result.city.name});
      this.setState({country: json_result.city.country});
      this.setState({forecastTime: json_result.list[this.state.timeInc].dt_txt});
      this.setState({totalLines: json_result.cnt});

      /* Set temperature data for days */
      this.setState({day1: this.state.timeInc > this.state.totalLines ? null :
        parseFloat(this.kelvinToCelsius(json_result.list[this.state.timeInc].main.temp).toFixed(0))});
      this.setState({day2: 6 + this.state.timeInc > this.state.totalLines ? null :
        parseFloat(this.kelvinToCelsius(json_result.list[6 + this.state.timeInc].main.temp).toFixed(0))});
      this.setState({day3: 12 + this.state.timeInc > this.state.totalLines ? null :
        parseFloat(this.kelvinToCelsius(json_result.list[12 + this.state.timeInc].main.temp).toFixed(0))});
      this.setState({day4: 18 + this.state.timeInc > this.state.totalLines ? null :
        parseFloat(this.kelvinToCelsius(json_result.list[18 + this.state.timeInc].main.temp).toFixed(0))});
      this.setState({day5: 24 + this.state.timeInc > this.state.totalLines ? null :
        parseFloat(this.kelvinToCelsius(json_result.list[24 + this.state.timeInc].main.temp).toFixed(0))});

      /* Set temperature descriptions for each day; this will be used in conjunction with the weather icons */
      this.setState({day1Weather: this.state.timeInc > this.state.totalLines ? null :
        json_result.list[this.state.timeInc].weather[0].main})
      this.setState({day2Weather: 6 + this.state.timeInc > this.state.totalLines ? null :
        json_result.list[6 + this.state.timeInc].weather[0].main})
      this.setState({day3Weather: 12 + this.state.timeInc > this.state.totalLines ? null :
        json_result.list[12 + this.state.timeInc].weather[0].main})
      this.setState({day4Weather: 18 + this.state.timeInc > this.state.totalLines ? null :
         json_result.list[18 + this.state.timeInc].weather[0].main})
      this.setState({day5Weather: 24 + this.state.timeInc > this.state.totalLines ? null :
        json_result.list[24 + this.state.timeInc].weather[0].main})
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
  }

  componentDidMount() { /* When the component is displayed, run this function */
    this.getWeatherData();
  }

  // Move forecast forward by 3 hours; does nothing if user tries to move it past the 5 day limit
  incrementTime = () => {
    if(this.state.timeInc < this.state.totalLines) {
      this.setState({timeInc: this.state.timeInc + 1});
      this.getWeatherData();
    }
  }
  // Moves forecast back by 3 hours; does nothing if user tries to move it behind the current day
  decrementTime = () => {
    if(this.state.timeInc > 0) {
      this.setState({timeInc: this.state.timeInc - 1});
      this.getWeatherData();
    }
  }

  /*
   * Given the "Main" value for the weather (conditions),
   * finds the corresponding image link (icons).
   */
  getWeatherIcon = (props) => {
    let conditions = ["Thunderstorm", "Drizzle", "Rain", "Snow", "Atmosphere", "Clear", "Clouds"];
    let icons = ["http://openweathermap.org/img/wn/11d@2x.png", "http://openweathermap.org/img/wn/10d@2x.png",
                 "http://openweathermap.org/img/wn/09d@2x.png", "http://openweathermap.org/img/wn/13d@2x.png",
                 "http://openweathermap.org/img/wn/50d@2x.png", "http://openweathermap.org/img/wn/01d@2x.png",
                 "http://openweathermap.org/img/wn/04d@2x.png"];
    for (let i = 0; i < 7; i++) {
      if (props === conditions[i]) {
        return icons[i];
      }
    }
  }

  /* Update the value of cityCode based on the data entered in the text input for the form */
  handleCodeChange = event => {this.setState({cityCode: event.target.value});}

  /* On form submit ("Update Code" pressed), re-request weather data */
  handleCodeSubmit = event => {
    let cityFound = false;
    /*
     * Checks the input code against the "cities.json" file. If a code match occurs, 
     * log the name of the city to the console.
     */
    for (let i = 0; i < citiesJSON.length; i++) {
      if (citiesJSON[i].id == this.state.cityCode) {
        console.log(citiesJSON[i].name); /* Debug print */
        cityFound = true;
        this.getWeatherData();
        break;
      }
    }
    if (!cityFound) {
      this.setState({cityCode: 2063523});
      console.log("No match for the given cityCode.");
    }
    event.preventDefault();
  }

  handleNameChange = event => {this.setState({cityInput: event.target.value});}

  handleNameSubmit = event => {
    let cityFound = false;
    /*
     * Checks the input name against the "cities.json" file. If a name match occurs, 
     * log the code of the city to the console.
     */
    for (let i = 0; i < citiesJSON.length; i++) {
      if (citiesJSON[i].name == this.state.cityInput) {
        console.log("----------------------------------");
        console.log(this.state.cityCode);
        console.log(citiesJSON[i].id);
        this.setState({cityCode: citiesJSON[i].id});
        console.log("After:");
        console.log(this.state.cityCode);
        console.log(citiesJSON[i].id); /* Debug print */
        cityFound = true;
        this.getWeatherData();
        break;
      }
    }
    if (!cityFound) {
      //this.setState({city: "Perth", country: "AU"});
      console.log("No match for the given city name.");
    }
    event.preventDefault();
  }

  render() {
    return (
      <div className="p-3 mb-2 bg-dark text-white">
        <div className="row" id="title-forecast">
          <div className="col-md-4">{/* Empty spacer */}</div>
          <div className="col-md-4">
            <div className="text-center">
              <h3>Today's Forecast: {this.state.day1Weather == null ? "--" : this.state.day1Weather}</h3>
              <h5><small>{this.state.city == null ? "--" : this.state.city}, 
              {this.state.country == null ? "--" : this.state.country}</small></h5>
            </div>
          </div>
          <div className="col-md-4">{/* Empty spacer */}</div>
        </div>
        <div className="row" id="current-forecast">
          <div className="col-md-4">
            <div className="text-center">
              <button type="button" onClick={this.decrementTime} className="btn btn-primary btn-sm">Remove 3 hours</button>
            </div>
          </div>
          <div className="col-md-4"> {/* Forecast for today */}
            <img src={this.getWeatherIcon(this.state.day1Weather)} className="mx-auto d-block" alt=""></img>
            <div className="text-center"><h1>{this.state.day1 == null ? "--" : this.state.day1} °C</h1></div>
          </div>
          <div className="col-md-4">
            <div className="text-center">
              <button type="button" onClick={this.incrementTime} className="btn btn-primary btn-sm">Add 3 hours</button>
            </div>
          </div>
        </div>
        <div className="mt-5" id="spacer">{/* Empty row spacer */}</div>
        <div className="row" id="later-forecast">
          <div className="col-md-3">
            <div className="text-center">
              <p className="lead">Tomorrow: {this.state.day2Weather == null ? "--" : this.state.day2Weather}</p>
              <img src={this.getWeatherIcon(this.state.day2Weather)} className="mx-auto d-block" alt=""></img>
              <h2>{this.state.day2 == null ? "--" : this.state.day2} °C</h2>
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-center">
              <p className="lead">Day 3: {this.state.day3Weather == null ? "--" : this.state.day3Weather}</p>
              <img src={this.getWeatherIcon(this.state.day3Weather)} className="mx-auto d-block" alt=""></img>
              <h2>{this.state.day3 == null ? "--" : this.state.day3} °C</h2>
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-center">
              <p className="lead">Day 4: {this.state.day4Weather == null ? "--" : this.state.day4Weather}</p>
              <img src={this.getWeatherIcon(this.state.day4Weather)} className="mx-auto d-block" alt=""></img>
              <h2>{this.state.day4 == null ? "--" : this.state.day4} °C</h2>
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-center">
              <p className="lead">Day 5: {this.state.day5Weather == null ? "--" : this.state.day5Weather}</p>
              <img src={this.getWeatherIcon(this.state.day5Weather)} className="mx-auto d-block" alt=""></img>
              <h2>{this.state.day5 == null ? "--" : this.state.day5} °C</h2>
            </div>
          </div>
        </div>
        <div className="mt-5" id="spacer">{/* Empty row spacer */}</div>
        <div className="row" id="reset-button">
          <div className="col-md-4">{/* Empty spacer */}</div>
          <div className="col-md-4">
            <div className="text-center">
              <button type="button" onClick={() => {this.setState({timeInc: 0}); this.getWeatherData();}} className="btn btn-danger btn-sm">Reset Forecast</button>
            </div>
          </div>
          <div className="col-md-4">{/* Empty spacer */}</div>
        </div>
        <div className="mt-5" id="spacer">{/* Empty row spacer */}</div>
        <div className="row" id="about-app">
          <div className="col-md-4">
            <div className="text-center">
              <small>Enter your city code or ID (not your postcode!) to get accurate forecast information relative to your location:</small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center">
              <h6><small>This app was made by Lachlan D Whang and developed at Takor.
                It is a simple weather app to demonstrate API fetch requests and practise good git commits.</small></h6>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center">
              <small>Searching by city name instead? Enter it below for accurate forcast information!</small>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <form onSubmit={this.handleCodeSubmit}>
              <div className="text-center">
                <div className="form-group">
                  <input type="text" className="form-control-sm" pattern="^[0-9]{5,7}$" onChange={this.handleCodeChange}
                   title="City codes must be between 5 to 7 digits long!" />
                  <input type="submit" className="btn btn-info btn-sm" value="Update Code" />
                </div>
              </div>
            </form>
          </div>
          <div className="col-md-4">
            <div className="text-center">
            <h6><small>Current date and time of forecast: </small></h6><h6><small>
                  {this.state.forecastTime == null ? "--" : this.state.forecastTime}</small></h6>
            </div>
          </div>
          <div className="col-md-4">
            <form onSubmit={this.handleNameSubmit}> {/* The form lags behind by one call. */}
              <div className="text-center">
                <div className="form-group">
                  <input type="text" className="form-control-sm" onChange={this.handleNameChange} />
                  <input type="submit" className="btn btn-info btn-sm" value="Update Name" />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-5" id="spacer">{/* Empty row spacer */}</div>
        <div className="row">
          <div className="col-md-12">
            <div className="text-center">
              <h6><small>Weather data from openweathermap.org</small></h6>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;