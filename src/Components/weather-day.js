import * as React from 'react';

const WeatherDay = (props) => {
    return (
        <div className="text-center">
            <p className="lead">{props.dayName}: {props.forecast}</p>
            <img src={props.weatherIcon} className="mx-auto d-block" alt=""></img>
            <h2>{props.temperature} °C</h2>
        </div>
    )
}

export default WeatherDay;