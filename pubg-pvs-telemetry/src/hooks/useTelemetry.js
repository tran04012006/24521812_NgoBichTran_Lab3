
import { useEffect, useState } from "react";

import {
  fetchKraftonPubgTelemetry,
} from "../services/telemetryService.js";

export const TELEMETRY_STATUS = {
  IDLE: "IDLE",
  LOADING: "LOADING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

const initialView = {
  status: TELEMETRY_STATUS.IDLE,
  data: null,
  error: null,
};

export function useTelemetry(squadId, retryTick = 0) {
  const [view, setView] = useState(initialView);

  useEffect(() => {
    if (!squadId) {
      setView(initialView);
      return;
    }

    const controller = new AbortController();

    setView({
      status: TELEMETRY_STATUS.LOADING,
      data: null,
      error: null,
    });

    fetchKraftonPubgTelemetry(squadId, {
      signal: controller.signal,
    })
      .then((data) => {
        if (controller.signal.aborted) {
          return;
        }

        setView({
          status: TELEMETRY_STATUS.SUCCESS,
          data,
          error: null,
        });
      })
      .catch((error) => {
        if (
          controller.signal.aborted ||
          error.name === "AbortError"
        ) {
          return;
        }

        setView({
          status: TELEMETRY_STATUS.ERROR,
          data: null,
          error: error.message,
        });
      });

    return () => {
      controller.abort();
    };
  }, [squadId, retryTick]);

  return view;
}
