# Stage 1: Build file .jar
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
# Tải trước các thư viện để tiết kiệm thời gian build lại sau này
RUN mvn dependency:go-offline -B
COPY src ./src
# Đóng gói ứng dụng, bỏ qua test để build nhanh hơn
RUN mvn clean package -DskipTests

# Stage 2: Chạy ứng dụng với JRE nhẹ
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
# Copy file .jar từ Stage 1 sang
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
# Khởi chạy Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]
