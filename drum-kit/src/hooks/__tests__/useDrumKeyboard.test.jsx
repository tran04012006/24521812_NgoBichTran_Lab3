
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDrumKeyboard } from "../useDrumKeyboard.js";
import { PAD_BY_CODE } from "../../data/drums.js";

function KeyboardHarness({ onTrigger, enabled = true }) {
  useDrumKeyboard(PAD_BY_CODE, onTrigger, enabled);

  return (
    <div>
      <input aria-label="Name" />
      <textarea aria-label="Message" />

      <select aria-label="Choice">
        <option>Option</option>
      </select>

      <div
        contentEditable
        suppressContentEditableWarning
        data-testid="editor"
      >
        Edit here
      </div>

      <div
        contentEditable
        suppressContentEditableWarning
        data-testid="editor-parent"
      >
        <span data-testid="editor-child">
          Editable child
        </span>
      </div>

      <button type="button">
        Unrelated button
      </button>
    </div>
  );
}

describe("useDrumKeyboard", () => {
  it.each([
    ["KeyW", "kick"],
    ["KeyA", "snare"],
    ["KeyS", "closed-hat"],
    ["KeyD", "open-hat"],
    ["KeyJ", "tom"],
    ["KeyK", "clap"],
    ["KeyL", "crash"],
  ])("maps physical %s to %s", (code, drumId) => {
    const onTrigger = vi.fn();

    render(
      <KeyboardHarness onTrigger={onTrigger} />
    );

    fireEvent.keyDown(window, { code });

    expect(onTrigger).toHaveBeenCalledTimes(1);
    expect(onTrigger).toHaveBeenCalledWith(drumId);
  });

  it("ignores repeated, modified and unmapped shortcuts", () => {
    const onTrigger = vi.fn();

    render(
      <KeyboardHarness onTrigger={onTrigger} />
    );

    fireEvent.keyDown(window, {
      code: "KeyW",
      repeat: true,
    });

    fireEvent.keyDown(window, {
      code: "KeyW",
      ctrlKey: true,
    });

    fireEvent.keyDown(window, {
      code: "KeyW",
      altKey: true,
    });

    fireEvent.keyDown(window, {
      code: "KeyW",
      metaKey: true,
    });

    fireEvent.keyDown(window, {
      code: "KeyZ",
    });

    expect(onTrigger).not.toHaveBeenCalled();
  });

  it("ignores shortcuts originating inside editable controls", () => {
    const onTrigger = vi.fn();

    const { getByRole, getByTestId } = render(
      <KeyboardHarness onTrigger={onTrigger} />
    );

    const targets = [
      getByRole("textbox", { name: "Name" }),
      getByRole("textbox", { name: "Message" }),
      getByRole("combobox", { name: "Choice" }),
      getByTestId("editor"),
      getByTestId("editor-child"),
    ];

    for (const target of targets) {
      fireEvent.keyDown(target, {
        code: "KeyW",
        bubbles: true,
      });
    }

    expect(onTrigger).not.toHaveBeenCalled();
  });

  it("does not install shortcuts if disabled", () => {
    const onTrigger = vi.fn();

    render(
      <KeyboardHarness
        onTrigger={onTrigger}
        enabled={false}
      />
    );

    fireEvent.keyDown(window, { code: "KeyW" });

    expect(onTrigger).not.toHaveBeenCalled();
  });

  it("removes listeners when unmounted", () => {
    const onTrigger = vi.fn();

    const view = render(
      <KeyboardHarness onTrigger={onTrigger} />
    );

    view.unmount();

    fireEvent.keyDown(window, { code: "KeyW" });

    expect(onTrigger).not.toHaveBeenCalled();
  });
});
