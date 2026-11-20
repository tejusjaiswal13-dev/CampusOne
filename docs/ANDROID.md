# Android builds

Requirements: Java 21, Android SDK matching android/variables.gradle and ANDROID_HOME pointing to that SDK. Native plugin compilation was checked with local tooling; phone runtime is a separate test.

## Debug APK (emulator)

Run the server on the host. Android emulator's host address is `10.0.2.2`, not localhost. In PowerShell:

```powershell
$env:VITE_API_URL='http://10.0.2.2:3001/api'
$env:VITE_DEMO_MODE='true'
$env:CAMPUS_ALLOW_HTTP='true'
npm run build
npx cap sync android
android\gradlew.bat -p android assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`. `CAMPUS_ALLOW_HTTP=true` enables WebView mixed HTTP content for local evaluation; cleartext permission is in the debug-only Android manifest. Never use HTTP for a public deployment. To test a physical phone, use an HTTPS server URL reachable from the phone, or explicitly configure a local development LAN address; localhost on a phone is the phone itself. Ensure the configured server CORS origins include `https://localhost` (Capacitor Android origin). No database or AI key belongs in the APK.

The bundled frontend API URL is fixed at build time. Restarting only the server does not change it. If unreachable and VITE_DEMO_MODE=true, the app falls back to the separate offline demo dataset.

## Physical phone on the same Wi-Fi (local demo)

1. Connect the laptop and phone to the same trusted Wi-Fi. In PowerShell run `ipconfig` and note the active **Wi-Fi adapter IPv4 Address** (the address observed during the 19 November 2026 audit was `192.168.31.198`; it may change).
2. In the project folder, configure and build a debug app for that address. Replace the example IP with the current address:

```powershell
$env:VITE_API_URL='http://192.168.31.198:3001/api'
$env:VITE_DEMO_MODE='true'
$env:CAMPUS_ALLOW_HTTP='true'
npm run build
npx cap sync android
android\gradlew.bat -p android assembleDebug
```

3. Start the server in another PowerShell window with the same `.env` and valid local `JWT_SECRET`/`DEMO_PASSWORD`: `npm run server`. The server binds to `0.0.0.0`; the app's API requests use the Wi-Fi IP above.
4. If Windows Firewall blocks the connection, add a **Private profile** inbound TCP rule for port 3001, limited to the local subnet. An administrator can use Windows Defender Firewall's Advanced Settings UI. Remove/disable the rule after the demo. Do not expose this HTTP development server on a public network.
5. Install `android\app\build\outputs\apk\debug\app-debug.apk` by copying it to the phone and opening it, or with USB debugging enabled run `adb install -r android\app\build\outputs\apk\debug\app-debug.apk`.
6. On the phone, open the app, sign in, then create a notice on the admin device and refresh notices on the student device. This is request/refresh synchronization, not realtime push. Verify the new notice appears before describing the workflow as successful.

Troubleshoot by confirming both devices are on the same Wi-Fi, the laptop IP has not changed, the API responds at `http://<laptop-ip>:3001/api/health` from the phone browser, the server is running, and Windows Firewall permits the private-network port. If the health check or cross-device notice test fails, use the visible offline demo mode and report LAN synchronization as unverified. Never set the phone API URL to `localhost` or emulator-only `10.0.2.2`.

## Signed release APK

Create your own keystore locally using keytool or Android Studio. Do not commit it or its passwords. Put signing properties in your user-level `%USERPROFILE%\.gradle\gradle.properties`, not this repository's tracked gradle.properties:

```properties
CAMPUSONE_STORE_FILE=C:/private/campusone-release.jks
CAMPUSONE_STORE_PASSWORD=<local password>
CAMPUSONE_KEY_ALIAS=<local alias>
CAMPUSONE_KEY_PASSWORD=<local password>
```

Use an HTTPS API endpoint and disable offline demo and mixed content:

```powershell
$env:VITE_API_URL='https://YOUR_API_HOST/api'
$env:VITE_DEMO_MODE='false'
$env:CAMPUS_ALLOW_HTTP='false'
npm run build
npx cap sync android
android\gradlew.bat -p android assembleRelease
```

With signing configured: `android/app/build/outputs/apk/release/app-release.apk`. Without signing properties, Gradle produces an unsigned release artifact, which is not a signed delivery. Release signing has not been executed for this project delivery. Never publish the seeded demo accounts.

Native features: status/splash/back button, share notices, opt-in local reminders. Notifications are scheduled from loaded data only when the user configures them; they are not remote pushes and are not automatically refreshed in the background. Logout clears pending/delivered native reminders. Test Android notification permission denial, back navigation and sharing on your own device before submission.
