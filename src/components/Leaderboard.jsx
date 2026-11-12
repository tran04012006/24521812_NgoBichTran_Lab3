
import React, {
  useDeferredValue,
  useMemo,
  useState,
  useCallback,
} from "react";

import {
  generateMockSquads,
  mockKillFeed,
} from "../data/leaderboardData";

import {
  filterAndSortSquads,
  SORT_OPTIONS,
} from "../utils/leaderboardUtils";

import useVirtualLeaderboard from
  "../hooks/useVirtualLeaderboard";

import LeaderboardRow from "./LeaderboardRow";
import KillFeedFilter from "./KillFeedFilter";

import "./Leaderboard.css";

const ROW_HEIGHT = 60;
const VIEWPORT_HEIGHT = 420;
const OVERSCAN_ROWS = 5;

/**
 * Accessible, responsive and virtualized
 * PUBG Vietnam leaderboard.
 */
export default function Leaderboard({
  squads = [],
}) {
  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("ALL");

  const [sortBy, setSortBy] =
    useState("total");

  const [
    sortDirection,
    setSortDirection,
  ] = useState("desc");

  /**
   * React 19 deferred search value.
   */
  const deferredSearch =
    useDeferredValue(search);

  const isSearchPending =
    search !== deferredSearch;

  /**
   * Generate 500 additional squads
   * without regenerating them on each
   * component render.
   */
  const generatedSquads = useMemo(
    () => generateMockSquads(500),
    []
  );

  const allSquads = useMemo(
    () => [
      ...squads,
      ...generatedSquads,
    ],
    [
      squads,
      generatedSquads,
    ]
  );

  /**
   * Search, filter and sort only when
   * relevant values change.
   */
  const rankedSquads = useMemo(
    () =>
      filterAndSortSquads(
        allSquads,
        {
          search: deferredSearch,
          category,
          sortBy,
          direction: sortDirection,
        }
      ),
    [
      allSquads,
      deferredSearch,
      category,
      sortBy,
      sortDirection,
    ]
  );

  const resetKey = [
    deferredSearch,
    category,
    sortBy,
    sortDirection,
  ].join("|");

  /**
   * Virtualization hook.
   *
   * Actual viewport height is measured
   * using ResizeObserver.
   */
  const {
    scrollContainerRef,
    handleScroll,
    handleKeyDown,
    startIndex,
    endIndex,
    topPadding,
    bottomPadding,
    visibleCount,
  } = useVirtualLeaderboard({
    itemCount: rankedSquads.length,
    rowHeight: ROW_HEIGHT,
    viewportHeight: VIEWPORT_HEIGHT,
    overscan: OVERSCAN_ROWS,
    resetKey,
  });

  /**
   * Only render the current virtual range.
   */
  const visibleSquads = useMemo(
    () =>
      rankedSquads.slice(
        startIndex,
        endIndex
      ),
    [
      rankedSquads,
      startIndex,
      endIndex,
    ]
  );

  /**
   * Stable event handlers.
   */
  const resetFilters = useCallback(
    () => {
      setSearch("");
      setCategory("ALL");
      setSortBy("total");
      setSortDirection("desc");
    },
    []
  );

  const toggleSortDirection =
    useCallback(() => {
      setSortDirection(
        (previous) =>
          previous === "desc"
            ? "asc"
            : "desc"
      );
    }, []);

  const handleSearchChange =
    useCallback((event) => {
      setSearch(
        event.target.value
      );
    }, []);

  const handleCategoryChange =
    useCallback((event) => {
      setCategory(
        event.target.value
      );
    }, []);

  const handleSortChange =
    useCallback((event) => {
      setSortBy(
        event.target.value
      );
    }, []);

  const activeSortLabel =
    SORT_OPTIONS.find(
      (option) =>
        option.value === sortBy
    )?.label ?? "Total Points";

  const hasResults =
    rankedSquads.length > 0;

  const isDefaultFilters =
    search === "" &&
    category === "ALL" &&
    sortBy === "total" &&
    sortDirection === "desc";

  /**
   * This description changes only
   * when relevant query results change.
   *
   * It is announced separately from
   * the visual result counters.
   */
  const resultAnnouncement =
    `${rankedSquads.length} of ` +
    `${allSquads.length} squads. ` +
    `Sorted by ${activeSortLabel}, ` +
    `${sortDirection === "desc"
      ? "descending"
      : "ascending"}.`;

  return (
    <>
      <section
        id="leaderboard"
        className="leaderboard-section"
        aria-labelledby="leaderboard-heading"
      >
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">
              CHAMPIONSHIP STANDINGS
            </span>

            <h2 id="leaderboard-heading">
              PUBG Vietnam Leaderboard
            </h2>

            <p>
              Search, filter and rank
              squads using virtualized
              standings.
            </p>
          </div>

          <span className="preview-tag">
            VIRTUALIZED DEMO
          </span>
        </div>

        <div className="leaderboard-card">
          <div
            className="leaderboard-filters"
            role="group"
            aria-label="Squad leaderboard filters"
          >
            <div className="filter-field filter-search">
              <label htmlFor="squad-search">
                SEARCH SQUADS
              </label>

              <input
                id="squad-search"
                type="search"
                placeholder="Search squad name..."
                value={search}
                onChange={handleSearchChange}
                aria-controls="squad-table-region"
                aria-describedby="squad-search-help"
              />

              <span
                id="squad-search-help"
                className="sr-only"
              >
                Search the leaderboard by
                squad name.
              </span>
            </div>

            <div className="filter-field">
              <label htmlFor="squad-category">
                CATEGORY
              </label>

              <select
                id="squad-category"
                value={category}
                onChange={handleCategoryChange}
                aria-controls="squad-table-region"
              >
                <option value="ALL">
                  All Categories
                </option>

                <option value="PRO">
                  Pro
                </option>

                <option value="ESPORTS">
                  Esports
                </option>

                <option value="AGG">
                  AGG
                </option>
              </select>
            </div>

            <div className="filter-field">
              <label htmlFor="squad-sort">
                SORT BY
              </label>

              <select
                id="squad-sort"
                value={sortBy}
                onChange={handleSortChange}
                aria-controls="squad-table-region"
              >
                {SORT_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="filter-field">
              <span
                id="sort-direction-label"
                className="control-label"
              >
                DIRECTION
              </span>

              <button
                type="button"
                className="sort-direction-button"
                onClick={toggleSortDirection}
                aria-labelledby="sort-direction-label"
                aria-describedby="sort-direction-value"
                aria-controls="squad-table-region"
              >
                <span aria-hidden="true">
                  {sortDirection === "desc"
                    ? "↓"
                    : "↑"}
                </span>

                <span id="sort-direction-value">
                  {sortDirection === "desc"
                    ? "Descending"
                    : "Ascending"}
                </span>
              </button>
            </div>

            <button
              type="button"
              className="filter-reset-button"
              onClick={resetFilters}
              disabled={isDefaultFilters}
            >
              RESET
            </button>
          </div>

          <div className="leaderboard-toolbar">
            <div className="toolbar-title">
              <span
                className="status-dot"
                aria-hidden="true"
              />

              <strong>
                Squad Standings
              </strong>
            </div>

            <div
              className="leaderboard-counts"
              aria-hidden="true"
            >
              <span>
                {rankedSquads.length} of{" "}
                {allSquads.length} squads
              </span>

              <span>
                {visibleCount} rendered rows
              </span>

              {isSearchPending && (
                <span>
                  Updating...
                </span>
              )}
            </div>
          </div>

          <div
            className="sr-only"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {!isSearchPending &&
              resultAnnouncement}
          </div>

          <p
            className="table-keyboard-hint"
            id="table-keyboard-help"
          >
            Focus the table to scroll with
            Arrow keys, Page Up/Down,
            Home or End.
          </p>

          {hasResults ? (
            <div
              id="squad-table-region"
              ref={scrollContainerRef}
              className="virtual-table-scroll"
              onScroll={handleScroll}
              onKeyDown={handleKeyDown}
              tabIndex={0}
              role="region"
              aria-label="Scrollable PUBG squad standings"
              aria-describedby="table-keyboard-help"
            >
              <table
                className="leaderboard-table virtual-leaderboard-table"
                aria-rowcount={
                  rankedSquads.length + 1
                }
              >
                <colgroup>
                  <col className="rank-column" />
                  <col className="squad-column" />
                  <col className="category-column" />
                  <col className="stat-column" />
                  <col className="stat-column" />
                  <col className="stat-column" />
                  <col className="stat-column" />
                </colgroup>

                <thead>
                  <tr aria-rowindex={1}>
                    <th scope="col">
                      RANK
                    </th>

                    <th scope="col">
                      SQUAD
                    </th>

                    <th scope="col">
                      CATEGORY
                    </th>

                    <th scope="col">
                      WWCD
                    </th>

                    <th scope="col">
                      PLACEMENT
                    </th>

                    <th scope="col">
                      KILLS
                    </th>

                    <th scope="col">
                      TOTAL
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {topPadding > 0 && (
                    <tr
                      className="virtual-spacer-row"
                      aria-hidden="true"
                      role="presentation"
                    >
                      <td
                        colSpan={7}
                        style={{
                          height: topPadding,
                        }}
                      />
                    </tr>
                  )}

                  {visibleSquads.map(
                    (squad, index) => {
                      const rank =
                        startIndex +
                        index +
                        1;

                      return (
                        <LeaderboardRow
                          key={
                            `${squad.squadName}-${squad.ts}`
                          }
                          squad={squad}
                          rank={rank}
                        />
                      );
                    }
                  )}

                  {bottomPadding > 0 && (
                    <tr
                      className="virtual-spacer-row"
                      aria-hidden="true"
                      role="presentation"
                    >
                      <td
                        colSpan={7}
                        style={{
                          height: bottomPadding,
                        }}
                      />
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              id="squad-table-region"
              className="empty-results"
            >
              <strong>
                No matching squads
              </strong>

              <p>
                Try another squad name
                or category.
              </p>

              <button
                type="button"
                className="filter-reset-button"
                onClick={resetFilters}
              >
                CLEAR FILTERS
              </button>
            </div>
          )}

          <div className="leaderboard-footer">
            <span>
              Sorted by {activeSortLabel}
              {" · "}
              {sortDirection === "desc"
                ? "Descending"
                : "Ascending"}
            </span>

            <span>
              Virtual scrolling enabled
            </span>
          </div>
        </div>
      </section>

      <KillFeedFilter
        events={mockKillFeed}
      />
    </>
  );
}
