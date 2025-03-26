import day from "../images/static/day.svg";
import "./HourSummary.css";

// data格式
// {
//   "date": "2025-03-26",
//   "periods": [
//       {
//           "startTime": "2025-03-26T18:00:00",
//           "endTime": "2025-03-27T06:00:00",
//           "avgTemp": "23",
//           "minTemp": "21",
//           "maxTemp": "26",
//           "weather": "晴時多雲",
//           "weatherCode": "02",
//           "pop": "0"
//       }
//   ]
// }

const weekdays = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];

export default function WeekItem({ data }) {
  const date = new Date(data.date);
  const dayOfWeek = date.getDay();

  return (
    <li className="flex-row">
      <div>
        <p>{data.date.substring(5).replace("-", "/")}</p>
        <p>{weekdays[dayOfWeek]}</p>
      </div>
      <div>
        {data.periods.map((i) => (
          <div className="flex-row" key={i.startTime}>
            <div>{i.endTime.includes("T18:00:00") ? "白天" : "晚上"}</div>
            <div>
              <img src={day} alt={i.weather} />
            </div>
            <div>最低溫 {i.minTemp}°</div>
            <div>最高溫 {i.maxTemp}°</div>
          </div>
        ))}
      </div>
    </li>
  );
}
