// =====================================================
// SHIELD SECURITY SERVICES
// SUPABASE LOGIN
// =====================================================

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const loginForm = document.getElementById("loginForm");
    const accountType = document.getElementById("accountType");
    const accountIdLabel = document.getElementById("accountIdLabel");
    const accountId = document.getElementById("accountId");
    const adminCodeGroup = document.getElementById("adminCodeGroup");
    const adminCode = document.getElementById("adminCode");
    const password = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    const rememberMe = document.getElementById("rememberMe");
    const loginError = document.getElementById("loginError");
    const submitButton = loginForm.querySelector('button[type="submit"]');

    const rememberedType = localStorage.getItem("shieldRememberedType");
    const rememberedId = localStorage.getItem("shieldRememberedId");

    if (
        rememberedType === "admin" ||
        rememberedType === "employee"
    ) {
        accountType.value = rememberedType;
    }

    if (rememberedId) {
        accountId.value = rememberedId;
        rememberMe.checked = true;
    }

    updateLoginMode();

    accountType.addEventListener("change", function () {
        loginError.textContent = "";
        updateLoginMode();
    });

    togglePassword.addEventListener("click", function () {
        const showing = password.type === "text";

        password.type = showing ? "password" : "text";
        togglePassword.textContent = showing ? "Show" : "Hide";
    });

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        loginError.textContent = "";

        const type = accountType.value;
        const enteredId = accountId.value
            .trim()
            .toUpperCase();

        const enteredPassword = password.value;

        if (!enteredId || !enteredPassword) {
            return showError(
                "Please complete all required fields."
            );
        }

        if (
            type === "admin" &&
            !adminCode.value.trim()
        ) {
            return showError(
                "Please enter the admin code."
            );
        }

        setBusy(true);

        try {
            await ShieldData.signIn(
                enteredId,
                enteredPassword
            );

            const profile =
                await ShieldData.getMyProfile();

            if (
                !profile ||
                profile.employeeId.toUpperCase() !==
                    enteredId ||
                profile.accountType !== type
            ) {
                await ShieldData.signOut();

                throw new Error(
                    "This account does not match the selected account type."
                );
            }

            if (type === "admin") {
                const validCode =
                    await ShieldData.verifyAdminCode(
                        adminCode.value.trim()
                    );

                if (!validCode) {
                    await ShieldData.signOut();

                    throw new Error(
                        "Invalid administrator code."
                    );
                }
            }

            saveRememberedLogin(
                type,
                enteredId
            );

            window.location.href =
                type === "admin"
                    ? "./admin.html"
                    : "./employee.html";

        } catch (error) {
            try {
                await ShieldData.signOut();
            } catch (_) {}

            showError(
                friendlyError(error)
            );

        } finally {
            setBusy(false);
        }
    });

    function updateLoginMode() {
        if (accountType.value === "admin") {
            accountIdLabel.textContent =
                "Admin ID";

            accountId.placeholder =
                "ADMIN-001";

            adminCodeGroup.classList.remove(
                "hidden"
            );

            adminCode.required = true;

        } else {
            accountIdLabel.textContent =
                "Employee ID";

            accountId.placeholder =
                "SHIELD-123";

            adminCodeGroup.classList.add(
                "hidden"
            );

            adminCode.required = false;
            adminCode.value = "";
        }
    }

    function saveRememberedLogin(type, id) {
        if (rememberMe.checked) {
            localStorage.setItem(
                "shieldRememberedType",
                type
            );

            localStorage.setItem(
                "shieldRememberedId",
                id
            );

        } else {
            localStorage.removeItem(
                "shieldRememberedType"
            );

            localStorage.removeItem(
                "shieldRememberedId"
            );
        }
    }

    function setBusy(busy) {
        submitButton.disabled = busy;

        submitButton.textContent =
            busy
                ? "Signing In..."
                : "Secure Login";
    }

    function showError(message) {
        loginError.textContent = message;
    }

    function friendlyError(error) {
        const message = String(
            error?.message ||
            error ||
            "Login failed."
        );

        if (
            /invalid login credentials/i.test(
                message
            )
        ) {
            return "Invalid employee/admin ID or password.";
        }

        if (
            /Supabase is not configured/i.test(
                message
            )
        ) {
            return message;
        }

        return message;
    }
});