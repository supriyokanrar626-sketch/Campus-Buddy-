FROM node:20-alpine

# set working directory 
WORKDIR /app

# copy .json file
COPY package*.json ./
RUN npm install

# copy rest of the code
COPY . .

EXPOSE 8000

# start the backend application
CMD [ "npm", "run", "dev" ]
