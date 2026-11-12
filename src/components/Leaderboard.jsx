
import React, {
  useDeferredValue,
  useMemo,
  useState,
} from "react";

import {
  generateMockSquads,
  mockKillFeed,
} from "../data/leaderboardData";

import {
  calculateTotalPoints,
  filterAndSortSquads,
  SORT_OPTIONS,
} from "../utils/leaderboardUtils";

import useVirtualLeaderboard from
  "../hooks/useVirtualLeaderboard";

import KillFeedFilter from "./KillFeedFilter";

import "./Leaderboard.css";

/**
 * Virtualized PUBG leaderboard.
 *
 * Task 4:
 * - Squad searching
 * - Category filtering
 * - Sorting and direction control
 * - Fixed-height virtualization
 * - Kill-feed filtering
 */

const ROW_HEIGHT = 60;

const VIEWPORT_HEIGHT = 420;

const OVERSCAN_ROWS = 5;

export default function Leaderboard({
  squads = [],
}) {
  /**
   * Filter controls.
   */
  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("ALL");

  const [sortBy, setSortBy] =
    useState("total");

  const [sortDirection, setSortDirection] =
    useState("desc");

  /**
   * Defer large search calculations
   * to keep input interaction responsive.
   */
  const deferredSearch =
    useDeferredValue(search);

  const isSearchPending =
    deferredSearch !== search;

  /**
   * Extend the eight original squads
   * with 500 generated mock squads.
   *
   * useMemo avoids recreating the
   * generated dataset on every render.
   */
  const allSquads = useMemo(
    () => [
      ...squads,
      ...generateMockSquads(500),
    ],
    [squads]
  );

  /**
   * Filter and sort the complete dataset.
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

  /**
   * Reset virtual scroll position
   * when the leaderboard query changes.
   */
  const resetKey = [
    deferredSearch,
    category,
    sortBy,
    sortDirection,
  ].join("|");

  /**
   * Virtualization calculations.
   */
  const {
    scrollContainerRef,
    handleScroll,
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
   * Slice only the rows that should
   * actually exist in the DOM.
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
   * Reset filters to the default view.
   */
  const resetFilters = () => {
    setSearch("");
    setCategory("ALL");
    setSortBy("total");
    setSortDirection("desc");
  };

  /**
   * Toggle ascending/descending order.
   */
  const toggleSortDirection = () => {
    setSortDirection(
      (previous) =>
        previous === "desc"
          ? "asc"
          : "desc"
    );
  };

  const hasResults =
    rankedSquads.length > 0;

  const activeSortLabel =
    SORT_OPTIONS.find(
      (option) =>
        option.value === sortBy
    )?.label || "Total Points";

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
              Search, filter, and rank
              squads using a virtualized
              standings table.
            </p>
          </div>

          <span className="preview-tag">
            VIRTUALIZED DEMO
          </span>
        </div>

        <div className="leaderboard-card">
          {/* FILTER CONTROLS */}
          <div className="leaderboard-filters">
            <div className="filter-field filter-search">
              <label
                htmlFor="squad-search"
              >
                SEARCH SQUADS
              </label>

              <input
                id="squad-search"
                type="search"
                placeholder="Search squad name..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />
            </div>

            <div className="filter-field">
              <label
                htmlFor="squad-category"
              >
                CATEGORY
              </label>

              <select
                id="squad-category"
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
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
              <label
                htmlFor="squad-sort"
              >
                SORT BY
              </label>

              <select
                id="squad-sort"
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target.value
                  )
                }
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
              <label>
                DIRECTION
              </label>

              <button
                type="button"
                className="sort-direction-button"
                onClick={
                  toggleSortDirection
                }
                aria-label={
                  `Sort ${
                    sortDirection === "desc"
                      ? "descending"
                      : "ascending"
                  }. Click to reverse.`
                }
              >
                <span aria-hidden="true">
                  {sortDirection === "desc"
                    ? "↓"
                    : "↑"}
                </span>

                {sortDirection === "desc"
                  ? "Descending"
                  : "Ascending"}
              </button>
            </div>

            <button
              type="button"
              className="filter-reset-button"
              onClick={resetFilters}
              disabled={
                search === "" &&
                category === "ALL" &&
                sortBy === "total" &&
                sortDirection === "desc"
              }
            >
              RESET
            </button>
          </div>

          {/* SUMMARY */}
          <div className="leaderboard-toolbar">
            <div className="toolbar-title">
              <span className="status-dot"></span>

              <strong>
                Squad Standings
              </strong>
            </div>

            <div className="leaderboard-counts">
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

          {/* VIRTUALIZED TABLE */}
          {hasResults ? (
            <div
              ref={scrollContainerRef}
              className="virtual-table-scroll"
              onScroll={handleScroll}
              style={{
                height: VIEWPORT_HEIGHT,
              }}
              tabIndex={0}
              role="region"
              aria-label="Scrollable PUBG squad standings"
            >
              <table
                className="leaderboard-table virtual-leaderboard-table"
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
                  <tr>
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

                      const totalPoints =
                        calculateTotalPoints(
                          squad
                        );

                      return (
                        <tr
                          className="virtual-row"
                          key={
                            `${squad.squadName}-${squad.ts}`
                          }
                          aria-rowindex={rank + 1}
                        >
                          <td>
                            <span
                              className={
                                rank <= 3
                                  ? "rank-badge top-rank"
                                  : "rank-badge"
                              }
                            >
                              #{rank}
                            </span>
                          </td>

                          <th scope="row">
                            <span className="squad-name">
                              {squad.squadName}
                            </span>
                          </th>

                          <td>
                            <span className="category-badge">
                              {squad.category}
                            </span>
                          </td>

                          <td>
                            {squad.wwcdCount}
                          </td>

                          <td>
                            {squad.placementPts}
                          </td>

                          <td>
                            {squad.killPts}
                          </td>

                          <td>
                            <strong className="total-points">
                              {totalPoints}
                            </strong>
                          </td>
                        </tr>
                      );
                    }
                  )}

                  {bottomPadding > 0 && (
                    <tr
                      className="virtual-spacer-row"
                      aria-hidden="true"
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
            <div className="empty-results">
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

          {/* FOOTER */}
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
