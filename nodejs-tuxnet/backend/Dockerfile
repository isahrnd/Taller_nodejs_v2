FROM node:20-alpine AS builder
WORKDIR /app

# Install Yarn Classic (v1) to match yarn.lock
RUN npm i -g yarn@1.22.22

# Install dependencies (with dev) and build TypeScript
COPY package.json yarn.lock tsconfig.json ./
COPY src ./src
RUN yarn install --frozen-lockfile
RUN yarn build

FROM node:20-alpine AS runner
WORKDIR /app

# Install Yarn Classic (v1) and only production dependencies
RUN npm i -g yarn@1.22.22
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile && yarn cache clean

# Copy built files from the builder stage
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# The app expects MONGO_URL from the environment
CMD ["node", "dist/index.js"]
