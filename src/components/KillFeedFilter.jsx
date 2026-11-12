
import React, {
  useDeferredValue,
  useMemo,
  useState,
} from "react";

import {
  filterKillFeed,
  formatEventTime,
} from "../utils/leaderboardUtils";

/**
 * PUBG Kill-Feed Filter.
 *
 * Task 4:
 * - Search attacker/victim/weapon
 * - Filter KILL / KNOCK events
 * - Display timestamps
 * - Show empty result feedback
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

  /**
   * Recalculate only when the input
   * data or filter conditions change.
   */
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

  const isSearching =
    search !== deferredSearch;

  const handleClear = () => {
    setSearch("");
    setEventType("ALL");
  };

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
        <div className="kill-feed-toolbar">
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
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
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
              onChange={(event) =>
                setEventType(
                  event.target.value
                )
              }
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
            disabled={
              !search &&
              eventType === "ALL"
            }
          >
            RESET
          </button>
        </div>

        <div className="kill-feed-summary">
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

        {filteredEvents.length > 0 ? (
          <div className="kill-feed-list">
            {filteredEvents.map(
              (event) => (
                <article
                  className="kill-feed-event"
                  key={event.id}
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
              )
            )}
          </div>
        ) : (
          <div className="empty-results">
            <strong>
              No matching events
            </strong>

            <p>
              Try changing your search
              or event type.
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
