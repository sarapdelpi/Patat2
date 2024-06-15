 #Use an OpenJDK runtime as a base image
FROM openjdk:17-jdk-slim

 #Set the working directory inside the container
WORKDIR /app

 #Copy the JAR file into the container
COPY target/back.volta-0.0.1-SNAPSHOT.jar /app/app.jar

 #Expose the port your application runs on
EXPOSE 8080

 #Define the command to run your application
#CMD ["java", "-jar", "app.jar"]