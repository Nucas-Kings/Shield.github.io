[dashboard.js](https://github.com/user-attachments/files/32257177/dashboard.js)[index.html](https://github.com/user-attachments/files/32257047/index.html)# Shield.github.io
[dashboard.html](https://github.com/user-attachments/files/32256989/dashboard.html)
<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>SHIELD | Officer Dashboard</title>


    <!-- GOOGLE FONTS -->

    <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
    >

    <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin
    >

    <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Nunito+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
    >


    <!-- MAIN STYLESHEET -->

    <link
        rel="stylesheet"
        href="./styles.css"
    >

</head>


<body class="dashboard-page">


    <!-- =================================================
         DASHBOARD HEADER
    ================================================== -->

    <header class="dashboard-header">


        <!-- LOGO + COMPANY NAME -->

        <div class="dashboard-brand">


            <!-- NEW SHIELD LOGO -->

            <div class="brand-logo small">

                <img
                    src="./images/LOGO.png"
                    alt="SHIELD Security Services Logo"
                >

            </div>


            <!-- COMPANY NAME -->

            <div>

                <h1>
                    SHIELD
                </h1>

                <p>
                    Officer Portal
                </p>

            </div>

        </div>


        <!-- SIGNED IN USER -->

        <div class="dashboard-user">

            <div class="signed-in-user">

                <span>
                    Signed in as
                </span>

                <strong id="officerName">
                    Officer
                </strong>

            </div>


            <!-- LOGOUT BUTTON -->

            <button
                id="logoutBtn"
                class="logout-button"
                type="button"
            >
                Logout
            </button>

        </div>

    </header>


    <!-- =================================================
         MAIN DASHBOARD CONTENT
    ================================================== -->

    <main class="dashboard-container">


        <!-- =================================================
             WELCOME SECTION
        ================================================== -->

        <section class="welcome-banner">


            <div>

                <span class="section-label light">
                    Officer Dashboard
                </span>


                <h2>

                    Welcome,

                    <span id="officerNameWelcome">
                        Officer
                    </span>

                </h2>


                <p>
                    Manage your shift and attendance
                    from your SHIELD officer portal.
                </p>

            </div>


            <!-- LIVE DATE AND TIME -->

            <div class="live-time-card">

                <span id="currentDate">
                    Loading date...
                </span>

                <strong id="currentTime">
                    --:--:--
                </strong>

            </div>

        </section>


        <!-- =================================================
             EMPLOYEE INFORMATION
        ================================================== -->

        <section class="dashboard-section">


            <div class="section-heading">

                <span class="section-label">
                    Employee Information
                </span>

                <h2>
                    Today's Assignment
                </h2>

            </div>


            <div class="profile-grid">


                <!-- EMPLOYEE ID -->

                <article class="profile-card blue-card">

                    <span>
                        Employee ID
                    </span>

                    <strong id="employeeIdText">
                        --
                    </strong>

                </article>


                <!-- POSITION -->

                <article class="profile-card purple-card">

                    <span>
                        Position
                    </span>

                    <strong id="roleText">
                        --
                    </strong>

                </article>


                <!-- ASSIGNED SITE -->

                <article class="profile-card cyan-card">

                    <span>
                        Assigned Site
                    </span>

                    <strong id="siteText">
                        --
                    </strong>

                </article>


                <!-- SHIFT -->

                <article class="profile-card gold-card">

                    <span>
                        Shift
                    </span>

                    <strong id="shiftText">
                        --
                    </strong>

                </article>


                <!-- SUPERVISOR -->

                <article class="profile-card pink-card">

                    <span>
                        Supervisor
                    </span>

                    <strong id="supervisorText">
                        --
                    </strong>

                </article>


            </div>

        </section>


        <!-- =================================================
             TIME CLOCK
        ================================================== -->

        <section class="dashboard-section">


            <div class="section-heading">

                <span class="section-label">
                    Attendance
                </span>

                <h2>
                    Time Clock
                </h2>

            </div>


            <div class="time-clock-grid">


                <!-- CURRENT STATUS -->

                <article class="clock-status-card">

                    <p>
                        Current Status
                    </p>


                    <div
                        id="statusIndicator"
                        class="status-indicator status-clocked-out"
                    >

                        <span class="status-dot"></span>


                        <strong id="statusText">
                            CLOCKED OUT
                        </strong>

                    </div>


                    <!-- TOTAL WORKED -->

                    <div class="worked-time-box">

                        <span>
                            Total Worked
                        </span>

                        <strong id="totalWorked">
                            00:00:00
                        </strong>

                    </div>

                </article>


                <!-- TIME INFORMATION -->

                <article class="time-details-card">


                    <!-- CLOCK IN TIME -->

                    <div class="time-detail">

                        <span>
                            Clock In
                        </span>

                        <strong id="clockInTime">
                            --
                        </strong>

                    </div>


                    <!-- BREAK TIME -->

                    <div class="time-detail">

                        <span>
                            Break Time
                        </span>

                        <strong id="breakTime">
                            00:00:00
                        </strong>

                    </div>


                    <!-- CLOCK OUT TIME -->

                    <div class="time-detail">

                        <span>
                            Clock Out
                        </span>

                        <strong id="clockOutTime">
                            --
                        </strong>

                    </div>


                </article>

            </div>


            <!-- =================================================
                 CLOCK BUTTONS
            ================================================== -->

            <div class="clock-buttons">


                <!-- CLOCK IN -->

                <button
                    id="clockInBtn"
                    class="clock-button clock-in"
                    type="button"
                >
                    Clock In
                </button>


                <!-- START BREAK -->

                <button
                    id="startBreakBtn"
                    class="clock-button start-break"
                    type="button"
                >
                    Start Break
                </button>


                <!-- END BREAK -->

                <button
                    id="endBreakBtn"
                    class="clock-button end-break"
                    type="button"
                >
                    End Break
                </button>


                <!-- CLOCK OUT -->

                <button
                    id="clockOutBtn"
                    class="clock-button clock-out"
                    type="button"
                >
                    Clock Out
                </button>


            </div>

        </section>


        <!-- =================================================
             ACTIVITY HISTORY
        ================================================== -->

        <section class="dashboard-section">


            <div class="section-heading">

                <span class="section-label">
                    Attendance History
                </span>

                <h2>
                    Recent Activity
                </h2>

            </div>


            <div class="table-wrapper">


                <table class="activity-table">


                    <thead>

                        <tr>

                            <th>
                                Activity
                            </th>

                            <th>
                                Date
                            </th>

                            <th>
                                Time
                            </th>

                            <th>
                                Location
                            </th>

                        </tr>

                    </thead>


                    <tbody id="activityTableBody">

                        <tr>

                            <td colspan="4">

                                No activity recorded yet.

                            </td>

                        </tr>

                    </tbody>


                </table>


            </div>

        </section>


        <!-- =================================================
             TIME CORRECTION REQUEST
        ================================================== -->

        <section class="dashboard-section correction-section">


            <div class="section-heading">

                <span class="section-label">
                    Time Assistance
                </span>

                <h2>
                    Report a Time Issue
                </h2>

                <p>
                    Submit a request if your recorded
                    time is incorrect.
                </p>

            </div>


            <form id="correctionForm">


                <!-- ISSUE TYPE -->

                <div class="form-group">


                    <label for="correctionType">

                        Issue Type

                    </label>


                    <select
                        id="correctionType"
                        required
                    >


                        <option value="">

                            Select an issue

                        </option>


                        <option value="Forgot Clock In">

                            Forgot to Clock In

                        </option>


                        <option value="Forgot Clock Out">

                            Forgot to Clock Out

                        </option>


                        <option value="Incorrect Time">

                            Incorrect Clock Time

                        </option>


                        <option value="Break Issue">

                            Break Issue

                        </option>


                        <option value="Other">

                            Other

                        </option>


                    </select>


                </div>


                <!-- EXPLANATION -->

                <div class="form-group">


                    <label for="correctionMessage">

                        Explanation

                    </label>


                    <textarea
                        id="correctionMessage"
                        rows="5"
                        placeholder="Explain what happened..."
                        required
                    ></textarea>


                </div>


                <!-- SUBMIT -->

                <button
                    type="submit"
                    class="correction-button"
                >

                    Submit Correction Request

                </button>


            </form>


        </section>


    </main>


    <!-- =================================================
         FOOTER
    ================================================== -->

    <footer class="dashboard-footer">


        <strong>

            SHIELD Security Services

        </strong>


        <span>

            Employee Time & Attendance Portal

        </span>


    </footer>


    <!-- =================================================
         DASHBOARD JAVASCRIPT
    ================================================== -->

    <script src="./dashboard.js"></script>


</body>

</html>




[<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>SHIELD | Officer Login</title>

    <!-- Google Fonts -->
    <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
    >

    <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin
    >

    <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Nunito+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
    >

    <!-- Main Stylesheet -->
    <link
        rel="stylesheet"
        href="./styles.css"
    >
</head>

<body class="login-page">

    <main class="login-container">

        <!-- =========================================
             LEFT SIDE
        ========================================== -->

        <section class="login-brand-section">

            <div class="brand">

                <div class="brand-logo">
                    <img src="./images/LOGO.png" alt="SHIELD Logo">
                </div>

                <div>
                    <h1>SHIELD</h1>
                    <p>Security Services</p>
                </div>

            </div>


            <div class="brand-content">

                <span class="eyebrow">
                    Officer Management System
                </span>

                <h2>
                    Secure attendance and workforce management.
                </h2>

                <p>
                    SHIELD gives security officers a simple
                    way to clock in, clock out, manage breaks,
                    review assignments, and report time issues.
                </p>


                <div class="login-features">

                    <article class="feature-card">

                        <span class="feature-number">
                            01
                        </span>

                        <div>

                            <h3>
                                Secure Login
                            </h3>

                            <p>
                                Access your personal officer
                                portal using assigned credentials.
                            </p>

                        </div>

                    </article>


                    <article class="feature-card">

                        <span class="feature-number">
                            02
                        </span>

                        <div>

                            <h3>
                                Time Clock
                            </h3>

                            <p>
                                Record clock-in, clock-out,
                                and break activity.
                            </p>

                        </div>

                    </article>


                    <article class="feature-card">

                        <span class="feature-number">
                            03
                        </span>

                        <div>

                            <h3>
                                Shift Information
                            </h3>

                            <p>
                                See your assigned site,
                                schedule, and supervisor.
                            </p>

                        </div>

                    </article>

                </div>

            </div>

        </section>


        <!-- =========================================
             RIGHT SIDE
        ========================================== -->

        <section class="login-form-section">

            <div class="login-card">

                <div class="login-card-header">

                    <span class="section-label">
                        Employee Portal
                    </span>

                    <h2>
                        Officer Sign In
                    </h2>

                    <p>
                        Enter your SHIELD employee credentials.
                    </p>

                </div>


                <form id="loginForm">

                    <!-- EMPLOYEE ID -->

                    <div class="form-group">

                        <label for="employeeId">
                            Employee ID
                        </label>

                        <input
                            type="text"
                            id="employeeId"
                            name="employeeId"
                            placeholder="SHIELD-123"
                            autocomplete="username"
                            required
                        >

                    </div>


                    <!-- PASSWORD -->

                    <div class="form-group">

                        <label for="password">
                            Password
                        </label>

                        <div class="password-wrapper">

                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter password"
                                autocomplete="current-password"
                                required
                            >

                            <button
                                type="button"
                                id="togglePassword"
                                class="password-toggle"
                            >
                                Show
                            </button>

                        </div>

                    </div>


                    <!-- LOGIN OPTIONS -->

                    <div class="login-options">

                        <label class="remember-row">

                            <input
                                type="checkbox"
                                id="rememberMe"
                            >

                            <span>
                                Remember Employee ID
                            </span>

                        </label>


                        <button
                            type="button"
                            id="forgotPassword"
                            class="forgot-password"
                        >
                            Forgot Password?
                        </button>

                    </div>


                    <!-- ERROR MESSAGE -->

                    <p
                        id="loginError"
                        class="login-error"
                        aria-live="polite"
                    ></p>


                    <!-- LOGIN BUTTON -->

                    <button
                        type="submit"
                        class="login-button"
                    >
                        Sign In to SHIELD
                    </button>

                </form>


                <!-- =========================================
                     DEMO ACCOUNT
                ========================================== -->

                <div class="demo-box">

                    <h3>
                        Prototype Demo Account
                    </h3>

                    <p>
                        Employee ID:
                        <strong>SHIELD-123</strong>
                    </p>

                    <p>
                        Password:
                        <strong>Ayomide28</strong>
                    </p>

                </div>


                <div class="login-footer">

                    <p>
                        Authorized SHIELD personnel only.
                    </p>

                </div>

            </div>

        </section>

    </main>


    <!-- =========================================
         NOTIFICATION
    ========================================== -->

    <div
        id="toast"
        class="toast"
        aria-live="polite"
    ></div>


    <!-- LOGIN SCRIPT -->

    <script src="./login.js"></script>

</body>

</html>Uploading index.html…]()





// =====================================================
// SHIELD SECURITY SERVICES
// MULTI-EMPLOYEE LOGIN SYSTEM
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // =================================================
        // CHAPTER 1
        // HTML ELEMENTS
        // =================================================

        const loginForm =
            document.getElementById("loginForm");

        const employeeIdInput =
            document.getElementById("employeeId");

        const passwordInput =
            document.getElementById("password");

        const togglePassword =
            document.getElementById("togglePassword");

        const rememberMe =
            document.getElementById("rememberMe");

        const forgotPassword =
            document.getElementById("forgotPassword");

        const loginError =
            document.getElementById("loginError");

        const toast =
            document.getElementById("toast");


        // =================================================
        // CHAPTER 2
        // SHIELD EMPLOYEE ACCOUNTS
        // =================================================
        //
        // shiftStart and shiftEnd use 24-hour time.
        //
        // Example:
        //
        // 8:30 AM  = 08:30
        // 5:30 PM  = 17:30
        // 6:00 PM  = 18:00
        //
        // =================================================

        const EMPLOYEES = [

            // =============================================
            // EMPLOYEE 1
            // =============================================

            {
                employeeId: "SHIELD-123",

                password: "Ayomide28",

                name: "Emmanuel Akinseye",

                role: "Security Officer",

                site: "VECTOR",

                shift: "8:30 AM - 5:30 PM",

                shiftStart: "08:30",

                shiftEnd: "17:30",

                supervisor: "Officer Rob"
            },


            // =============================================
            // EMPLOYEE 2
            // =============================================

            {
                employeeId: "SHIELD-124",

                password: "Robert25",

                name: "Robert Johnson",

                role: "Security Officer",

                site: "Amazon Distribution Center",

                shift: "4:00 PM - 12:00 AM",

                shiftStart: "16:00",

                shiftEnd: "00:00",

                supervisor: "Officer James"
            },


            // =============================================
            // EMPLOYEE 3
            // =============================================

            {
                employeeId: "SHIELD-125",

                password: "Francisca30",

                name: "Francisca Williams",

                role: "Security Officer",

                site: "FedEx Distribution Center",

                shift: "12:00 AM - 8:00 AM",

                shiftStart: "00:00",

                shiftEnd: "08:00",

                supervisor: "Officer Rob"
            },


            // =============================================
            // EMPLOYEE 4
            // =============================================

            {
                employeeId: "SHIELD-126",

                password: "Patrol26",

                name: "Michael Brown",

                role: "Patrol Officer",

                site: "Downtown Office Complex",

                shift: "6:00 PM - 2:00 AM",

                shiftStart: "18:00",

                shiftEnd: "02:00",

                supervisor: "Officer Daniels"
            }

        ];


        // =================================================
        // CHAPTER 3
        // LOAD REMEMBERED EMPLOYEE ID
        // =================================================

        const rememberedEmployeeId =
            localStorage.getItem(
                "shieldRememberedEmployeeId"
            );


        if (rememberedEmployeeId) {

            employeeIdInput.value =
                rememberedEmployeeId;

            rememberMe.checked =
                true;

        }


        // =================================================
        // CHAPTER 4
        // SHOW / HIDE PASSWORD
        // =================================================

        togglePassword.addEventListener(
            "click",
            function () {

                if (
                    passwordInput.type ===
                    "password"
                ) {

                    passwordInput.type =
                        "text";

                    togglePassword.textContent =
                        "Hide";

                }

                else {

                    passwordInput.type =
                        "password";

                    togglePassword.textContent =
                        "Show";

                }

            }
        );


        // =================================================
        // CHAPTER 5
        // FORGOT PASSWORD
        // =================================================

        forgotPassword.addEventListener(
            "click",
            function () {

                showToast(
                    "Please contact your SHIELD supervisor or administrator for password assistance."
                );

            }
        );


        // =================================================
        // CHAPTER 6
        // LOGIN FORM
        // =================================================

        loginForm.addEventListener(
            "submit",
            function (event) {

                // Prevent page refresh
                event.preventDefault();


                // Clear previous error
                loginError.textContent =
                    "";


                // =========================================
                // READ LOGIN DETAILS
                // =========================================

                const enteredEmployeeId =
                    employeeIdInput.value
                        .trim()
                        .toUpperCase();


                const enteredPassword =
                    passwordInput.value
                        .trim();


                // =========================================
                // CHECK EMPTY FIELDS
                // =========================================

                if (
                    enteredEmployeeId === "" ||
                    enteredPassword === ""
                ) {

                    loginError.textContent =
                        "Please enter your Employee ID and password.";

                    return;

                }


                // =========================================
                // FIND MATCHING EMPLOYEE
                // =========================================

                const employee =
                    EMPLOYEES.find(
                        function (currentEmployee) {

                            return (

                                currentEmployee.employeeId ===
                                    enteredEmployeeId

                                &&

                                currentEmployee.password ===
                                    enteredPassword

                            );

                        }
                    );


                // =========================================
                // INVALID LOGIN
                // =========================================

                if (!employee) {

                    loginError.textContent =
                        "Invalid Employee ID or password.";

                    passwordInput.value =
                        "";

                    passwordInput.focus();

                    return;

                }


                // =================================================
                // CHAPTER 7
                // CREATE EMPLOYEE SESSION
                // =================================================

                const officerSession = {

                    employeeId:
                        employee.employeeId,

                    name:
                        employee.name,

                    role:
                        employee.role,

                    site:
                        employee.site,

                    shift:
                        employee.shift,

                    shiftStart:
                        employee.shiftStart,

                    shiftEnd:
                        employee.shiftEnd,

                    supervisor:
                        employee.supervisor,

                    loginTime:
                        new Date().toISOString()

                };


                // =========================================
                // SAVE SESSION
                // =========================================

                sessionStorage.setItem(
                    "shieldSession",
                    JSON.stringify(
                        officerSession
                    )
                );


                // =================================================
                // CHAPTER 8
                // REMEMBER EMPLOYEE ID
                // =================================================

                if (rememberMe.checked) {

                    localStorage.setItem(
                        "shieldRememberedEmployeeId",
                        employee.employeeId
                    );

                }

                else {

                    localStorage.removeItem(
                        "shieldRememberedEmployeeId"
                    );

                }


                // =================================================
                // CHAPTER 9
                // GO TO DASHBOARD
                // =================================================

                window.location.href =
                    "./dashboard.html";

            }
        );


        // =================================================
        // CHAPTER 10
        // TOAST NOTIFICATION
        // =================================================

        function showToast(message) {

            toast.textContent =
                message;

            toast.classList.add(
                "show"
            );


            setTimeout(
                function () {

                    toast.classList.remove(
                        "show"
                    );

                },
                3000
            );

        }

    }
);
[login.js](https://github.com/user-attachments/files/32257120/login.js)







/* =====================================================
   SHIELD SECURITY SERVICES
   COMPLETE STYLESHEET
===================================================== */


/* =====================================================
   RESET
===================================================== */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}


