FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json tsconfig.json ./
COPY m1-rest/package.json m1-rest/tsconfig.json ./m1-rest/
RUN npm install
COPY proto ./proto
COPY m1-rest/src ./m1-rest/src
RUN npm run build --workspace=m1-rest

FROM node:20-alpine AS runner
WORKDIR /app
COPY package.json ./
COPY m1-rest/package.json ./m1-rest/
RUN npm install --omit=dev
COPY proto ./proto
COPY --from=builder /app/m1-rest/dist ./m1-rest/dist
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "run", "start", "--workspace=m1-rest"]
