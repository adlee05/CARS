import { getRegionFromCountryCode } from "../utils/region-mapper.ts";

export const getUserLocation = async function () {
  const response = await fetch("https://ipinfo.io/json");
  const data = await response.json();

  console.log(data);

  return getRegionFromCountryCode(data.country);
};