/* =====================================================
   COLORS
===================================================== */

:root {
    --navy: #07182f;
    --navy-light: #12365f;

    --blue: #2563eb;
    --bright-blue: #0ea5e9;
    --cyan: #06b6d4;

    --purple: #7c3aed;

    --gold: #fbbf24;
    --orange: #f97316;

    --green: #10b981;
    --red: #ef4444;
    --pink: #ec4899;

    --white: #ffffff;

    --background: #f3f7fc;
    --text: #172033;
    --muted: #667085;
    --border: #dde5ef;

    --shadow:
        0 18px 45px
        rgba(7, 24, 47, 0.12);
}


/* =====================================================
   GLOBAL
===================================================== */

html {
    scroll-behavior: smooth;
}


body {
    min-height: 100vh;

    font-family:
        "Nunito Sans",
        sans-serif;

    color: var(--text);

    background:
        var(--background);
}


h1,
h2,
h3,
button,
strong {
    font-family:
        "Montserrat",
        sans-serif;
}


button,
input,
select,
textarea {
    font: inherit;
}


button {
    cursor: pointer;
}


/* =====================================================
   LOGIN PAGE
===================================================== */

.login-page {
    min-height: 100vh;

    background:
        linear-gradient(
            135deg,
            #06152c,
            #113d79,
            #5b36d6
        );
}


