import HourItemGroup from "./HourItem";
import "./HourSummary.css";

function combineWeatherData(data) {
  // 取得當前時間
  const now = new Date();
  const currentHour = now.getHours(); // 只取當前的小時部分，例如 13

  // 從 WeatherElement 中找到需要的資料
  const tempRecords = data.records.Locations[0].Location[0].WeatherElement.find(
    (element) => element.ElementName === "溫度"
  ).Time;
  const precipRecords =
    data.records.Locations[0].Location[0].WeatherElement.find(
      (element) => element.ElementName === "3小時降雨機率"
    ).Time;
  const weatherRecords =
    data.records.Locations[0].Location[0].WeatherElement.find(
      (element) => element.ElementName === "天氣現象"
    ).Time;

  // 以 3 小時為單位建立結果陣列
  const result = weatherRecords
    .map((weatherPeriod, index) => {
      const startTime = weatherPeriod.StartTime.replace("+08:00", "");
      const endTime = weatherPeriod.EndTime.replace("+08:00", "");

      // 找出該時間段內的每小時溫度資料，並過濾掉早於當前小時的資料
      const perHourData = tempRecords
        .filter((temp) => {
          const tempTime = new Date(temp.DataTime);
          const tempHour = tempTime.getHours(); // 只取小時部分
          const start = new Date(startTime);
          const end = new Date(endTime);
          // 只比較小時，且保留該時段內的資料
          return tempTime >= start && tempTime < end && tempHour >= currentHour;
        })
        .map((temp) => ({
          dataTime: temp.DataTime.replace("+08:00", ""),
          temperature: temp.ElementValue[0].Temperature,
          weather: weatherPeriod.ElementValue[0].Weather,
          weatherCode: weatherPeriod.ElementValue[0].WeatherCode,
        }));

      // 如果該時段有任何資料則返回，否則跳過
      if (perHourData.length > 0) {
        return {
          startTime: startTime,
          endTime: endTime,
          probabilityOfPrecipitation:
            precipRecords[index].ElementValue[0].ProbabilityOfPrecipitation,
          perHour: perHourData,
        };
      }
      return null; // 返回 null 表示該時段被過濾掉
    })
    .filter((item) => item !== null); // 移除所有 null 值

  return result;
}

export default function HourSummary({ hourData }) {
  let data = [];
  if (hourData) {
    data = combineWeatherData(hourData);
  }
  console.log(data);
  return (
    <div className="flex-row">
      {data.map((i) => (
        <HourItemGroup data={i} key={i.startTime} />
      ))}
    </div>
  );
}
