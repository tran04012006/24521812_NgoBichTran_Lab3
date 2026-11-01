
import { getSquadById } from "../data/pubgTelemetry.js";

const SIMULATED_DELAY = 1200;
const PACKET_LOSS_RATE = 0.35;

const UNSTABLE_MAPS = new Set([
  "Erangel",
  "Miramar",
]);

function createAbortError() {
  return new DOMException(
    "Telemetry request was canceled",
    "AbortError"
  );
}

export function fetchKraftonPubgTelemetry(
  squadId,
  options = {}
) {
  const { signal } = options;

  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError());
      return;
    }

    console.log(
      `[Telemetry] Starting request: ${squadId}`
    );

    let timeoutId;

    const cleanup = () => {
      clearTimeout(timeoutId);

      signal?.removeEventListener(
        "abort",
        handleAbort
      );
    };

    const handleAbort = () => {
      cleanup();

      console.log(
        `[Telemetry] Request canceled: ${squadId}`
      );

      reject(createAbortError());
    };

    signal?.addEventListener(
      "abort",
      handleAbort,
      { once: true }
    );

    timeoutId = setTimeout(() => {
      cleanup();

      const squad = getSquadById(squadId);

      if (!squad) {
        console.error(
          `[Telemetry] Squad not found: ${squadId}`
        );

        reject(new Error("Squad not found"));
        return;
      }

      const isUnstableMap =
        UNSTABLE_MAPS.has(squad.map);

      const shouldFail =
        isUnstableMap &&
        Math.random() < PACKET_LOSS_RATE;

      if (shouldFail) {
        console.error(
          `[Telemetry] Simulated network failure: ${squadId}`
        );

        reject(
          new Error(
            `Packet loss detected on ${squad.map}. ` +
            "Unable to receive match telemetry."
          )
        );

        return;
      }

      console.log(
        `[Telemetry] Request successful: ${squadId}`
      );

      resolve({ ...squad });
    }, SIMULATED_DELAY);
  });
}
