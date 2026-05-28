FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json tsconfig.json ./
COPY m2-grpc/package.json m2-grpc/tsconfig.json ./m2-grpc/
RUN npm install
COPY proto ./proto
COPY m2-grpc/src ./m2-grpc/src
RUN npm run build --workspace=m2-grpc

FROM node:20-alpine AS runner
WORKDIR /app
COPY package.json ./
COPY m2-grpc/package.json ./m2-grpc/
RUN npm install --omit=dev
COPY proto ./proto
COPY --from=builder /app/m2-grpc/dist ./m2-grpc/dist
ENV PORT=50051
EXPOSE 50051
CMD ["npm", "run", "start", "--workspace=m2-grpc"]
