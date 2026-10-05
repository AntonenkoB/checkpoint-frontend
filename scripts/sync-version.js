const fs = require('fs').promises;
const path = require('path');

const PACKAGE_JSON_PATH = path.resolve(__dirname, '../package.json');
const ANGULAR_ENV_PATH = path.resolve(__dirname, '../src/environments/environment.ts');
const ANGULAR_ENV_PROD_PATH = path.resolve(__dirname, '../src/environments/environment.prod.ts');
const XCODE_PROJECT_PATH = path.resolve(__dirname, '../ios/App/App.xcodeproj/project.pbxproj');
const ANDROID_GRADLE_PATH = path.resolve(__dirname, '../android/app/build.gradle');

const isReleaseMode = process.argv.includes('--release');

function generateBuildHash() {
  const PROJECT_START_EPOCH = new Date('2026-01-01T00:00:00Z').getTime();
  return Math.floor((Date.now() - PROJECT_START_EPOCH) / 1000);
}

async function syncVersion() {
  try {
    const packageJsonContent = await fs.readFile(PACKAGE_JSON_PATH, 'utf8');
    const { version: rootVersion } = JSON.parse(packageJsonContent);

    if (!/^\d+\.\d+\.\d+$/.test(rootVersion)) {
      throw new Error(`Invalid version format: "${rootVersion}"`);
    }

    const nextBuildNumber = generateBuildHash();

    const angularVersion = isReleaseMode ? rootVersion : `${rootVersion}-dev.${nextBuildNumber}`;

    console.log(`✈️ Syncing project versions [Mode: ${isReleaseMode ? 'RELEASE' : 'DEV'}]...`);

    // release-збірка бере environment.prod.ts (fileReplacements у angular.json)
    const envPath = isReleaseMode ? ANGULAR_ENV_PROD_PATH : ANGULAR_ENV_PATH;
    let envContent = await fs.readFile(envPath, 'utf8');
    envContent = envContent.replace(/(releaseVersion:\s*['"])[^'"]+(['"])/, `$1${angularVersion}$2`);
    await fs.writeFile(envPath, envContent, 'utf8');
    console.log(`✅ Angular env (${path.basename(envPath)}) updated to: ${angularVersion}`);

    let xcodeContent = await fs.readFile(XCODE_PROJECT_PATH, 'utf8');

    xcodeContent = xcodeContent.replace(/(CURRENT_PROJECT_VERSION\s*=\s*)[^;]+/g, `$1${nextBuildNumber}`);
    xcodeContent = xcodeContent.replace(/(MARKETING_VERSION\s*=\s*)[^;]+/g, `$1${rootVersion}`);

    await fs.writeFile(XCODE_PROJECT_PATH, xcodeContent, 'utf8');
    console.log(`✅ Xcode updated (Marketing: ${rootVersion}, Build: ${nextBuildNumber})`);

    let gradleContent = await fs.readFile(ANDROID_GRADLE_PATH, 'utf8');

    gradleContent = gradleContent.replace(/(versionCode\s+)\d+/, `$1${nextBuildNumber}`);
    gradleContent = gradleContent.replace(/(versionName\s+)["'][^"']*["']/, `$1"${rootVersion}"`);

    await fs.writeFile(ANDROID_GRADLE_PATH, gradleContent, 'utf8');
    console.log(`✅ Android updated (versionName: ${rootVersion}, versionCode: ${nextBuildNumber})`);

  } catch (error) {
    console.error(`❌ Sync failed:`, error.message);
    process.exit(1);
  }
}

syncVersion().then(() => process.exit(0));