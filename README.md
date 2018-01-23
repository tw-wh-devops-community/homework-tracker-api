## Homework Tracker
[![Build Status](https://travis-ci.org/tw-wh-devops-community/homework-tracker-api.svg?branch=master)](https://travis-ci.org/tw-wh-devops-community/homework-tracker-api)

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


#### Guidelines

##### Git commit

In order to make our commit messages more readable and easy to follow when looking through the project history, we made the git commit guideline. 

Our commit message format is:

`[Yourname] [type]: your commit message`

For example: 
```
[grace] feat: add lint rules.
```

For `type`, we use part of [Angular JS commit message guideline](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commit-message-format), Generally speaking, a commit has a type which must be one of the following:

- feat: A new feature
- fix: A bug fix
- docs: Documentation only changes
- style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- refactor: A code change that neither fixes a bug nor adds a feature
- perf: A code change that improves performance
- test: Adding missing or correcting existing tests
- chore: Changes to the build process or auxiliary tools and libraries such as documentation generation

                                                                                                                                          




 

