
import React from "react";

import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

import {
  describe,
  expect,
  it,
} from "vitest";

import Leaderboard from
  "../src/components/Leaderboard";

const sampleSquads = [
  {
    ts: "2026-11-12T12:00:00Z",
    squadName: "Alpha Champions",
    category: "ESPORTS",
    wwcdCount: 4,
    placementPts: 50,
    killPts: 70,
  },
  {
    ts: "2026-11-12T12:00:00Z",
    squadName: "Bravo Warriors",
    category: "PRO",
    wwcdCount: 2,
    placementPts: 30,
    killPts: 40,
  },
];

function getVisibleSummary(container) {
  const summary =
    container.querySelector(
      ".leaderboard-counts"
    );

  if (!summary) {
    throw new Error(
      "Leaderboard summary not found"
    );
  }

  return summary;
}

describe("Leaderboard component", () => {
  it("renders the main heading", () => {
    render(
      <Leaderboard squads={sampleSquads} />
    );

    expect(
      screen.getByRole("heading", {
        name: /PUBG Vietnam Leaderboard/i,
      })
    ).toBeInTheDocument();
  });

  it("includes 500 generated squads", () => {
    const { container } = render(
      <Leaderboard squads={sampleSquads} />
    );

    expect(
      getVisibleSummary(container)
    ).toHaveTextContent(
      "502 of 502 squads"
    );
  });

  it("filters by squad name", async () => {
    const { container } = render(
      <Leaderboard squads={sampleSquads} />
    );

    const search = screen.getByRole(
      "searchbox",
      {
        name: /SEARCH SQUADS/i,
      }
    );

    fireEvent.change(search, {
      target: {
        value: "Alpha Champions",
      },
    });

    await waitFor(() => {
      expect(
        getVisibleSummary(container)
      ).toHaveTextContent(
        "1 of 502 squads"
      );
    });

    const region = screen.getByRole(
      "region",
      {
        name: /Scrollable PUBG squad standings/i,
      }
    );

    expect(
      within(region).getByText(
        "Alpha Champions"
      )
    ).toBeInTheDocument();
  });

  it("filters by category", async () => {
    const { container } = render(
      <Leaderboard squads={sampleSquads} />
    );

    const category = screen.getByRole(
      "combobox",
      {
        name: /CATEGORY/i,
      }
    );

    fireEvent.change(category, {
      target: {
        value: "PRO",
      },
    });

    expect(category).toHaveValue("PRO");

    await waitFor(() => {
      expect(
        getVisibleSummary(container)
      ).not.toHaveTextContent(
        "502 of 502 squads"
      );
    });
  });

  it("changes sorting direction", () => {
    render(
      <Leaderboard squads={sampleSquads} />
    );

    const directionButton =
      screen.getByRole("button", {
        name: /DIRECTION/i,
      });

    fireEvent.click(directionButton);

    expect(
      screen.getByText(
        /Sorted by Total Points · Ascending/
      )
    ).toBeInTheDocument();
  });

  it("displays an empty result state", async () => {
    render(
      <Leaderboard squads={sampleSquads} />
    );

    fireEvent.change(
      screen.getByRole("searchbox", {
        name: /SEARCH SQUADS/i,
      }),
      {
        target: {
          value: "NoSuchSquad99999",
        },
      }
    );

    expect(
      await screen.findByText(
        "No matching squads"
      )
    ).toBeInTheDocument();
  });

  it("clears active filters", async () => {
    render(
      <Leaderboard squads={sampleSquads} />
    );

    const search = screen.getByRole(
      "searchbox",
      {
        name: /SEARCH SQUADS/i,
      }
    );

    fireEvent.change(search, {
      target: {
        value: "Unknown Squad",
      },
    });

    await screen.findByText(
      "No matching squads"
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "CLEAR FILTERS",
      })
    );

    expect(search).toHaveValue("");
  });

  it("renders fewer rows than all squads", () => {
    render(
      <Leaderboard squads={sampleSquads} />
    );

    const region = screen.getByRole(
      "region",
      {
        name: /Scrollable PUBG squad standings/i,
      }
    );

    const rows =
      within(region).getAllByRole("row");

    expect(rows.length).toBeLessThan(502);
  });

  it("renders the kill feed", () => {
    render(
      <Leaderboard squads={sampleSquads} />
    );

    expect(
      screen.getByRole("heading", {
        name: /PUBG Kill Feed/i,
      })
    ).toBeInTheDocument();
  });
});
