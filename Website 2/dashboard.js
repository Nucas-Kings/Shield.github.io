// =====================================================
// SHIELD SECURITY SERVICES
// OFFICER DASHBOARD
// AUTOMATIC CLOCK-OUT SYSTEM
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // =================================================
        // CHAPTER 1
        // CHECK LOGIN SESSION
        // =================================================

        const storedSession =
            sessionStorage.getItem(
                "shieldSession"
            );


        if (!storedSession) {

            window.location.href =
                "./index.html";

            return;

        }


        const officer =
            JSON.parse(
                storedSession
            );


        // =================================================
        // CHAPTER 2
        // AUTOMATIC CLOCK-OUT SETTINGS
        // =================================================
        //
        // Employees receive 30 minutes after their
        // scheduled shift end before automatic clock-out.
        //
        // Example:
        //
        // Shift ends: 5:30 PM
        // Grace period: 30 minutes
        // Auto clock-out: 6:00 PM
        //
        // =================================================

        const AUTO_CLOCK_OUT_GRACE_MINUTES =
            30;


        // =================================================
        // CHAPTER 3
        // EMPLOYEE-SPECIFIC STORAGE
        // =================================================

        const TIME_STATE_KEY =
            "shieldTimeState_" +
            officer.employeeId;


        const ACTIVITY_HISTORY_KEY =
            "shieldActivityHistory_" +
            officer.employeeId;


        const CORRECTION_REQUEST_KEY =
            "shieldCorrectionRequests_" +
            officer.employeeId;


        // =================================================
        // CHAPTER 4
        // HTML ELEMENTS
        // =================================================

        const officerName =
            document.getElementById(
                "officerName"
            );


        const officerNameWelcome =
            document.getElementById(
                "officerNameWelcome"
            );


        const employeeIdText =
            document.getElementById(
                "employeeIdText"
            );


        const roleText =
            document.getElementById(
                "roleText"
            );


        const siteText =
            document.getElementById(
                "siteText"
            );


        const shiftText =
            document.getElementById(
                "shiftText"
            );


        const supervisorText =
            document.getElementById(
                "supervisorText"
            );


        const currentDate =
            document.getElementById(
                "currentDate"
            );


        const currentTime =
            document.getElementById(
                "currentTime"
            );


        const statusText =
            document.getElementById(
                "statusText"
            );


        const statusIndicator =
            document.getElementById(
                "statusIndicator"
            );


        const clockInBtn =
            document.getElementById(
                "clockInBtn"
            );


        const clockOutBtn =
            document.getElementById(
                "clockOutBtn"
            );


        const startBreakBtn =
            document.getElementById(
                "startBreakBtn"
            );


        const endBreakBtn =
            document.getElementById(
                "endBreakBtn"
            );


        const clockInTimeDisplay =
            document.getElementById(
                "clockInTime"
            );


        const clockOutTimeDisplay =
            document.getElementById(
                "clockOutTime"
            );


        const breakTimeDisplay =
            document.getElementById(
                "breakTime"
            );


        const totalWorkedDisplay =
            document.getElementById(
                "totalWorked"
            );


        const activityTableBody =
            document.getElementById(
                "activityTableBody"
            );


        const correctionForm =
            document.getElementById(
                "correctionForm"
            );


        const correctionType =
            document.getElementById(
                "correctionType"
            );


        const correctionMessage =
            document.getElementById(
                "correctionMessage"
            );


        const logoutBtn =
            document.getElementById(
                "logoutBtn"
            );


        // =================================================
        // CHAPTER 5
        // DISPLAY EMPLOYEE INFORMATION
        // =================================================

        officerName.textContent =
            officer.name;


        officerNameWelcome.textContent =
            officer.name;


        employeeIdText.textContent =
            officer.employeeId;


        roleText.textContent =
            officer.role;


        siteText.textContent =
            officer.site;


        shiftText.textContent =
            officer.shift;


        supervisorText.textContent =
            officer.supervisor;


        // =================================================
        // CHAPTER 6
        // CLOCK VARIABLES
        // =================================================

        let clockInTime =
            null;


        let clockOutTime =
            null;


        let breakStartTime =
            null;


        let totalBreakMilliseconds =
            0;


        let timerInterval =
            null;


        // =================================================
        // CHAPTER 7
        // ACTIVITY HISTORY
        // =================================================

        let activityHistory =
            JSON.parse(
                localStorage.getItem(
                    ACTIVITY_HISTORY_KEY
                ) || "[]"
            );


        // =================================================
        // CHAPTER 8
        // LIVE DATE AND TIME
        // =================================================

        function updateDateAndTime() {

            const now =
                new Date();


            currentDate.textContent =
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


            currentTime.textContent =
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


        updateDateAndTime();


        setInterval(
            updateDateAndTime,
            1000
        );


        // =================================================
        // CHAPTER 9
        // CLOCK IN
        // =================================================

        clockInBtn.addEventListener(
            "click",
            function () {

                // Already working
                if (
                    clockInTime &&
                    !clockOutTime
                ) {

                    alert(
                        "You are already clocked in."
                    );

                    return;

                }


                // =========================================
                // START NEW SHIFT
                // =========================================

                clockInTime =
                    new Date();


                clockOutTime =
                    null;


                breakStartTime =
                    null;


                totalBreakMilliseconds =
                    0;


                // =========================================
                // UPDATE DISPLAY
                // =========================================

                clockInTimeDisplay.textContent =
                    formatTime(
                        clockInTime
                    );


                clockOutTimeDisplay.textContent =
                    "--";


                breakTimeDisplay.textContent =
                    "00:00:00";


                totalWorkedDisplay.textContent =
                    "00:00:00";


                // =========================================
                // STATUS
                // =========================================

                updateStatus(
                    "clocked-in"
                );


                // =========================================
                // ACTIVITY
                // =========================================

                addActivity(
                    "Clock In",
                    clockInTime
                );


                // =========================================
                // SAVE
                // =========================================

                saveTimeState();


                // =========================================
                // START TIMER
                // =========================================

                startTimer();


                updateButtons();

            }
        );


        // =================================================
        // CHAPTER 10
        // START BREAK
        // =================================================

        startBreakBtn.addEventListener(
            "click",
            function () {

                if (
                    !clockInTime ||
                    clockOutTime
                ) {

                    return;

                }


                if (breakStartTime) {

                    return;

                }


                breakStartTime =
                    new Date();


                updateStatus(
                    "break"
                );


                addActivity(
                    "Break Started",
                    breakStartTime
                );


                saveTimeState();


                updateButtons();

            }
        );


        // =================================================
        // CHAPTER 11
        // END BREAK
        // =================================================

        endBreakBtn.addEventListener(
            "click",
            function () {

                if (!breakStartTime) {

                    return;

                }


                const breakEnd =
                    new Date();


                totalBreakMilliseconds +=

                    breakEnd.getTime() -

                    breakStartTime.getTime();


                addActivity(
                    "Break Ended",
                    breakEnd
                );


                breakStartTime =
                    null;


                updateStatus(
                    "clocked-in"
                );


                saveTimeState();


                updateBreakDisplay();


                updateWorkedTime();


                updateButtons();

            }
        );


        // =================================================
        // CHAPTER 12
        // MANUAL CLOCK OUT
        // =================================================

        clockOutBtn.addEventListener(
            "click",
            function () {

                // Must be clocked in
                if (!clockInTime) {

                    alert(
                        "You need to clock in first."
                    );

                    return;

                }


                // Cannot clock out while on break
                if (breakStartTime) {

                    alert(
                        "Please end your break before clocking out."
                    );

                    return;

                }


                // Already clocked out
                if (clockOutTime) {

                    alert(
                        "You are already clocked out."
                    );

                    return;

                }


                // =========================================
                // RECORD MANUAL CLOCK OUT
                // =========================================

                clockOutTime =
                    new Date();


                clockOutTimeDisplay.textContent =
                    formatTime(
                        clockOutTime
                    );


                addActivity(
                    "Clock Out",
                    clockOutTime
                );


                updateStatus(
                    "clocked-out"
                );


                saveTimeState();


                stopTimer();


                updateWorkedTime();


                updateBreakDisplay();


                updateButtons();

            }
        );


        // =================================================
        // CHAPTER 13
        // START WORK TIMER
        // =================================================

        function startTimer() {

            stopTimer();


            timerInterval =
                setInterval(
                    function () {

                        // Update worked time
                        updateWorkedTime();


                        // Update break time
                        updateBreakDisplay();


                        // Check automatic clock-out
                        checkAutomaticClockOut();

                    },
                    1000
                );

        }


        // =================================================
        // CHAPTER 14
        // STOP WORK TIMER
        // =================================================

        function stopTimer() {

            if (timerInterval) {

                clearInterval(
                    timerInterval
                );


                timerInterval =
                    null;

            }

        }


        // =================================================
        // CHAPTER 15
        // AUTOMATIC CLOCK-OUT CHECK
        // =================================================

        function checkAutomaticClockOut() {

            // Must have an active shift
            if (
                !clockInTime ||
                clockOutTime
            ) {

                return;

            }


            // Employee must have shift information
            if (
                !officer.shiftStart ||
                !officer.shiftEnd
            ) {

                return;

            }


            // Calculate automatic clock-out
            const automaticClockOutTime =
                getAutomaticClockOutTime();


            if (!automaticClockOutTime) {

                return;

            }


            const now =
                new Date();


            // =========================================
            // HAS AUTO CLOCK-OUT TIME BEEN REACHED?
            // =========================================

            if (
                now.getTime() >=
                automaticClockOutTime.getTime()
            ) {

                performAutomaticClockOut(
                    automaticClockOutTime
                );

            }

        }


        // =================================================
        // CHAPTER 16
        // CALCULATE AUTOMATIC CLOCK-OUT TIME
        // =================================================

        function getAutomaticClockOutTime() {

            if (
                !clockInTime ||
                !officer.shiftStart ||
                !officer.shiftEnd
            ) {

                return null;

            }


            // =========================================
            // READ SHIFT TIMES
            // =========================================

            const startParts =
                officer.shiftStart.split(":");


            const endParts =
                officer.shiftEnd.split(":");


            const startHour =
                Number(
                    startParts[0]
                );


            const startMinute =
                Number(
                    startParts[1]
                );


            const endHour =
                Number(
                    endParts[0]
                );


            const endMinute =
                Number(
                    endParts[1]
                );


            // =========================================
            // CREATE SHIFT START DATE
            // =========================================

            const scheduledStart =
                new Date(
                    clockInTime
                );


            scheduledStart.setHours(
                startHour,
                startMinute,
                0,
                0
            );


            // =========================================
            // CREATE SHIFT END DATE
            // =========================================

            const scheduledEnd =
                new Date(
                    clockInTime
                );


            scheduledEnd.setHours(
                endHour,
                endMinute,
                0,
                0
            );


            // =========================================
            // HANDLE OVERNIGHT SHIFTS
            // =========================================
            //
            // Example:
            //
            // Start = 6:00 PM
            // End   = 2:00 AM
            //
            // 2:00 AM belongs to the next day.
            //
            // =========================================

            if (
                scheduledEnd.getTime() <=
                scheduledStart.getTime()
            ) {

                scheduledEnd.setDate(
                    scheduledEnd.getDate() + 1
                );

            }


            // =========================================
            // ADD 30-MINUTE GRACE PERIOD
            // =========================================

            const graceMilliseconds =

                AUTO_CLOCK_OUT_GRACE_MINUTES *

                60 *

                1000;


            const automaticClockOutTime =
                new Date(

                    scheduledEnd.getTime() +

                    graceMilliseconds

                );


            return automaticClockOutTime;

        }


        // =================================================
        // CHAPTER 17
        // PERFORM AUTOMATIC CLOCK OUT
        // =================================================

        function performAutomaticClockOut(
            automaticClockOutTime
        ) {

            // Prevent duplicate clock-outs
            if (clockOutTime) {

                return;

            }


            // =========================================
            // IF EMPLOYEE IS STILL ON BREAK
            // =========================================

            if (breakStartTime) {

                let breakMilliseconds =

                    automaticClockOutTime.getTime() -

                    breakStartTime.getTime();


                if (
                    breakMilliseconds <
                    0
                ) {

                    breakMilliseconds =
                        0;

                }


                totalBreakMilliseconds +=
                    breakMilliseconds;


                breakStartTime =
                    null;

            }


            // =========================================
            // SET OFFICIAL CLOCK OUT TIME
            // =========================================

            clockOutTime =
                new Date(
                    automaticClockOutTime
                );


            // =========================================
            // UPDATE SCREEN
            // =========================================

            clockOutTimeDisplay.textContent =
                formatTime(
                    clockOutTime
                );


            // =========================================
            // RECORD AUTOMATIC ACTIVITY
            // =========================================

            addActivity(
                "Automatic Clock Out",
                clockOutTime
            );


            // =========================================
            // CHANGE STATUS
            // =========================================

            updateStatus(
                "clocked-out"
            );


            // =========================================
            // SAVE
            // =========================================

            saveTimeState();


            // =========================================
            // STOP TIMER
            // =========================================

            stopTimer();


            // =========================================
            // UPDATE TOTALS
            // =========================================

            updateWorkedTime();


            updateBreakDisplay();


            updateButtons();


            // =========================================
            // NOTIFY OFFICER
            // =========================================

            alert(

                "Your shift has been automatically clocked out " +

                AUTO_CLOCK_OUT_GRACE_MINUTES +

                " minutes after your scheduled shift ended."

            );

        }


        // =================================================
        // CHAPTER 18
        // CALCULATE WORKED TIME
        // =================================================

        function updateWorkedTime() {

            if (!clockInTime) {

                totalWorkedDisplay.textContent =
                    "00:00:00";

                return;

            }


            // Use clock-out time if available.
            // Otherwise use current time.

            const end =
                clockOutTime ||
                new Date();


            let totalMilliseconds =

                end.getTime() -

                clockInTime.getTime();


            let breakMilliseconds =
                totalBreakMilliseconds;


            // =========================================
            // ACTIVE BREAK
            // =========================================

            if (breakStartTime) {

                breakMilliseconds +=

                    new Date().getTime() -

                    breakStartTime.getTime();

            }


            // =========================================
            // REMOVE BREAKS FROM WORK TIME
            // =========================================

            totalMilliseconds -=
                breakMilliseconds;


            if (
                totalMilliseconds <
                0
            ) {

                totalMilliseconds =
                    0;

            }


            totalWorkedDisplay.textContent =
                convertMilliseconds(
                    totalMilliseconds
                );

        }


        // =================================================
        // CHAPTER 19
        // BREAK TIME DISPLAY
        // =================================================

        function updateBreakDisplay() {

            let totalBreak =
                totalBreakMilliseconds;


            if (breakStartTime) {

                totalBreak +=

                    new Date().getTime() -

                    breakStartTime.getTime();

            }


            breakTimeDisplay.textContent =
                convertMilliseconds(
                    totalBreak
                );

        }


        // =================================================
        // CHAPTER 20
        // STATUS DISPLAY
        // =================================================

        function updateStatus(status) {

            statusIndicator.classList.remove(
                "status-clocked-out",
                "status-clocked-in",
                "status-break"
            );


            // =========================================
            // CLOCKED IN
            // =========================================

            if (
                status ===
                "clocked-in"
            ) {

                statusText.textContent =
                    "CLOCKED IN";


                statusIndicator.classList.add(
                    "status-clocked-in"
                );

            }


            // =========================================
            // ON BREAK
            // =========================================

            else if (
                status ===
                "break"
            ) {

                statusText.textContent =
                    "ON BREAK";


                statusIndicator.classList.add(
                    "status-break"
                );

            }


            // =========================================
            // CLOCKED OUT
            // =========================================

            else {

                statusText.textContent =
                    "CLOCKED OUT";


                statusIndicator.classList.add(
                    "status-clocked-out"
                );

            }

        }


        // =================================================
        // CHAPTER 21
        // BUTTON CONTROL
        // =================================================

        function updateButtons() {

            // =========================================
            // NOT WORKING
            // =========================================

            if (
                !clockInTime ||
                clockOutTime
            ) {

                clockInBtn.disabled =
                    false;


                startBreakBtn.disabled =
                    true;


                endBreakBtn.disabled =
                    true;


                clockOutBtn.disabled =
                    true;


                return;

            }


            // =========================================
            // ON BREAK
            // =========================================

            if (breakStartTime) {

                clockInBtn.disabled =
                    true;


                startBreakBtn.disabled =
                    true;


                endBreakBtn.disabled =
                    false;


                clockOutBtn.disabled =
                    true;


                return;

            }


            // =========================================
            // CURRENTLY WORKING
            // =========================================

            clockInBtn.disabled =
                true;


            startBreakBtn.disabled =
                false;


            endBreakBtn.disabled =
                true;


            clockOutBtn.disabled =
                false;

        }


        // =================================================
        // CHAPTER 22
        // ADD ACTIVITY
        // =================================================

        function addActivity(
            type,
            date
        ) {

            const activity = {

                employeeId:
                    officer.employeeId,

                employeeName:
                    officer.name,

                type:
                    type,

                timestamp:
                    date.toISOString(),

                location:
                    officer.site

            };


            activityHistory.unshift(
                activity
            );


            localStorage.setItem(
                ACTIVITY_HISTORY_KEY,

                JSON.stringify(
                    activityHistory
                )
            );


            renderActivities();

        }


        // =================================================
        // CHAPTER 23
        // DISPLAY ACTIVITY HISTORY
        // =================================================

        function renderActivities() {

            activityTableBody.innerHTML =
                "";


            if (
                activityHistory.length ===
                0
            ) {

                activityTableBody.innerHTML = `

                    <tr>

                        <td colspan="4">

                            No activity recorded yet.

                        </td>

                    </tr>

                `;

                return;

            }


            activityHistory
                .slice(0, 20)
                .forEach(
                    function (activity) {

                        const activityDate =
                            new Date(
                                activity.timestamp
                            );


                        const row =
                            document.createElement(
                                "tr"
                            );


                        row.innerHTML = `

                            <td>
                                ${activity.type}
                            </td>

                            <td>
                                ${formatDate(activityDate)}
                            </td>

                            <td>
                                ${formatTime(activityDate)}
                            </td>

                            <td>
                                ${activity.location}
                            </td>

                        `;


                        activityTableBody.appendChild(
                            row
                        );

                    }
                );

        }


        // =================================================
        // CHAPTER 24
        // TIME CORRECTION REQUEST
        // =================================================

        correctionForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const issue =
                    correctionType.value;


                const description =
                    correctionMessage.value
                        .trim();


                if (
                    !issue ||
                    !description
                ) {

                    alert(
                        "Please complete the correction form."
                    );

                    return;

                }


                // =========================================
                // CREATE REQUEST
                // =========================================

                const correctionRequest = {

                    employeeId:
                        officer.employeeId,

                    employeeName:
                        officer.name,

                    site:
                        officer.site,

                    supervisor:
                        officer.supervisor,

                    issue:
                        issue,

                    description:
                        description,

                    submittedAt:
                        new Date()
                            .toISOString(),

                    status:
                        "Pending"

                };


                // =========================================
                // LOAD EXISTING REQUESTS
                // =========================================

                const savedRequests =
                    JSON.parse(
                        localStorage.getItem(
                            CORRECTION_REQUEST_KEY
                        ) || "[]"
                    );


                savedRequests.unshift(
                    correctionRequest
                );


                // =========================================
                // SAVE REQUEST
                // =========================================

                localStorage.setItem(
                    CORRECTION_REQUEST_KEY,

                    JSON.stringify(
                        savedRequests
                    )
                );


                alert(
                    "Your correction request has been submitted."
                );


                correctionForm.reset();

            }
        );


        // =================================================
        // CHAPTER 25
        // SAVE TIME STATE
        // =================================================

        function saveTimeState() {

            const timeState = {

                clockInTime:

                    clockInTime

                        ? clockInTime.toISOString()

                        : null,


                clockOutTime:

                    clockOutTime

                        ? clockOutTime.toISOString()

                        : null,


                breakStartTime:

                    breakStartTime

                        ? breakStartTime.toISOString()

                        : null,


                totalBreakMilliseconds:
                    totalBreakMilliseconds

            };


            localStorage.setItem(
                TIME_STATE_KEY,

                JSON.stringify(
                    timeState
                )
            );

        }


        // =================================================
        // CHAPTER 26
        // RESTORE SAVED TIME STATE
        // =================================================

        function restoreTimeState() {

            const savedState =
                JSON.parse(
                    localStorage.getItem(
                        TIME_STATE_KEY
                    ) || "null"
                );


            // =========================================
            // NO SAVED SHIFT
            // =========================================

            if (!savedState) {

                updateStatus(
                    "clocked-out"
                );


                updateButtons();


                return;

            }


            // =========================================
            // RESTORE CLOCK IN
            // =========================================

            clockInTime =
                savedState.clockInTime

                    ? new Date(
                        savedState.clockInTime
                    )

                    : null;


            // =========================================
            // RESTORE CLOCK OUT
            // =========================================

            clockOutTime =
                savedState.clockOutTime

                    ? new Date(
                        savedState.clockOutTime
                    )

                    : null;


            // =========================================
            // RESTORE BREAK START
            // =========================================

            breakStartTime =
                savedState.breakStartTime

                    ? new Date(
                        savedState.breakStartTime
                    )

                    : null;


            // =========================================
            // RESTORE BREAK TOTAL
            // =========================================

            totalBreakMilliseconds =
                savedState.totalBreakMilliseconds ||
                0;


            // =========================================
            // DISPLAY CLOCK IN
            // =========================================

            if (clockInTime) {

                clockInTimeDisplay.textContent =
                    formatTime(
                        clockInTime
                    );

            }

            else {

                clockInTimeDisplay.textContent =
                    "--";

            }


            // =========================================
            // DISPLAY CLOCK OUT
            // =========================================

            if (clockOutTime) {

                clockOutTimeDisplay.textContent =
                    formatTime(
                        clockOutTime
                    );

            }

            else {

                clockOutTimeDisplay.textContent =
                    "--";

            }


            // =================================================
            // IMPORTANT:
            // CHECK AUTOMATIC CLOCK-OUT FIRST
            // =================================================

            if (
                clockInTime &&
                !clockOutTime
            ) {

                const automaticClockOutTime =
                    getAutomaticClockOutTime();


                if (
                    automaticClockOutTime &&
                    new Date().getTime() >=
                        automaticClockOutTime.getTime()
                ) {

                    performAutomaticClockOut(
                        automaticClockOutTime
                    );


                    return;

                }

            }


            // =========================================
            // RESTORE STATUS
            // =========================================

            if (
                clockInTime &&
                !clockOutTime &&
                breakStartTime
            ) {

                updateStatus(
                    "break"
                );


                startTimer();

            }


            else if (
                clockInTime &&
                !clockOutTime
            ) {

                updateStatus(
                    "clocked-in"
                );


                startTimer();

            }


            else {

                updateStatus(
                    "clocked-out"
                );

            }


            // =========================================
            // UPDATE SCREEN
            // =========================================

            updateWorkedTime();


            updateBreakDisplay();


            updateButtons();

        }


        // =================================================
        // CHAPTER 27
        // LOGOUT
        // =================================================

        logoutBtn.addEventListener(
            "click",
            function () {

                stopTimer();


                // Only remove login session.
                // Attendance data stays saved.

                sessionStorage.removeItem(
                    "shieldSession"
                );


                window.location.href =
                    "./index.html";

            }
        );


        // =================================================
        // CHAPTER 28
        // FORMAT TIME
        // =================================================

        function formatTime(date) {

            return date.toLocaleTimeString(
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


        // =================================================
        // CHAPTER 29
        // FORMAT DATE
        // =================================================

        function formatDate(date) {

            return date.toLocaleDateString(
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


        // =================================================
        // CHAPTER 30
        // CONVERT MILLISECONDS TO HH:MM:SS
        // =================================================

        function convertMilliseconds(
            milliseconds
        ) {

            const totalSeconds =
                Math.floor(
                    milliseconds /
                    1000
                );


            const hours =
                Math.floor(
                    totalSeconds /
                    3600
                );


            const minutes =
                Math.floor(
                    (
                        totalSeconds %
                        3600
                    ) /
                    60
                );


            const seconds =
                totalSeconds %
                60;


            return (

                String(hours)
                    .padStart(
                        2,
                        "0"
                    )

                +

                ":"

                +

                String(minutes)
                    .padStart(
                        2,
                        "0"
                    )

                +

                ":"

                +

                String(seconds)
                    .padStart(
                        2,
                        "0"
                    )

            );

        }


        // =================================================
        // CHAPTER 31
        // START DASHBOARD
        // =================================================

        restoreTimeState();


        renderActivities();

    }
);