import 'dotenv/config';

export default {
  "expo": {
    "name": "formagentez",
    "slug": "chatapp",
    "version": "1.0.0",
    "owner": "dcdevs",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0D1117"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "scheme": "formagentez",
    "ios": {
      "bundleIdentifier": "com.chatapp.formagentez",
      "supportsTablet": true
    },
    "android": {
      "package": "com.chatapp.formagentez",
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon-cam.png",
        "backgroundColor": "#0D1117"
      },
      "permissions": ['CAMERA', 'READ_EXTERNAL_STORAGE'],
      "expoClientId": "66814066011-n6pig89pq374jc2mb108n4s6dt0uuhm5"
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "expoClientId": "66814066011-oa2j1u2t5ajj2fbdfjcmmjuo7d4oebpe"
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      cloudinary: {
        CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        API_KEY: process.env.CLOUDINARY_API_KEY,
        API_SECRET: process.env.CLOUDINARY_API_SECRET,
      },
      "eas": {
        "projectId": "d411c03d-82d4-4790-8f59-097805cf44d3"
      }
    },
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "Permita que FormAgentez acesse suas fotos",
          "cameraPermission": "Permita que FormAgentez acesse sua câmera"
        }
      ]
    ],
  }
}
