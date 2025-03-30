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
  )[0].forecastFor7DaysRoute;
  const urlParams = `?Authorization=${apiKey}&format=JSON&LocationName=${distName}`;

  const url = urlRoot + apiRoute + urlParams;

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
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
        const result = { LocationName };
        const per12HourData = records.WeatherElement.filter((el) => {
          return el.ElementName !== "紫外線指數";
        });
        const per24HourData = records.WeatherElement.filter((el) => {
          return el.ElementName === "紫外線指數";
        });
        const transformedPer12HourData = per12HourData
          .find((el) => el.ElementName === "平均溫度")
          .Time.map((el, i) => {
            return {
              StartTime: el.StartTime,
              EndTime: el.EndTime,
              ...per12HourData.find((i) => i.ElementName === "平均溫度").Time[i]
                .ElementValue[0],
              ...per12HourData.find((i) => i.ElementName === "最高溫度").Time[i]
                .ElementValue[0],
              ...per12HourData.find((i) => i.ElementName === "最低溫度").Time[i]
                .ElementValue[0],
              ...per12HourData.find((i) => i.ElementName === "平均露點溫度")
                .Time[i].ElementValue[0],
              ...per12HourData.find((i) => i.ElementName === "平均相對濕度")
                .Time[i].ElementValue[0],
              ...per12HourData.find((i) => i.ElementName === "最高體感溫度")
                .Time[i].ElementValue[0],
              ...per12HourData.find((i) => i.ElementName === "最低體感溫度")
                .Time[i].ElementValue[0],
              ...per12HourData.find((i) => i.ElementName === "最大舒適度指數")
                .Time[i].ElementValue[0],
              ...per12HourData.find((i) => i.ElementName === "最小舒適度指數")
                .Time[i].ElementValue[0],
              ...per12HourData.find((i) => i.ElementName === "風速").Time[i]
                .ElementValue[0],
              ...per12HourData.find((i) => i.ElementName === "風向").Time[i]
                .ElementValue[0],
              ...per12HourData.find((i) => i.ElementName === "12小時降雨機率")
                .Time[i].ElementValue[0],
              ...per12HourData.find((i) => i.ElementName === "天氣現象").Time[i]
                .ElementValue[0],
              ...per12HourData.find((i) => i.ElementName === "天氣預報綜合描述")
                .Time[i].ElementValue[0],
            };
          });
        result.data = per12HourData[0].Time.filter((el) =>
          el.StartTime.includes("18:00:00+08:00")
        ).map((el) => {
          return { date: el.StartTime.slice(0, 10) };
        });
        result.data.forEach((el, i, arr) => {
          arr[i].AM = transformedPer12HourData.filter(
            (data) => data.StartTime === `${el.date}T06:00:00+08:00`
          );
          arr[i].PM = transformedPer12HourData.filter(
            (data) => data.StartTime === `${el.date}T18:00:00+08:00`
          );
        });
        setData(result);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [distName]);

  return { data, loading, error };
}
