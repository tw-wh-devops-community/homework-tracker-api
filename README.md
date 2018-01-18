## Homework Tracker


### Preconditon
- [MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#install-mongodb-community-edition-with-homebrew) 
- Node(v6.9.4)
- npm(v3.10.10)


### How to Run

#### Download codebase and install dependencies

```
git clone git@github.com:tw-wh-devops-community/homework-tracker-api.git
cd homework-tracker-api
npm i
```

#### Run MongoDB
```
mongod
```

#### Dynamically Build TypeScript to JavaScript ES5
```
npm run watch
```

#### Build TypeScript to JavaScript ES5 for once
```
npm run build
```

#### Run application in dev mode
```
npm run start-dev 
```

#### Run application in production mode
```
npm run start-prod
```

#### Run Test
```
npm test
```

### Others

#### Connect to mongoDB vai IntelliJ

First of all, make sure you have MongoDB installed. then install [Mongo] plugin in IntelliJ via:

- Open IntelliJ settings(Cmd + ,)
- Plugins
- Browse repositories
- Search: Mongo Plugin
- Install the Plugin and then restart IntelliJ
- Open IntelliJ settings(Cmd + ,)
- Other Settings
- Mongo Servers
- Create a server: Set the label for server
- Save
- Search Mongo Explorer
- Then you can see the connected MongoDB
