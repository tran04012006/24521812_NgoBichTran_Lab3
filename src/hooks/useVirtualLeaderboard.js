
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/**
 * Responsive virtualized list hook.
 *
 * Features:
 * - Fixed-height row virtualization
 * - Actual viewport measurement
 * - ResizeObserver support
 * - Keyboard scrolling
 * - Overscan buffering
 * - Scroll position clamping
 * - Filter/sort reset
 * - Effect cleanup
 */

export default function useVirtualLeaderboard({
  itemCount,
  rowHeight = 60,
  viewportHeight = 420,
  overscan = 5,
  resetKey = "",
}) {
  const scrollContainerRef =
    useRef(null);

  const [scrollTop, setScrollTop] =
    useState(0);

  const [measuredHeight, setMeasuredHeight] =
    useState(viewportHeight);

  /**
   * Use safe positive dimensions.
   */
  const safeItemCount = Math.max(
    0,
    itemCount
  );

  const safeRowHeight = Math.max(
    1,
    rowHeight
  );

  const safeOverscan = Math.max(
    0,
    Math.floor(overscan)
  );

  const effectiveViewportHeight =
    Math.max(
      1,
      measuredHeight
    );

  /**
   * Total virtual content height.
   */
  const totalHeight =
    safeItemCount * safeRowHeight;

  const maxScrollTop = Math.max(
    0,
    totalHeight -
      effectiveViewportHeight
  );

  const safeScrollTop = Math.min(
    Math.max(0, scrollTop),
    maxScrollTop
  );

  /**
   * Measure the actual scroll container.
   *
   * ResizeObserver detects changes caused
   * by screen resizing and responsive CSS.
   */
  useEffect(() => {
    const element =
      scrollContainerRef.current;

    if (!element) {
      return;
    }

    const updateHeight = () => {
      const nextHeight =
        element.clientHeight;

      if (nextHeight > 0) {
        setMeasuredHeight(
          (previous) =>
            previous === nextHeight
              ? previous
              : nextHeight
        );
      }
    };

    updateHeight();

    if (
      typeof ResizeObserver !== "undefined"
    ) {
      const observer =
        new ResizeObserver(updateHeight);

      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    }

    window.addEventListener(
      "resize",
      updateHeight
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateHeight
      );
    };
  }, []);

  /**
   * Compute the visible indices.
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

    const firstVisibleIndex = Math.floor(
      safeScrollTop /
        safeRowHeight
    );

    const visibleRowCount = Math.ceil(
      effectiveViewportHeight /
        safeRowHeight
    );

    const startIndex = Math.max(
      0,
      firstVisibleIndex -
        safeOverscan
    );

    const endIndex = Math.min(
      safeItemCount,
      firstVisibleIndex +
        visibleRowCount +
        safeOverscan +
        1
    );

    const topPadding =
      startIndex *
      safeRowHeight;

    const bottomPadding = Math.max(
      0,
      (safeItemCount - endIndex) *
        safeRowHeight
    );

    return {
      startIndex,
      endIndex,
      topPadding,
      bottomPadding,
      visibleCount:
        endIndex - startIndex,
    };
  }, [
    safeItemCount,
    safeRowHeight,
    safeOverscan,
    effectiveViewportHeight,
    safeScrollTop,
  ]);

  /**
   * Native scroll handler.
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
   * Scroll to a specific position.
   *
   * Scroll positions are clamped so
   * keyboard navigation cannot move
   * beyond the available content.
   */
  const scrollToPosition = useCallback(
    (position) => {
      const element =
        scrollContainerRef.current;

      if (!element) {
        return;
      }

      const actualMaximum = Math.max(
        0,
        element.scrollHeight -
          element.clientHeight
      );

      const nextPosition = Math.min(
        Math.max(0, position),
        actualMaximum
      );

      element.scrollTop =
        nextPosition;

      setScrollTop(
        nextPosition
      );
    },
    []
  );

  /**
   * Keyboard navigation.
   *
   * Handled keys:
   * - ArrowDown
   * - ArrowUp
   * - PageDown
   * - PageUp
   * - Home
   * - End
   *
   * Horizontal arrow keys retain
   * their native browser behavior.
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

      const element =
        scrollContainerRef.current;

      if (!element) {
        return;
      }

      const currentPosition =
        element.scrollTop;

      const pageStep = Math.max(
        safeRowHeight,
        element.clientHeight -
          safeRowHeight
      );

      let nextPosition = null;

      switch (event.key) {
        case "ArrowDown":
          nextPosition =
            currentPosition +
            safeRowHeight;
          break;

        case "ArrowUp":
          nextPosition =
            currentPosition -
            safeRowHeight;
          break;

        case "PageDown":
          nextPosition =
            currentPosition +
            pageStep;
          break;

        case "PageUp":
          nextPosition =
            currentPosition -
            pageStep;
          break;

        case "Home":
          nextPosition = 0;
          break;

        case "End":
          nextPosition =
            element.scrollHeight -
            element.clientHeight;
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
      safeRowHeight,
      scrollToPosition,
    ]
  );

  /**
   * Reset scrolling after a change
   * in searching, sorting or filtering.
   *
   * useLayoutEffect runs before the
   * browser paints the updated view.
   */
  useLayoutEffect(() => {
    const element =
      scrollContainerRef.current;

    if (element) {
      element.scrollTop = 0;
    }

    setScrollTop(0);
  }, [resetKey]);

  /**
   * Correct the actual scroll position
   * if the list becomes shorter.
   *
   * For example, after filtering from
   * 508 rows down to 4 rows.
   */
  useLayoutEffect(() => {
    const element =
      scrollContainerRef.current;

    if (!element) {
      return;
    }

    if (
      element.scrollTop >
      maxScrollTop
    ) {
      element.scrollTop =
        maxScrollTop;

      setScrollTop(
        maxScrollTop
      );
    }
  }, [maxScrollTop]);

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
