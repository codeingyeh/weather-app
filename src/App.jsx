import { useState } from "react";

//取得時間，預設回傳當前時間
function getDateTime(hourOffset = 0) {
  const now = new Date();
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);
  now.setHours(now.getHours() + hourOffset);
  // 回傳yyyy-MM-ddThh:mm:ss
  return now.toISOString().replace(/\.\d+Z$/, ":00");
}

function App() {
  return <div>天氣</div>;
}

export default App;
