export function getDateTime(hourOffset = 0) {
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

//將時間轉換成中文12小時制
export function formatTime(dateString) {
  const date = new Date(dateString);
  const hours = date.getHours();
  return `${hours >= 12 ? "下午" : "上午"}${hours % 12 || 12}時`;
}
