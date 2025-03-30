# ---------- Build Stage ----------
    FROM node:18-alpine AS builder

    WORKDIR /app
    
    ENV NODE_ENV=production
    
    COPY package.json package-lock.json ./
    RUN npm ci
    
    COPY . .
    RUN npm run build
    
    
    # ---------- Production Stage ----------
    FROM node:18-alpine
    
    WORKDIR /app
    
    ENV NODE_ENV=production
    
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package.json ./package.json
    COPY --from=builder /app/next.config.js ./next.config.js
    
    EXPOSE 3000
    
    CMD ["npm", "start"]
    