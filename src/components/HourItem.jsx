import day from "../images/static/day.svg";
import "./HourSummary.css";

//將時間轉換成中文12小時制
function formatTime(dateString) {
  const date = new Date(dateString);
  const hours = date.getHours();
  return `${hours >= 12 ? "下午" : "上午"}${hours % 12 || 12}時`;
}

export default function HourItemGroup({ data }) {
  console.log(data);
  return (
    <div className="flex-col">
      <div className="flex-row">
        {data.perHour.map((hour) => (
          <Hour data={hour} key={hour.dataTime} />
        ))}
      </div>
      <div>
        <img src={day} />
      </div>
      <div>{data.probabilityOfPrecipitation}°</div>
    </div>
  );
}

function Hour({ data }) {
  return (
    <div className="flex-col">
      <p>{formatTime(data.dataTime)}</p>

      <p>{data.temperature}°</p>
    </div>
  );
}
