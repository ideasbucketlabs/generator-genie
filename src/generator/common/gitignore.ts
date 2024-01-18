const javaGitIgnore = `

### STS ###
.apt_generated
.classpath
.factorypath
.project
.settings
.springBeans
.sts4-cache
bin/
!**/src/main/**/bin/
!**/src/test/**/bin/

### IntelliJ IDEA ###
.idea
*.iws
*.iml
*.ipr
out/
!**/src/main/**/out/
!**/src/test/**/out/

### NetBeans ###
/nbproject/private/
/nbbuild/
/dist/
/nbdist/
/.nb-gradle/

### VS Code ###
.vscode/
!.vscode/extensions.json

### Virtual machine crash logs, see http://www.java.com/en/download/help/error_hotspot.xml ###
hs_err_pid*
replay_pid*

### MacOS ###
.DS_Store
.AppleDouble
.LSOverride
.DocumentRevisions-V100
.fseventsd
.Spotlight-V100
.TemporaryItems
.Trashes
.VolumeIcon.icns
.com.apple.timemachine.donotpresent
.AppleDB
.AppleDesktop

### Windows ###
Thumbs.db
Thumbs.db:encryptable
ehthumbs.db
ehthumbs_vista.db
`
const gradleGitIgnore =
    `.gradle
build/
!gradle/wrapper/gradle-wrapper.jar
!**/src/main/**/build/
!**/src/test/**/build/` + javaGitIgnore

const mavenGitIgnore =
    `target/
!.mvn/wrapper/maven-wrapper.jar
!**/src/main/**/target/
!**/src/test/**/target/` + javaGitIgnore

const jsGitIgnore = `### Logs ##
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

### Node ###
node_modules
dist
dist-ssr
coverage
*.local

### IntelliJ IDEA ###
.idea
*.iws
*.iml
*.ipr
out/
!**/src/main/**/out/
!**/src/test/**/out/

### NetBeans ###
/nbproject/private/
/nbbuild/
/dist/
/nbdist/
/.nb-gradle/

### VS Code ###
.vscode/
!.vscode/extensions.json

### MacOS ###
.DS_Store
.AppleDouble
.LSOverride
.DocumentRevisions-V100
.fseventsd
.Spotlight-V100
.TemporaryItems
.Trashes
.VolumeIcon.icns
.com.apple.timemachine.donotpresent
.AppleDB
.AppleDesktop

### Windows ###
Thumbs.db
Thumbs.db:encryptable
ehthumbs.db

### E2E Results ###
/cypress/videos/
/cypress/screenshots/
test-results/
playwright-report/`

export { gradleGitIgnore, mavenGitIgnore, jsGitIgnore }
