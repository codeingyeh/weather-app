import { useEffect, useState } from "react";
import { cities } from "../data/cities";
import { dists } from "../data/dists";
import { getDateTime } from "../functions/commonFunction";

const apiKey = "CWA-D426CA1B-AA24-4C08-8231-1F6BB619F637";

export default function useFetch(distName) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const urlRoot = "https://opendata.cwa.gov.tw/api/v1/rest/datastore/";
  const apiRoute = cities.filter(
    (citie) =>
      citie.city ===
      dists.filter((dist) => dist.distName === distName).at(0).city
  )[0].forecastFor3DaysRoute;
  const nowTime = new Date().getHours();
  let hourOffset = 24;
  //如當前為05、11、17、23時 則抓25小時
  if (nowTime === 5 || nowTime === 11 || nowTime === 17 || nowTime === 23) {
    hourOffset = 25;
  }
  const urlParams = `?Authorization=${apiKey}&format=JSON&LocationName=${distName}&ElementName=&timeTo=${getDateTime(
    hourOffset
  )}`;

  const url = urlRoot + apiRoute + urlParams;

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("請求失敗");
        }
        const data = await response.json();
        const records = data.records.Locations[0].Location[0];
        const LocationName = records.LocationName;
        const perHourData = records.WeatherElement.filter((el) => {
          return (
            el.ElementName === "溫度" ||
            el.ElementName === "露點溫度" ||
            el.ElementName === "相對濕度" ||
            el.ElementName === "體感溫度" ||
            el.ElementName === "舒適度指數"
          );
        });
        const per3HourData = records.WeatherElement.filter((el) => {
          return (
            el.ElementName === "風速" ||
            el.ElementName === "風向" ||
            el.ElementName === "3小時降雨機率" ||
            el.ElementName === "天氣現象" ||
            el.ElementName === "天氣預報綜合描述"
          );
        });

        const result = { LocationName };
        //將每小時的資料放入同個obj中
        const transformedPerHourData = perHourData
          .find((el) => el.ElementName === "溫度")
          .Time.map((el, i) => {
            return {
              DataTime: el.DataTime,
              ...perHourData.find((i) => i.ElementName === "溫度").Time[i]
                .ElementValue[0],
              ...perHourData.find((i) => i.ElementName === "露點溫度").Time[i]
                .ElementValue[0],
              ...perHourData.find((i) => i.ElementName === "相對濕度").Time[i]
                .ElementValue[0],
              ...perHourData.find((i) => i.ElementName === "體感溫度").Time[i]
                .ElementValue[0],
              ...perHourData.find((i) => i.ElementName === "舒適度指數").Time[i]
                .ElementValue[0],
            };
          })
          .filter((el) => {
            const nowTime = new Date();
            nowTime.setMinutes(0);
            nowTime.setSeconds(0);
            nowTime.setMilliseconds(0);
            const dataTime = new Date(el.DataTime);
            // console.log(nowTime, dataTime);
            return nowTime <= dataTime;
          });
        //將每3小時資料放入同個obj中
        result.data = per3HourData
          .find((el) => el.ElementName === "天氣現象")
          .Time.map((el, i) => {
            return {
              StartTime: el.StartTime,
              EndTime: el.EndTime,
              ...per3HourData.find((i) => i.ElementName === "風速").Time[i]
                .ElementValue[0],
              ...per3HourData.find((i) => i.ElementName === "風向").Time[i]
                .ElementValue[0],
              ...per3HourData.find((i) => i.ElementName === "3小時降雨機率")
                .Time[i].ElementValue[0],
              ...per3HourData.find((i) => i.ElementName === "天氣現象").Time[i]
                .ElementValue[0],
              ...per3HourData.find((i) => i.ElementName === "天氣預報綜合描述")
                .Time[i].ElementValue[0],
            };
          });
        //將每小時資料放入相對應的每三小時obj中
        result.data.forEach((el, i, arr) => {
          const startTime = new Date(el.StartTime);
          const endTime = new Date(el.EndTime);
          arr[i].perHourData = transformedPerHourData.filter((hourdata) => {
            const dataTime = new Date(hourdata.DataTime);
            return dataTime >= startTime && dataTime < endTime;
          });
        });
        //將已過時間資料移除
        result.data = result.data.filter((el) => {
          const nowTime = new Date();
          const endTime = new Date(el.EndTime);
          return nowTime < endTime;
        });

        setData(result);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
        // setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [distName]);

  return { data, loading, error };
}
