# Prime Ministers of India

An Expo React Native application for browsing and maintaining a list of the Prime Ministers of India. The app runs on Android, iOS, and the web. Each record contains an ID, name, term information, and an image URL.

## What the app does

The app has two bottom tabs:

- **PM List** displays the saved Prime Minister records as cards with an image, name, and term.
- **Edit Info** lets the user select a record, edit its name, term, or image URL, save the changes, or restore the default records.

The interface is intentionally local-first. There is no backend or account system. Data is stored with React Native AsyncStorage, so changes remain available after the app is restarted on the same device or browser.

## Technology

- Expo SDK 42
- React Native
- React Navigation bottom tabs and native stack
- TypeScript 6.0.3
- AsyncStorage for local persistence
- React Native Web for browser support
- Jest and `jest-expo` for tests

## Requirements

- Node.js and npm
- A web browser, Android emulator/device, or iOS simulator/device
- Android Studio for Android development
- Xcode for iOS development on macOS

This is an older Expo project. If Metro reports an OpenSSL error with a newer Node.js version, run this before starting Expo:

```bash
export NODE_OPTIONS=--openssl-legacy-provider
```

## Installation

Open a terminal in the project directory and install the dependencies:

```bash
npm install
```

## Running the app

Start the Expo development server:

```bash
npm start
```

The Expo terminal menu can then open the project on a connected device or simulator. The following scripts start a specific target directly:

```bash
NODE_OPTIONS=--openssl-legacy-provider npm run web
npm run android
npm run ios
```

For browser development, the OpenSSL compatibility variable is included because Expo SDK 42 uses an older Metro toolchain. Expo prints a local URL such as `http://localhost:19006`, although the port can change if it is already in use. To access the web app from another device on the same network, use the network URL printed by Expo and make sure the development machine's firewall allows the port.

## Build and export

This project uses the Expo SDK 42 managed workflow. The legacy Expo build service requires an Expo account and may ask you to configure Android or iOS signing credentials during the first build.

Log in before creating a native build:

```bash
npx expo login
```

Create an Android app bundle for store distribution:

```bash
npx expo build:android -t app-bundle
```

Create an Android APK for direct testing or sideloading:

```bash
npx expo build:android -t apk
```

Create an iOS build:

```bash
npx expo build:ios
```

Export the web application as static files:

```bash
NODE_OPTIONS=--openssl-legacy-provider npx expo export:web
```

The web export is written to the `web-build/` directory. The native build commands upload the project to Expo's classic build service and provide a build URL when the build is complete. Native store submission, certificates, package identifiers, and app-store metadata must be configured separately.

The commands above are for this older Expo SDK 42 project. Newer Expo projects generally use EAS Build, but upgrading to a newer Expo SDK should be treated as a separate migration because it can require changes to React Native, navigation, and native configuration.

## Application flow

The application starts in `App.tsx`:

1. `useCachedResources` loads fonts and other cached resources.
2. The app waits until resource loading is complete.
3. `SafeAreaProvider` supplies safe-area support for mobile layouts.
4. `Navigation` creates the navigation container and the bottom-tab navigator.
5. The PM List tab is selected as the initial screen.

The navigation is defined in `navigation/index.tsx`. The root stack contains the bottom tabs, and each tab points to one screen:

```text
Root stack
	-> PM List tab   -> TabOneScreen -> PMList
	-> Edit Info tab -> TabTwoScreen
```

## PM List screen

The list UI is implemented in `components/PMofIndia/PMList.tsx` and rendered by `screens/TabOneScreen.tsx`.

When the screen mounts:

1. It calls `readPmList()` from `services/pmData.ts`.
2. The returned records are stored in component state.
3. A `FlatList` renders one card for each record.
4. Each card displays the remote image, PM name, and term information.

`FlatList` is used instead of manually rendering every item so the list can handle longer data sets efficiently. The header also shows the current number of records.

## Edit Info screen

The editor is implemented in `screens/TabTwoScreen.tsx`.

