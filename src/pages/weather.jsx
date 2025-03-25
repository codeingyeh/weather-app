import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { cities } from "../data/cities";
import { dists } from "../data/dists";
import CurrentSummary from "../components/CurrentSummary";
import HourSummary from "../components/HourSummary";
import WeekSummary from "../components/WeekSummary";

//取得時間，預設回傳當前時間
// function getDateTime(hourOffset = 0) {
//   const now = new Date();
//   now.setMinutes(0);
//   now.setSeconds(0);
//   now.setMilliseconds(0);
//   now.setHours(now.getHours() + hourOffset);
//   // 回傳yyyy-MM-ddThh:mm:ss
//   return now.toISOString().replace(/\.\d+Z$/, ":00");
// }
function getDateTime(hourOffset = 0) {
  // 取得當前 UTC 時間
  const now = new Date();
  // 計算 UTC+8 的時間，並加上額外的 hourOffset
  const utcPlus8 = new Date(now.getTime() + (8 + hourOffset) * 60 * 60 * 1000);
  // 設定分、秒、毫秒為 0
  utcPlus8.setUTCMinutes(0);
  utcPlus8.setUTCSeconds(0);
  utcPlus8.setUTCMilliseconds(0);
  // 回傳 yyyy-MM-ddThh:mm:ss 格式（基於 UTC+8）
  return utcPlus8.toISOString().replace(/\.\d+Z$/, "");
}

const apiKey = "CWA-D426CA1B-AA24-4C08-8231-1F6BB619F637";

export default function Waether() {
  const { distName } = useParams();
  //取得3日、一週的api url
  const rootUrl = "https://opendata.cwa.gov.tw/api/v1/rest/datastore/";
  const apiRouteByHourly = cities.filter(
    (citie) =>
      citie.city ===
      dists.filter((dist) => dist.distName === distName).at(0).city
  )[0].APIRouterByHour;
  const apiRouteByWeekly = cities.filter(
    (citie) =>
      citie.city ===
      dists.filter((dist) => dist.distName === distName).at(0).city
  )[0].APIRouterByWeek;
  const urlParams = `?Authorization=${apiKey}&format=JSON&LocationName=${distName}&ElementName=&timeTo=${getDateTime(
    24
  )}`;
  const urlByHourly = rootUrl + apiRouteByHourly + urlParams;
  const urlByWeekly = rootUrl + apiRouteByWeekly + urlParams;

  const {
    data: hourData,
    loading: hourLoading,
    error: hourError,
  } = useFetch(`http://localhost:3000/day`);
  const {
    data: weekData,
    loading: weekLoading,
    error: weekError,
  } = useFetch(`http://localhost:3000/week`);

  return (
    <div>
      {!weekLoading && <CurrentSummary weekData={weekData} />}
      {!hourLoading && <HourSummary hourData={hourData} />}
      {!weekLoading && <WeekSummary weekData={weekData} />}
    </div>
  );
}
