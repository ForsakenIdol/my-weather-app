import React from 'react';
import './App.css';

function App() {
  return (
    <html class="weather-app">
      <header class="weather-today">
        <div class="headcolumn">
          {/* These buttons should move the forecast forward or back a day in the week.
            * Does nothing if user tries to move to yesterday.
            */}
          <button onClick={() => {console.log("something")}} class="nav-button">Previous day</button>
        </div>
        <div class="headcolumn">
          <p>-- °C</p> {/* Replace this later with the data from the api */}
        </div>
        <div class="headcolumn">
          <button onClick={() => {console.log("something")}}  class="nav-button">Next day</button>
        </div>
      </header>
      <body class="weather-later">
            <div class="bodycolumn">
              <p>Tomorrow</p>
              <p>-- °C</p>
            </div>
            <div class="bodycolumn">
              <p>Day 2</p>
              <p>-- °C</p>
            </div>
            <div class="bodycolumn">
              <p>Day 3</p>
              <p>-- °C</p>
            </div>
            <div class="bodycolumn">
              <p>Day 4</p>
              <p>-- °C</p>
            </div>
            <div class="bodycolumn">
              <p>Day 5</p>
              <p>-- °C</p>
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

export default App;