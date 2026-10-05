// =====================================================
// SHIELD SECURITY SERVICES
// SHARED SCHEDULE CALENDAR
// Works on both admin.html and employee.html
// =====================================================

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        const adminGrid =
            document.getElementById("adminCalendarGrid");

        const employeeGrid =
            document.getElementById("employeeCalendarGrid");

        if (!adminGrid && !employeeGrid) {
            return;
        }

        const mode =
            adminGrid ? "admin" : "employee";

        const prefix =
            mode === "admin"
                ? "admin"
                : "employee";

        const $ =
            (id) =>
                document.getElementById(id);

        const el = {
            grid:
                $(prefix + "CalendarGrid"),

            monthLabel:
                $(prefix + "CalendarMonthLabel"),

            prevBtn:
                $(prefix + "CalendarPrevBtn"),

            todayBtn:
                $(prefix + "CalendarTodayBtn"),

            nextBtn:
                $(prefix + "CalendarNextBtn"),

            selectedDate:
                $(prefix + "CalendarSelectedDate"),

            details:
                $(prefix + "CalendarDetails"),

            status:
                $(prefix + "CalendarStatus"),

            employeeFilter:
                $(prefix + "CalendarEmployeeFilter"),

            siteFilter:
                $(prefix + "CalendarSiteFilter")
        };

        const state = {
            schedules: [],
            employees: [],
            sites: [],

            viewDate:
                firstOfMonth(
                    new Date()
                ),

            selectedDateKey:
                localDateKey(
                    new Date()
                ),

            loading: false
        };

        bindEvents();
        refreshCalendarData();

        // Refresh every 10 seconds
        // so schedule changes from another device appear.
        setInterval(
            function () {
                if (!document.hidden) {
                    refreshCalendarData(true);
                }
            },
            10000
        );

        // Refresh when user comes back to browser tab.
        window.addEventListener(
            "focus",
            function () {
                refreshCalendarData(true);
            }
        );

        document.addEventListener(
            "visibilitychange",
            function () {
                if (!document.hidden) {
                    refreshCalendarData(true);
                }
            }
        );

        // Other SHIELD code can call:
        //
        // window.dispatchEvent(
        //     new Event("shield:schedules-changed")
        // );
        //
        // after adding/editing/deleting a shift.

        window.addEventListener(
            "shield:schedules-changed",
            function () {
                refreshCalendarData(true);
            }
        );

        // =================================================
        // EVENTS
        // =================================================

        function bindEvents() {
            el.prevBtn?.addEventListener(
                "click",
                function () {
                    state.viewDate =
                        new Date(
                            state.viewDate.getFullYear(),
                            state.viewDate.getMonth() - 1,
                            1
                        );

                    state.selectedDateKey =
                        dateKeyFromParts(
                            state.viewDate.getFullYear(),
                            state.viewDate.getMonth(),
                            1
                        );

                    renderCalendar();
                }
            );

            el.nextBtn?.addEventListener(
                "click",
                function () {
                    state.viewDate =
                        new Date(
                            state.viewDate.getFullYear(),
                            state.viewDate.getMonth() + 1,
                            1
                        );

                    state.selectedDateKey =
                        dateKeyFromParts(
                            state.viewDate.getFullYear(),
                            state.viewDate.getMonth(),
                            1
                        );

                    renderCalendar();
                }
            );

            el.todayBtn?.addEventListener(
                "click",
                function () {
                    const today =
                        new Date();

                    state.viewDate =
                        firstOfMonth(today);

                    state.selectedDateKey =
                        localDateKey(today);

                    renderCalendar();
                }
            );

            el.employeeFilter?.addEventListener(
                "change",
                function () {
                    renderCalendar();
                }
            );

            el.siteFilter?.addEventListener(
                "change",
                function () {
                    renderCalendar();
                }
            );
        }

        // =================================================
        // LOAD DATA
        // =================================================

        async function refreshCalendarData(
            silent = false
        ) {
            if (state.loading) {
                return;
            }

            state.loading = true;

            if (!silent) {
                setStatus(
                    "Loading calendar…",
                    false
                );
            }

            try {
                if (!window.ShieldData) {
                    throw new Error(
                        "SHIELD data services are not available."
                    );
                }

                if (mode === "admin") {
                    const [
                        schedules,
                        employees,
                        sites
                    ] =
                        await Promise.all([
                            ShieldData.getSchedules(),
                            ShieldData.getEmployees(),
                            ShieldData.getSites()
                        ]);

                    state.schedules =
                        schedules || [];

                    state.employees =
                        employees || [];

                    state.sites =
                        sites || [];

                    populateAdminFilters();

                } else {
                    state.schedules =
                        (
                            await ShieldData
                                .getSchedules()
                        ) || [];
                }

                setStatus("", false);

                renderCalendar();

            } catch (error) {
                console.error(
                    "SHIELD CALENDAR ERROR:",
                    error
                );

                setStatus(
                    error?.message ||
                    "Calendar could not be loaded.",
                    true
                );

            } finally {
                state.loading = false;
            }
        }

        // =================================================
        // ADMIN FILTERS
        // =================================================

        function populateAdminFilters() {
            if (
                !el.employeeFilter ||
                !el.siteFilter
            ) {
                return;
            }

            const oldEmployee =
                el.employeeFilter.value ||
                "all";

            const oldSite =
                el.siteFilter.value ||
                "all";

            const employees =
                [...state.employees]
                    .sort(
                        (a, b) =>
                            String(
                                a.name || ""
                            ).localeCompare(
                                String(
                                    b.name || ""
                                )
                            )
                    );

            const sites =
                [...state.sites]
                    .sort(
                        (a, b) =>
                            String(
                                a.name || ""
                            ).localeCompare(
                                String(
                                    b.name || ""
                                )
                            )
                    );

            el.employeeFilter.innerHTML =
                `<option value="all">
                    All Employees
                </option>` +

                employees
                    .map(
                        (employee) => `
                            <option
                                value="${escapeAttr(
                                    employee.userId
                                )}"
                            >
                                ${escapeHtml(
                                    employee.name ||
                                    employee.employeeId ||
                                    "Employee"
                                )}
                            </option>
                        `
                    )
                    .join("");

            el.siteFilter.innerHTML =
                `<option value="all">
                    All Sites
                </option>` +

                sites
                    .map(
                        (site) => `
                            <option
                                value="${escapeAttr(
                                    site.siteId
                                )}"
                            >
                                ${escapeHtml(
                                    site.name ||
                                    "Site"
                                )}
                            </option>
                        `
                    )
                    .join("");

            if (
                oldEmployee ===
                    "all" ||
                employees.some(
                    (employee) =>
                        employee.userId ===
                        oldEmployee
                )
            ) {
                el.employeeFilter.value =
                    oldEmployee;
            }

            if (
                oldSite ===
                    "all" ||
                sites.some(
                    (site) =>
                        site.siteId ===
                        oldSite
                )
            ) {
                el.siteFilter.value =
                    oldSite;
            }
        }

        // =================================================
        // RENDER CALENDAR
        // =================================================

        function renderCalendar() {
            if (
                !el.grid ||
                !el.monthLabel
            ) {
                return;
            }

            const year =
                state.viewDate.getFullYear();

            const month =
                state.viewDate.getMonth();

            el.monthLabel.textContent =
                state.viewDate
                    .toLocaleDateString(
                        "en-US",
                        {
                            month:
                                "long",

                            year:
                                "numeric"
                        }
                    );

            const firstDay =
                new Date(
                    year,
                    month,
                    1
                ).getDay();

            const daysInMonth =
                new Date(
                    year,
                    month + 1,
                    0
                ).getDate();

            const todayKey =
                localDateKey(
                    new Date()
                );

            const schedules =
                getFilteredSchedules();

            let html = "";

            // Empty boxes before day 1.
            for (
                let i = 0;
                i < firstDay;
                i += 1
            ) {
                html += `
                    <div
                        class="calendar-day calendar-day-empty"
                        aria-hidden="true"
                    ></div>
                `;
            }

            // Actual month days.
            for (
                let day = 1;
                day <= daysInMonth;
                day += 1
            ) {
                const dateKey =
                    dateKeyFromParts(
                        year,
                        month,
                        day
                    );

                const daySchedules =
                    schedules
                        .filter(
                            (schedule) =>
                                schedule.date ===
                                dateKey
                        )
                        .sort(
                            compareSchedules
                        );

                const isToday =
                    dateKey ===
                    todayKey;

                const isSelected =
                    dateKey ===
                    state.selectedDateKey;

                const chips =
                    daySchedules
                        .slice(
                            0,
                            3
                        )
                        .map(
                            renderCalendarChip
                        )
                        .join("");

                const more =
                    daySchedules.length >
                    3
                        ? `
                            <span
                                class="calendar-more"
                            >
                                +${
                                    daySchedules.length -
                                    3
                                } more
                            </span>
                        `
                        : "";

                html += `
                    <button
                        class="
                            calendar-day
                            ${
                                isToday
                                    ? "is-today"
                                    : ""
                            }
                            ${
                                isSelected
                                    ? "is-selected"
                                    : ""
                            }
                            ${
                                daySchedules.length
                                    ? "has-shifts"
                                    : ""
                            }
                        "
                        type="button"
                        data-calendar-date="${dateKey}"

                        aria-label="
                            ${escapeAttr(
                                formatLongDate(
                                    dateKey
                                )
                            )}.
                            ${daySchedules.length}
                            scheduled shift${
                                daySchedules.length ===
                                1
                                    ? ""
                                    : "s"
                            }.
                        "
                    >
                        <span
                            class="calendar-day-number"
                        >
                            ${day}
                        </span>

                        <span
                            class="calendar-day-events"
                        >
                            ${chips}
                            ${more}
                        </span>
                    </button>
                `;
            }

            el.grid.innerHTML =
                html;

            el.grid
                .querySelectorAll(
                    "[data-calendar-date]"
                )
                .forEach(
                    (button) => {
                        button.addEventListener(
                            "click",
                            function () {
                                state.selectedDateKey =
                                    button.dataset
                                        .calendarDate;

                                renderCalendar();
                            }
                        );
                    }
                );

            renderSelectedDateDetails();
        }

        // =================================================
        // FILTER SCHEDULES
        // =================================================

        function getFilteredSchedules() {
            let rows =
                [...state.schedules];

            if (mode === "admin") {
                const employeeValue =
                    el.employeeFilter
                        ?.value ||
                    "all";

                const siteValue =
                    el.siteFilter
                        ?.value ||
                    "all";

                if (
                    employeeValue !==
                    "all"
                ) {
                    rows =
                        rows.filter(
                            (schedule) =>
                                schedule
                                    .employeeUserId ===
                                employeeValue
                        );
                }

                if (
                    siteValue !==
                    "all"
                ) {
                    rows =
                        rows.filter(
                            (schedule) =>
                                schedule.siteId ===
                                siteValue
                        );
                }
            }

            return rows;
        }

        // =================================================
        // SMALL CALENDAR SHIFT LABELS
        // =================================================

        function renderCalendarChip(
            schedule
        ) {
            const time =
                formatTime(
                    schedule.startTime
                );

            const site =
                getSiteName(
                    schedule
                );

            if (mode === "admin") {
                const employee =
                    schedule.employeeName ||
                    schedule.employeeId ||
                    "Employee";

                return `
                    <span
                        class="calendar-shift-chip"

                        title="${escapeAttr(
                            `${employee} • ${time} • ${site}`
                        )}"
                    >
                        <strong>
                            ${escapeHtml(
                                shortName(
                                    employee
                                )
                            )}
                        </strong>

                        <span>
                            ${escapeHtml(
                                time
                            )}
                        </span>
                    </span>
                `;
            }

            return `
                <span
                    class="calendar-shift-chip"

                    title="${escapeAttr(
                        `${site} • ${time}`
                    )}"
                >
                    <strong>
                        ${escapeHtml(
                            site
                        )}
                    </strong>

                    <span>
                        ${escapeHtml(
                            time
                        )}
                    </span>
                </span>
            `;
        }

        // =================================================
        // SELECTED DAY DETAILS
        // =================================================

        function renderSelectedDateDetails() {
            if (
                !el.details ||
                !el.selectedDate
            ) {
                return;
            }

            const dateKey =
                state.selectedDateKey;

            el.selectedDate.textContent =
                formatLongDate(
                    dateKey
                );

            const rows =
                getFilteredSchedules()
                    .filter(
                        (schedule) =>
                            schedule.date ===
                            dateKey
                    )
                    .sort(
                        compareSchedules
                    );

            if (!rows.length) {
                el.details.innerHTML = `
                    <div
                        class="calendar-empty-details"
                    >
                        No shifts are scheduled
                        for this date.
                    </div>
                `;

                return;
            }

            el.details.innerHTML =
                rows
                    .map(
                        renderDetailCard
                    )
                    .join("");
        }

        function renderDetailCard(
            schedule
        ) {
            const siteName =
                getSiteName(
                    schedule
                );

            const siteAddress =
                schedule.siteAddress ||
                "";

            const notes =
                schedule.notes ||
                "No assignment notes";

            const time =
                `${formatTime(
                    schedule.startTime
                )} – ${formatTime(
                    schedule.endTime
                )}`;

            if (mode === "admin") {
                return `
                    <article
                        class="calendar-detail-card"
                    >
                        <div
                            class="calendar-detail-main"
                        >
                            <span
                                class="calendar-detail-kicker"
                            >
                                Employee
                            </span>

                            <h4>
                                ${escapeHtml(
                                    schedule
                                        .employeeName ||
                                    schedule
                                        .employeeId ||
                                    "Employee"
                                )}
                            </h4>

                            <p>
                                ${escapeHtml(
                                    schedule
                                        .employeeId ||
                                    ""
                                )}
                            </p>
                        </div>

                        <div
                            class="calendar-detail-grid"
                        >
                            <div>
                                <span>
                                    Time
                                </span>

                                <strong>
                                    ${escapeHtml(
                                        time
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Site
                                </span>

                                <strong>
                                    ${escapeHtml(
                                        siteName
                                    )}
                                </strong>

                                ${
                                    siteAddress
                                        ? `
                                            <small>
                                                ${escapeHtml(
                                                    siteAddress
                                                )}
                                            </small>
                                        `
                                        : ""
                                }
                            </div>

                            <div>
                                <span>
                                    Position
                                </span>

                                <strong>
                                    ${escapeHtml(
                                        schedule.position ||
                                        "Security Officer"
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Notes
                                </span>

                                <strong>
                                    ${escapeHtml(
                                        notes
                                    )}
                                </strong>
                            </div>
                        </div>
                    </article>
                `;
            }

            return `
                <article
                    class="
                        calendar-detail-card
                        employee-calendar-detail
                    "
                >
                    <div
                        class="calendar-detail-main"
                    >
                        <span
                            class="calendar-detail-kicker"
                        >
                            Your Shift
                        </span>

                        <h4>
                            ${escapeHtml(
                                siteName
                            )}
                        </h4>

                        ${
                            siteAddress
                                ? `
                                    <p>
                                        ${escapeHtml(
                                            siteAddress
                                        )}
                                    </p>
                                `
                                : ""
                        }
                    </div>

                    <div
                        class="calendar-detail-grid"
                    >
                        <div>
                            <span>
                                Time
                            </span>

                            <strong>
                                ${escapeHtml(
                                    time
                                )}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Site
                            </span>

                            <strong>
                                ${escapeHtml(
                                    siteName
                                )}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Position
                            </span>

                            <strong>
                                ${escapeHtml(
                                    schedule.position ||
                                    "Security Officer"
                                )}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Notes
                            </span>

                            <strong>
                                ${escapeHtml(
                                    notes
                                )}
                            </strong>
                        </div>
                    </div>
                </article>
            `;
        }

        // =================================================
        // HELPERS
        // =================================================

        function compareSchedules(
            a,
            b
        ) {
            return String(
                a.startTime || ""
            ).localeCompare(
                String(
                    b.startTime || ""
                )
            );
        }

        function getSiteName(
            schedule
        ) {
            return (
                schedule.siteName ||
                schedule.site ||
                "Site not assigned"
            );
        }

        function shortName(
            name
        ) {
            const parts =
                String(
                    name || ""
                )
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean);

            if (!parts.length) {
                return "Employee";
            }

            if (
                parts.length ===
                1
            ) {
                return parts[0];
            }

            return (
                `${parts[0]} ` +
                `${parts[
                    parts.length - 1
                ].charAt(0)}.`
            );
        }

        function firstOfMonth(
            date
        ) {
            return new Date(
                date.getFullYear(),
                date.getMonth(),
                1
            );
        }

        function localDateKey(
            date
        ) {
            return dateKeyFromParts(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );
        }

        function dateKeyFromParts(
            year,
            zeroBasedMonth,
            day
        ) {
            return (
                `${year}-` +
                `${String(
                    zeroBasedMonth +
                    1
                ).padStart(
                    2,
                    "0"
                )}-` +
                `${String(
                    day
                ).padStart(
                    2,
                    "0"
                )}`
            );
        }

        function formatLongDate(
            dateKey
        ) {
            const parts =
                String(
                    dateKey || ""
                )
                    .split("-")
                    .map(Number);

            if (
                parts.length !==
                    3 ||
                parts.some(
                    (part) =>
                        !Number.isFinite(
                            part
                        )
                )
            ) {
                return "Selected date";
            }

            const date =
                new Date(
                    parts[0],
                    parts[1] - 1,
                    parts[2],
                    12,
                    0,
                    0
                );

            return date.toLocaleDateString(
                "en-US",
                {
                    weekday:
                        "long",

                    month:
                        "long",

                    day:
                        "numeric",

                    year:
                        "numeric"
                }
            );
        }

        function formatTime(
            value
        ) {
            if (!value) {
                return "--";
            }

            const [
                hour,
                minute
            ] =
                String(
                    value
                )
                    .slice(
                        0,
                        5
                    )
                    .split(":")
                    .map(Number);

            if (
                !Number.isFinite(
                    hour
                ) ||
                !Number.isFinite(
                    minute
                )
            ) {
                return "--";
            }

            const date =
                new Date();

            date.setHours(
                hour,
                minute,
                0,
                0
            );

            return date.toLocaleTimeString(
                "en-US",
                {
                    hour:
                        "numeric",

                    minute:
                        "2-digit"
                }
            );
        }

        function setStatus(
            message,
            isError
        ) {
            if (!el.status) {
                return;
            }

            el.status.textContent =
                message || "";

            el.status.classList.toggle(
                "error",
                Boolean(
                    isError
                )
            );
        }

        function escapeHtml(
            value
        ) {
            return String(
                value ?? ""
            ).replace(
                /[&<>'"]/g,
                (character) => {
                    return {
                        "&":
                            "&amp;",

                        "<":
                            "&lt;",

                        ">":
                            "&gt;",

                        "'":
                            "&#39;",

                        '"':
                            "&quot;"
                    }[
                        character
                    ];
                }
            );
        }

        function escapeAttr(
            value
        ) {
            return escapeHtml(
                value
            );
        }
    });
})();