import { useState } from 'react';
import axios from 'axios';

import getCurrentDayForecast from '../helpers/getCurrentDayForecast';
import getCurrentDayDetailedForecast from '../helpers/getCurrentDayDetailedForecast';
import getUpcomingDaysForecast from '../helpers/getUpcomingDaysForecast';

const API_KEY = '65920bfadce4ec4948b1169270349a45';

const useForecast = () => {
    const [isError, setError] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [forecast, setForecast] = useState(null);

    

    const getForecastData = async (location, dataType) => {
        const { data } = await axios(`https://api.openweathermap.org/data/2.5/${dataType}?q=${location}&appid=${API_KEY}&units=metric`);

        if (!data || data.length === 0) {
            setError('Something went wrong');
            setLoading(false);
            return;
        }
        setLoading(false);
        return data;
    };



    const gatherForecastData = async (data, location) => {
        const currentDay = getCurrentDayForecast(data, data.name);
        const currentDayDetails = getCurrentDayDetailedForecast(data);
        const upComingDaysData = await getForecastData(location, 'forecast');
        let dataArray = [];
        dataArray.push(upComingDaysData.list[7], upComingDaysData.list[15], upComingDaysData.list[23], upComingDaysData.list[31]);
        const upcomingDays = getUpcomingDaysForecast(dataArray);
        setForecast({ currentDay, currentDayDetails, upcomingDays });
        setLoading(false);
    };



    const submitRequest = async location => {
        setLoading(true);
        setError(false);


        const data = await getForecastData(location, 'weather');
        if (!data) return; 


        console.log("Hello", data);
        gatherForecastData(data, location);
    };

    return {
        isError,
        isLoading,
        forecast,
        submitRequest,
    };
};

export default useForecast;
