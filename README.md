## Homework Tracker
[![Build Status](https://travis-ci.org/tw-wh-devops-community/homework-tracker-api.svg?branch=master)](https://travis-ci.org/tw-wh-devops-community/homework-tracker-api)

### Preconditon
- [MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#install-mongodb-community-edition-with-homebrew) 
- Node(v6.12.3)
- npm(v3.10.10)


### How to Run in development

#### 1. Download codebase

```
git clone git@github.com:tw-wh-devops-community/homework-tracker-api.git
cd homework-tracker-api
```
#### 2. [Set node version via nvm](https://github.com/creationix/nvm#nvmrc) and install dependencies
```
nvm install
nvm use
npm install
```

#### 3. Start MongoDB
```
mongod
```

#### 4. Setup database according to different environments

We use [dotenv](https://github.com/motdotla/dotenv) to setup database for different environments.

Please copy the `.env.example` file to `.env`, and then update the `.env` file to your own settings.
```
cp .env.example .env
```

#### 5. Init database via seed in dev environment
```
npm run db:seed-dev
```
 

#### 6. Dynamically Build TypeScript to JavaScript ES5
```
npm run watch
```

#### 7. Start application
```
npm run start-dev 
```

#### 8. Run Test
```
npm test
```

### How to run in production

Please refer to the [Travis config](https://github.com/tw-wh-devops-community/homework-tracker-api/blob/master/.travis.yml) scripts.

### How to update the image data in production

The latest image data should update on google drive (tw-wh-devops-community/HomeworkTracker/data/image/thumbnail)

You can download it, and use the scp to upload the images to aws ec2 server.

the ec2 PEM private key can get from the team member.the upload script will be like
```
sudo scp -i $EC2_SERVER.pem $LOCAL_IMAGE_DIRECTORY/*.png USER@IP:/home/ec2-user/homework/upload
```

### MongoDB GUI

We use [Robo 3T](https://robomongo.org/)

### Guidelines

#### Git commit

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

                                                                                                                                          




 

