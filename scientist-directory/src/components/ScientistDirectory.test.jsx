
import React, { Profiler } from "react";

import {
  render,
  screen,
  within,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import ScientistDirectory from "./ScientistDirectory.jsx";
import { SMART_PEOPLE } from "../data/scientists.js";

// ============================================
// Helper functions
// ============================================

function setup() {
  const user = userEvent.setup();

  render(<ScientistDirectory />);

  return { user };
}

function getScientistNames() {
  return screen
    .getAllByRole("heading", { level: 3 })
    .map((heading) => heading.textContent);
}

// ============================================
// Test suite
// ============================================

describe("ScientistDirectory", () => {
  // ==========================================
  // Test 1: Initial rendering
  // ==========================================

  it("renders all six scientists initially", () => {
    setup();

    expect(
      screen.getAllByRole("button", {
        name: /^Delete /,
      })
    ).toHaveLength(6);

    expect(
      screen.getByRole("status")
    ).toHaveTextContent("Found 6 scientists");
  });

  // ==========================================
  // Test 2: Accessible input labels
  // ==========================================

  it("has accessible form controls", () => {
    setup();

    expect(
      screen.getByRole("searchbox", {
        name: /search by scientist name/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("spinbutton", {
        name: /minimum iq/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("combobox", {
        name: /sort by iq/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("status")
    ).toHaveAttribute("aria-live", "polite");
  });

  // ==========================================
  // Test 3: Case-insensitive search
  // ==========================================

  it("filters names case-insensitively", async () => {
    const { user } = setup();

    const search = screen.getByRole("searchbox", {
      name: /search by scientist name/i,
    });

    await user.type(search, "EINSTEIN");

    expect(
      screen.getByRole("heading", {
        name: "Albert Einstein",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("status")
    ).toHaveTextContent("Found 1 scientist");

    expect(
      screen.queryByRole("heading", {
        name: "Isaac Newton",
      })
    ).not.toBeInTheDocument();
  });

  // ==========================================
  // Test 4: Minimum IQ filtering
  // ==========================================

  it("filters scientists by minimum IQ", async () => {
    const { user } = setup();

    const iqInput = screen.getByRole("spinbutton", {
      name: /minimum iq/i,
    });

    await user.clear(iqInput);
    await user.type(iqInput, "200");

    expect(
      screen.getByRole("status")
    ).toHaveTextContent("Found 3 scientists");

    expect(getScientistNames()).toEqual([
      "Johann Goethe",
      "Albert Einstein",
      "William Sidis",
    ]);
  });

  // ==========================================
  // Test 5: Empty numeric input
  // ==========================================

  it("handles an empty IQ input safely", async () => {
    const { user } = setup();

    const iqInput = screen.getByRole("spinbutton", {
      name: /minimum iq/i,
    });

    await user.clear(iqInput);

    expect(iqInput).toHaveValue(null);

    expect(
      screen.getByRole("status")
    ).toHaveTextContent("Found 6 scientists");
  });

  // ==========================================
  // Test 6: Ascending sorting
  // ==========================================

  it("sorts scientists by ascending IQ", async () => {
    const { user } = setup();

    const sortSelect = screen.getByRole("combobox", {
      name: /sort by iq/i,
    });

    await user.selectOptions(sortSelect, "iq-asc");

    expect(getScientistNames()).toEqual([
      "Leonardo da Vinci",
      "Isaac Newton",
      "James Maxwell",
      "William Sidis",
      "Albert Einstein",
      "Johann Goethe",
    ]);
  });

  // ==========================================
  // Test 7: Combined filters
  // ==========================================

  it("combines name, IQ and sorting controls", async () => {
    const { user } = setup();

    const search = screen.getByRole("searchbox", {
      name: /search by scientist name/i,
    });

    const iqInput = screen.getByRole("spinbutton", {
      name: /minimum iq/i,
    });

    const sortSelect = screen.getByRole("combobox", {
      name: /sort by iq/i,
    });

    await user.type(search, "a");

    await user.clear(iqInput);
    await user.type(iqInput, "190");

    await user.selectOptions(sortSelect, "iq-asc");

    expect(getScientistNames()).toEqual([
      "Isaac Newton",
      "James Maxwell",
      "Albert Einstein",
      "Johann Goethe",
    ]);
  });

  // ==========================================
  // Test 8: Immutable deletion
  // ==========================================

  it("deletes only the selected scientist", async () => {
    const { user } = setup();

    await user.click(
      screen.getByRole("button", {
        name: "Delete Albert Einstein",
      })
    );

    expect(
      screen.queryByRole("heading", {
        name: "Albert Einstein",
      })
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Isaac Newton",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("status")
    ).toHaveTextContent("Found 5 scientists");

    // The original source dataset is untouched.
    expect(
      SMART_PEOPLE.find(
        (person) => person.id === "sp-2"
      )
    ).toBeDefined();

    expect(SMART_PEOPLE).toHaveLength(6);
  });

  // ==========================================
  // Test 9: Focus after deletion
  // ==========================================

  it("moves focus to the next Delete button", async () => {
    const { user } = setup();

    const einsteinButton = screen.getByRole("button", {
      name: "Delete Albert Einstein",
    });

    einsteinButton.focus();

    expect(einsteinButton).toHaveFocus();

    await user.keyboard("{Enter}");

    expect(
      screen.getByRole("button", {
        name: "Delete William Sidis",
      })
    ).toHaveFocus();
  });

  // ==========================================
  // Test 10: Focus after last deletion
  // ==========================================

  it("focuses Reset when no results remain", async () => {
    const { user } = setup();

    const search = screen.getByRole("searchbox", {
      name: /search by scientist name/i,
    });

    await user.type(search, "einstein");

    const deleteButton = screen.getByRole("button", {
      name: "Delete Albert Einstein",
    });

    deleteButton.focus();
    await user.keyboard("{Enter}");

    expect(
      screen.getByRole("button", {
        name: /reset directory/i,
      })
    ).toHaveFocus();

    expect(
      screen.getByRole("status")
    ).toHaveTextContent("Found 0 scientists");
  });

  // ==========================================
  // Test 11: Reset
  // ==========================================

  it("restores all scientists and control defaults", async () => {
    const { user } = setup();

    await user.click(
      screen.getByRole("button", {
        name: "Delete Albert Einstein",
      })
    );

    const search = screen.getByRole("searchbox", {
      name: /search by scientist name/i,
    });

    const iqInput = screen.getByRole("spinbutton", {
      name: /minimum iq/i,
    });

    const sortSelect = screen.getByRole("combobox", {
      name: /sort by iq/i,
    });

    await user.type(search, "newton");

    await user.clear(iqInput);
    await user.type(iqInput, "200");

    await user.selectOptions(sortSelect, "iq-asc");

    await user.click(
      screen.getByRole("button", {
        name: /reset directory/i,
      })
    );

    expect(search).toHaveValue("");
    expect(iqInput).toHaveValue(160);
    expect(sortSelect).toHaveValue("iq-desc");

    expect(
      screen.getByRole("status")
    ).toHaveTextContent("Found 6 scientists");

    expect(
      screen.getByRole("heading", {
        name: "Albert Einstein",
      })
    ).toBeInTheDocument();
  });

  // ==========================================
  // Test 12: Render commit verification
  // ==========================================

  it("commits one update for one search change", async () => {
    const user = userEvent.setup();

    const onRender = vi.fn();

    render(
      <Profiler id="directory" onRender={onRender}>
        <ScientistDirectory />
      </Profiler>
    );

    // Ignore the initial mount.
    onRender.mockClear();

    const search = screen.getByRole("searchbox", {
      name: /search by scientist name/i,
    });

    await user.type(search, "a");

    const updateCalls = onRender.mock.calls.filter(
      (call) => call[1] === "update"
    );

    expect(updateCalls).toHaveLength(1);
  });
});
