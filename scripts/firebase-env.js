const fs = require('fs').promises;
const path = require('path');

// Кладе Firebase-конфіг обраного середовища у фіксоване місце, звідки його беруть Xcode та Gradle.

const ENVIRONMENTS = {
  dev: { ios: 'Dev', android: 'dev' },
  prod: { ios: 'Prod', android: 'prod' },
};

const IOS_FIREBASE_DIR = path.resolve(__dirname, '../ios/App/App/Firebase');
const ANDROID_APP_DIR = path.resolve(__dirname, '../android/app');

const env = process.argv[2];

async function copyConfig(src, dst) {
  try {
    await fs.access(src);
  } catch {
    throw new Error(`Firebase config not found: ${path.relative(process.cwd(), src)}`);
  }
  await fs.copyFile(src, dst);
}

async function useFirebaseEnv() {
  try {
    const dirs = ENVIRONMENTS[env];
    if (!dirs) {
      throw new Error(`Unknown environment "${env ?? ''}". Use: dev | prod`);
    }

    const iosSrc = path.join(IOS_FIREBASE_DIR, dirs.ios, 'GoogleService-Info.plist');
    const iosDst = path.join(IOS_FIREBASE_DIR, 'GoogleService-Info.plist');
    await copyConfig(iosSrc, iosDst);

    const iosContent = await fs.readFile(iosDst, 'utf8');
    const iosProjectId = iosContent.match(/<key>PROJECT_ID<\/key>\s*<string>([^<]+)<\/string>/)?.[1];
    console.log(`✅ iOS Firebase: ${env} (${iosProjectId})`);

    const androidSrc = path.join(ANDROID_APP_DIR, 'firebase', dirs.android, 'google-services.json');
    const androidDst = path.join(ANDROID_APP_DIR, 'google-services.json');
    await copyConfig(androidSrc, androidDst);

    const { project_info } = JSON.parse(await fs.readFile(androidDst, 'utf8'));
    console.log(`✅ Android Firebase: ${env} (${project_info.project_id})`);

  } catch (error) {
    console.error(`❌ Firebase env failed:`, error.message);
    process.exit(1);
  }
}

useFirebaseEnv().then(() => process.exit(0));
