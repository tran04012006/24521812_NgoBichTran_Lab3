
import { getSquadById } from "../data/pubgTelemetry.js";

const SIMULATED_DELAY = 650;

export function fetchKraftonPubgTelemetry(squadId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const squad = getSquadById(squadId);

      if (!squad) {
        reject(new Error("Squad not found"));
        return;
      }

      resolve({ ...squad });
    }, SIMULATED_DELAY);
  });
}
