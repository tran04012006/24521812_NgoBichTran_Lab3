
import {
  describe,
  it,
  expect,
  vi,
} from "vitest";

import {
  fetchKraftonPubgTelemetry,
} from "./telemetryService.js";

describe("fetchKraftonPubgTelemetry", () => {
  it("returns squad data when the API succeeds", async () => {
    const squad = {
      id: "ge",
      name: "Genius Esports",
      map: "Taego",
      kills: 9,
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: squad }),
    });

    vi.stubGlobal("fetch", mockFetch);

    const result =
      await fetchKraftonPubgTelemetry("ge");

    expect(result).toEqual(squad);

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/telemetry/ge",
      expect.objectContaining({
        method: "GET",
      })
    );
  });

  it("throws an error when the server fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => ({
          message: "Packet loss detected",
        }),
      })
    );

    await expect(
      fetchKraftonPubgTelemetry("ces")
    ).rejects.toThrow("Packet loss detected");
  });

  it("rejects when squad ID is missing", async () => {
    await expect(
      fetchKraftonPubgTelemetry("")
    ).rejects.toThrow("Squad ID is required");
  });

  it("passes AbortSignal to fetch", async () => {
    const controller = new AbortController();

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          id: "ge",
          name: "Genius Esports",
        },
      }),
    });

    vi.stubGlobal("fetch", mockFetch);

    await fetchKraftonPubgTelemetry("ge", {
      signal: controller.signal,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/telemetry/ge",
      expect.objectContaining({
        signal: controller.signal,
      })
    );
  });

  it("rejects with AbortError on cancellation", async () => {
    const controller = new AbortController();

    const mockFetch = vi.fn(
      (_url, options) =>
        new Promise((_resolve, reject) => {
          options.signal.addEventListener(
            "abort",
            () => {
              reject(
                new DOMException(
                  "Request aborted",
                  "AbortError"
                )
              );
            },
            { once: true }
          );
        })
    );

    vi.stubGlobal("fetch", mockFetch);

    const request = fetchKraftonPubgTelemetry(
      "ces",
      {
        signal: controller.signal,
      }
    );

    controller.abort();

    await expect(request).rejects.toMatchObject({
      name: "AbortError",
    });
  });
});