/* =====================================================
   LOGIN CONTAINER
===================================================== */

.login-container {
    min-height: 100vh;

    display: grid;

    grid-template-columns:
        1.15fr 0.85fr;
}


/* =====================================================
   LEFT LOGIN SECTION
===================================================== */

.login-brand-section {
    padding: 40px 55px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    color: white;

    background:

        radial-gradient(
            circle at top left,
            rgba(6, 182, 212, 0.30),
            transparent 32%
        ),

        radial-gradient(
            circle at bottom right,
            rgba(251, 191, 36, 0.18),
            transparent 30%
        );
}


/* =====================================================
   BRAND AREA
===================================================== */

.brand {
    display: flex;
    align-items: center;

    gap: 12px;
}


/* =====================================================
   LOGIN PAGE LOGO
   THIS IS THE SECTION THAT CONTROLS YOUR NEW IMAGE
===================================================== */

.login-brand-section .brand-logo {
    width: 52px;
    height: 52px;

    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 5px;

    border-radius: 12px;

    background:
        rgba(
            255,
            255,
            255,
            0.10
        );

    border:
        1px solid
        rgba(
            255,
            255,
            255,
            0.16
        );

    overflow: hidden;

    box-shadow:
        0 8px 20px
        rgba(
            0,
            0,
            0,
            0.15
        );
}


