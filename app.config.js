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
      "supportsTablet": true,
      "permissions": [
        "CAMERA",
        "ACCESS_FINE_LOCATION",
        "READ_EXTERNAL_STORAGE"
      ],
    },
    "android": {
      "package": "com.chatapp.formagentez",
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon-cam.png",
        "backgroundColor": "#0D1117"
      },
      "permissions": [
        "CAMERA",
        "ACCESS_FINE_LOCATION",
        "READ_EXTERNAL_STORAGE"
      ],
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
        "projectId": "6ee402ab-552b-4c28-8c7c-8b8c1e5041e2"
      }
    },
    "plugins": [
      [
        "expo-image-picker",
        {
          "ios": {
            "NSCameraUsageDescription": "Permita que FormAgentez acesse sua câmera",
            "NSPhotoLibraryUsageDescription": "Permita que FormAgentez acesse suas fotos"
          },
          "android": {
            "cameraPermission": "Permita que FormAgentez acesse sua câmera",
            "mediaLibraryPermission": "Permita que FormAgentez acesse suas fotos"
          }
        }
      ]
    ],
  }
}
