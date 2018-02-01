FROM node:6.12.3

# Create app directory
RUN mkdir -p /src/app
WORKDIR /src/app

COPY package.json /src/app/
RUN npm install

# Bundle app source
COPY . /src/app

# Build and optimize react app
RUN npm run build

EXPOSE 5678

ARG DB_HOMEWORK_TRACKER_PROD

ENV DB_HOMEWORK_TRACKER_PROD ${DB_HOMEWORK_TRACKER_PROD}

# defined in package.json
CMD [ "npm", "run", "start-prod" ]