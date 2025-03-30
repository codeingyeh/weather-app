import day from "../images/static/day.svg";
import "../App.css";
import { formatTime } from "../functions/commonFunction";

export default function ForecastFor24Hours({ data }) {
  return (
    <div className="flex-row" style={{ gap: "1rem" }}>
      {data?.data.map((el) => (
        <Per3Hours data={el} key={el.StartTime} />
      ))}
    </div>
  );
}

function Per3Hours({ data }) {
  return (
    <div className="flex">
      <div className="flex-row">
        {data.perHourData.map((el) => (
          <Hour data={el} key={el.DataTime} />
        ))}
      </div>
      <div>
        <img src={day} />
      </div>
      <div>降雨率 {data.ProbabilityOfPrecipitation}%</div>
    </div>
  );
}

function Hour({ data }) {
  return (
    <div className="flex">
      <p>{formatTime(data.DataTime)}</p>

      <p>{data.Temperature}°</p>
    </div>
  );
}
