FROM node:20-alpine

# set work directory
WORKDIR /app

# copy packege files
COPY package*.json .

# install dependencies
RUN npm install

#copy project from host path to container path
COPY . .
