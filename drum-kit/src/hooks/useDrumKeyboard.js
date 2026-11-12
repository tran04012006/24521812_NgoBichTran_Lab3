
import { useEffect } from "react";

function isEditingTarget(target) {
  if (!(target instanceof Element)) return false;

  return Boolean(
    target.closest(
      'input, textarea, select, [contenteditable]:not([contenteditable="false"])'
    )
  );
}

export function useDrumKeyboard(padMap, onTriggerPad, isEnabled = true) {
  useEffect(() => {
    if (!isEnabled) return undefined;

    function onKeyDown(event) {
      // Respect IME composition and shortcuts handled elsewhere.
      if (
        event.defaultPrevented ||
        event.isComposing ||
        event.repeat ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey
      ) {
        return;
      }

      if (isEditingTarget(event.target)) return;

      const padId = padMap[event.code];
      if (!padId) return;

      event.preventDefault();
      onTriggerPad(padId);
    }

    window.addEventListener("keydown", onKeyDown);

    return () =>
      window.removeEventListener("keydown", onKeyDown);
  }, [padMap, onTriggerPad, isEnabled]);
}
