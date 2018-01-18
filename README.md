## Homework Tracker


### Preconditon
- [MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#install-mongodb-community-edition-with-homebrew) 
- Node(v6.9.4)
- npm(v3.10.10)


### How to Run

#### Download codebase and install dependencies

```
git clone 
cd HomeworkTracker
npm i
```

#### Run MongoDB
```
mongod
```

#### Build TypeScript to JavaScript ES5
```
npm run build
```

#### Run application
```
npm start
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






