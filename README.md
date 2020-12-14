# Group project for 437S Fall 2020
Our semester long project for 437S: Software Engineering Workshop. Idea is to make a score tracker for different types of games you might play with friends. Uses react-native, node.js, and mongoDB.

### Things you need to test the project:
- Node.js
- exponent-cli: npm install expo-cli --global
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

### Features:
- Social:
    - Friends
	    - can add users as friends to see their updates in your activity feed
    - Groups
	    - can add users to group
	    - can create games within the group
	    - people within the group are the people that can be involved in a game
    - User profile
	    - displays friends, groups, games
    - Activity feed:
	    - displayes when friends join a group or finish a game
- Games:
    - Request users in your group to join a game
	    - game created upon all users accepting    
    - Simple counter:
	    - has maximum score, first person to reach max wins
    - Tournament:
	    - bracket style
    - Stats:
    	    - display stats for games for each group and each users.
		    - eg: win rate, leader board, avg score
- Navigation:
    - Navigation stack
    - Navigation tabs on home page
    - Search features for games, users, and groups
- Email confirmation on registration
- Cross platform: ios, android, web
