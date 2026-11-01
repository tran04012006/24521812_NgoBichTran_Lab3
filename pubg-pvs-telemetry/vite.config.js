
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { getSquadById } from "./src/data/pubgTelemetry.js";

function telemetryMockApi() {
  return {
    name: "pvs-telemetry-mock-api",

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(
          req.url ?? "/",
          "http://localhost"
        );

        if (
          !url.pathname.startsWith("/api/telemetry/")
        ) {
          next();
          return;
        }

        res.setHeader(
          "Content-Type",
          "application/json; charset=utf-8"
        );

        if (req.method !== "GET") {
          res.statusCode = 405;
          res.setHeader("Allow", "GET");
          res.end(
            JSON.stringify({
              message: "Method not allowed",
            })
          );
          return;
        }

        const squadId = decodeURIComponent(
          url.pathname.split("/")[3] ?? ""
        );

        const timer = setTimeout(() => {
          if (res.destroyed) {
            return;
          }

          const squad = getSquadById(squadId);

          if (!squad) {
            res.statusCode = 404;
            res.end(
              JSON.stringify({
                message: "Squad not found",
              })
            );
            return;
          }

          const unstableMaps = [
            "Erangel",
            "Miramar",
          ];

          const shouldFail =
            unstableMaps.includes(squad.map) &&
            Math.random() < 0.35;

          if (shouldFail) {
            res.statusCode = 503;
            res.end(
              JSON.stringify({
                message:
                  `Packet loss detected on ${squad.map}. ` +
                  "Unable to receive match telemetry.",
              })
            );
            return;
          }

          res.statusCode = 200;

          res.end(
            JSON.stringify({ data: squad })
          );
        }, 1200);

        // Clear the timer if the connection closes
        // before the mock response is sent.
        res.on("close", () => {
          clearTimeout(timer);
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), telemetryMockApi()],

  server: {
    port: 5173,
  },
});