/* THE ACTUAL LOGO IMAGE */

.login-brand-section .brand-logo img {
    width: 100%;
    height: 100%;

    display: block;

    object-fit: contain;
}


/* SHIELD WORD NEXT TO LOGO */

.brand h1 {
    font-size: 28px;

    letter-spacing: 4px;

    line-height: 1;
}


.brand p {
    margin-top: 5px;

    font-size: 13px;

    color:
        rgba(
            255,
            255,
            255,
            0.70
        );
}


/* =====================================================
   BRAND CONTENT
===================================================== */

.brand-content {
    max-width: 680px;

    margin-top: 65px;
}


.eyebrow,
.section-label {
    color: var(--cyan);

    text-transform: uppercase;

    letter-spacing: 2px;

    font-size: 12px;

    font-weight: 800;
}


.section-label.light {
    color: #a5f3fc;
}


.brand-content h2 {
    margin-top: 17px;

    font-size:
        clamp(
            40px,
            5vw,
            67px
        );

    line-height: 1.06;
}


.brand-content > p {
    margin-top: 20px;

    max-width: 590px;

    font-size: 18px;

    line-height: 1.7;

    color:
        rgba(
            255,
            255,
            255,
            0.75
        );
}


/* =====================================================
   LOGIN FEATURES
===================================================== */

