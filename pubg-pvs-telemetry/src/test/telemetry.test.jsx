
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import PubgMatchTelemetry from
  "../components/PubgMatchTelemetry.jsx";

import {
  PUBG_VN_SQUADS,
} from "../data/pubgTelemetry.js";

import {
  fetchKraftonPubgTelemetry,
} from "../services/telemetryService.js";

vi.mock("../services/telemetryService.js", () => ({
  fetchKraftonPubgTelemetry: vi.fn(),
}));

function getSquad(id) {
  return PUBG_VN_SQUADS.find(
    (squad) => squad.id === id
  );
}

beforeEach(() => {
  fetchKraftonPubgTelemetry.mockReset();
});

describe("PUBG Telemetry Dashboard", () => {
  it("starts in IDLE", () => {
    render(<PubgMatchTelemetry />);

    expect(
      screen.getByText("Telemetry Ready")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("region", {
        name: "PUBG squad telemetry results",
      })
    ).toHaveAttribute("aria-busy", "false");
  });

  it("renders the four squad buttons", () => {
    render(<PubgMatchTelemetry />);

    const group = screen.getByRole("group", {
      name: "PUBG squad selection",
    });

    expect(
      group.querySelectorAll("button")
    ).toHaveLength(4);
  });

  it("loads selected squad telemetry", async () => {
    const user = userEvent.setup();

    fetchKraftonPubgTelemetry.mockResolvedValue(
      getSquad("ge")
    );

    render(<PubgMatchTelemetry />);

    const button = screen.getByRole("button", {
      name: "Genius Esports",
    });

    await user.click(button);

    expect(button).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: "Genius Esports",
        })
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("region", {
        name: "PUBG squad telemetry results",
      })
    ).toHaveAttribute("aria-busy", "false");
  });

  it("displays LOADING while a request is pending", async () => {
    const user = userEvent.setup();

    fetchKraftonPubgTelemetry.mockImplementation(
      () => new Promise(() => {})
    );

    render(<PubgMatchTelemetry />);

    await user.click(
      screen.getByRole("button", {
        name: "Cerberus Esports",
      })
    );

    expect(
      screen.getByText(
        "Receiving Blue-Zone satellite telemetry..."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("region", {
        name: "PUBG squad telemetry results",
      })
    ).toHaveAttribute("aria-busy", "true");
  });

  it("displays an accessible error", async () => {
    const user = userEvent.setup();

    fetchKraftonPubgTelemetry.mockRejectedValue(
      new Error("Packet loss detected")
    );

    render(<PubgMatchTelemetry />);

    await user.click(
      screen.getByRole("button", {
        name: "Cerberus Esports",
      })
    );

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(
      "Satellite Connection Lost"
    );

    expect(
      screen.getByRole("button", {
        name: /Reconnect satellite and retry/i,
      })
    ).toBeInTheDocument();
  });

  it("retries the same squad after an error", async () => {
    const user = userEvent.setup();

    fetchKraftonPubgTelemetry
      .mockRejectedValueOnce(
        new Error("Connection unavailable")
      )
      .mockResolvedValueOnce(getSquad("ces"));

    render(<PubgMatchTelemetry />);

    const squadButton = screen.getByRole(
      "button",
      { name: "Cerberus Esports" }
    );

    await user.click(squadButton);

    const retryButton = await screen.findByRole(
      "button",
      { name: /Reconnect satellite and retry/i }
    );

    await user.click(retryButton);

    await waitFor(() => {
      expect(
        fetchKraftonPubgTelemetry
      ).toHaveBeenCalledTimes(2);
    });

    expect(
      await screen.findByRole("heading", {
        name: "Cerberus Esports",
      })
    ).toBeInTheDocument();

    expect(squadButton).toHaveFocus();
  });

  it("supports keyboard squad selection", async () => {
    const user = userEvent.setup();

    fetchKraftonPubgTelemetry.mockResolvedValue(
      getSquad("ge")
    );

    render(<PubgMatchTelemetry />);

    await user.tab();
    await user.tab();
    await user.tab();

    const geniusButton = screen.getByRole(
      "button",
      { name: "Genius Esports" }
    );

    expect(geniusButton).toHaveFocus();

    await user.keyboard("{Enter}");

    expect(geniusButton).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("aborts the previous request when switching squads", async () => {
    const user = userEvent.setup();
    const signals = [];

    fetchKraftonPubgTelemetry.mockImplementation(
      (_squadId, { signal }) => {
        signals.push(signal);

        return new Promise((_resolve, reject) => {
          signal.addEventListener(
            "abort",
            () => {
              reject(
                new DOMException(
                  "Aborted",
                  "AbortError"
                )
              );
            },
            { once: true }
          );
        });
      }
    );

    render(<PubgMatchTelemetry />);

    await user.click(
      screen.getByRole("button", {
        name: "Cerberus Esports",
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: "The Expendables",
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: "Genius Esports",
      })
    );

    expect(signals).toHaveLength(3);

    expect(signals[0].aborted).toBe(true);
    expect(signals[1].aborted).toBe(true);
    expect(signals[2].aborted).toBe(false);

    expect(
      screen.queryByRole("alert")
    ).not.toBeInTheDocument();
  });

  it("does not render stale squad data", async () => {
    const user = userEvent.setup();

    let resolveOldRequest;

    fetchKraftonPubgTelemetry.mockImplementation(
      (squadId) => {
        if (squadId === "ces") {
          return new Promise((resolve) => {
            resolveOldRequest = resolve;
          });
        }

        return Promise.resolve(getSquad("ge"));
      }
    );

    render(<PubgMatchTelemetry />);

    await user.click(
      screen.getByRole("button", {
        name: "Cerberus Esports",
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: "Genius Esports",
      })
    );

    expect(
      await screen.findByRole("heading", {
        name: "Genius Esports",
      })
    ).toBeInTheDocument();

    resolveOldRequest(getSquad("ces"));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: "Genius Esports",
        })
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("heading", {
        name: "Cerberus Esports",
      })
    ).not.toBeInTheDocument();
  });
});
