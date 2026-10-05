document.addEventListener(
    "DOMContentLoaded",
    async function () {
        "use strict";

        const AUTO_GRACE_MINUTES =
            30;

        const $ =
            id =>
                document.getElementById(
                    id
                );

        const el = {
            employeeNameHeader:
                $("employeeNameHeader"),

            employeeNameWelcome:
                $("employeeNameWelcome"),

            employeeIdText:
                $("employeeIdText"),

            employeeRoleText:
                $("employeeRoleText"),

            employeeSiteText:
                $("employeeSiteText"),

            logoutBtn:
                $("logoutBtn"),

            currentDate:
                $("currentDate"),

            currentTime:
                $("currentTime"),

            todaySchedule:
                $("todaySchedule"),

            clockStatus:
                $("clockStatus"),

            totalWorked:
                $("totalWorked"),

            scheduledShiftDisplay:
                $("scheduledShiftDisplay"),

            scheduledEndDisplay:
                $("scheduledEndDisplay"),

            automaticClockOutDisplay:
                $("automaticClockOutDisplay"),

            clockInDisplay:
                $("clockInDisplay"),

            breakDisplay:
                $("breakDisplay"),

            clockOutDisplay:
                $("clockOutDisplay"),

            clockInBtn:
                $("clockInBtn"),

            startBreakBtn:
                $("startBreakBtn"),

            endBreakBtn:
                $("endBreakBtn"),

            clockOutBtn:
                $("clockOutBtn"),

            clockMessage:
                $("clockMessage"),

            employeeTimesheetBody:
                $("employeeTimesheetBody"),

            employeeScheduleBody:
                $("employeeScheduleBody")
        };

        const state = {
            profile: null,
            schedules: [],
            entries: []
        };

        let refreshing =
            false;

        try {
            state.profile =
                await ShieldData
                    .requireProfile(
                        "employee"
                    );

            if (!state.profile) {
                return redirectLogin();
            }

            fillProfile();
            bindEvents();
            updateClock();

            await refreshEverything();

            setInterval(
                updateClock,
                1000
            );

            setInterval(
                refreshEverything,
                10000
            );

        } catch (error) {
            alert(
                "SHIELD could not load: " +
                friendlyError(
                    error
                )
            );

            redirectLogin();
        }

        function bindEvents() {
            el.logoutBtn
                .addEventListener(
                    "click",
                    async () => {
                        await ShieldData
                            .signOut();

                        redirectLogin();
                    }
                );

            el.clockInBtn
                .addEventListener(
                    "click",
                    handleClockIn
                );

            el.startBreakBtn
                .addEventListener(
                    "click",
                    handleStartBreak
                );

            el.endBreakBtn
                .addEventListener(
                    "click",
                    handleEndBreak
                );

            el.clockOutBtn
                .addEventListener(
                    "click",
                    handleClockOut
                );
        }

        function fillProfile() {
            el.employeeNameHeader.textContent =
                state.profile.name;

            el.employeeNameWelcome.textContent =
                state.profile.name;

            el.employeeIdText.textContent =
                state.profile.employeeId;

            el.employeeRoleText.textContent =
                state.profile.position ||
                "Not assigned";

            el.employeeSiteText.textContent =
                state.profile.defaultSiteName ||
                "Not assigned";
        }

        async function refreshEverything() {
            if (
                refreshing ||
                document.hidden
            ) {
                return;
            }

            refreshing =
                true;

            try {
                await ShieldData
                    .applyDueAutoClockOuts();

                const [
                    schedules,
                    entries
                ] =
                    await Promise.all([
                        ShieldData
                            .getSchedules(),

                        ShieldData
                            .getTimeEntries()
                    ]);

                state.schedules =
                    schedules || [];

                state.entries =
                    entries || [];

                renderToday();
                renderClock();
                renderTimesheet();
                renderSchedule();

            } catch (error) {
                console.error(
                    error
                );

            } finally {
                refreshing =
                    false;
            }
        }

        function updateClock() {
            const now =
                new Date();

            el.currentDate.textContent =
                now.toLocaleDateString(
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

            el.currentTime.textContent =
                now.toLocaleTimeString(
                    "en-US",
                    {
                        hour:
                            "numeric",

                        minute:
                            "2-digit",

                        second:
                            "2-digit"
                    }
                );

            renderClock();
        }

        function getTodaySchedules() {
            const today =
                localDateKey(
                    new Date()
                );

            return state.schedules
                .filter(
                    schedule =>
                        schedule.date ===
                        today
                )
                .sort(
                    (
                        a,
                        b
                    ) =>
                        new Date(
                            a.startsAt
                        ) -
                        new Date(
                            b.startsAt
                        )
                );
        }

        function getActiveEntry() {
            return (
                state.entries.find(
                    entry =>
                        !entry.clockOut &&
                        [
                            "clocked-in",
                            "on-break"
                        ].includes(
                            entry.status
                        )
                ) ||
                null
            );
        }

        function getClockSchedule() {
            const active =
                getActiveEntry();

            if (active) {
                return (
                    state.schedules.find(
                        schedule =>
                            schedule.id ===
                            active.scheduleId
                    ) ||
                    null
                );
            }

            const now =
                Date.now();

            return (
                getTodaySchedules()
                    .find(
                        schedule => {
                            const deadline =
                                new Date(
                                    schedule.endsAt
                                ).getTime() +
                                AUTO_GRACE_MINUTES *
                                60000;

                            const used =
                                state.entries.some(
                                    entry =>
                                        entry.scheduleId ===
                                        schedule.id
                                );

                            return (
                                !used &&
                                now <=
                                deadline
                            );
                        }
                    ) ||
                getTodaySchedules()[0] ||
                null
            );
        }

        function renderToday() {
            const shifts =
                getTodaySchedules();

            if (!shifts.length) {
                el.todaySchedule.innerHTML =
                    `
                    <div class="empty-state">
                        No shift scheduled today.
                    </div>
                    `;

                return;
            }

            el.todaySchedule.innerHTML =
                shifts.map(
                    schedule => `
                    <div class="today-shift-card">

                        <div>
                            <span>Site</span>
                            <strong>
                                ${escapeHtml(
                                    schedule.siteName ||
                                    "Not assigned"
                                )}
                            </strong>
                        </div>

                        <div>
                            <span>Shift</span>
                            <strong>
                                ${formatTime(
                                    schedule.startTime
                                )}
                                –
                                ${formatTime(
                                    schedule.endTime
                                )}
                            </strong>
                        </div>

                        <div>
                            <span>Notes</span>
                            <strong>
                                ${escapeHtml(
                                    schedule.notes ||
                                    "No notes"
                                )}
                            </strong>
                        </div>

                    </div>
                    `
                ).join("");
        }

        function renderClock() {
            const active =
                getActiveEntry();

            const schedule =
                getClockSchedule();

            const entry =
                active ||
                (
                    schedule
                        ? state.entries
                            .find(
                                item =>
                                    item.scheduleId ===
                                    schedule.id
                            )
                        : null
                );

            if (schedule) {
                el.scheduledShiftDisplay.textContent =
                    `${formatTime(
                        schedule.startTime
                    )} – ${formatTime(
                        schedule.endTime
                    )}`;

                el.scheduledEndDisplay.textContent =
                    formatDateTime(
                        schedule.endsAt,
                        true
                    );

                const autoOut =
                    new Date(
                        new Date(
                            schedule.endsAt
                        ).getTime() +
                        AUTO_GRACE_MINUTES *
                        60000
                    );

                el.automaticClockOutDisplay.textContent =
                    formatDateTime(
                        autoOut,
                        true
                    );

            } else {
                el.scheduledShiftDisplay.textContent =
                    "--";

                el.scheduledEndDisplay.textContent =
                    "--";

                el.automaticClockOutDisplay.textContent =
                    "--";
            }

            el.clockInDisplay.textContent =
                entry?.clockIn
                    ? formatDateTime(
                        entry.clockIn,
                        true
                    )
                    : "--";

            el.clockOutDisplay.textContent =
                entry?.clockOut
                    ? formatDateTime(
                        entry.clockOut,
                        true
                    )
                    : "--";

            if (active) {
                const metrics =
                    getEntryMetrics(
                        active
                    );

                el.totalWorked.textContent =
                    formatDurationClock(
                        metrics.workedMs
                    );

                const openBreak =
                    (
                        active.breaks ||
                        []
                    ).find(
                        b =>
                            !b.endedAt
                    );

                el.breakDisplay.textContent =
                    openBreak
                        ? `On break since ${formatDateTime(
                            openBreak.startedAt,
                            true
                        )}`
                        : `${formatDurationShort(
                            metrics.breakMs
                        )} total`;

                setClockStatus(
                    active.status ===
                        "on-break"
                        ? "ON BREAK"
                        : "CLOCKED IN",

                    active.status ===
                        "on-break"
                        ? "break"
                        : "on"
                );

                el.clockInBtn.disabled =
                    true;

                el.startBreakBtn.disabled =
                    active.status ===
                    "on-break";

                el.endBreakBtn.disabled =
                    active.status !==
                    "on-break";

                el.clockOutBtn.disabled =
                    false;

            } else {
                el.totalWorked.textContent =
                    entry
                        ? formatDurationClock(
                            getEntryMetrics(
                                entry
                            ).workedMs
                        )
                        : "00:00:00";

                el.breakDisplay.textContent =
                    entry
                        ? `${formatDurationShort(
                            getEntryMetrics(
                                entry
                            ).breakMs
                        )} total`
                        : "Not on break";

                setClockStatus(
                    "CLOCKED OUT",
                    "off"
                );

                const canClockIn =
                    Boolean(
                        schedule &&
                        !entry
                    );

                el.clockInBtn.disabled =
                    !canClockIn;

                el.startBreakBtn.disabled =
                    true;

                el.endBreakBtn.disabled =
                    true;

                el.clockOutBtn.disabled =
                    true;
            }
        }

        async function handleClockIn() {
            const schedule =
                getClockSchedule();

            if (!schedule) {
                return showMessage(
                    "No available shift to clock into.",
                    true
                );
            }

            try {
                await ShieldData
                    .clockIn(
                        schedule.id
                    );

                showMessage(
                    "Clocked in successfully.",
                    false
                );

                await refreshEverything();

            } catch (error) {
                showMessage(
                    friendlyError(
                        error
                    ),
                    true
                );
            }
        }

        async function handleStartBreak() {
            const entry =
                getActiveEntry();

            if (!entry) {
                return;
            }

            try {
                await ShieldData
                    .startBreak(
                        entry.id
                    );

                await refreshEverything();

            } catch (error) {
                showMessage(
                    friendlyError(
                        error
                    ),
                    true
                );
            }
        }

        async function handleEndBreak() {
            const entry =
                getActiveEntry();

            if (!entry) {
                return;
            }

            try {
                await ShieldData
                    .endBreak(
                        entry.id
                    );

                await refreshEverything();

            } catch (error) {
                showMessage(
                    friendlyError(
                        error
                    ),
                    true
                );
            }
        }

        async function handleClockOut() {
            const entry =
                getActiveEntry();

            if (!entry) {
                return;
            }

            if (
                !confirm(
                    "Clock out now?"
                )
            ) {
                return;
            }

            try {
                await ShieldData
                    .clockOut(
                        entry.id
                    );

                showMessage(
                    "Clocked out successfully.",
                    false
                );

                await refreshEverything();

            } catch (error) {
                showMessage(
                    friendlyError(
                        error
                    ),
                    true
                );
            }
        }

        function renderTimesheet() {
            const rows =
                [...state.entries]
                    .sort(
                        (
                            a,
                            b
                        ) =>
                            new Date(
                                b.clockIn
                            ) -
                            new Date(
                                a.clockIn
                            )
                    );

            if (!rows.length) {
                el.employeeTimesheetBody.innerHTML =
                    `
                    <tr>
                        <td colspan="9" class="empty-cell">
                            No time entries.
                        </td>
                    </tr>
                    `;

                return;
            }

            el.employeeTimesheetBody.innerHTML =
                rows.map(
                    entry => {
                        const metrics =
                            getEntryMetrics(
                                entry
                            );

                        return `
                        <tr>

                            <td>
                                ${formatDate(
                                    entry.date
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    entry.siteName ||
                                    "-"
                                )}
                            </td>

                            <td>
                                ${formatTime(
                                    entry.scheduledStart
                                )}
                                –
                                ${formatTime(
                                    entry.scheduledEnd
                                )}
                            </td>

                            <td>
                                ${formatDateTime(
                                    entry.clockIn,
                                    true
                                )}
                            </td>

                            <td>
                                ${entry.clockOut
                                    ? formatDateTime(
                                        entry.clockOut,
                                        true
                                    )
                                    : "--"
                                }
                            </td>

                            <td>
                                ${formatDurationShort(
                                    metrics.breakMs
                                )}
                            </td>

                            <td>
                                ${formatDurationShort(
                                    metrics.onSiteMs
                                )}
                            </td>

                            <td>
                                <strong>
                                    ${formatDurationShort(
                                        metrics.workedMs
                                    )}
                                </strong>
                            </td>

                            <td>
                                ${attendanceBadge(
                                    entry
                                )}
                            </td>

                        </tr>
                        `;
                    }
                ).join("");
        }

        function renderSchedule() {
            if (
                !state.schedules.length
            ) {
                el.employeeScheduleBody.innerHTML =
                    `
                    <tr>
                        <td colspan="5" class="empty-cell">
                            No scheduled shifts.
                        </td>
                    </tr>
                    `;

                return;
            }

            el.employeeScheduleBody.innerHTML =
                state.schedules
                    .map(
                        schedule => `
                        <tr>

                            <td>
                                ${formatDate(
                                    schedule.date
                                )}
                            </td>

                            <td>
                                ${formatTime(
                                    schedule.startTime
                                )}
                                –
                                ${formatTime(
                                    schedule.endTime
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    schedule.siteName ||
                                    "-"
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    schedule.notes ||
                                    "-"
                                )}
                            </td>

                            <td>
                                ${scheduleStatus(
                                    schedule
                                )}
                            </td>

                        </tr>
                        `
                    )
                    .join("");
        }

        function scheduleStatus(
            schedule
        ) {
            const now =
                Date.now();

            const start =
                new Date(
                    schedule.startsAt
                ).getTime();

            const entry =
                state.entries.find(
                    item =>
                        item.scheduleId ===
                        schedule.id
                );

            if (entry?.clockOut) {
                return (
                    entry.status ===
                    "auto-clock-out"
                        ? "Auto Clock-Out"
                        : "Completed"
                );
            }

            if (entry) {
                return (
                    entry.status ===
                    "on-break"
                        ? "On Break"
                        : "Clocked In"
                );
            }

            return (
                now < start
                    ? "Upcoming"
                    : "Available"
            );
        }

        function getEntryMetrics(
            entry
        ) {
            if (!entry?.clockIn) {
                return {
                    breakMs: 0,
                    onSiteMs: 0,
                    workedMs: 0
                };
            }

            const start =
                new Date(
                    entry.clockIn
                );

            const end =
                entry.clockOut
                    ? new Date(
                        entry.clockOut
                    )
                    : new Date();

            const breakMs =
                (
                    entry.breaks ||
                    []
                ).reduce(
                    (
                        total,
                        item
                    ) => {
                        if (
                            !item.startedAt
                        ) {
                            return total;
                        }

                        const breakStart =
                            new Date(
                                item.startedAt
                            );

                        const breakEnd =
                            item.endedAt
                                ? new Date(
                                    item.endedAt
                                )
                                : end;

                        return (
                            total +
                            Math.max(
                                0,
                                breakEnd -
                                breakStart
                            )
                        );
                    },
                    0
                );

            const onSiteMs =
                Math.max(
                    0,
                    end - start
                );

            return {
                breakMs,
                onSiteMs,

                workedMs:
                    Math.max(
                        0,
                        onSiteMs -
                        breakMs
                    )
            };
        }

        function setClockStatus(
            text,
            mode
        ) {
            el.clockStatus.textContent =
                text;

            el.clockStatus.className =
                `clock-status ${mode}`;
        }

        function attendanceBadge(
            entry
        ) {
            const labels = {
                "clocked-in":
                    "Clocked In",

                "on-break":
                    "On Break",

                "completed":
                    "Completed",

                "auto-clock-out":
                    "Auto Clock-Out"
            };

            return (
                labels[
                    entry.status
                ] ||
                entry.status
            );
        }

        function localDateKey(
            date
        ) {
            return (
                `${date.getFullYear()}-` +
                `${String(
                    date.getMonth() + 1
                ).padStart(2, "0")}-` +
                `${String(
                    date.getDate()
                ).padStart(2, "0")}`
            );
        }

        function formatDate(value) {
            if (!value) {
                return "--";
            }

            return new Date(
                value +
                "T12:00:00"
            ).toLocaleDateString(
                "en-US",
                {
                    month:
                        "short",

                    day:
                        "numeric",

                    year:
                        "numeric"
                }
            );
        }

        function formatTime(value) {
            if (!value) {
                return "--";
            }

            const [
                h,
                m
            ] =
                String(value)
                    .slice(0, 5)
                    .split(":")
                    .map(Number);

            const date =
                new Date();

            date.setHours(
                h,
                m,
                0,
                0
            );

            return date
                .toLocaleTimeString(
                    "en-US",
                    {
                        hour:
                            "numeric",

                        minute:
                            "2-digit"
                    }
                );
        }

        function formatDateTime(
            value,
            timeOnly = false
        ) {
            if (!value) {
                return "--";
            }

            const date =
                value instanceof Date
                    ? value
                    : new Date(value);

            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {
                return "--";
            }

            return timeOnly
                ? date.toLocaleTimeString(
                    "en-US",
                    {
                        hour:
                            "numeric",

                        minute:
                            "2-digit"
                    }
                )
                : date.toLocaleString();
        }

        function formatDurationShort(
            ms
        ) {
            const minutes =
                Math.floor(
                    Math.max(
                        0,
                        ms
                    ) /
                    60000
                );

            const hours =
                Math.floor(
                    minutes /
                    60
                );

            const rest =
                minutes %
                60;

            return hours
                ? `${hours}h ${String(
                    rest
                ).padStart(
                    2,
                    "0"
                )}m`
                : `${minutes}m`;
        }

        function formatDurationClock(
            ms
        ) {
            const seconds =
                Math.floor(
                    Math.max(
                        0,
                        ms
                    ) /
                    1000
                );

            const h =
                Math.floor(
                    seconds /
                    3600
                );

            const m =
                Math.floor(
                    (
                        seconds %
                        3600
                    ) /
                    60
                );

            const s =
                seconds %
                60;

            return (
                `${String(h).padStart(2, "0")}:` +
                `${String(m).padStart(2, "0")}:` +
                `${String(s).padStart(2, "0")}`
            );
        }

        function showMessage(
            message,
            error
        ) {
            el.clockMessage.textContent =
                message;

            el.clockMessage.classList.toggle(
                "error",
                Boolean(
                    error
                )
            );

            el.clockMessage.classList.toggle(
                "success",
                !error
            );
        }

        function friendlyError(
            error
        ) {
            return String(
                error?.message ||
                error ||
                "Something went wrong."
            );
        }

        function escapeHtml(
            value
        ) {
            return String(
                value ?? ""
            ).replace(
                /[&<>'"]/g,
                character =>
                    ({
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
                    })[
                        character
                    ]
            );
        }

        function redirectLogin() {
            window.location.href =
                "./index.html";
        }
    }
);