.login-features {
    margin-top: 38px;

    display: grid;

    gap: 14px;
}


.feature-card {
    display: flex;

    align-items: center;

    gap: 16px;

    padding: 18px;

    border-radius: 17px;

    border:
        1px solid
        rgba(
            255,
            255,
            255,
            0.13
        );

    background:
        rgba(
            255,
            255,
            255,
            0.07
        );

    backdrop-filter:
        blur(12px);

    transition: 0.2s;
}


.feature-card:hover {
    transform:
        translateY(-2px);

    background:
        rgba(
            255,
            255,
            255,
            0.10
        );
}


.feature-number {
    width: 45px;
    height: 45px;

    flex:
        0 0 45px;

    display: grid;

    place-items: center;

    border-radius: 12px;

    background:
        linear-gradient(
            145deg,
            var(--cyan),
            var(--bright-blue)
        );

    color: var(--navy);

    font-weight: 800;
}


.feature-card h3 {
    font-size: 15px;
}


.feature-card p {
    margin-top: 4px;

    font-size: 14px;

    color:
        rgba(
            255,
            255,
            255,
            0.67
        );
}


/* =====================================================
   LOGIN FORM SIDE
===================================================== */

.login-form-section {
    padding: 35px;

    display: grid;

    place-items: center;

    background:
        linear-gradient(
            180deg,
            #ffffff,
            #edf3ff
        );
}


/* =====================================================
   LOGIN CARD
===================================================== */

.login-card {
    width: 100%;

    max-width: 500px;

    padding: 42px;

    border-radius: 26px;

    background: white;

    box-shadow:
        0 30px 70px
        rgba(
            6,
            24,
            47,
            0.18
        );
}


.login-card-header {
    margin-bottom: 30px;
}


.login-card-header h2 {
    margin-top: 8px;

    color: var(--navy);

    font-size: 32px;
}


.login-card-header p {
    margin-top: 8px;

    color: var(--muted);
}


