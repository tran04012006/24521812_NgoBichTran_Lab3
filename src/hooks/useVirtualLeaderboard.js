
import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";

/**
 * Custom fixed-height list virtualization.
 *
 * Only rows within the visible scroll
 * window plus overscan are rendered.
 *
 * @param {Object} options
 * @param {number} options.itemCount
 * @param {number} options.rowHeight
 * @param {number} options.viewportHeight
 * @param {number} options.overscan
 * @param {string} options.resetKey
 */
export default function useVirtualLeaderboard({
  itemCount,
  rowHeight = 60,
  viewportHeight = 420,
  overscan = 5,
  resetKey = "",
}) {
  const scrollContainerRef = useRef(null);

  const [scrollTop, setScrollTop] =
    useState(0);

  /**
   * Keep scrollTop within the list's
   * possible scroll range.
   */
  const totalHeight =
    itemCount * rowHeight;

  const maxScrollTop = Math.max(
    0,
    totalHeight - viewportHeight
  );

  const safeScrollTop = Math.min(
    Math.max(0, scrollTop),
    maxScrollTop
  );

  /**
   * Determine which rows can be seen.
   *
   * The overscan buffer reduces visible
   * popping during small scroll movements.
   */
  const virtualRange = useMemo(() => {
    if (itemCount === 0) {
      return {
        startIndex: 0,
        endIndex: 0,
        topPadding: 0,
        bottomPadding: 0,
        visibleCount: 0,
      };
    }

    const firstVisibleIndex = Math.floor(
      safeScrollTop / rowHeight
    );

    const visibleRowCount = Math.ceil(
      viewportHeight / rowHeight
    );

    const startIndex = Math.max(
      0,
      firstVisibleIndex - overscan
    );

    const endIndex = Math.min(
      itemCount,
      firstVisibleIndex +
        visibleRowCount +
        overscan +
        1
    );

    const topPadding =
      startIndex * rowHeight;

    const bottomPadding = Math.max(
      0,
      (itemCount - endIndex) * rowHeight
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
    itemCount,
    rowHeight,
    viewportHeight,
    overscan,
    safeScrollTop,
  ]);

  /**
   * Update scroll position.
   *
   * A scroll event is passed by React.
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
   * Reset the viewport when filters,
   * searching, or sorting changes.
   *
   * A new result set should begin
   * at the first ranked squad.
   */
  useEffect(() => {
    const element =
      scrollContainerRef.current;

    if (element) {
      element.scrollTop = 0;
    }

    setScrollTop(0);
  }, [resetKey]);

  /**
   * Return a stable public interface
   * for components.
   */
  return {
    scrollContainerRef,
    handleScroll,

    scrollTop: safeScrollTop,
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
