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
      day5: null
    }
  }

  /* Fetch API address: http://api.openweathermap.org/data/2.5/forecast?id=2063523&APPID=a61002d90fe4eaac824f28012985aa2c */

  render() {
    return (
      <html class="weather-app">
        <header class="weather-today">
          <div class="headcolumn">
            {/* This button should move the big forecast back a day in the week.
              * Does nothing if user tries to move to yesterday.
              */}
            <button onClick={() => {console.log("something")}} class="nav-button">Previous day</button>
          </div>
          <div class="headcolumn">
            <p>{this.state.day1 == null ? "--" : this.state.day1} °C</p> {/* Replace this later with the data from the api */}
          </div>
          <div class="headcolumn">
            {/* This button should move the big forecast forward a day in the week.
              * Does nothing if user tries to move past day 5.
              */}
            <button onClick={() => {console.log("something")}}  class="nav-button">Next day</button>
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