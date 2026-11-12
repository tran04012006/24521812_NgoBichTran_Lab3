
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import DrumKit from "../DrumKit.jsx";

vi.mock("../../audio/drumAudio.js", () => ({
  playDrum: vi.fn(async () => {}),
  closeDrumAudio: vi.fn(async () => {}),
  getAudioLevelDbfs: vi.fn(() => -25),
}));

import {
  playDrum,
  closeDrumAudio,
} from "../../audio/drumAudio.js";

const keys = ["W", "A", "S", "D", "J", "K", "L"];

beforeEach(() => {
  playDrum.mockResolvedValue(undefined);
});

describe("DrumKit", () => {
  it("renders seven labeled, focusable native buttons and a digital meter", () => {
    render(<DrumKit />);

    const group = screen.getByRole("group", {
      name: "Drum pads",
    });

    const buttons = within(group).getAllByRole("button");

    expect(buttons).toHaveLength(7);

    for (const key of keys) {
      expect(
        within(group).getByRole("button", {
          name: new RegExp(
            `physical key ${key}$`,
            "i"
          ),
        })
      ).toBeVisible();
    }

    expect(
      screen.getByRole("meter", {
        name: /digital drum audio level/i,
      })
    ).toHaveAttribute("aria-valuemin", "-60");

    expect(
      screen.getByText(
        /not real-world sound pressure/i
      )
    ).toBeVisible();
  });

  it("plays a drum on click, logs it and shows a brief activation", async () => {
    const user = userEvent.setup();

    render(<DrumKit />);

    const kick = screen.getByRole("button", {
      name: /kick drum pad/i,
    });

    await user.click(kick);

    await waitFor(() =>
      expect(playDrum).toHaveBeenCalledWith("kick")
    );

    await waitFor(() =>
      expect(kick).toHaveClass("is-active")
    );

    expect(
      screen.getByText(/hit 1: kick/i)
    ).toBeInTheDocument();

    expect(
      within(screen.getByRole("list"))
        .getAllByRole("listitem")
    ).toHaveLength(1);
  });

  it("activates a focused pad with Enter and Space", async () => {
    const user = userEvent.setup();

    render(<DrumKit />);

    const snare = screen.getByRole("button", {
      name: /snare drum pad/i,
    });

    snare.focus();

    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    await waitFor(() =>
      expect(playDrum).toHaveBeenCalledTimes(2)
    );

    expect(playDrum).toHaveBeenNthCalledWith(
      1,
      "snare"
    );

    expect(playDrum).toHaveBeenNthCalledWith(
      2,
      "snare"
    );
  });

  it("triggers mapped physical keys but ignores held-key repeat", async () => {
    render(<DrumKit />);

    fireEvent.keyDown(window, {
      code: "KeyL",
    });

    fireEvent.keyDown(window, {
      code: "KeyL",
      repeat: true,
    });

    await waitFor(() =>
      expect(playDrum).toHaveBeenCalledTimes(1)
    );

    expect(playDrum).toHaveBeenCalledWith("crash");
  });

  it("keeps the 12 latest successful hits, newest first, and clears them", async () => {
    const user = userEvent.setup();

    render(<DrumKit />);

    const kick = screen.getByRole("button", {
      name: /kick drum pad/i,
    });

    const snare = screen.getByRole("button", {
      name: /snare drum pad/i,
    });

    for (let i = 0; i < 12; i += 1) {
      await user.click(kick);
    }

    await user.click(snare);

    const entries = within(
      screen.getByRole("list")
    ).getAllByRole("listitem");

    expect(entries).toHaveLength(12);

    expect(entries[0]).toHaveTextContent("Snare");
    expect(entries[1]).toHaveTextContent("Kick");

    await user.click(
      screen.getByRole("button", {
        name: /clear history/i,
      })
    );

    expect(
      screen.getByText(/no hits yet/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /clear history/i,
      })
    ).toBeDisabled();
  });

  it("shows playback errors and does not record a hit on failure", async () => {
    const user = userEvent.setup();

    playDrum.mockRejectedValueOnce(
      new Error("Audio unavailable")
    );

    render(<DrumKit />);

    await user.click(
      screen.getByRole("button", {
        name: /kick drum pad/i,
      })
    );

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent("Audio unavailable");

    expect(
      screen.getByText(/no hits yet/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /clear history/i,
      })
    ).toBeDisabled();
  });

  it("closes audio on unmount", () => {
    const view = render(<DrumKit />);

    view.unmount();

    expect(closeDrumAudio).toHaveBeenCalled();
  });
});
