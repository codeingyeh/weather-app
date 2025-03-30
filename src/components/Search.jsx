import { useState } from "react";
import { cities } from "../data/cities";
import { dists } from "../data/dists";
export default function Search({ onDistChange }) {
  const [selectedCity, setSelectedCity] = useState("臺北市");
  const [selectedDistrict, setSelectedDistrict] = useState("中正區");

  function handleCitySelect(city) {
    setSelectedCity(city);
    setSelectedDistrict(() => dists.find((el) => el.city === city).distName);
  }

  return (
    <div>
      <select
        value={selectedCity}
        onChange={(e) => handleCitySelect(e.target.value)}
      >
        {cities.map((el) => (
          <option value={el.city} key={el.city}>
            {el.city}
          </option>
        ))}
      </select>
      <select
        value={selectedDistrict}
        onChange={(e) => setSelectedDistrict(e.target.value)}
      >
        {dists
          .filter((el) => el.city === selectedCity)
          .map((el) => (
            <option value={el.distName} key={el.distName}>
              {el.distName}
            </option>
          ))}
      </select>
      <button onClick={() => onDistChange(selectedDistrict)}>查詢</button>
    </div>
  );
}
