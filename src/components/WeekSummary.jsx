import WeekItem from "./WeekItem";

//二次處理
function groupByDate(data) {
  const tempObj = {};

  // 先將數據按日期分組到臨時物件中
  data.forEach((item) => {
    const date = item.startTime.split("T")[0];
    if (!tempObj[date]) {
      tempObj[date] = [];
    }
    tempObj[date].push(item);
  });

  // 直接返回陣列格式
  return Object.keys(tempObj).map((date) => ({
    date,
    periods: tempObj[date],
  }));
}
//一次處理
function combineWeatherData(data) {
  // 取得當前時間
  const now = new Date();
  const currentHour = now.getHours(); // 只取當前的小時部分，例如 13

  // 從 WeatherElement 中找到需要的資料
  const avgTempRecords =
    data.records.Locations[0].Location[0].WeatherElement.find(
      (element) => element.ElementName === "平均溫度"
    ).Time;
  const maxTempRecords =
    data.records.Locations[0].Location[0].WeatherElement.find(
      (element) => element.ElementName === "最高溫度"
    ).Time;
  const minTempRecords =
    data.records.Locations[0].Location[0].WeatherElement.find(
      (element) => element.ElementName === "最低溫度"
    ).Time;
  const popRecords = data.records.Locations[0].Location[0].WeatherElement.find(
    (element) => element.ElementName === "12小時降雨機率"
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

      // 如果該時段有任何資料則返回，否則跳過

      return {
        startTime: startTime,
        endTime: endTime,
        avgTemp: avgTempRecords[index].ElementValue[0].Temperature,
        minTemp: minTempRecords[index].ElementValue[0].MinTemperature,
        maxTemp: maxTempRecords[index].ElementValue[0].MaxTemperature,
        weather: weatherPeriod.ElementValue[0].Weather,
        weatherCode: weatherPeriod.ElementValue[0].WeatherCode,
        pop: popRecords[index].ElementValue[0].ProbabilityOfPrecipitation,
      };
      return null; // 返回 null 表示該時段被過濾掉
    })
    .filter((item) => item !== null); // 移除所有 null 值

  return groupByDate(result);
}

export default function WeekSummary({ weekData }) {
  let data = [];
  if (weekData) {
    data = combineWeatherData(weekData);
  }
  console.log(data);
  return (
    <div className="flex-row" style={{ gap: "1rem" }}>
      {data.map((i) => (
        <WeekItem data={i} key={i.startTime} />
      ))}
    </div>
  );
}
