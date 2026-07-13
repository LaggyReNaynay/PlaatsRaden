import fs from "node:fs/promises";
import path from "node:path";
import AdmZip from "adm-zip";

const TARGET_LOCATIONS = 1000;
const MINIMUM_POPULATION = 100_000;
const MAX_CITIES_PER_COUNTRY = 40;

const GEONAMES_CITIES_URL =
  "https://download.geonames.org/export/dump/cities15000.zip";

const GEONAMES_COUNTRIES_URL =
  "https://download.geonames.org/export/dump/countryInfo.txt";

const OUTPUT_FILE = path.resolve(
  "src/data/generatedLocations.json"
);

const CONTINENT_NAMES = {
  AF: "Afrika",
  AS: "Azië",
  EU: "Europa",
  NA: "Noord-Amerika",
  OC: "Oceanië",
  SA: "Zuid-Amerika",
  AN: "Antarctica",
};

/*
 * Kleine eilandstaten en overzeese eilandgebieden die we
 * niet in de normale spelmodus willen gebruiken.
 */
const EXCLUDED_COUNTRY_CODES = new Set([
  "AS",
  "AG",
  "AI",
  "AW",
  "BB",
  "BM",
  "BS",
  "BQ",
  "CK",
  "CW",
  "DM",
  "FJ",
  "FM",
  "FO",
  "GD",
  "GG",
  "GL",
  "GP",
  "GU",
  "IM",
  "JE",
  "KI",
  "KN",
  "KY",
  "LC",
  "MH",
  "MP",
  "MQ",
  "MS",
  "MV",
  "NC",
  "NF",
  "NR",
  "NU",
  "PF",
  "PG",
  "PM",
  "PN",
  "PW",
  "RE",
  "SB",
  "SC",
  "SH",
  "SX",
  "TC",
  "TK",
  "TO",
  "TT",
  "TV",
  "UM",
  "VC",
  "VG",
  "VI",
  "VU",
  "WF",
  "WS",
  "YT",
]);

function parseNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function downloadText(url) {
  console.log(`Downloaden: ${url}`);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Download mislukt: ${response.status} ${response.statusText}`
    );
  }

  return response.text();
}

async function downloadBuffer(url) {
  console.log(`Downloaden: ${url}`);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Download mislukt: ${response.status} ${response.statusText}`
    );
  }

  return Buffer.from(await response.arrayBuffer());
}

function parseCountries(text) {
  const countries = new Map();

  for (const line of text.split(/\r?\n/)) {
    if (!line || line.startsWith("#")) {
      continue;
    }

    const columns = line.split("\t");

    const countryCode = columns[0];
    const countryName = columns[4];
    const continentCode = columns[8];

    if (!countryCode || !countryName) {
      continue;
    }

    countries.set(countryCode, {
      name: countryName,
      continent:
        CONTINENT_NAMES[continentCode] ??
        continentCode ??
        "Onbekend",
    });
  }

  return countries;
}

function createAlternativeAnswers(
  name,
  asciiName,
  alternateNames
) {
  return [asciiName, ...alternateNames]
    .map((value) => value.trim())
    .filter(
      (value) =>
        value &&
        value.length <= 60 &&
        value.toLowerCase() !== name.toLowerCase()
    )
    .filter(
      (value, index, array) =>
        array.findIndex(
          (candidate) =>
            candidate.toLowerCase() === value.toLowerCase()
        ) === index
    )
    .slice(0, 8);
}

