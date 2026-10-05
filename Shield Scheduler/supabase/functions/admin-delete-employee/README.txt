README.txt

SHIELD SECURITY SERVICES — SUPABASE / SHARED DATABASE VERSION
=============================================================

THIS IS THE NEW MASTER VERSION.

WHAT CHANGED
------------
The old SHIELD project saved employees, sites, schedules and time entries in browser localStorage.
This version stores the important SHIELD records in a shared Supabase PostgreSQL database.

That means:
- An admin can create a schedule on one computer.
- The employee can see it on a different phone/computer.
- The employee can clock in/out on their device.
- The admin can see that same attendance record from another device.
- Sites and employee accounts are shared across devices.

The only browser-side storage that may remain is the optional remembered account ID and the Supabase login session token. Business records are in the database.

PROJECT FILES
-------------
index.html
admin.html
employee.html
styles.css
config.js
login.js
data.js
admin.js
employee.js
images/LOGO.png
supabase_setup.sql
seed_admin.sql
supabase/functions/admin-create-employee/index.ts
supabase/functions/admin-delete-employee/index.ts

GEOFENCE STATUS
---------------
Site address, latitude, longitude, radius and geofence enabled/disabled settings are stored in the database.
Actual GPS restriction of the Clock In button is intentionally NOT activated yet. That remains the final feature.

STEP 1 — CREATE A SUPABASE PROJECT
----------------------------------
Create a Supabase project.

STEP 2 — CREATE DATABASE TABLES + SECURITY
------------------------------------------
Open Supabase SQL Editor and run the full contents of:

    supabase_setup.sql

This creates:
- profiles
- sites
- schedules
- time_entries
- breaks
- admin_secrets
- Row Level Security policies
- secure clock-in / break / clock-out database functions
- starter sites including VECTOR

STEP 3 — CREATE THE FIRST ADMIN AUTH USER
-----------------------------------------
In Supabase Dashboard -> Authentication -> Users, create a user manually:

    Email: admin-001@shield.local
    Password: choose your administrator password
    Auto-confirm user/email: ON

The login screen still lets you type ADMIN-001. The app converts the account ID internally to the synthetic authentication email.

Then run:

    seed_admin.sql

The starter admin code in that SQL file is:

    SHIELD-2026

Change the admin code in seed_admin.sql before running it if you want a different code.

STEP 4 — DEPLOY THE TWO ADMIN EDGE FUNCTIONS
--------------------------------------------
These functions create/delete Supabase Auth employee accounts without putting the secret service-role key in the browser.

With the Supabase CLI configured for your project, deploy:

    supabase functions deploy admin-create-employee
    supabase functions deploy admin-delete-employee

Never put SUPABASE_SERVICE_ROLE_KEY in config.js, HTML, or browser JavaScript.

STEP 5 — CONNECT THE WEBSITE
----------------------------
Open config.js and replace:

    PASTE_YOUR_SUPABASE_PROJECT_URL_HERE
    PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE

Use the Project URL and PUBLISHABLE key from your Supabase project API settings.
Do NOT use a service-role/secret key in config.js.

STEP 6 — TEST LOCALLY
---------------------
Use VS Code Live Server or another local web server.
Open index.html through http://localhost/... instead of double-clicking the file when possible.

Sign in as Administrator:

    Account Type: Administrator
    Admin ID: ADMIN-001
    Admin Code: the code from seed_admin.sql
    Password: the password you chose when creating the Auth user

Then use Admin -> Add Employee to create employee accounts.

STEP 7 — TEST ON TWO DEVICES
----------------------------
After publishing the website:
1. Log in as admin on your computer.
2. Create an employee and schedule.
3. Log in as that employee from another browser/phone.
4. Confirm the schedule appears.
5. Clock in/out.
6. Refresh the admin Time & Attendance table.

The admin dashboard also refreshes shared schedule/attendance data every 10 seconds while open.

TIME CLOCK
----------
Clock actions use secure PostgreSQL RPC functions and server timestamps:
- Clock In
- Start Break
- End Break
- Clock Out

Each completed time entry calculates:
- Clock In
- Clock Out
- Break Duration
- Total Time On Site
- Actual Worked Hours
- Manual or Automatic Clock-Out

The automatic deadline is scheduled shift end + 30 minutes. If no portal is open exactly at the deadline, the next SHIELD attendance refresh closes the entry using the intended deadline timestamp rather than the later refresh time.

SECURITY NOTES
--------------
- Passwords are handled by Supabase Auth and are not readable from the Admin dashboard.
- Row Level Security prevents normal employees from reading other employees' schedules/timesheets.
- Administrator-only employee creation/deletion runs server-side through Edge Functions.
- The browser uses only the Supabase publishable key.
- The service-role key remains server-side only.
- For real deployment, choose strong passwords and change the starter admin code.

HOSTING
-------
After Supabase is connected and tested, these website files can be uploaded to your hosting /htdocs directory for shield.nucaskings.site.
The Supabase database is separate from the Domain.com/Network Solutions hosting storage.