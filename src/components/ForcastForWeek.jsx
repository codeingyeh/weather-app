import day from "../images/static/day.svg";
import "../App.css";

export default function ForcastForWeek({ data }) {
  return (
    <ul className="flex-col" style={{ gap: "1rem" }}>
      {data?.data.map((el) => (
        <Day data={el} key={el.date} />
      ))}
    </ul>
  );
}
const weekdays = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];

function Day({ data }) {
  const date = new Date(data.date);
  const dayOfWeek = date.getDay();

  return (
    <li className="flex-row">
      <div>
        <p>{data.date.substring(5).replace("-", "/")}</p>
        <p>{weekdays[dayOfWeek]}</p>
      </div>
      <div>
        {data?.AM[0] && <HalfDay data={data?.AM[0]} />}
        {data?.PM[0] && <HalfDay data={data?.PM[0]} />}
      </div>
    </li>
  );
}

function HalfDay({ data }) {
  return (
    <div className="flex-row">
      <div>{data.EndTime.includes("T18:00:00") ? "白天" : "晚上"}</div>
      <div>
        <img src={day} alt={data.Weather} />
      </div>
      <div>最低溫 {data.MinTemperature}°</div>
      <div>最高溫 {data.MaxTemperature}°</div>
    </div>
  );
}
