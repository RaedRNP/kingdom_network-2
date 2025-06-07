import cron from "node-cron";
import fs from "fs"; // Import the filesystem module
import path from "path"; // Import the path module
import dotenv from "dotenv";

// Calculate the path to the project root directory (3 levels up from current file)
const projectRootPath = path.resolve(process.cwd(), "../../..");

// Configure dotenv to look for .env file in project root
dotenv.config({ path: path.join(projectRootPath, ".env") });

// Log the path being used to find .env file for debugging
console.log(`Looking for .env file at: ${path.join(projectRootPath, ".env")}`);

const bearerApiExchange = process.env.BEARER_API_EXCHANGE;

// Show the API key for debugging (masked for security)
if (bearerApiExchange) {
  const maskedKey =
    bearerApiExchange.substring(0, 4) +
    "****" +
    (bearerApiExchange.length > 8
      ? bearerApiExchange.substring(bearerApiExchange.length - 4)
      : "");
  console.log(`BEARER_API_EXCHANGE loaded: ${maskedKey}`);
} else {
  console.error(
    "FATAL ERROR: BEARER_API_EXCHANGE is not defined in .env file.",
  );
}

// Define the path for the JSON file in the public directory
// Use projectRootPath instead of process.cwd() to ensure we're using the project root
const publicDir = path.join(projectRootPath, "public");
const dataDir = path.join(publicDir, "data");
const jsonFilePath = path.join(dataDir, "exchangeRate.json");

console.log(`JSON file will be saved to: ${jsonFilePath}`);

// Ensure the data directory exists. { recursive: true } makes it work even if 'public' doesn't exist.
if (!fs.existsSync(dataDir)) {
  console.log(`Creating directory: ${dataDir}`);
  fs.mkdirSync(dataDir, { recursive: true });
}

// const BS = await exchangePageApi.json();
// We don't need a module-level tasaDolar anymore if the client reads from file
// let tasaDolar;
// export const conversionRateBS = BS.conversion_rates.VES;

async function getExchangeDaily() {
  try {
    console.log("Attempting to fetch exchange rate...");
    // Configura las cabeceras si la API requiere una clave
    const headers = {
      "Content-Type": "application/json",
      // Descomenta y ajusta la siguiente línea si tu API necesita autenticación
      // 'Authorization': `Bearer ${TU_API_KEY}`,
      // 'x-api-key': TU_API_KEY, // Algunas APIs usan este formato
    };

    console.log(`Making API request to ExchangeRate API...`);
    const respuesta = await fetch(
      `https://v6.exchangerate-api.com/v6/${bearerApiExchange}/latest/USD`,
      { headers },
    );

    if (!respuesta.ok) {
      // Si la respuesta no es exitosa (ej. 401, 403, 404, 500)
      throw new Error(
        `Error al obtener los datos: ${respuesta.status} ${respuesta.statusText}`,
      );
    }

    const datos = await respuesta.json();

    // Asumiendo que la API devuelve algo como: { "conversion_rates": { "VES": 36.50 } }
    // Adjust the key based on the actual API response structure
    const fetchedRate = datos.conversion_rates.VES;

    if (fetchedRate) {
      console.log(`Fetched rate successfully: ${fetchedRate}`);

      // Save the rate to the JSON file
      const dataToSave = {
        tasa: fetchedRate,
        ultimaActualizacion: new Date().toISOString(),
      };

      // Write the data to the JSON file
      fs.writeFileSync(
        jsonFilePath,
        JSON.stringify(dataToSave, null, 2), // Use null, 2 for pretty printing
        "utf8", // Specify encoding
      );

      console.log(`Tasa guardada/actualizada exitosamente en ${jsonFilePath}`);
      return fetchedRate; // Return the fetched rate
    } else {
      console.error("No se pudo extraer la tasa de la respuesta:", datos);
      return null; // Return null if rate couldn't be extracted
    }
  } catch (error) {
    console.error("Error in scheduled task:", error.message);
    return null; // Return null on error
  }
}

// Modify the cron callback to be async and await getExchangeDaily
let newCron = cron.schedule(
  "0 17 * * 1-5", // 17:00 (5 PM), Monday-Friday
  async () => {
    // Make the callback async
    console.log("-------------------------------------");
    console.log(`Scheduled task initiated at ${new Date().toLocaleString()}`);
    // Await the promise returned by getExchangeDaily to ensure file is written
    await getExchangeDaily();
    console.log("Scheduled task finished.");
  },
  {
    scheduled: true,
    timezone: "America/Caracas", // Correct timezone for Caracas
  },
);

newCron.start();
console.log("Cron job scheduled for 17:00 America/Caracas on weekdays.");

// --- TEMPORARY TEST: Call the function once immediately ---
console.log("Executing getExchangeDaily once for testing...");
getExchangeDaily()
  .then(() => {
    console.log("Test execution of getExchangeDaily finished.");
  })
  .catch((err) => {
    console.error("Test execution failed:", err);
  });