/* =====================================================
   FORM
===================================================== */

.form-group {
    margin-bottom: 20px;
}


.form-group label {
    display: block;

    margin-bottom: 8px;

    color: #27364d;

    font-weight: 700;
}


.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;

    padding: 14px 15px;

    border:
        1px solid
        var(--border);

    border-radius: 12px;

    background: #f9fbff;

    color: var(--text);

    outline: none;

    transition: 0.2s;
}


.form-group textarea {
    resize: vertical;
}


.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    background: white;

    border-color: var(--blue);

    box-shadow:
        0 0 0 4px
        rgba(
            37,
            99,
            235,
            0.11
        );
}


/* =====================================================
   PASSWORD
===================================================== */

.password-wrapper {
    position: relative;
}


.password-wrapper input {
    padding-right: 80px;
}


.password-toggle {
    position: absolute;

    top: 50%;
    right: 8px;

    transform:
        translateY(-50%);

    padding: 8px 11px;

    border: none;

    border-radius: 8px;

    background: #e9f1ff;

    color: var(--blue);

    font-weight: 700;
}


.password-toggle:hover {
    background: #dbe8ff;
}


/* =====================================================
   LOGIN OPTIONS
===================================================== */

.login-options {
    display: flex;

    justify-content: space-between;
    align-items: center;

    gap: 12px;
}


.remember-row {
    display: flex;

    align-items: center;

    gap: 8px;

    font-size: 14px;

    cursor: pointer;
}


.remember-row input {
    accent-color: var(--blue);
}


.forgot-password {
    border: none;

    background: none;

    color: var(--blue);

    font-weight: 700;
}


.forgot-password:hover {
    text-decoration: underline;
}


/* =====================================================
   ERROR MESSAGE
===================================================== */

.login-error {
    min-height: 24px;

    margin: 12px 0;

    color: var(--red);

    font-weight: 700;
}


/* =====================================================
   LOGIN BUTTON
===================================================== */

.login-button {
    width: 100%;

    padding: 15px;

    border: none;

    border-radius: 12px;

    background:
        linear-gradient(
            110deg,
            var(--blue),
            var(--purple)
        );

    color: white;

    font-weight: 800;

    box-shadow:
        0 14px 25px
        rgba(
            37,
            99,
            235,
            0.25
        );

    transition: 0.2s;
}


.login-button:hover {
    transform:
        translateY(-2px);

    box-shadow:
        0 18px 32px
        rgba(
            37,
            99,
            235,
            0.30
        );
}


/* =====================================================
   DEMO BOX
===================================================== */

.demo-box {
    margin-top: 25px;

    padding: 18px;

    border:
        1px solid
        #d8e3ff;

    border-radius: 15px;

    background:
        linear-gradient(
            120deg,
            #edf7ff,
            #f3efff
        );
}


.demo-box h3 {
    color: var(--navy);

    font-size: 15px;
}


.demo-box p {
    margin-top: 7px;
}


.demo-box strong {
    color: var(--blue);
}


/* =====================================================
   LOGIN FOOTER
===================================================== */

.login-footer {
    margin-top: 22px;

    padding-top: 18px;

    border-top:
        1px solid
        var(--border);

    color: var(--muted);

    text-align: center;
}


/* =====================================================
   TOAST
===================================================== */

.toast {
    position: fixed;

    right: 25px;
    bottom: 25px;

    max-width: 380px;

    padding: 15px 18px;

    border-radius: 12px;

    background: var(--navy);

    color: white;

    opacity: 0;

    transform:
        translateY(15px);

    pointer-events: none;

    transition: 0.25s;

    box-shadow: var(--shadow);

    z-index: 1000;
}


.toast.show {
    opacity: 1;

    transform:
        translateY(0);
}


/* =====================================================
   DASHBOARD
===================================================== */

.dashboard-page {
    background:
        linear-gradient(
            180deg,
            #edf4ff,
            #f8fbff
        );
}


/* =====================================================
   DASHBOARD HEADER
===================================================== */

.dashboard-header {
    position: sticky;

    top: 0;

    z-index: 100;

    display: flex;

    justify-content: space-between;
    align-items: center;

    padding:
        14px
        clamp(
            20px,
            4vw,
            55px
        );

    background:
        linear-gradient(
            100deg,
            #07182f,
            #123a68,
            #343d8f
        );

    color: white;

    box-shadow:
        0 8px 25px
        rgba(
            7,
            24,
            47,
            0.18
        );
}


/* =====================================================
   DASHBOARD LOGO
   SEPARATE FROM LOGIN LOGO
===================================================== */

.dashboard-brand {
    display: flex;

    align-items: center;

    gap: 12px;
}


.dashboard-brand .brand-logo.small {
    width: 42px;
    height: 42px;

    flex-shrink: 0;

    display: flex;

    align-items: center;
    justify-content: center;

    padding: 4px;

    border-radius: 10px;

    overflow: hidden;

    background:
        rgba(
            255,
            255,
            255,
            0.10
        );
}


.dashboard-brand .brand-logo.small img {
    width: 100%;
    height: 100%;

    object-fit: contain;

    display: block;
}


.dashboard-brand h1 {
    letter-spacing: 3px;

    font-size: 22px;
}


