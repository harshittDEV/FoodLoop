# Build stage: Maven with Java 21
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and package JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# Runtime stage: Eclipse Temurin Java 21 JRE
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy packaged JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Cloud Run defaults to port 8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
