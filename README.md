## Release Instructions
Build local apk
`eas build --platform android --profile preview --local`


## Release Instructions
`rm ios and android folders`

`npx expo prebuild -p ios`

Staging
- Adjust the .env to `staging`. (no longer required)
- Run:
`eas build  --profile staging --platform ios`

Production
- Adjust the .env to `production`. (no longer required)
- Run:
`eas build --profile main --platform ios `

## OTA Updates
Update the build - happens automatically in circleci
`eas update --auto`
