import { useContext, createContext, useState, useEffect } from "react";
import axios from 'axios';

const StateContext = createContext()

export const StateContextProvider = ({ children }) => {
    const [weather, setWeather] = useState({})
    const [values, setValues] = useState([])
    const [place, setPlace] = useState('Jaipur')
    const [thisLocation, setLocation] = useState('')

    const fahrenheitToCelsius = (fahrenheit) => {
        return (fahrenheit - 32) * (5 / 9);
    }

    const weatherData = async () => {
        const options = {
            locations: place,
            aggregateHours: '24',
            unitGroup: "us",
            shortColumnNames: 'false',
            contentType: 'json',
            key: import.meta.env.VITE_API_KEY
        }
        const params = new URLSearchParams(options);
        const baseURL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/forecast?${params}`;

        const response = await axios.request(baseURL);
        console.log("abcd ", response)
        const loc = response.data.locations[place];
        console.log("loction : ", loc)
        const currentConditions = loc.currentConditions
        console.log("Curreee",)
        const location = place
        const temp = currentConditions.temp;
        const humidity = currentConditions.humidity;
        const windspeed = currentConditions.wspd;
        const heatIndex = currentConditions?.heatindex
        const weatherObj = {
            humidity: humidity,
            temp: fahrenheitToCelsius(temp).toFixed(1),
            wspd: windspeed,
            heatindex: heatIndex
        }
        setLocation(location);
        setWeather(weatherObj);
    }

    useEffect(() => {
        weatherData();
    }, [place])

    useEffect(() => {
        console.log(values)
    }, [values])

    return (
        <StateContext.Provider value={{
            weather,
            setPlace,
            values,
            thisLocation,
            place
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)