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
//將時間轉換成中文12小時制
function formatTime(dateString) {
  const date = new Date(dateString);
  const hours = date.getHours();
  return `${hours >= 12 ? "下午" : "上午"}${hours % 12 || 12}時`;
}

function App() {
  return <div>天氣</div>;
}

export default App;