function parseCities(text, countries) {
  const cities = [];

  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) {
      continue;
    }

    const columns = line.split("\t");

    const geonameId = Number(columns[0]);
    const name = columns[1];
    const asciiName = columns[2];

    const alternateNames = columns[3]
      ? columns[3].split(",")
      : [];

    const latitude = parseNumber(columns[4]);
    const longitude = parseNumber(columns[5]);
    const featureClass = columns[6];
    const featureCode = columns[7];
    const countryCode = columns[8];
    const population = parseNumber(columns[14]);

    const country = countries.get(countryCode);

    if (
      featureClass !== "P" ||
      !country ||
      !name ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      continue;
    }

    if (population < MINIMUM_POPULATION) {
      continue;
    }

    if (EXCLUDED_COUNTRY_CODES.has(countryCode)) {
      continue;
    }

    cities.push({
      geonameId,
      name,
      country: country.name,
      countryCode,
      continent: country.continent,
      latitude,
      longitude,
      population,
      isCapital: featureCode === "PPLC",
      alternativeAnswers: createAlternativeAnswers(
        name,
        asciiName,
        alternateNames
      ),
    });
  }

  return cities;
}

function selectBalancedCities(cities) {
  const sortedCities = [...cities].sort((a, b) => {
    if (a.isCapital !== b.isCapital) {
      return a.isCapital ? -1 : 1;
    }

    return b.population - a.population;
  });

  const selectedCities = [];
  const countryCounts = new Map();

  for (const city of sortedCities) {
    if (selectedCities.length >= TARGET_LOCATIONS) {
      break;
    }

    const currentCountryCount =
      countryCounts.get(city.countryCode) ?? 0;

    if (
      currentCountryCount >= MAX_CITIES_PER_COUNTRY
    ) {
      continue;
    }

    selectedCities.push(city);

    countryCounts.set(
      city.countryCode,
      currentCountryCount + 1
    );
  }

  return selectedCities;
}

function createLocations(cities) {
  return cities.map((city, index) => ({
    id: index + 1,
    cityId: city.geonameId,
    name: city.name,
    country: city.country,
    countryCode: city.countryCode,
    continent: city.continent,

    /*
     * We gebruiken bewust het geregistreerde stadspunt.
     * Geen willekeurige verschuiving meer richting zee,
     * natuurgebieden of buitenwijken buiten de stad.
     */
    latitude: city.latitude,
    longitude: city.longitude,

    population: city.population,
    isCapital: city.isCapital,
    pointNumber: 1,
    alternativeAnswers: city.alternativeAnswers,
    verified: false,
  }));
}

async function main() {
  console.log("GeoNames-data ophalen...");

  const [countryText, citiesZipBuffer] =
    await Promise.all([
      downloadText(GEONAMES_COUNTRIES_URL),
      downloadBuffer(GEONAMES_CITIES_URL),
    ]);

  const zip = new AdmZip(citiesZipBuffer);

  const citiesEntry = zip
    .getEntries()
    .find((entry) =>
      entry.entryName.endsWith(".txt")
    );

  if (!citiesEntry) {
    throw new Error(
      "Het stedenbestand is niet gevonden in de ZIP."
    );
  }

  const citiesText = citiesEntry
    .getData()
    .toString("utf8");

  const countries = parseCountries(countryText);
  const cities = parseCities(citiesText, countries);
  const selectedCities = selectBalancedCities(cities);
  const locations = createLocations(selectedCities);

  await fs.mkdir(path.dirname(OUTPUT_FILE), {
    recursive: true,
  });

  await fs.writeFile(
    OUTPUT_FILE,
    `${JSON.stringify(locations, null, 2)}\n`,
    "utf8"
  );

  const uniqueCountries = new Set(
    locations.map(
      (location) => location.countryCode
    )
  );

  const continents = new Set(
    locations.map(
      (location) => location.continent
    )
  );

  console.log("");
  console.log("Klaar!");
  console.log(`Locaties: ${locations.length}`);
  console.log(
    `Landen: ${uniqueCountries.size}`
  );
  console.log(
    `Werelddelen: ${continents.size}`
  );
  console.log(
    `Minimaal inwonertal: ${MINIMUM_POPULATION.toLocaleString(
      "nl-NL"
    )}`
  );
  console.log(`Bestand: ${OUTPUT_FILE}`);
}

main().catch((error) => {
  console.error("");
  console.error("Genereren mislukt:");
  console.error(error);
  process.exitCode = 1;
});