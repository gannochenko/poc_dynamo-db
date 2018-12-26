FROM node:8.10
RUN apt-get update && apt-get install -y --no-install-recommends vim && apt-get clean
WORKDIR /app
RUN npm install
RUN npm install serverless -g
CMD ["npm", "run", "start"]
