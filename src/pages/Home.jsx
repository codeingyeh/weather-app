import useLocalStorage from "../hooks/useLocalStorage";

export default function Home() {
  const [subscript, setSubscript] = useLocalStorageState(
    [],
    "subscriptionDistricts"
  );

  return <div>天氣</div>;
}
