document.addEventListener(
    "DOMContentLoaded",
    async function () {
        "use strict";

        const $ =
            (id) =>
                document.getElementById(
                    id
                );

        const el = {
            adminNameHeader:
                $("adminNameHeader"),

            logoutBtn:
                $("logoutBtn"),

            currentDate:
                $("currentDate"),

            currentTime:
                $("currentTime"),

            totalEmployees:
                $("totalEmployees"),

            totalShifts:
                $("totalShifts"),

            upcomingShifts:
                $("upcomingShifts"),

            clockedInNow:
                $("clockedInNow"),

            completedEntries:
                $("completedEntries"),

            recordedHours:
                $("recordedHours"),

            shiftForm:
                $("shiftForm"),

            editingShiftId:
                $("editingShiftId"),

            shiftFormTitle:
                $("shiftFormTitle"),

            shiftEmployee:
                $("shiftEmployee"),

            shiftDate:
                $("shiftDate"),

            shiftStart:
                $("shiftStart"),

            shiftEnd:
                $("shiftEnd"),

            shiftSite:
                $("shiftSite"),

            shiftNotes:
                $("shiftNotes"),

            saveShiftBtn:
                $("saveShiftBtn"),

            cancelEditBtn:
                $("cancelEditBtn"),

            shiftMessage:
                $("shiftMessage"),

            scheduleEmployeeFilter:
                $("scheduleEmployeeFilter"),

            scheduleTableBody:
                $("scheduleTableBody"),

            attendanceEmployeeFilter:
                $("attendanceEmployeeFilter"),

            attendanceStatusFilter:
                $("attendanceStatusFilter"),

            attendanceTableBody:
                $("attendanceTableBody"),

            employeeForm:
                $("employeeForm"),

            employeeFormTitle:
                $("employeeFormTitle"),

            newEmployeeName:
                $("newEmployeeName"),

            newEmployeeId:
                $("newEmployeeId"),

            newEmployeePassword:
                $("newEmployeePassword"),

            newEmployeeRole:
                $("newEmployeeRole"),

            newEmployeeSite:
                $("newEmployeeSite"),

            employeeMessage:
                $("employeeMessage"),

            employeeSubmitBtn:
                $("employeeSubmitBtn"),

            cancelEmployeeEditBtn:
                $("cancelEmployeeEditBtn"),

            employeeAccountBody:
                $("employeeAccountBody"),

            siteForm:
                $("siteForm"),

            editingSiteId:
                $("editingSiteId"),

            siteName:
                $("siteName"),

            siteAddress:
                $("siteAddress"),

            siteLatitude:
                $("siteLatitude"),

            siteLongitude:
                $("siteLongitude"),

            siteRadius:
                $("siteRadius"),

            siteGeofenceEnabled:
                $("siteGeofenceEnabled"),

            saveSiteBtn:
                $("saveSiteBtn"),

            cancelSiteEditBtn:
                $("cancelSiteEditBtn"),

            siteMessage:
                $("siteMessage"),

            siteTableBody:
                $("siteTableBody")
        };

        const state = {
            profile: null,
            employees: [],
            sites: [],
            schedules: [],
            entries: []
        };

        let refreshing = false;

        let editingEmployeeUserId =
            null;

        try {
            state.profile =
                await ShieldData
                    .requireProfile(
                        "admin"
                    );

            if (!state.profile) {
                return redirectLogin();
            }

            el.adminNameHeader.textContent =
                state.profile.name;

            setDefaultDate();

            updateClock();

            bindEvents();

            await refreshEverything();

            setInterval(
                updateClock,
                1000
            );

            setInterval(
                refreshLiveData,
                10000
            );

        } catch (error) {
            console.error(
                error
            );

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
                    async function () {
                        await ShieldData
                            .signOut();

                        redirectLogin();
                    }
                );

            el.shiftEmployee
                .addEventListener(
                    "change",
                    setEmployeeDefaultSite
                );

            el.shiftForm
                .addEventListener(
                    "submit",
                    async function (
                        event
                    ) {
                        event
                            .preventDefault();

                        await saveShift();
                    }
                );

            el.cancelEditBtn
                .addEventListener(
                    "click",
                    resetShiftForm
                );

            el.scheduleEmployeeFilter
                .addEventListener(
                    "change",
                    renderSchedules
                );

            el.attendanceEmployeeFilter
                .addEventListener(
                    "change",
                    renderAttendance
                );

            el.attendanceStatusFilter
                .addEventListener(
                    "change",
                    renderAttendance
                );

            el.employeeForm
                .addEventListener(
                    "submit",
                    async function (
                        event
                    ) {
                        event
                            .preventDefault();

                        await saveEmployee();
                    }
                );

            el.cancelEmployeeEditBtn
                .addEventListener(
                    "click",
                    resetEmployeeForm
                );

            el.siteForm
                .addEventListener(
                    "submit",
                    async function (
                        event
                    ) {
                        event
                            .preventDefault();

                        await saveSite();
                    }
                );

            el.cancelSiteEditBtn
                .addEventListener(
                    "click",
                    resetSiteForm
                );
        }

        async function refreshEverything() {
            if (refreshing) {
                return;
            }

            refreshing = true;

            try {
                await ShieldData
                    .applyDueAutoClockOuts();

                const [
                    employees,
                    sites,
                    schedules,
                    entries
                ] =
                    await Promise.all([
                        ShieldData
                            .getEmployees(),

                        ShieldData
                            .getSites(),

                        ShieldData
                            .getSchedules(),

                        ShieldData
                            .getTimeEntries()
                    ]);

                state.employees =
                    employees || [];

                state.sites =
                    sites || [];

                state.schedules =
                    schedules || [];

                state.entries =
                    entries || [];

                populateEmployeeControls();
                populateSiteControls();
                renderStats();
                renderSchedules();
                renderAttendance();
                renderEmployeeAccounts();
                renderSites();

            } catch (error) {
                console.error(
                    "REFRESH ERROR:",
                    error
                );

            } finally {
                refreshing = false;
            }
        }

        async function refreshLiveData() {
            if (
                refreshing ||
                document.hidden
            ) {
                return;
            }

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

                renderStats();
                renderSchedules();
                renderAttendance();

            } catch (error) {
                console.error(
                    "LIVE REFRESH ERROR:",
                    error
                );
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
        }

        function populateEmployeeControls() {
            const employees =
                [...state.employees]
                    .sort(
                        (
                            a,
                            b
                        ) =>
                            a.name
                                .localeCompare(
                                    b.name
                                )
                    );

            const oldShift =
                el.shiftEmployee.value;

            const oldSchedule =
                el.scheduleEmployeeFilter
                    .value;

            const oldAttendance =
                el.attendanceEmployeeFilter
                    .value;

            el.shiftEmployee.innerHTML =
                employees.length
                    ? employees
                        .map(
                            employee => `
                                <option value="${escapeAttr(
                                    employee.userId
                                )}">
                                    ${escapeHtml(
                                        employee.name
                                    )}
                                    (${escapeHtml(
                                        employee.employeeId
                                    )})
                                </option>
                            `
                        )
                        .join("")
                    : `
                        <option value="">
                            No employees available
                        </option>
                    `;

            const options =
                employees
                    .map(
                        employee => `
                            <option value="${escapeAttr(
                                employee.userId
                            )}">
                                ${escapeHtml(
                                    employee.name
                                )}
                            </option>
                        `
                    )
                    .join("");

            el.scheduleEmployeeFilter.innerHTML =
                `<option value="all">All Employees</option>` +
                options;

            el.attendanceEmployeeFilter.innerHTML =
                `<option value="all">All Employees</option>` +
                options;

            if (
                employees.some(
                    e =>
                        e.userId ===
                        oldShift
                )
            ) {
                el.shiftEmployee.value =
                    oldShift;
            }

            if (
                oldSchedule ===
                    "all" ||
                employees.some(
                    e =>
                        e.userId ===
                        oldSchedule
                )
            ) {
                el.scheduleEmployeeFilter.value =
                    oldSchedule ||
                    "all";
            }

            if (
                oldAttendance ===
                    "all" ||
                employees.some(
                    e =>
                        e.userId ===
                        oldAttendance
                )
            ) {
                el.attendanceEmployeeFilter.value =
                    oldAttendance ||
                    "all";
            }
        }

        function populateSiteControls() {
            const sites =
                [...state.sites]
                    .sort(
                        (
                            a,
                            b
                        ) =>
                            a.name
                                .localeCompare(
                                    b.name
                                )
                    );

            const oldShift =
                el.shiftSite.value;

            const oldEmployee =
                el.newEmployeeSite.value;

            const options =
                sites.length
                    ? sites
                        .map(
                            site => `
                                <option value="${escapeAttr(
                                    site.siteId
                                )}">
                                    ${escapeHtml(
                                        site.name
                                    )}
                                </option>
                            `
                        )
                        .join("")
                    : `
                        <option value="">
                            No sites available
                        </option>
                    `;

            el.shiftSite.innerHTML =
                options;

            el.newEmployeeSite.innerHTML =
                options;

            if (
                sites.some(
                    s =>
                        s.siteId ===
                        oldShift
                )
            ) {
                el.shiftSite.value =
                    oldShift;
            } else {
                setEmployeeDefaultSite();
            }

            if (
                sites.some(
                    s =>
                        s.siteId ===
                        oldEmployee
                )
            ) {
                el.newEmployeeSite.value =
                    oldEmployee;
            }
        }

        function setEmployeeDefaultSite() {
            const employee =
                state.employees.find(
                    e =>
                        e.userId ===
                        el.shiftEmployee
                            .value
                );

            if (
                employee
                    ?.defaultSiteId
            ) {
                el.shiftSite.value =
                    employee.defaultSiteId;
            }
        }

        function renderStats() {
            const now =
                Date.now();

            const upcoming =
                state.schedules
                    .filter(
                        schedule =>
                            new Date(
                                schedule.endsAt
                            ).getTime() >=
                            now
                    )
                    .length;

            const active =
                state.entries
                    .filter(
                        entry =>
                            !entry.clockOut &&
                            [
                                "clocked-in",
                                "on-break"
                            ].includes(
                                entry.status
                            )
                    )
                    .length;

            const completed =
                state.entries
                    .filter(
                        entry =>
                            Boolean(
                                entry.clockOut
                            )
                    );

            const totalWorked =
                completed.reduce(
                    (
                        total,
                        entry
                    ) =>
                        total +
                        getEntryMetrics(
                            entry
                        ).workedMs,
                    0
                );

            el.totalEmployees.textContent =
                state.employees.length;

            el.totalShifts.textContent =
                state.schedules.length;

            el.upcomingShifts.textContent =
                upcoming;

            el.clockedInNow.textContent =
                active;

            el.completedEntries.textContent =
                completed.length;

            el.recordedHours.textContent =
                formatDurationShort(
                    totalWorked
                );
        }

        // =================================================
        // SHIFTS
        // =================================================

        async function saveShift() {
            clearMessage(
                el.shiftMessage
            );

            const employeeUserId =
                el.shiftEmployee.value;

            const siteId =
                el.shiftSite.value;

            const date =
                el.shiftDate.value;

            const startTime =
                el.shiftStart.value;

            const endTime =
                el.shiftEnd.value;

            const notes =
                el.shiftNotes.value
                    .trim();

            if (
                !employeeUserId ||
                !siteId ||
                !date ||
                !startTime ||
                !endTime
            ) {
                return showMessage(
                    el.shiftMessage,
                    "Please complete all required shift fields.",
                    true
                );
            }

            const editing =
                Boolean(
                    el.editingShiftId
                        .value
                );

            setButtonBusy(
                el.saveShiftBtn,
                true,
                editing
                    ? "Updating..."
                    : "Saving..."
            );

            try {
                await ShieldData
                    .saveSchedule({
                        id:
                            el.editingShiftId
                                .value ||
                            null,

                        employeeUserId,
                        siteId,
                        date,
                        startTime,
                        endTime,
                        notes
                    });

                resetShiftForm(
                    false
                );

                showMessage(
                    el.shiftMessage,
                    editing
                        ? "Shift updated successfully."
                        : "Shift created successfully.",
                    false
                );

                await refreshEverything();

                window.dispatchEvent(
                    new Event(
                        "shield:schedules-changed"
                    )
                );

            } catch (error) {
                showMessage(
                    el.shiftMessage,
                    friendlyError(
                        error
                    ),
                    true
                );

            } finally {
                setButtonBusy(
                    el.saveShiftBtn,
                    false,
                    "Save Shift"
                );
            }
        }

        function editShift(id) {
            const schedule =
                state.schedules.find(
                    s =>
                        s.id === id
                );

            if (!schedule) {
                return;
            }

            el.editingShiftId.value =
                schedule.id;

            el.shiftEmployee.value =
                schedule
                    .employeeUserId;

            el.shiftDate.value =
                schedule.date;

            el.shiftStart.value =
                schedule.startTime;

            el.shiftEnd.value =
                schedule.endTime;

            el.shiftSite.value =
                schedule.siteId;

            el.shiftNotes.value =
                schedule.notes ||
                "";

            el.shiftFormTitle.textContent =
                "Edit Shift";

            el.saveShiftBtn.textContent =
                "Update Shift";

            el.cancelEditBtn
                .classList
                .remove(
                    "hidden"
                );

            el.shiftForm
                .scrollIntoView({
                    behavior:
                        "smooth"
                });
        }

        async function deleteShift(id) {
            const schedule =
                state.schedules.find(
                    s =>
                        s.id === id
                );

            if (!schedule) {
                return;
            }

            if (
                !confirm(
                    `Delete ${schedule.employeeName}'s shift on ${formatDate(
                        schedule.date
                    )}?`
                )
            ) {
                return;
            }

            try {
                await ShieldData
                    .deleteSchedule(
                        id
                    );

                await refreshEverything();

                window.dispatchEvent(
                    new Event(
                        "shield:schedules-changed"
                    )
                );

            } catch (error) {
                alert(
                    friendlyError(
                        error
                    )
                );
            }
        }

        function resetShiftForm(
            clear = true
        ) {
            const date =
                el.shiftDate.value ||
                localDateKey(
                    new Date()
                );

            el.shiftForm.reset();

            el.editingShiftId.value =
                "";

            el.shiftFormTitle.textContent =
                "Create Shift";

            el.saveShiftBtn.textContent =
                "Save Shift";

            el.cancelEditBtn
                .classList
                .add(
                    "hidden"
                );

            el.shiftDate.value =
                date;

            if (clear) {
                clearMessage(
                    el.shiftMessage
                );
            }

            populateEmployeeControls();
            populateSiteControls();
        }

        function renderSchedules() {
            let rows =
                [...state.schedules];

            if (
                el.scheduleEmployeeFilter
                    .value !==
                "all"
            ) {
                rows =
                    rows.filter(
                        schedule =>
                            schedule
                                .employeeUserId ===
                            el.scheduleEmployeeFilter
                                .value
                    );
            }

            if (!rows.length) {
                el.scheduleTableBody.innerHTML =
                    `
                    <tr>
                        <td colspan="6" class="empty-cell">
                            No shifts found.
                        </td>
                    </tr>
                    `;

                return;
            }

            el.scheduleTableBody.innerHTML =
                rows.map(
                    schedule => `
                    <tr>
                        <td>
                            <strong>
                                ${escapeHtml(
                                    schedule.employeeName
                                )}
                            </strong>
                            <br>
                            <small>
                                ${escapeHtml(
                                    schedule.employeeId
                                )}
                            </small>
                        </td>

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
                                schedule.siteName
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                schedule.notes ||
                                "-"
                            )}
                        </td>

                        <td class="action-cell">

                            <button
                                class="table-button"
                                data-shift-action="edit"
                                data-id="${escapeAttr(
                                    schedule.id
                                )}"
                                type="button"
                            >
                                Edit
                            </button>

                            <button
                                class="table-button danger"
                                data-shift-action="delete"
                                data-id="${escapeAttr(
                                    schedule.id
                                )}"
                                type="button"
                            >
                                Delete
                            </button>

                        </td>
                    </tr>
                    `
                ).join("");

            el.scheduleTableBody
                .querySelectorAll(
                    "[data-shift-action]"
                )
                .forEach(
                    button => {
                        button
                            .addEventListener(
                                "click",
                                function () {
                                    if (
                                        button.dataset
                                            .shiftAction ===
                                        "edit"
                                    ) {
                                        editShift(
                                            button.dataset
                                                .id
                                        );
                                    } else {
                                        deleteShift(
                                            button.dataset
                                                .id
                                        );
                                    }
                                }
                            );
                    }
                );
        }

        // =================================================
        // EMPLOYEES
        // =================================================

        async function saveEmployee() {
            clearMessage(
                el.employeeMessage
            );

            const employeeId =
                el.newEmployeeId
                    .value
                    .trim()
                    .toUpperCase();

            const password =
                el.newEmployeePassword
                    .value;

            const name =
                el.newEmployeeName
                    .value
                    .trim();

            const position =
                el.newEmployeeRole
                    .value
                    .trim();

            const defaultSiteId =
                el.newEmployeeSite
                    .value;

            const editing =
                Boolean(
                    editingEmployeeUserId
                );

            if (
                !employeeId ||
                !name ||
                !position ||
                !defaultSiteId
            ) {
                return showMessage(
                    el.employeeMessage,
                    "Please complete all employee fields.",
                    true
                );
            }

            if (
                !editing &&
                !password
            ) {
                return showMessage(
                    el.employeeMessage,
                    "A password is required for new employees.",
                    true
                );
            }

            setButtonBusy(
                el.employeeSubmitBtn,
                true,
                editing
                    ? "Updating..."
                    : "Creating..."
            );

            try {
                if (editing) {
                    await ShieldData
                        .updateEmployee({
                            userId:
                                editingEmployeeUserId,

                            employeeId,
                            password,
                            name,
                            position,
                            defaultSiteId
                        });

                    showMessage(
                        el.employeeMessage,
                        "Employee updated successfully.",
                        false
                    );

                } else {
                    await ShieldData
                        .createEmployee({
                            employeeId,
                            password,
                            name,
                            position,
                            defaultSiteId
                        });

                    showMessage(
                        el.employeeMessage,
                        "Employee account created successfully.",
                        false
                    );
                }

                resetEmployeeForm(
                    false
                );

                await refreshEverything();

            } catch (error) {
                console.error(
                    "EMPLOYEE SAVE ERROR:",
                    error
                );

                showMessage(
                    el.employeeMessage,
                    friendlyError(
                        error
                    ),
                    true
                );

            } finally {
                setButtonBusy(
                    el.employeeSubmitBtn,
                    false,
                    editingEmployeeUserId
                        ? "Update Employee"
                        : "Create Employee Account"
                );
            }
        }

        function editEmployee(
            userId
        ) {
            const employee =
                state.employees.find(
                    e =>
                        e.userId ===
                        userId
                );

            if (!employee) {
                return;
            }

            editingEmployeeUserId =
                userId;

            el.employeeFormTitle.textContent =
                "Edit Employee";

            el.newEmployeeName.value =
                employee.name;

            el.newEmployeeId.value =
                employee.employeeId;

            el.newEmployeeRole.value =
                employee.position ||
                "Security Officer";

            el.newEmployeeSite.value =
                employee.defaultSiteId ||
                "";

            el.newEmployeePassword.value =
                "";

            el.newEmployeePassword.required =
                false;

            el.newEmployeePassword.placeholder =
                "Leave blank to keep password";

            el.employeeSubmitBtn.textContent =
                "Update Employee";

            el.cancelEmployeeEditBtn
                .classList
                .remove(
                    "hidden"
                );

            showMessage(
                el.employeeMessage,
                "Editing employee. Leave password blank to keep the current password.",
                false
            );

            el.employeeForm
                .scrollIntoView({
                    behavior:
                        "smooth"
                });
        }

        function resetEmployeeForm(
            clear = true
        ) {
            editingEmployeeUserId =
                null;

            el.employeeForm.reset();

            el.employeeFormTitle.textContent =
                "Add Employee Account";

            el.newEmployeeRole.value =
                "Security Officer";

            el.newEmployeePassword.required =
                true;

            el.newEmployeePassword.placeholder =
                "Create password";

            el.employeeSubmitBtn.textContent =
                "Create Employee Account";

            el.cancelEmployeeEditBtn
                .classList
                .add(
                    "hidden"
                );

            if (clear) {
                clearMessage(
                    el.employeeMessage
                );
            }

            populateSiteControls();
        }

        async function deleteEmployee(
            userId
        ) {
            const employee =
                state.employees.find(
                    e =>
                        e.userId ===
                        userId
                );

            if (!employee) {
                return;
            }

            if (
                !confirm(
                    `Delete ${employee.name} (${employee.employeeId})?\n\nThis also removes their schedules and time entries.`
                )
            ) {
                return;
            }

            try {
                await ShieldData
                    .deleteEmployee(
                        userId
                    );

                if (
                    editingEmployeeUserId ===
                    userId
                ) {
                    resetEmployeeForm();
                }

                await refreshEverything();

            } catch (error) {
                alert(
                    friendlyError(
                        error
                    )
                );
            }
        }

        function renderEmployeeAccounts() {
            if (
                !state.employees.length
            ) {
                el.employeeAccountBody.innerHTML =
                    `
                    <tr>
                        <td colspan="5" class="empty-cell">
                            No employee accounts.
                        </td>
                    </tr>
                    `;

                return;
            }

            el.employeeAccountBody.innerHTML =
                state.employees
                    .map(
                        employee => `
                        <tr>

                            <td>
                                <strong>
                                    ${escapeHtml(
                                        employee.name
                                    )}
                                </strong>
                            </td>

                            <td>
                                ${escapeHtml(
                                    employee.employeeId
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    employee.position
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    employee.defaultSiteName ||
                                    "-"
                                )}
                            </td>

                            <td class="action-cell">

                                <button
                                    class="table-button"
                                    data-edit-employee="${escapeAttr(
                                        employee.userId
                                    )}"
                                    type="button"
                                >
                                    Edit
                                </button>

                                <button
                                    class="table-button danger"
                                    data-delete-employee="${escapeAttr(
                                        employee.userId
                                    )}"
                                    type="button"
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>
                        `
                    )
                    .join("");

            el.employeeAccountBody
                .querySelectorAll(
                    "[data-edit-employee]"
                )
                .forEach(
                    button =>
                        button.addEventListener(
                            "click",
                            () =>
                                editEmployee(
                                    button.dataset
                                        .editEmployee
                                )
                        )
                );

            el.employeeAccountBody
                .querySelectorAll(
                    "[data-delete-employee]"
                )
                .forEach(
                    button =>
                        button.addEventListener(
                            "click",
                            () =>
                                deleteEmployee(
                                    button.dataset
                                        .deleteEmployee
                                )
                        )
                );
        }

        // =================================================
        // SITES
        // =================================================

        async function saveSite() {
            clearMessage(
                el.siteMessage
            );

            const name =
                el.siteName.value
                    .trim();

            const address =
                el.siteAddress.value
                    .trim();

            const latitude =
                el.siteLatitude.value
                    .trim() === ""
                    ? null
                    : Number(
                        el.siteLatitude
                            .value
                    );

            const longitude =
                el.siteLongitude.value
                    .trim() === ""
                    ? null
                    : Number(
                        el.siteLongitude
                            .value
                    );

            const radiusMeters =
                Number(
                    el.siteRadius.value
                );

            const geofenceEnabled =
                el.siteGeofenceEnabled
                    .checked;

            if (!name) {
                return showMessage(
                    el.siteMessage,
                    "Enter a site name.",
                    true
                );
            }

            if (
                !Number.isFinite(
                    radiusMeters
                ) ||
                radiusMeters < 25
            ) {
                return showMessage(
                    el.siteMessage,
                    "Radius must be at least 25 meters.",
                    true
                );
            }

            if (
                latitude !== null &&
                (
                    latitude < -90 ||
                    latitude > 90
                )
            ) {
                return showMessage(
                    el.siteMessage,
                    "Latitude must be between -90 and 90.",
                    true
                );
            }

            if (
                longitude !== null &&
                (
                    longitude < -180 ||
                    longitude > 180
                )
            ) {
                return showMessage(
                    el.siteMessage,
                    "Longitude must be between -180 and 180.",
                    true
                );
            }

            if (
                geofenceEnabled &&
                (
                    latitude === null ||
                    longitude === null
                )
            ) {
                return showMessage(
                    el.siteMessage,
                    "Latitude and longitude are required when geofence is enabled.",
                    true
                );
            }

            const editing =
                Boolean(
                    el.editingSiteId
                        .value
                );

            setButtonBusy(
                el.saveSiteBtn,
                true,
                editing
                    ? "Updating..."
                    : "Adding..."
            );

            try {
                await ShieldData
                    .saveSite({
                        siteId:
                            el.editingSiteId
                                .value ||
                            null,

                        name,
                        address,
                        latitude,
                        longitude,
                        radiusMeters:
                            Math.round(
                                radiusMeters
                            ),

                        geofenceEnabled
                    });

                resetSiteForm(
                    false
                );

                showMessage(
                    el.siteMessage,
                    editing
                        ? "Site updated successfully."
                        : "Site added successfully.",
                    false
                );

                await refreshEverything();

            } catch (error) {
                console.error(
                    "SITE SAVE ERROR:",
                    error
                );

                showMessage(
                    el.siteMessage,
                    friendlyError(
                        error
                    ),
                    true
                );

            } finally {
                setButtonBusy(
                    el.saveSiteBtn,
                    false,
                    "Add Site"
                );
            }
        }

        function editSite(id) {
            const site =
                state.sites.find(
                    s =>
                        s.siteId ===
                        id
                );

            if (!site) {
                return;
            }

            el.editingSiteId.value =
                site.siteId;

            el.siteName.value =
                site.name;

            el.siteAddress.value =
                site.address ||
                "";

            el.siteLatitude.value =
                site.latitude ??
                "";

            el.siteLongitude.value =
                site.longitude ??
                "";

            el.siteRadius.value =
                site.radiusMeters;

            el.siteGeofenceEnabled.checked =
                site.geofenceEnabled;

            el.saveSiteBtn.textContent =
                "Update Site";

            el.cancelSiteEditBtn
                .classList
                .remove(
                    "hidden"
                );

            el.siteForm
                .scrollIntoView({
                    behavior:
                        "smooth"
                });
        }

        async function deleteSite(id) {
            const site =
                state.sites.find(
                    s =>
                        s.siteId ===
                        id
                );

            if (!site) {
                return;
            }

            const employeeCount =
                state.employees
                    .filter(
                        employee =>
                            employee.defaultSiteId ===
                            id
                    )
                    .length;

            const shiftCount =
                state.schedules
                    .filter(
                        schedule =>
                            schedule.siteId ===
                            id
                    )
                    .length;

            if (
                employeeCount ||
                shiftCount
            ) {
                return alert(
                    `${site.name} is still assigned to employees or shifts. Reassign them first.`
                );
            }

            if (
                !confirm(
                    `Delete ${site.name}?`
                )
            ) {
                return;
            }

            try {
                await ShieldData
                    .deleteSite(
                        id
                    );

                await refreshEverything();

            } catch (error) {
                alert(
                    friendlyError(
                        error
                    )
                );
            }
        }

        function resetSiteForm(
            clear = true
        ) {
            el.siteForm.reset();

            el.editingSiteId.value =
                "";

            el.siteRadius.value =
                "200";

            el.saveSiteBtn.textContent =
                "Add Site";

            el.cancelSiteEditBtn
                .classList
                .add(
                    "hidden"
                );

            if (clear) {
                clearMessage(
                    el.siteMessage
                );
            }
        }

        function renderSites() {
            if (!state.sites.length) {
                el.siteTableBody.innerHTML =
                    `
                    <tr>
                        <td colspan="7" class="empty-cell">
                            No sites available.
                        </td>
                    </tr>
                    `;

                return;
            }

            el.siteTableBody.innerHTML =
                state.sites
                    .map(
                        site => `
                        <tr>
                            <td>
                                <strong>
                                    ${escapeHtml(
                                        site.name
                                    )}
                                </strong>
                            </td>

                            <td>
                                ${escapeHtml(
                                    site.address ||
                                    "-"
                                )}
                            </td>

                            <td>
                                ${site.latitude ?? "-"}
                            </td>

                            <td>
                                ${site.longitude ?? "-"}
                            </td>

                            <td>
                                ${site.radiusMeters} m
                            </td>

                            <td>
                                <span class="geofence-badge ${
                                    site.geofenceEnabled
                                        ? "enabled"
                                        : "disabled"
                                }">
                                    ${
                                        site.geofenceEnabled
                                            ? "Enabled"
                                            : "Off"
                                    }
                                </span>
                            </td>

                            <td class="action-cell">

                                <button
                                    class="table-button"
                                    data-site-action="edit"
                                    data-site-id="${escapeAttr(
                                        site.siteId
                                    )}"
                                    type="button"
                                >
                                    Edit
                                </button>

                                <button
                                    class="table-button danger"
                                    data-site-action="delete"
                                    data-site-id="${escapeAttr(
                                        site.siteId
                                    )}"
                                    type="button"
                                >
                                    Delete
                                </button>

                            </td>
                        </tr>
                        `
                    )
                    .join("");

            el.siteTableBody
                .querySelectorAll(
                    "[data-site-action]"
                )
                .forEach(
                    button =>
                        button.addEventListener(
                            "click",
                            () => {
                                if (
                                    button.dataset
                                        .siteAction ===
                                    "edit"
                                ) {
                                    editSite(
                                        button.dataset
                                            .siteId
                                    );
                                } else {
                                    deleteSite(
                                        button.dataset
                                            .siteId
                                    );
                                }
                            }
                        )
                );
        }

        // =================================================
        // ATTENDANCE
        // =================================================

        function renderAttendance() {
            let rows =
                [...state.entries];

            if (
                el.attendanceEmployeeFilter
                    .value !==
                "all"
            ) {
                rows =
                    rows.filter(
                        entry =>
                            entry.employeeUserId ===
                            el.attendanceEmployeeFilter
                                .value
                    );
            }

            if (
                el.attendanceStatusFilter
                    .value !==
                "all"
            ) {
                rows =
                    rows.filter(
                        entry =>
                            entry.status ===
                            el.attendanceStatusFilter
                                .value
                    );
            }

            if (!rows.length) {
                el.attendanceTableBody.innerHTML =
                    `
                    <tr>
                        <td colspan="10" class="empty-cell">
                            No attendance records.
                        </td>
                    </tr>
                    `;

                return;
            }

            el.attendanceTableBody.innerHTML =
                rows.map(
                    entry => {
                        const metrics =
                            getEntryMetrics(
                                entry
                            );

                        return `
                        <tr>

                            <td>
                                ${escapeHtml(
                                    entry.employeeName
                                )}
                            </td>

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

        function getEntryMetrics(
            entry
        ) {
            if (!entry.clockIn) {
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
                )
                    .reduce(
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

            return `
                <span class="attendance-status ${escapeAttr(
                    entry.status
                )}">
                    ${escapeHtml(
                        labels[
                            entry.status
                        ] ||
                        entry.status
                    )}
                </span>
            `;
        }

        // =================================================
        // HELPERS
        // =================================================

        function setDefaultDate() {
            el.shiftDate.value =
                localDateKey(
                    new Date()
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

            const date =
                new Date(
                    value +
                    "T12:00:00"
                );

            return date
                .toLocaleDateString(
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
                hour,
                minute
            ] =
                String(value)
                    .slice(
                        0,
                        5
                    )
                    .split(":")
                    .map(Number);

            const date =
                new Date();

            date.setHours(
                hour,
                minute,
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
                new Date(value);

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

            const remaining =
                minutes %
                60;

            return hours
                ? `${hours}h ${String(
                    remaining
                ).padStart(
                    2,
                    "0"
                )}m`
                : `${minutes}m`;
        }

        function showMessage(
            node,
            message,
            error
        ) {
            node.textContent =
                message;

            node.classList.toggle(
                "error",
                Boolean(
                    error
                )
            );

            node.classList.toggle(
                "success",
                !error
            );
        }

        function clearMessage(node) {
            node.textContent =
                "";

            node.classList.remove(
                "error",
                "success"
            );
        }

        function setButtonBusy(
            button,
            busy,
            label
        ) {
            button.disabled =
                busy;

            button.textContent =
                label;
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

        function escapeAttr(
            value
        ) {
            return escapeHtml(
                value
            );
        }

        function redirectLogin() {
            window.location.href =
                "./index.html";
        }
    }
);