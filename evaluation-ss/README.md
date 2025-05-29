# Getting Started

### Install PostGreSql and Creation the DB

- Install PostGreSql from https://www.postgresql.org/
- Create a user "EVALUATION" with "Create databases" priviledge with password "EVALUATION"
- Create a database "EVALUATION" with the user "EVALUATION" as owner

### Install JDK 17

- Download and install JDK 17 from : https://jdk.java.net/java-se-ri/17-MR1
- Set its path in the JAVA_HOME environment variable
- Add %JAVA_HOME% to the PATH environment variable

### Install JDK 17

- Download and install Maven from : https://maven.apache.org/download.cgi
- Set its path in the MAVEN_HOME environment variable
- Add %MAVEN_HOME% to the PATH environment variable

### Start the back-end

```
cd [your-path]/evaluation/evaluation-ss
mvn spring-boot:run
```
