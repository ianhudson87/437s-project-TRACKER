# Group project for 437S Fall 2020
Our semester long project for 437S: Software Engineering Workshop. Idea is to make a score tracker for different types of games you might play with friends. Uses react-native, node.js, and mongoDB.

### Things you need to test the project:
- Node.js
- exponent-cli: npm instll expo-cli --global
    - If on macOS install watchman https://facebook.github.io/watchman/docs/install#buildinstall
- Expo client on phone

### How to test project:
- Start front end:
    - Go to my-projects folder
    - In console: npm install
    - In console: npm run production
    - Scan QR code, or run in web browser
- If using local host as backend instead of heroku server:
    - Instead of npm run production do npm start
    - Go to root (437s-project-TRACKER) folder. Start the backend:
	    - In console: npm install
	    - In console: node index.js
