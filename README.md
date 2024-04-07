# Express Phonebook

## Navigate the world of phone numbers!

## Description

This repository contains a straightforward RESTful API built with Java Spring Boot, incorporating HATEOAS principles, consumed by a React 18 frontend


## System Requirements

### For Java Spring Boot:

1. **Java Development Kit (JDK)**: Ensure you have JDK 8 or later installed on your system. You can download and install it from the [official Oracle website](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) or use OpenJDK, an open-source implementation of the Java Platform.

### For React:

1. **Node.js and npm (Node Package Manager)**: React applications are typically built and managed using Node.js and npm. You need to have Node.js installed on your system, which includes npm. You can download and install Node.js from the [official Node.js website](https://nodejs.org/).

2. **Memory and CPU**: React applications, especially during development and building, might require a certain amount of memory and CPU resources. Ensure your system has sufficient resources to run Node.js and npm smoothly.

## Running the Backend

To run the backend, navigate to the 'backend' directory in your terminal:

```bash
cd backend
```
```bash
.\gradlew.bat bootRun
```

## Running the Frontend

To run the frontend, navigate to the 'frontend' directory in your terminal:

```bash
cd frontend
```

```bash
npm i
```

```bash
npm start
```
Once the fe is up and running, React will spin up a local server on http://localhost:3000/


## CURL Requests:

# GET (search, sort, paginate):
Parameters:
1. search (string)
2. field (string) sorting column
3. direction (ASC |  DESC) sorting
4. page (number) paginate size
5. size (number) paginate page size

```bash
curl -X GET "http://localhost:8080/employees/v2?search={search}&field={field}&direction={direction}&size={size}&page={page}" -H "Content-Type: application/json"
```

# DELETE
Parameters:
1. userID (number)

```bash
curl -X DELETE "http://localhost:8080/employees/{userID}" -H "Content-Type: application/json"
```

# POST
Parameters:
1. name (string)
2. surname (string)
3. phoneCode (string)
4. phoneNumber (string)

```bash
curl -X POST "http://localhost:8080/employees" -H "Content-Type: application/json" -d "{\"name\": \"{name}\", \"surname\": \"{surname}\", \"phoneCode\": \"{phoneCode}\", \"phoneNumber\": \"{phoneNumber}\"}"
```

# PUT
Parameters:
1. userID (number)
2. name (string)
3. surname (string)
4. phoneCode (string)
5. phoneNumber (string)

```bash
curl -X PUT "http://localhost:8080/employees/{userID}" -H "Content-Type: application/json" -d "{\"name\": \"{name}\", \"surname\": \"{surname}\", \"phoneCode\": \"{phoneCode}\", \"phoneNumber\": \"{phoneNumber}\"}"
```
