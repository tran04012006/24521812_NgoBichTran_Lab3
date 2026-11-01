
export async function fetchKraftonPubgTelemetry(
  squadId,
  options = {}
) {
  const { signal } = options;

  if (!squadId) {
    throw new Error("Squad ID is required");
  }

  const endpoint =
    `/api/telemetry/${encodeURIComponent(squadId)}`;

  console.log(
    `[Telemetry] Starting HTTP request: ${squadId}`
  );

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      signal,
      headers: {
        Accept: "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          `Telemetry request failed (${response.status})`
      );
    }

    if (!result.data) {
      throw new Error("Missing telemetry data");
    }

    console.log(
      `[Telemetry] Request successful: ${squadId}`
    );

    return result.data;
  } catch (error) {
    if (signal?.aborted || error.name === "AbortError") {
      console.log(
        `[Telemetry] Request canceled: ${squadId}`
      );

      throw new DOMException(
        "Telemetry request canceled",
        "AbortError"
      );
    }

    console.error(
      `[Telemetry] Request failed: ${squadId}`,
      error
    );

    throw error;
  }
}
