# Tasky

## Description
 Api for project managment application.
## Requirements
* node
* npm
* docker

## Setup
*  pull project
*  change directory to tasky
*  run ``` npm i```
*  run ```docker-compose up -d```
*  create db inside pgAdmin called project_managment
*  run ```npm run migration:run```
*  run ```npm run start:dev```

## Auth
After signup or signin you will get new token which shoud be added to header like this:

Authorization Bearer <token\>


## ENDPOINTS
| Endpoint                | Http Method | Role              | Service                                                                   |
|-------------------------|-------------|-------------------|---------------------------------------------------------------------------|
| /auth/signup            | POST        | ANY               | Register                                                                  |
| /auth/signin            | POST        | ANY               | Login                                                                     |
| /projects               | POST        | Admin             | Create Project                                                            |
| /users/:id              | PATCH       | Admin             | Update User                                                               |
| /tasks                  | POST        | Admin             | Create task                                                               |
| /tasks/:id              | POST        | Employee, Manager | Create Task for project with id (if assigned)                             |
| /tasks/:id              | PATCH       | ANY               | Update task on assigned project if user, ony any if admin                 |
| /tasks                  | GET         | ANY               | Read all if admin, on assigned projects if user                           |
| /tasks:id               | DELETE      | ANY               | Delete any with id if admin otherwise if assigned to project              |
| /tasks/projectId?userId | GET         | ANY               | Gets all tasks assigned to userId,query params:(limit,page and userId)    |
| /projects               | GET         | ADMIN             | Read all projects and users and their roles                               |
| /projects               | GET         | Employee,Manager  | Read all projects and users on projects that they are assigned to         |
| /users/:id              | DELETE      | ADMIN             | Delete user with given id                                                 |
| /projects/:id           | PATCH       | ADMIN             | Updates project with given id                                             |
| /projects/:id           | DELETE      | ADMIN             | Deletes project with given id                                             |
| /tasks/:id              | DELETE      | ADMIN             | Deletes task with given id                                                |
| /tasks                  | GET         | ADMIN             | Filter through tasks, PossibleQueryParams(assignees,completed,title,sort) |
| /users                  | GET         | ADMIN             | Read all users                                                            |
| /projects               | PATCH       | Manager           | Updates project                                                           |
|                         |             |                   |                                                                           |


## TO DO
* Make app prod ready, make config files 
* Optimize some services, by making better queries.