When the screen mounts, it loads the same data source as the list screen and selects the first record. The left panel contains the available records. Selecting a row changes `selectedId`, which determines the record shown in the form on the right.

The editable fields are:

- `name`: the PM's display name
- `term`: one or more term date ranges
- `url`: the image URL used by the list card

Changing an input updates the local React state immediately. These changes are only written to persistent storage when **Save** is pressed.

### Saving changes

The Save button calls `savePmList(items)`. The complete current array is serialized with `JSON.stringify` and written to AsyncStorage. A success alert confirms the operation.

### Resetting changes

The **Reset to default** button calls `resetPmList()`. This replaces the saved data with a fresh copy of `data/pmList.json`, updates the editor state, selects the first record, and displays a reset confirmation.

## Data and persistence

The default records are stored in `data/pmList.json`. Each item follows this shape:

```json
{
	"id": "jawaharlal-nehru",
	"name": "Jawaharlal Nehru",
	"term": "15 August, 1947 - 27 May, 1964",
	"url": "https://example.com/image.jpg"
}
```

`services/pmData.ts` is the single data-access layer. It defines the `PMItemType` type and these functions:

- `readPmList()` reads the AsyncStorage value. If no saved value exists, or the value is invalid or empty, it returns the JSON defaults.
- `savePmList(items)` stores the current array under the key `pm_india_list_v1`.
- `resetPmList()` copies the JSON defaults into AsyncStorage and returns them.

Important: editing the app does not modify `data/pmList.json` directly. That file is bundled default data. User edits are stored in AsyncStorage instead.

The storage behavior when either data screen mounts is:

```text
Data screen mounts
	-> read AsyncStorage
			-> valid saved list: use saved list
			-> missing or invalid list: use data/pmList.json

Save
	-> serialize current state
	-> write to AsyncStorage

Reset
	-> load JSON defaults
	-> overwrite AsyncStorage
```

## Project structure

```text
App.tsx
	Application entry point and resource-loading gate

components/PMofIndia/PMList.tsx
	PM List card layout and list rendering

screens/TabOneScreen.tsx
	Screen wrapper for the PM List tab

screens/TabTwoScreen.tsx
	Edit Info screen, form state, save, and reset actions

navigation/index.tsx
	Navigation container, root stack, and bottom tabs

navigation/LinkingConfiguration.ts
	Deep-linking configuration for navigation routes

services/pmData.ts
	PM type definition, AsyncStorage access, defaults, and reset logic

data/pmList.json
	Default PM records bundled with the app

constants/
	Shared colors and layout constants

hooks/
	Cached-resource loading and color-scheme hooks

assets/
	Fonts and image assets used by the project

types.tsx
	TypeScript navigation parameter types

package.json
	Dependencies and npm scripts
```

## Useful commands

Type-check the project without generating build files:

```bash
npx tsc --noEmit
```

Run the configured tests once:

```bash
npm test
```

Clear the Metro cache if the app shows stale code or bundling behaves unexpectedly:

```bash
npx expo start --clear
```

Reinstall dependencies if `node_modules` is incomplete or corrupted:

```bash
rm -rf node_modules
npm install
```

## Troubleshooting

### The app does not start

Check that dependencies are installed, then try the OpenSSL compatibility setting and start Expo again:

```bash
export NODE_OPTIONS=--openssl-legacy-provider
npm start
```

### The list is empty

The app falls back to `data/pmList.json` when AsyncStorage is missing or invalid. Use **Reset to default** from the Edit Info tab to restore the saved list. Also check that the JSON file remains valid and contains a non-empty array.

### Images do not appear

Images are loaded from the `url` field over the network. Check the URL in the Edit Info tab and verify that the device or browser has internet access. A record can still appear in the list even if its image URL is unavailable.

### TypeScript reports JSX or compile errors

Run the type checker from the project directory:

```bash
npx tsc --noEmit
```

Also confirm that `tsconfig.json` contains the React Native JSX setting and that dependencies have been installed.

## License

This project is for demonstration and learning purposes.
