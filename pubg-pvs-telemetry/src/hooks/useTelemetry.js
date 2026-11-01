
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

export function useTelemetry(squadId) {
  const [view, setView] = useState(initialView);

  useEffect(() => {
    if (!squadId) {
      return;
    }

    let ignore = false;

    setView({
      status: TELEMETRY_STATUS.LOADING,
      data: null,
      error: null,
    });

    fetchKraftonPubgTelemetry(squadId)
      .then((data) => {
        if (ignore) return;

        setView({
          status: TELEMETRY_STATUS.SUCCESS,
          data,
          error: null,
        });
      })
      .catch((error) => {
        if (ignore) return;

        setView({
          status: TELEMETRY_STATUS.ERROR,
          data: null,
          error: error.message,
        });
      });

    return () => {
      ignore = true;
    };
  }, [squadId]);

  return view;
}
