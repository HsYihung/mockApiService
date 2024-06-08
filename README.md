# Project Setup

This project is designed to run a Node.js server and configure API endpoints dynamically. Follow the instructions below to set up and start the server, configure endpoints, and manage request and response structures.

## Prerequisites

- Node.js installed on your system.

## Installation

Install the required dependencies:

```bash
npm install
```

## Starting the Server

To start the server, run the following command in your terminal:

```bash
node server.js
```

## Configuring Endpoints

Endpoints can be configured by modifying the endpoints configuration file located in the config folder.

configuration (config/endpoints.json):

```json
{
  "endpoints": [
    {
      "method": "post",
      "path": "/api/users"
    }
  ]
}
```

## Request Validation

For request validation, create a new configuration file in the config directory that matches the endpoint path. For example, for the endpoint /api/users, create a file named request.js in the folder config/api/users.

Example config/api/users/request.js:

```json
{
  "bodyStructure": {
    "name": {
      "type": "string",
      "isRequired": true,
      "equals": null
    },
    "age": {
      "type": "number",
      "isRequired": false
    },
    "email": {
      "type": "string",
      "isRequired": true,
      "equals": "example@example.com"
    },
    "data": {
      "project": {
        "type": "string",
        "isRequired": true,
        "equals": null
      },
      "role": {
        "type": "string",
        "isRequired": false,
        "equals": "admin"
      },
      "metadata": {
        "isActive": {
          "type": "boolean",
          "isRequired": true,
          "equals": null
        },
        "registeredOn": {
          "type": "string",
          "isRequired": false,
          "equals": "2021-01-01"
        }
      }
    }
  }
}
```

## Response Structure

Response structures can also be configured similarly in the config directory.

Example config/api/users/response.js:

```json
{
  "status": 200,
  "body": {
    "message": "User data retrieved successfully."
  }
}
```

## Directory Structure

```
project_directory/
├── config/
│ ├── endpoints.json
│ ├── api/
│ │ ├── users/
│ │ │ ├── request.js
│ │ │ ├── response.js
├── server.js
├── package.json
└── README.md
```
