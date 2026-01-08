# --- ESTÁGIO 1: Build do Angular ---
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build --configuration=production

# --- ESTÁGIO 2: Build do Backend (Spring Boot com Gradle) ---
FROM gradle:8.5-jdk17 AS build-backend
WORKDIR /app/backend
COPY backend/ ./
# Copia o build do Angular (pasta browser) para dentro de static do Spring Boot
# Isso faz com que o Java sirva o HTML/JS do Angular
COPY --from=build-frontend /app/frontend/dist/frontend/browser /app/backend/src/main/resources/static/
RUN gradle bootJar --no-daemon

# --- ESTÁGIO 3: Execução ---
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build-backend /app/backend/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]