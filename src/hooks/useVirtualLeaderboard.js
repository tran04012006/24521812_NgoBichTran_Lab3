
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

/**
 * Responsive fixed-row virtualization.
 *
 * Task 6 fixes:
 * - Reattach observer after container remount
 * - Clean up old ResizeObserver
 * - Reset scrolling after filter changes
 * - Recalculate viewport dimensions
 *
 * Existing Task 5 features are retained.
 */
export default function useVirtualLeaderboard({
  itemCount,
  rowHeight = 60,
  viewportHeight = 420,
  overscan = 5,
  resetKey = "",
}) {
  /**
   * Callback ref stored as React state.
   *
   * When the DOM node is replaced,
   * setScrollElement receives the new node.
   *
   * This causes the observer effect
   * to reconnect to the new container.
   */
  const [
    scrollElement,
    setScrollElement,
  ] = useState(null);

  const scrollContainerRef =
    useCallback((element) => {
      setScrollElement(element);
    }, []);

  const [scrollTop, setScrollTop] =
    useState(0);

  const [
    measuredHeight,
    setMeasuredHeight,
  ] = useState(viewportHeight);

  /**
   * Ensure calculations use safe values.
   */
  const safeItemCount =
    Math.max(0, itemCount);

  const safeRowHeight =
    Math.max(1, rowHeight);

  const safeOverscan =
    Math.max(
      0,
      Math.floor(overscan)
    );

  const effectiveViewportHeight =
    Math.max(
      1,
      measuredHeight
    );

  const totalHeight =
    safeItemCount *
    safeRowHeight;

  const maxScrollTop =
    Math.max(
      0,
      totalHeight -
        effectiveViewportHeight
    );

  const safeScrollTop =
    Math.min(
      Math.max(0, scrollTop),
      maxScrollTop
    );

  /**
   * Measure and observe the current
   * DOM scroll container.
   *
   * The effect reruns whenever
   * scrollElement changes.
   */
  useEffect(() => {
    if (!scrollElement) {
      return;
    }

    const measure = () => {
      const nextHeight =
        scrollElement.clientHeight;

      if (nextHeight > 0) {
        setMeasuredHeight(
          (previous) =>
            previous === nextHeight
              ? previous
              : nextHeight
        );
      }
    };

    measure();

    if (
      typeof ResizeObserver !== "undefined"
    ) {
      const observer =
        new ResizeObserver(measure);

      observer.observe(
        scrollElement
      );

      return () => {
        observer.disconnect();
      };
    }

    window.addEventListener(
      "resize",
      measure
    );

    return () => {
      window.removeEventListener(
        "resize",
        measure
      );
    };
  }, [scrollElement]);

  /**
   * Compute the current visible range.
   *
   * endIndex is exclusive.
   */
  const virtualRange = useMemo(() => {
    if (safeItemCount === 0) {
      return {
        startIndex: 0,
        endIndex: 0,
        topPadding: 0,
        bottomPadding: 0,
        visibleCount: 0,
      };
    }

    const firstVisibleIndex =
      Math.floor(
        safeScrollTop /
          safeRowHeight
      );

    const visibleRowCount =
      Math.ceil(
        effectiveViewportHeight /
          safeRowHeight
      );

    const startIndex =
      Math.max(
        0,
        firstVisibleIndex -
          safeOverscan
      );

    const endIndex =
      Math.min(
        safeItemCount,
        firstVisibleIndex +
          visibleRowCount +
          safeOverscan +
          1
      );

    return {
      startIndex,
      endIndex,

      topPadding:
        startIndex *
        safeRowHeight,

      bottomPadding:
        Math.max(
          0,
          (safeItemCount -
            endIndex) *
            safeRowHeight
        ),

      visibleCount:
        endIndex -
        startIndex,
    };
  }, [
    safeItemCount,
    safeRowHeight,
    safeOverscan,
    effectiveViewportHeight,
    safeScrollTop,
  ]);

  /**
   * Handle native scroll events.
   */
  const handleScroll = useCallback(
    (event) => {
      setScrollTop(
        event.currentTarget.scrollTop
      );
    },
    []
  );

  /**
   * Scroll to a clamped position.
   */
  const scrollToPosition = useCallback(
    (position) => {
      if (!scrollElement) {
        return;
      }

      const actualMax =
        Math.max(
          0,
          scrollElement.scrollHeight -
            scrollElement.clientHeight
        );

      const next =
        Math.min(
          Math.max(0, position),
          actualMax
        );

      scrollElement.scrollTop = next;

      setScrollTop(next);
    },
    [scrollElement]
  );

  /**
   * Keyboard scrolling.
   */
  const handleKeyDown = useCallback(
    (event) => {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return;
      }

      if (!scrollElement) {
        return;
      }

      const current =
        scrollElement.scrollTop;

      const pageStep =
        Math.max(
          safeRowHeight,
          scrollElement.clientHeight -
            safeRowHeight
        );

      let nextPosition;

      switch (event.key) {
        case "ArrowDown":
          nextPosition =
            current +
            safeRowHeight;
          break;

        case "ArrowUp":
          nextPosition =
            current -
            safeRowHeight;
          break;

        case "PageDown":
          nextPosition =
            current +
            pageStep;
          break;

        case "PageUp":
          nextPosition =
            current -
            pageStep;
          break;

        case "Home":
          nextPosition = 0;
          break;

        case "End":
          nextPosition =
            scrollElement.scrollHeight -
            scrollElement.clientHeight;
          break;

        default:
          return;
      }

      event.preventDefault();

      scrollToPosition(
        nextPosition
      );
    },
    [
      scrollElement,
      safeRowHeight,
      scrollToPosition,
    ]
  );

  /**
   * Reset scroll whenever the
   * filter/sort key changes.
   *
   * Also handles the newly attached
   * DOM node after a zero-result state.
   */
  useLayoutEffect(() => {
    if (scrollElement) {
      scrollElement.scrollTop = 0;
    }

    setScrollTop(0);
  }, [
    resetKey,
    scrollElement,
  ]);

  /**
   * Clamp an existing scroll position
   * when the data or viewport shrinks.
   */
  useLayoutEffect(() => {
    if (!scrollElement) {
      return;
    }

    const actualMax =
      Math.max(
        0,
        scrollElement.scrollHeight -
          scrollElement.clientHeight
      );

    const next =
      Math.min(
        Math.max(
          0,
          scrollElement.scrollTop
        ),
        actualMax,
        maxScrollTop
      );

    if (
      scrollElement.scrollTop !== next
    ) {
      scrollElement.scrollTop = next;
    }

    setScrollTop(
      (previous) =>
        previous === next
          ? previous
          : next
    );
  }, [
    scrollElement,
    maxScrollTop,
  ]);

  return {
    scrollContainerRef,

    handleScroll,
    handleKeyDown,
    scrollToPosition,

    scrollTop: safeScrollTop,
    viewportHeight:
      effectiveViewportHeight,

    totalHeight,

    startIndex:
      virtualRange.startIndex,

    endIndex:
      virtualRange.endIndex,

    topPadding:
      virtualRange.topPadding,

    bottomPadding:
      virtualRange.bottomPadding,

    visibleCount:
      virtualRange.visibleCount,
  };
}
