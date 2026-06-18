const fs = require('fs').promises;
const path = require('path');

const PACKAGE_JSON_PATH = path.resolve(__dirname, '../package.json');
const ANGULAR_ENV_PATH = path.resolve(__dirname, '../src/environments/environment.ts');
const XCODE_PROJECT_PATH = path.resolve(__dirname, '../ios/App/App.xcodeproj/project.pbxproj');

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

    let envContent = await fs.readFile(ANGULAR_ENV_PATH, 'utf8');
    envContent = envContent.replace(/(releaseVersion:\s*['"])[^'"]+(['"])/, `$1${angularVersion}$2`);
    await fs.writeFile(ANGULAR_ENV_PATH, envContent, 'utf8');
    console.log(`✅ Angular env updated to: ${angularVersion}`);

    let xcodeContent = await fs.readFile(XCODE_PROJECT_PATH, 'utf8');

    xcodeContent = xcodeContent.replace(/(CURRENT_PROJECT_VERSION\s*=\s*)[^;]+/g, `$1${nextBuildNumber}`);
    xcodeContent = xcodeContent.replace(/(MARKETING_VERSION\s*=\s*)[^;]+/g, `$1${rootVersion}`);

    await fs.writeFile(XCODE_PROJECT_PATH, xcodeContent, 'utf8');
    console.log(`✅ Xcode updated (Marketing: ${rootVersion}, Build: ${nextBuildNumber})`);

  } catch (error) {
    console.error(`❌ Sync failed:`, error.message);
    process.exit(1);
  }
}

syncVersion().then(() => process.exit(0));