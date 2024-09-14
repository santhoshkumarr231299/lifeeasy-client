FROM node:18.14.2
WORKDIR /lifeeasy-client
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]