.dashboard-brand p {
    font-size: 13px;

    color:
        rgba(
            255,
            255,
            255,
            0.65
        );
}


/* =====================================================
   DASHBOARD USER
===================================================== */

.dashboard-user {
    display: flex;

    align-items: center;

    gap: 20px;
}


.signed-in-user {
    display: flex;

    flex-direction: column;

    text-align: right;
}


.signed-in-user span {
    font-size: 12px;

    color:
        rgba(
            255,
            255,
            255,
            0.65
        );
}


.logout-button {
    padding: 10px 16px;

    border:
        1px solid
        rgba(
            255,
            255,
            255,
            0.25
        );

    border-radius: 10px;

    background:
        rgba(
            255,
            255,
            255,
            0.10
        );

    color: white;

    font-weight: 700;
}


.logout-button:hover {
    background:
        rgba(
            255,
            255,
            255,
            0.20
        );
}


/* =====================================================
   DASHBOARD CONTAINER
===================================================== */

.dashboard-container {
    width:
        min(
            1320px,
            92%
        );

    margin:
        35px auto 70px;
}


/* =====================================================
   WELCOME BANNER
===================================================== */

.welcome-banner {
    display: flex;

    justify-content: space-between;
    align-items: center;

    gap: 25px;

    padding: 30px;

    border-radius: 24px;

    background:
        linear-gradient(
            110deg,
            var(--blue),
            var(--purple)
        );

    color: white;

    box-shadow:
        0 20px 45px
        rgba(
            91,
            54,
            214,
            0.22
        );
}


.welcome-banner h2 {
    margin-top: 7px;

    font-size:
        clamp(
            28px,
            4vw,
            42px
        );
}


.welcome-banner p {
    margin-top: 8px;

    color:
        rgba(
            255,
            255,
            255,
            0.77
        );
}


/* =====================================================
   LIVE TIME
===================================================== */

.live-time-card {
    min-width: 230px;

    padding: 18px 22px;

    border-radius: 17px;

    text-align: center;

    background:
        rgba(
            255,
            255,
            255,
            0.13
        );

    border:
        1px solid
        rgba(
            255,
            255,
            255,
            0.18
        );
}


.live-time-card span {
    display: block;

    font-size: 13px;
}


.live-time-card strong {
    display: block;

    margin-top: 5px;

    font-size: 25px;
}


/* =====================================================
   DASHBOARD SECTIONS
===================================================== */

.dashboard-section {
    margin-top: 24px;

    padding: 28px;

    border-radius: 22px;

    background: white;

    box-shadow:
        0 12px 35px
        rgba(
            7,
            24,
            47,
            0.08
        );
}


.section-heading {
    margin-bottom: 22px;
}


.section-heading h2 {
    margin-top: 5px;

    color: var(--navy);

    font-size: 25px;
}


.section-heading p {
    margin-top: 6px;

    color: var(--muted);
}


/* =====================================================
   PROFILE
===================================================== */

.profile-grid {
    display: grid;

    grid-template-columns:
        repeat(
            auto-fit,
            minmax(
                190px,
                1fr
            )
        );

    gap: 15px;
}


.profile-card {
    min-height: 128px;

    padding: 20px;

    display: flex;

    flex-direction: column;

    justify-content: space-between;

    border-radius: 17px;

    color: white;

    transition: 0.2s;
}


.profile-card:hover {
    transform:
        translateY(-3px);
}


.profile-card span {
    font-size: 13px;

    opacity: 0.8;
}


.profile-card strong {
    margin-top: 18px;

    font-size: 17px;
}


.blue-card {
    background:
        linear-gradient(
            135deg,
            #2563eb,
            #0ea5e9
        );
}


.purple-card {
    background:
        linear-gradient(
            135deg,
            #7c3aed,
            #a855f7
        );
}


.cyan-card {
    background:
        linear-gradient(
            135deg,
            #0891b2,
            #10b981
        );
}


.gold-card {
    background:
        linear-gradient(
            135deg,
            #f59e0b,
            #fbbf24
        );

    color: var(--navy);
}


.pink-card {
    background:
        linear-gradient(
            135deg,
            #ec4899,
            #f97316
        );
}


/* =====================================================
   TIME CLOCK
===================================================== */

.time-clock-grid {
    display: grid;

    grid-template-columns:
        0.8fr 1.2fr;

    gap: 18px;
}


.clock-status-card {
    padding: 24px;

    border-radius: 20px;

    background:
        linear-gradient(
            145deg,
            #07182f,
            #123f70
        );

    color: white;
}


.status-indicator {
    margin-top: 14px;

    display: flex;

    align-items: center;

    gap: 10px;

    padding: 13px 15px;

    border-radius: 13px;
}


.status-dot {
    width: 11px;
    height: 11px;

    border-radius: 50%;

    background: currentColor;

    box-shadow:
        0 0 12px
        currentColor;
}


.status-clocked-out {
    color: #ff7777;

    background:
        rgba(
            239,
            68,
            68,
            0.13
        );
}


.status-clocked-in {
    color: #46e5aa;

    background:
        rgba(
            16,
            185,
            129,
            0.15
        );
}


.status-break {
    color: #ffd05f;

    background:
        rgba(
            251,
            191,
            36,
            0.15
        );
}


