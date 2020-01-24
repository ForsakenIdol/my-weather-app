import React from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css'

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

      /* Other variables */
      timeInc: 0, /* Navigation for the day */
      totalLines: null,
      city: null,
      country: null,
      forecastTime: null /* Current time at which forecast was taken */
    }
  }

  kelvinToCelsius = (kelvin) => {return (kelvin - 273.15);}

  /* 
   * Fetch API address for Perth, AU:
   * http://api.openweathermap.org/data/2.5/forecast?id=2063523&APPID=a61002d90fe4eaac824f28012985aa2c
   */
  getWeatherData = () => {
    fetch("http://api.openweathermap.org/data/2.5/forecast?id=2063523&APPID=a61002d90fe4eaac824f28012985aa2c")
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

  render() {
    return (
      <div className="p-3 mb-2 bg-dark text-white">
        <div class="row" id="title-forecast">
          <div class="col-md-4">{/* Empty spacer */}</div>
          <div class="col-md-4">
            <div class="text-center">
              <h3>Today's Forecast:</h3>
              <h5><small>{this.state.city == null ? "undefined" : this.state.city}, 
              {this.state.country == null ? "undefined" : this.state.country}</small></h5>
            </div>
          </div>
          <div class="col-md-4">{/* Empty spacer */}</div>
        </div>
        <div class="row" id="current-forecast">
          <div class="col-md-4">
            <div class="text-center">
              <button type="button" onClick={this.decrementTime} class="btn btn-primary btn-sm">Remove 3 hours</button>
            </div>
          </div>
          <div class="col-md-4">
            <div class="text-center"><h1>{this.state.day1 == null ? "--" : this.state.day1} °C</h1></div>
          </div>
          <div class="col-md-4">
            <div class="text-center">
              <button type="button" onClick={this.incrementTime} class="btn btn-primary btn-sm">Add 3 hours</button>
            </div>
          </div>
        </div>
        <div class="mt-5" id="spacer">{/* Empty row spacer */}</div>
        <div class="row" id="later-forecast">
          <div class="col-md-3">
            <div class="text-center">
              <p class="lead">Tomorrow</p>
              <h2>{this.state.day2 == null ? "--" : this.state.day2} °C</h2>
            </div>
          </div>
          <div class="col-md-3">
            <div class="text-center">
              <p class="lead">Day 3</p>
              <h2>{this.state.day3 == null ? "--" : this.state.day3} °C</h2>
            </div>
          </div>
          <div class="col-md-3">
            <div class="text-center">
              <p class="lead">Day 4</p>
              <h2>{this.state.day4 == null ? "--" : this.state.day4} °C</h2>
            </div>
          </div>
          <div class="col-md-3">
            <div class="text-center">
              <p class="lead">Day 5</p>
              <h2>{this.state.day5 == null ? "--" : this.state.day5} °C</h2>
            </div>
          </div>
        </div>
        <div class="mt-5" id="spacer">{/* Empty row spacer */}</div>
        <div class="row" id="reset-button">
          <div class="col-md-4">{/* Empty spacer */}</div>
          <div class="col-md-4">
            <div class="text-center">
              <button type="button" onClick={() => {this.setState({timeInc: 0}); this.getWeatherData();}} class="btn btn-danger btn-sm">Reset Forecast</button>
            </div>
          </div>
          <div class="col-md-4">{/* Empty spacer */}</div>
        </div>
        <div class="mt-5" id="spacer">{/* Empty row spacer */}</div>
        <div class="row" id="about-app">
          <div class="col-md-4">{/* Empty spacer */}</div>
          <div class="col-md-4">
            <div class="text-center">
              <h6><small>This app was made by Lachlan and developed at Takor.
                It is a simple weather app to demonstrate API fetch requests and practise good git commits.</small></h6>
                <h6><small>Current date and time of forecast: 
                  {this.state.forecastTime == null ? "--" : this.state.forecastTime}</small></h6>
            </div>
          </div>
          <div class="col-md-4">{/* Empty spacer */}</div>
        </div>
      </div>
    );
  }
}

export default App;