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