.worked-time-box {
    margin-top: 25px;
}


.worked-time-box span {
    opacity: 0.65;
}


.worked-time-box strong {
    display: block;

    margin-top: 6px;

    font-size:
        clamp(
            30px,
            4vw,
            44px
        );
}


/* =====================================================
   TIME DETAILS
===================================================== */

.time-details-card {
    display: grid;

    grid-template-columns:
        repeat(
            3,
            1fr
        );

    gap: 12px;

    padding: 18px;

    border-radius: 20px;

    background:
        linear-gradient(
            145deg,
            #f3f8ff,
            #f0efff
        );

    border:
        1px solid
        #e0e7f5;
}


.time-detail {
    padding: 18px;

    border-radius: 15px;

    background: white;

    box-shadow:
        0 8px 22px
        rgba(
            7,
            24,
            47,
            0.06
        );
}


.time-detail span {
    display: block;

    color: var(--muted);

    font-size: 13px;
}


.time-detail strong {
    display: block;

    margin-top: 10px;

    color: var(--navy);

    font-size: 18px;
}


/* =====================================================
   CLOCK BUTTONS
===================================================== */

.clock-buttons {
    margin-top: 20px;

    display: grid;

    grid-template-columns:
        repeat(
            4,
            1fr
        );

    gap: 14px;
}


.clock-button {
    padding: 15px;

    border: none;

    border-radius: 12px;

    color: white;

    font-weight: 800;

    transition: 0.2s;
}


.clock-button:hover:not(:disabled) {
    transform:
        translateY(-2px);
}


.clock-button:disabled {
    opacity: 0.38;

    cursor: not-allowed;
}


.clock-in {
    background:
        linear-gradient(
            120deg,
            #10b981,
            #34d399
        );
}


.start-break {
    background:
        linear-gradient(
            120deg,
            #f59e0b,
            #f97316
        );
}


.end-break {
    background:
        linear-gradient(
            120deg,
            #06b6d4,
            #2563eb
        );
}


.clock-out {
    background:
        linear-gradient(
            120deg,
            #ef4444,
            #be123c
        );
}


/* =====================================================
   TABLE
===================================================== */

.table-wrapper {
    width: 100%;

    overflow-x: auto;

    border-radius: 14px;
}


.activity-table {
    width: 100%;

    border-collapse: collapse;
}


.activity-table thead {
    background:
        linear-gradient(
            100deg,
            var(--navy),
            #194979
        );

    color: white;
}


.activity-table th,
.activity-table td {
    padding: 14px 16px;

    text-align: left;

    border-bottom:
        1px solid
        var(--border);
}


.activity-table th {
    font-family:
        "Montserrat",
        sans-serif;

    font-size: 13px;
}


.activity-table tbody tr:hover {
    background: #f6f9ff;
}


/* =====================================================
   CORRECTION
===================================================== */

.correction-section {
    border-top:
        5px solid
        var(--gold);
}


.correction-button {
    padding: 14px 22px;

    border: none;

    border-radius: 12px;

    background:
        linear-gradient(
            110deg,
            var(--purple),
            var(--blue)
        );

    color: white;

    font-weight: 800;

    transition: 0.2s;
}


.correction-button:hover {
    transform:
        translateY(-2px);
}


/* =====================================================
   DASHBOARD FOOTER
===================================================== */

.dashboard-footer {
    padding: 25px;

    display: flex;

    justify-content: center;

    gap: 10px;

    flex-wrap: wrap;

    text-align: center;

    background: var(--navy);

    color:
        rgba(
            255,
            255,
            255,
            0.67
        );
}


.dashboard-footer strong {
    color: white;
}


/* =====================================================
   TABLET
===================================================== */

@media (max-width: 950px) {

    .login-container {
        grid-template-columns: 1fr;
    }


    .login-brand-section {
        padding: 30px 25px;
    }


    .brand-content {
        margin-top: 45px;
    }


    .login-form-section {
        padding: 30px 20px;
    }


    .time-clock-grid {
        grid-template-columns: 1fr;
    }


    .clock-buttons {
        grid-template-columns:
            repeat(
                2,
                1fr
            );
    }

}


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 650px) {

    /* LOGIN LOGO ON PHONE */

    .login-brand-section .brand-logo {
        width: 44px;
        height: 44px;

        padding: 4px;

        border-radius: 10px;
    }


    .brand h1 {
        font-size: 22px;
    }


    .brand p {
        font-size: 11px;
    }


    .login-card {
        padding: 27px 20px;
    }


    .login-options {
        flex-direction: column;

        align-items: flex-start;
    }


    .dashboard-header {
        gap: 15px;
    }


    .signed-in-user {
        display: none;
    }


    .welcome-banner {
        flex-direction: column;

        align-items: stretch;
    }


    .live-time-card {
        width: 100%;
    }


    .dashboard-section {
        padding: 20px;
    }


    .time-details-card {
        grid-template-columns: 1fr;
    }


    .clock-buttons {
        grid-template-columns: 1fr;
    }


    .profile-grid {
        grid-template-columns: 1fr;
    }

}
[styles.css](https://github.com/user-attachments/files/32257136/styles.css)






[Uploading dashboar// =====================================================
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
);d.js…]()
