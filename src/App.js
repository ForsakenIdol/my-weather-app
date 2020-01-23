import React from 'react';
import './App.css';

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
      timeInc: 2, /* Navigation for the day */
      city: null,
      country: null
    }
  }

  kelvinToCelsius = (kelvin) => {return (kelvin - 273.15);}

  /* 
   * Fetch API address for Perth:
   * http://api.openweathermap.org/data/2.5/forecast?id=2063523&APPID=a61002d90fe4eaac824f28012985aa2c
   */
  getWeatherData = () => {
    fetch("http://api.openweathermap.org/data/2.5/forecast?id=2063523&APPID=a61002d90fe4eaac824f28012985aa2c")
    .then((response) => {
      if (!response.ok) throw new Error("Weather API response was not ok");

      return response.json();
    }).then(json_result /* This is the response.json() */ => {
      /* Set temperature data for days */
      this.setState({day1: parseFloat(this.kelvinToCelsius(json_result.list[this.state.timeInc].main.temp).toFixed(4))});
      this.setState({day2: parseFloat(this.kelvinToCelsius(json_result.list[6 + this.state.timeInc].main.temp).toFixed(4))});
      this.setState({day3: parseFloat(this.kelvinToCelsius(json_result.list[12 + this.state.timeInc].main.temp).toFixed(4))});
      this.setState({day4: parseFloat(this.kelvinToCelsius(json_result.list[18 + this.state.timeInc].main.temp).toFixed(4))});
      this.setState({day5: parseFloat(this.kelvinToCelsius(json_result.list[24 + this.state.timeInc].main.temp).toFixed(4))});
      /* Set city data */
      this.setState({city: json_result.city.name});
      this.setState({country: json_result.city.country});
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
  }

  componentDidMount() { /* When the component is displayed, run this function */
    this.getWeatherData();
  }

  render() {
    return (
      <html class="weather-app">
        <header class="weather-today">
          <div class="headcolumn">
            {/*
              * This button should move the forecast time backwards by 3 hours.
              * Does nothing if user tries to move to yesterday.
              */}
            <button onClick={() => {this.setState({timeInc: this.state.timeInc - 1})}} class="nav-button">Remove 3 hours</button>
          </div>
          <div class="headcolumn">
            <p class="forecast-title">Forecast for {this.state.city == null ? "undefined" : this.state.city}, 
            {this.state.country == null ? "undefined" : this.state.country}:</p>
            <p>{this.state.day1 == null ? "--" : this.state.day1} °C</p> 
          </div>
          <div class="headcolumn">
            {/*
              * This button should move the forecast time forwards by 3 hours.
              * Does nothing if user tries to move it to the next day.
              */}
            <button onClick={() => {this.setState({timeInc: this.state.timeInc + 1})}}  class="nav-button">Add 3 hours</button>
          </div>
        </header>
        <body class="weather-later">
              <div class="bodycolumn">
                <p>Today</p>
                <p>{this.state.day1 == null ? "--" : this.state.day1} °C</p>
              </div>
              <div class="bodycolumn">
                <p>Tomorrow</p>
                <p>{this.state.day2 == null ? "--" : this.state.day2} °C</p>
              </div>
              <div class="bodycolumn">
                <p>Day 3</p>
                <p>{this.state.day3 == null ? "--" : this.state.day3} °C</p>
              </div>
              <div class="bodycolumn">
                <p>Day 4</p>
                <p>{this.state.day4 == null ? "--" : this.state.day4} °C</p>
              </div>
              <div class="bodycolumn">
                <p>Day 5</p>
                <p>{this.state.day5 == null ? "--" : this.state.day5} °C</p>
              </div>
        </body>
        <footer class="about-app">
          <p>
            This app was made by Lachlan and developed at Takor.
            It is a simple weather app to demonstrate API fetch requests and practise good git commits.
          </p>
        </footer>
      </html>
    );
  }
}

export default App;