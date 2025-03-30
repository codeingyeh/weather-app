import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UseFetchWeatherForecast3Days from "../hooks/UseFetchWeatherForecast3Days";
import UseFetchWeatherForecast7Days from "../hooks/UseFetchWeatherForecast7Days";
import ForecastFor24Hours from "../components/ForcastFor24Hours";
import ForecastForWeek from "../components/ForcastForWeek";
import Search from "../components/Search";

export default function District() {
  // const { distName } = useParams();
  const [distName, setDistName] = useState("中正區");
  const {
    data: dataFor3Days,
    loading: loadingFor3Days,
    error: errorFor3Days,
  } = UseFetchWeatherForecast3Days(distName);
  const {
    data: dataFor7Days,
    loading: loadingFor7Days,
    error: errorFor7Days,
  } = UseFetchWeatherForecast7Days(distName);

  const now = new Date();
  const current = now.getHours() >= 12 ? "PM" : "AM";
  // if (loadingFor3Days || loadingFor7Days) return <p>Loading...</p>;
  // if (errorFor3Days || errorFor7Days) return <p>Error</p>;
  const nowDataBy3Days = dataFor3Days?.data[0];
  const nowDataBy7Days = dataFor7Days?.data[0][current][0];

  return (
    <div>
      <Search onDistChange={setDistName} />
      <header>
        <h1>{dataFor3Days?.LocationName}</h1>

        <p>{nowDataBy3Days?.perHourData[0].Temperature}°</p>
        <p>最高溫 {nowDataBy7Days?.MaxTemperature}°</p>
        <p>最低溫 {nowDataBy7Days?.MinTemperature}°</p>
      </header>

      <ForecastFor24Hours data={dataFor3Days} />
      <ForecastForWeek data={dataFor7Days} />
      <Box>
        <h4>天氣預報綜合描述</h4>
        <p>{nowDataBy3Days?.WeatherDescription}</p>
      </Box>
      <Box>
        <h4>體感溫度</h4>
        <p>{nowDataBy3Days?.perHourData[0].ApparentTemperature}°</p>
      </Box>
      <Box>
        <h4>舒適度指數</h4>
        <p>{nowDataBy3Days?.perHourData[0].ComfortIndexDescription}</p>
      </Box>
      <Box>
        <h4>風速</h4>
        <p>{nowDataBy3Days?.WindSpeed}級</p>
      </Box>
      <Box>
        <h4>風向</h4>
        <p>{nowDataBy3Days?.WindDirection}</p>
      </Box>
      <Box>
        <h4>露點溫度</h4>
        <p>{nowDataBy3Days?.perHourData[0].DewPoint}°</p>
      </Box>
      <Box>
        <h4>相對濕度</h4>
        <p>{nowDataBy3Days?.perHourData[0].RelativeHumidity}%</p>
      </Box>
    </div>
  );
}

function Box({ children }) {
  return <div>{children}</div>;
}
