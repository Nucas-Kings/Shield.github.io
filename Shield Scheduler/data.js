// =====================================================
// SHIELD SECURITY SERVICES
// SHARED SUPABASE DATA LAYER
// =====================================================

window.ShieldData = (function () {
    "use strict";

    let client = null;

    // =====================================================
    // SUPABASE CLIENT
    // =====================================================

    function getClient() {
        if (client) {
            return client;
        }

        const config =
            window.SHIELD_CONFIG || {};

        const supabaseUrl =
            String(
                config.SUPABASE_URL || ""
            ).trim();

        const publishableKey =
            String(
                config.SUPABASE_PUBLISHABLE_KEY || ""
            ).trim();

        if (
            !supabaseUrl ||
            !publishableKey ||
            supabaseUrl.includes(
                "PASTE_YOUR"
            ) ||
            publishableKey.includes(
                "PASTE_YOUR"
            )
        ) {
            throw new Error(
                "Supabase is not configured. Open config.js and add your Supabase Project URL and publishable key."
            );
        }

        if (
            !window.supabase ||
            typeof window.supabase
                .createClient !==
                "function"
        ) {
            throw new Error(
                "The Supabase JavaScript library did not load."
            );
        }

        client =
            window.supabase.createClient(
                supabaseUrl,
                publishableKey,
                {
                    auth: {
                        persistSession: true,
                        autoRefreshToken: true,
                        detectSessionInUrl: true
                    }
                }
            );

        return client;
    }

    // =====================================================
    // LOGIN EMAIL MAPPING
    // =====================================================

    function loginEmailFromAccountId(
        accountId
    ) {
        const config =
            window.SHIELD_CONFIG || {};

        const normalizedId =
            String(
                accountId || ""
            )
                .trim()
                .toUpperCase();

        const adminAccountId =
            String(
                config.ADMIN_ACCOUNT_ID ||
                "ADMIN-001"
            )
                .trim()
                .toUpperCase();

        const adminLoginEmail =
            String(
                config.ADMIN_LOGIN_EMAIL ||
                ""
            ).trim();

        // ---------------------------------------------
        // ADMIN
        // ---------------------------------------------

        if (
            normalizedId ===
                adminAccountId &&
            adminLoginEmail
        ) {
            return adminLoginEmail;
        }

        // ---------------------------------------------
        // EMPLOYEES
        //
        // SHIELD-123
        // becomes
        // shield-123@shield.local
        // ---------------------------------------------

        const safeEmployeeId =
            normalizedId
                .toLowerCase()
                .replace(
                    /[^a-z0-9._-]/g,
                    "-"
                );

        return (
            safeEmployeeId +
            "@shield.local"
        );
    }

    // =====================================================
    // AUTHENTICATION
    // =====================================================

    async function signIn(
        accountId,
        password
    ) {
        const supabase =
            getClient();

        const email =
            loginEmailFromAccountId(
                accountId
            );

        const {
            data,
            error
        } =
            await supabase.auth
                .signInWithPassword({
                    email,
                    password
                });

        if (error) {
            throw error;
        }

        return data;
    }

    async function signOut() {
        const {
            error
        } =
            await getClient()
                .auth
                .signOut();

        if (error) {
            throw error;
        }
    }

    async function getSession() {
        const {
            data,
            error
        } =
            await getClient()
                .auth
                .getSession();

        if (error) {
            throw error;
        }

        return (
            data.session ||
            null
        );
    }

    async function getAuthUser() {
        const {
            data,
            error
        } =
            await getClient()
                .auth
                .getUser();

        if (error) {
            return null;
        }

        return (
            data.user ||
            null
        );
    }

    // =====================================================
    // PROFILE
    // =====================================================

    async function getMyProfile() {
        const user =
            await getAuthUser();

        if (!user) {
            return null;
        }

        const {
            data,
            error
        } =
            await getClient()
                .from("profiles")
                .select(`
                    id,
                    employee_id,
                    full_name,
                    position,
                    account_type,
                    default_site_id,
                    site:sites!profiles_default_site_id_fkey(
                        id,
                        name
                    )
                `)
                .eq(
                    "id",
                    user.id
                )
                .maybeSingle();

        if (error) {
            throw error;
        }

        return mapProfile(
            data
        );
    }

    async function requireProfile(
        accountType
    ) {
        const profile =
            await getMyProfile();

        if (
            !profile ||
            profile.accountType !==
                accountType
        ) {
            try {
                await signOut();
            } catch (_) {}

            return null;
        }

        return profile;
    }

    async function verifyAdminCode(
        code
    ) {
        const {
            data,
            error
        } =
            await getClient()
                .rpc(
                    "verify_admin_code",
                    {
                        p_code:
                            String(
                                code ||
                                ""
                            )
                    }
                );

        if (error) {
            throw error;
        }

        return Boolean(data);
    }

    // =====================================================
    // EMPLOYEE ACCOUNTS
    // =====================================================

    async function getEmployees() {
        const {
            data,
            error
        } =
            await getClient()
                .from("profiles")
                .select(`
                    id,
                    employee_id,
                    full_name,
                    position,
                    account_type,
                    default_site_id,
                    site:sites!profiles_default_site_id_fkey(
                        id,
                        name
                    )
                `)
                .eq(
                    "account_type",
                    "employee"
                )
                .order(
                    "full_name",
                    {
                        ascending: true
                    }
                );

        if (error) {
            throw error;
        }

        return (
            data || []
        ).map(
            mapProfile
        );
    }

    // -----------------------------------------------------
    // CREATE EMPLOYEE
    // Calls Edge Function:
    // admin-create-employee
    // -----------------------------------------------------

    async function createEmployee(
        payload
    ) {
        return invokeAdminFunction(
            "admin-create-employee",
            payload
        );
    }

    // -----------------------------------------------------
    // UPDATE EMPLOYEE
    // Calls Edge Function:
    // admin-update-employee
    // -----------------------------------------------------

    async function updateEmployee(
        payload
    ) {
        return invokeAdminFunction(
            "admin-update-employee",
            payload
        );
    }

    // -----------------------------------------------------
    // DELETE EMPLOYEE
    // Calls Edge Function:
    // admin-delete-employee
    // -----------------------------------------------------

    async function deleteEmployee(
        userId
    ) {
        return invokeAdminFunction(
            "admin-delete-employee",
            {
                userId
            }
        );
    }

    // =====================================================
    // SITE MANAGEMENT
    // =====================================================

    async function getSites() {
        const {
            data,
            error
        } =
            await getClient()
                .from("sites")
                .select(`
                    id,
                    name,
                    address,
                    latitude,
                    longitude,
                    radius_meters,
                    geofence_enabled
                `)
                .order(
                    "name",
                    {
                        ascending: true
                    }
                );

        if (error) {
            throw error;
        }

        return (
            data || []
        ).map(
            mapSite
        );
    }

    async function saveSite(
        site
    ) {
        const row = {
            name:
                site.name,

            address:
                site.address ||
                null,

            latitude:
                site.latitude,

            longitude:
                site.longitude,

            radius_meters:
                site.radiusMeters,

            geofence_enabled:
                Boolean(
                    site.geofenceEnabled
                )
        };

        // ---------------------------------------------
        // UPDATE EXISTING SITE
        // ---------------------------------------------

        if (site.siteId) {
            const {
                data,
                error
            } =
                await getClient()
                    .from("sites")
                    .update(row)
                    .eq(
                        "id",
                        site.siteId
                    )
                    .select()
                    .single();

            if (error) {
                throw error;
            }

            return mapSite(
                data
            );
        }

        // ---------------------------------------------
        // CREATE NEW SITE
        // ---------------------------------------------

        const {
            data,
            error
        } =
            await getClient()
                .from("sites")
                .insert(row)
                .select()
                .single();

        if (error) {
            throw error;
        }

        return mapSite(
            data
        );
    }

    async function deleteSite(
        siteId
    ) {
        const {
            error
        } =
            await getClient()
                .from("sites")
                .delete()
                .eq(
                    "id",
                    siteId
                );

        if (error) {
            throw error;
        }
    }

    // =====================================================
    // SCHEDULES
    // =====================================================

    async function getSchedules() {
        const {
            data,
            error
        } =
            await getClient()
                .from("schedules")
                .select(`
                    id,
                    employee_user_id,
                    site_id,
                    shift_date,
                    start_time,
                    end_time,
                    starts_at,
                    ends_at,
                    notes,

                    employee:profiles!schedules_employee_user_id_fkey(
                        employee_id,
                        full_name,
                        position
                    ),

                    site:sites!schedules_site_id_fkey(
                        id,
                        name,
                        address
                    )
                `)
                .order(
                    "starts_at",
                    {
                        ascending: true
                    }
                );

        if (error) {
            throw error;
        }

        return (
            data || []
        ).map(
            mapSchedule
        );
    }

    async function saveSchedule(
        schedule
    ) {
        const times =
            buildShiftTimestamps(
                schedule.date,
                schedule.startTime,
                schedule.endTime
            );

        const row = {
            employee_user_id:
                schedule.employeeUserId,

            site_id:
                schedule.siteId,

            shift_date:
                schedule.date,

            start_time:
                schedule.startTime,

            end_time:
                schedule.endTime,

            starts_at:
                times.start
                    .toISOString(),

            ends_at:
                times.end
                    .toISOString(),

            notes:
                schedule.notes ||
                null
        };

        // ---------------------------------------------
        // UPDATE SHIFT
        // ---------------------------------------------

        if (schedule.id) {
            const {
                data,
                error
            } =
                await getClient()
                    .from(
                        "schedules"
                    )
                    .update(row)
                    .eq(
                        "id",
                        schedule.id
                    )
                    .select()
                    .single();

            if (error) {
                throw error;
            }

            return data;
        }

        // ---------------------------------------------
        // CREATE SHIFT
        // ---------------------------------------------

        const {
            data,
            error
        } =
            await getClient()
                .from(
                    "schedules"
                )
                .insert(row)
                .select()
                .single();

        if (error) {
            throw error;
        }

        return data;
    }

    async function deleteSchedule(
        scheduleId
    ) {
        const {
            error
        } =
            await getClient()
                .from(
                    "schedules"
                )
                .delete()
                .eq(
                    "id",
                    scheduleId
                );

        if (error) {
            throw error;
        }
    }

    // =====================================================
    // TIME ENTRIES / ATTENDANCE
    // =====================================================

    async function getTimeEntries() {
        const {
            data,
            error
        } =
            await getClient()
                .from(
                    "time_entries"
                )
                .select(`
                    id,
                    employee_user_id,
                    schedule_id,
                    clock_in_at,
                    clock_out_at,
                    status,
                    clock_out_type,
                    created_at,

                    employee:profiles!time_entries_employee_user_id_fkey(
                        employee_id,
                        full_name
                    ),

                    schedule:schedules!time_entries_schedule_id_fkey(
                        id,
                        shift_date,
                        start_time,
                        end_time,
                        starts_at,
                        ends_at,
                        site_id,

                        site:sites!schedules_site_id_fkey(
                            id,
                            name,
                            address
                        )
                    ),

                    breaks(
                        id,
                        started_at,
                        ended_at
                    )
                `)
                .order(
                    "clock_in_at",
                    {
                        ascending: false
                    }
                );

        if (error) {
            throw error;
        }

        return (
            data || []
        ).map(
            mapTimeEntry
        );
    }

    // =====================================================
    // CLOCK RPC FUNCTIONS
    // =====================================================

    async function applyDueAutoClockOuts() {
        const {
            data,
            error
        } =
            await getClient()
                .rpc(
                    "apply_due_auto_clockouts"
                );

        if (error) {
            throw error;
        }

        return data;
    }

    async function clockIn(
        scheduleId
    ) {
        const {
            data,
            error
        } =
            await getClient()
                .rpc(
                    "clock_in",
                    {
                        p_schedule_id:
                            scheduleId
                    }
                );

        if (error) {
            throw error;
        }

        return data;
    }

    async function startBreak(
        timeEntryId
    ) {
        const {
            data,
            error
        } =
            await getClient()
                .rpc(
                    "start_break",
                    {
                        p_time_entry_id:
                            timeEntryId
                    }
                );

        if (error) {
            throw error;
        }

        return data;
    }

    async function endBreak(
        timeEntryId
    ) {
        const {
            data,
            error
        } =
            await getClient()
                .rpc(
                    "end_break",
                    {
                        p_time_entry_id:
                            timeEntryId
                    }
                );

        if (error) {
            throw error;
        }

        return data;
    }

    async function clockOut(
        timeEntryId
    ) {
        const {
            data,
            error
        } =
            await getClient()
                .rpc(
                    "clock_out",
                    {
                        p_time_entry_id:
                            timeEntryId
                    }
                );

        if (error) {
            throw error;
        }

        return data;
    }

    // =====================================================
    // EDGE FUNCTION CALLER
    // =====================================================

    async function invokeAdminFunction(
        functionName,
        body
    ) {
        const supabase =
            getClient();

        // ---------------------------------------------
        // GET CURRENT LOGIN SESSION
        // ---------------------------------------------

        const {
            data: sessionData,
            error: sessionError
        } =
            await supabase.auth
                .getSession();

        if (sessionError) {
            throw sessionError;
        }

        let session =
            sessionData.session;

        if (!session) {
            throw new Error(
                "Your login session has expired. Please sign in again."
            );
        }

        // ---------------------------------------------
        // REFRESH SESSION IF NEEDED
        // ---------------------------------------------

        const expiresAt =
            session.expires_at
                ? session.expires_at *
                  1000
                : 0;

        if (
            expiresAt &&
            expiresAt -
                Date.now() <
                60000
        ) {
            const {
                data: refreshed,
                error: refreshError
            } =
                await supabase.auth
                    .refreshSession();

            if (refreshError) {
                throw refreshError;
            }

            session =
                refreshed.session;

            if (!session) {
                throw new Error(
                    "Your login session has expired. Please sign in again."
                );
            }
        }

        const accessToken =
            session.access_token;

        if (!accessToken) {
            throw new Error(
                "Your login session is missing an access token."
            );
        }

        const config =
            window.SHIELD_CONFIG;

        const functionUrl =
            `${config.SUPABASE_URL}/functions/v1/${functionName}`;

        let response;

        try {
            response =
                await fetch(
                    functionUrl,
                    {
                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${accessToken}`,

                            "apikey":
                                config
                                    .SUPABASE_PUBLISHABLE_KEY
                        },

                        body:
                            JSON.stringify(
                                body
                            )
                    }
                );

        } catch (networkError) {
            console.error(
                "EDGE FUNCTION NETWORK ERROR:",
                networkError
            );

            throw new Error(
                `Could not reach the ${functionName} server function. Make sure the Edge Function is deployed in Supabase.`
            );
        }

        let result = {};

        try {
            result =
                await response.json();

        } catch (_) {
            result = {};
        }

        if (!response.ok) {
            throw new Error(
                result.error ||
                result.message ||
                `${functionName} failed with status ${response.status}.`
            );
        }

        return result;
    }

    // =====================================================
    // PROFILE MAPPER
    // =====================================================

    function mapProfile(
        row
    ) {
        if (!row) {
            return null;
        }

        return {
            userId:
                row.id,

            employeeId:
                row.employee_id,

            name:
                row.full_name,

            position:
                row.position,

            accountType:
                row.account_type,

            defaultSiteId:
                row.default_site_id,

            defaultSiteName:
                row.site?.name ||
                ""
        };
    }

    // =====================================================
    // SITE MAPPER
    // =====================================================

    function mapSite(
        row
    ) {
        return {
            siteId:
                row.id,

            name:
                row.name,

            address:
                row.address ||
                "",

            latitude:
                row.latitude ===
                null
                    ? null
                    : Number(
                        row.latitude
                    ),

            longitude:
                row.longitude ===
                null
                    ? null
                    : Number(
                        row.longitude
                    ),

            radiusMeters:
                Number(
                    row.radius_meters ||
                    200
                ),

            geofenceEnabled:
                Boolean(
                    row.geofence_enabled
                )
        };
    }

    // =====================================================
    // SCHEDULE MAPPER
    // =====================================================

    function mapSchedule(
        row
    ) {
        return {
            id:
                row.id,

            employeeUserId:
                row.employee_user_id,

            employeeId:
                row.employee
                    ?.employee_id ||
                "",

            employeeName:
                row.employee
                    ?.full_name ||
                "",

            position:
                row.employee
                    ?.position ||
                "",

            siteId:
                row.site_id,

            siteName:
                row.site
                    ?.name ||
                "",

            siteAddress:
                row.site
                    ?.address ||
                "",

            date:
                row.shift_date,

            startTime:
                String(
                    row.start_time ||
                    ""
                ).slice(
                    0,
                    5
                ),

            endTime:
                String(
                    row.end_time ||
                    ""
                ).slice(
                    0,
                    5
                ),

            startsAt:
                row.starts_at,

            endsAt:
                row.ends_at,

            notes:
                row.notes ||
                ""
        };
    }

    // =====================================================
    // TIME ENTRY MAPPER
    // =====================================================

    function mapTimeEntry(
        row
    ) {
        const breaks =
            (
                row.breaks ||
                []
            ).map(
                mapBreak
            );

        return {
            id:
                row.id,

            employeeUserId:
                row.employee_user_id,

            employeeId:
                row.employee
                    ?.employee_id ||
                "",

            employeeName:
                row.employee
                    ?.full_name ||
                "",

            scheduleId:
                row.schedule_id,

            date:
                row.schedule
                    ?.shift_date ||
                "",

            siteId:
                row.schedule
                    ?.site_id ||
                "",

            siteName:
                row.schedule
                    ?.site
                    ?.name ||
                "",

            siteAddress:
                row.schedule
                    ?.site
                    ?.address ||
                "",

            scheduledStart:
                String(
                    row.schedule
                        ?.start_time ||
                    ""
                ).slice(
                    0,
                    5
                ),

            scheduledEnd:
                String(
                    row.schedule
                        ?.end_time ||
                    ""
                ).slice(
                    0,
                    5
                ),

            startsAt:
                row.schedule
                    ?.starts_at ||
                null,

            endsAt:
                row.schedule
                    ?.ends_at ||
                null,

            clockIn:
                row.clock_in_at,

            clockOut:
                row.clock_out_at,

            status:
                row.status,

            clockOutType:
                row.clock_out_type,

            createdAt:
                row.created_at,

            breaks
        };
    }

    // =====================================================
    // BREAK MAPPER
    // =====================================================

    function mapBreak(
        row
    ) {
        return {
            id:
                row.id,

            startedAt:
                row.started_at,

            endedAt:
                row.ended_at
        };
    }

    // =====================================================
    // SHIFT TIME BUILDER
    // =====================================================

    function buildShiftTimestamps(
        date,
        startTime,
        endTime
    ) {
        const start =
            new Date(
                `${date}T${startTime}:00`
            );

        const end =
            new Date(
                `${date}T${endTime}:00`
            );

        // Overnight shift:
        // Example:
        // 6 PM → 2 AM
        if (end <= start) {
            end.setDate(
                end.getDate() +
                1
            );
        }

        return {
            start,
            end
        };
    }

    // =====================================================
    // PUBLIC API
    // =====================================================

    return {
        // Client
        getClient,

        // Authentication
        signIn,
        signOut,
        getSession,
        getAuthUser,

        // Profile
        getMyProfile,
        requireProfile,
        verifyAdminCode,

        // Employees
        getEmployees,
        createEmployee,
        updateEmployee,
        deleteEmployee,

        // Sites
        getSites,
        saveSite,
        deleteSite,

        // Schedules
        getSchedules,
        saveSchedule,
        deleteSchedule,

        // Attendance
        getTimeEntries,

        // Time Clock
        applyDueAutoClockOuts,
        clockIn,
        startBreak,
        endBreak,
        clockOut
    };
})();