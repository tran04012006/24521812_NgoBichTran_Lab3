
import React, {
  useCallback,
  useDeferredValue,
  useMemo,
  useState,
} from "react";

import {
  filterKillFeed,
  formatEventTime,
} from "../utils/leaderboardUtils";

/**
 * Accessible PUBG kill-feed filter.
 *
 * Task 5:
 * - Deferred search
 * - Accessible filter labels
 * - Result count announcements
 * - Descriptive event text
 * - Keyboard-scrollable event list
 */
export default function KillFeedFilter({
  events = [],
}) {
  const [search, setSearch] =
    useState("");

  const [eventType, setEventType] =
    useState("ALL");

  const deferredSearch =
    useDeferredValue(search);

  const isSearching =
    search !== deferredSearch;

  const filteredEvents = useMemo(
    () =>
      filterKillFeed(events, {
        search: deferredSearch,
        type: eventType,
      }),
    [
      events,
      deferredSearch,
      eventType,
    ]
  );

  const handleSearchChange =
    useCallback((event) => {
      setSearch(
        event.target.value
      );
    }, []);

  const handleEventTypeChange =
    useCallback((event) => {
      setEventType(
        event.target.value
      );
    }, []);

  const handleClear = useCallback(
    () => {
      setSearch("");
      setEventType("ALL");
    },
    []
  );

  const hasActiveFilters =
    search !== "" ||
    eventType !== "ALL";

  const resultAnnouncement =
    `${filteredEvents.length} of ` +
    `${events.length} kill-feed events.`;

  return (
    <section
      className="kill-feed-section"
      aria-labelledby="kill-feed-heading"
    >
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">
            MATCH ACTIVITY
          </span>

          <h2 id="kill-feed-heading">
            PUBG Kill Feed
          </h2>

          <p>
            Explore mock eliminations and
            knockdowns from the arena.
          </p>
        </div>

        <span className="preview-tag">
          MOCK EVENTS
        </span>
      </div>

      <div className="kill-feed-card">
        <div
          className="kill-feed-toolbar"
          role="group"
          aria-label="Kill-feed filters"
        >
          <div className="filter-field">
            <label
              htmlFor="kill-feed-search"
            >
              SEARCH EVENTS
            </label>

            <input
              id="kill-feed-search"
              type="search"
              value={search}
              placeholder="Squad or weapon..."
              onChange={handleSearchChange}
              aria-controls="kill-feed-results"
              aria-describedby="kill-search-help"
            />

            <span
              id="kill-search-help"
              className="sr-only"
            >
              Search attacker squad,
              victim squad or weapon.
            </span>
          </div>

          <div className="filter-field">
            <label
              htmlFor="kill-feed-type"
            >
              EVENT TYPE
            </label>

            <select
              id="kill-feed-type"
              value={eventType}
              onChange={handleEventTypeChange}
              aria-controls="kill-feed-results"
            >
              <option value="ALL">
                All Events
              </option>

              <option value="KILL">
                Kills
              </option>

              <option value="KNOCK">
                Knockdowns
              </option>
            </select>
          </div>

          <button
            type="button"
            className="filter-reset-button"
            onClick={handleClear}
            disabled={!hasActiveFilters}
          >
            RESET
          </button>
        </div>

        <div
          className="kill-feed-summary"
          aria-hidden="true"
        >
          <span>
            {filteredEvents.length} of{" "}
            {events.length} events
          </span>

          {isSearching && (
            <span>
              Updating results...
            </span>
          )}
        </div>

        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {!isSearching &&
            resultAnnouncement}
        </div>

        {filteredEvents.length > 0 ? (
          <div
            id="kill-feed-results"
            className="kill-feed-list"
            role="region"
            aria-label="PUBG kill-feed events"
            tabIndex={0}
          >
            {filteredEvents.map(
              (event) => {
                const action =
                  event.eventType === "KILL"
                    ? "eliminated"
                    : "knocked down";

                const readableEvent =
                  `${event.attacker} ` +
                  `${action} ` +
                  `${event.victim} ` +
                  `using ${event.weapon}`;

                return (
                  <article
                    className="kill-feed-event"
                    key={event.id}
                    aria-label={readableEvent}
                  >
                    <div className="kill-feed-event-main">
                      <span className="kill-attacker">
                        {event.attacker}
                      </span>

                      <span
                        className={
                          event.eventType === "KILL"
                            ? "event-type event-kill"
                            : "event-type event-knock"
                        }
                      >
                        {event.eventType}
                      </span>

                      <span className="kill-victim">
                        {event.victim}
                      </span>
                    </div>

                    <div className="kill-feed-event-meta">
                      <span className="weapon-label">
                        {event.weapon}
                      </span>

                      <time
                        dateTime={event.timestamp}
                      >
                        {formatEventTime(
                          event.timestamp
                        )}{" "}
                        ICT
                      </time>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        ) : (
          <div
            id="kill-feed-results"
            className="empty-results"
          >
            <strong>
              No matching events
            </strong>

            <p>
              Try another squad name,
              weapon, or event type.
            </p>

            <button
              type="button"
              onClick={handleClear}
              className="filter-reset-button"
            >
              CLEAR FILTERS
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
