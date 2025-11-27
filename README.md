# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/olenaweb/nodejs2025Q4-service.git
cd nodejs2025Q4-service
git checkout -b dev origin/dev

```

## Important!!! (because old project!!!)

## Installing NPM modules

The --legacy-peer-deps flag is used to resolve dependency version conflicts.

```
npm install --legacy-peer-deps
```

## Running application

```
npm run start:dev
```

1. After starting the app on port (4000 as default) you can open
   in your browser OpenAPI documentation by typing http://localhost:4000/doc/ and check work of application.
2. On http://localhost:4000/doc-json enable json version of yaml
3. download json Powershell terminal :
   Invoke-WebRequest -Uri http://localhost:4000/doc-json -OutFile doc/openapi-check.json
4. Json-> Yaml online generator : https://www.bairesdev.com/tools/json2yaml/

5. To test, click the "Try it out" button, enter parameters , if necessary, and click the button "Execute".
   For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing :

#### first start the server with the command:

```
 npm run start
```

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>

npm test -- test/users.e2e.spec.ts

npm test -- test/artists.e2e.spec.ts

npm test -- test/albums.e2e.spec.ts

```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging

#### RUN

**✅ What to check with OpenAPI/Swagger:**

1. Open in your browser: `http://localhost:4000/doc`
2. You should see Swagger UI with a "Users" and others sections
3. Try running queries directly in Swagger:
   - Click on `POST /user`
   - Click "Try it out"
   - Enter data:
     ```json
     {
       "login": "testuser",
       "password": "password123"
     }
     ```
   - Click "Execute"
   - You will receive a response with the created user (without password!)
4. continue with others endpoints

##### Декоратор @ApiProperty:

Adds field descriptions to Swagger documentation
Shows example values.
Helps you understand what each field means.
In CreateUserDto and other DTO -> @ApiProperty used for OpenAPI/Swagger documentation.

#### USER

**Example endpoints:**

- `POST http://localhost:4000/user` - create user
- `GET http://localhost:4000/user` - all users
- `GET http://localhost:4000/user/123e4567-e89b-12d3-a456-426614174000` - one user
- `PUT http://localhost:4000/user/123e4567-e89b-12d3-a456-426614174000` - renew password
- `DELETE http://localhost:4000/user/123e4567-e89b-12d3-a456-426614174000` - delete user

###### bash terminal

1. all users

```
curl -X 'GET' \
 'http://localhost:4000/user' \
 -H 'accept: _/_'
```

2. create user

```
   curl -X 'POST' \
    'http://localhost:4000/user' \
    -H 'accept: _/_' \
    -H 'Content-Type: application/json' \
    -d '{
   "login": "TestUser",
   "password": "Password_123"
   }'
```

3. get user with id
   Id from real user , see http://localhost:4000/user

```
   curl -X 'GET' \
    'http://localhost:4000/user/71da8eb5-5bf7-4204-a023-986089609144' \
    -H 'accept: _/_'
```

4. change password : Password_123 ->newPassword_123

```
   curl -X 'PUT' \
    'http://localhost:4000/user/71da8eb5-5bf7-4204-a023-986089609144' \
    -H 'accept: _/_' \
    -H 'Content-Type: application/json' \
    -d '{
   "oldPassword": "Password_123",
   "newPassword": "newPassword_123"
   }'
```

5. delete user

```
   curl -X 'DELETE' \
    'http://localhost:4000/user/597f7ecf-d67f-4e8f-ada2-f1d51cba1d5e' \
    -H 'accept: _/_'
```

#### Browser

Get

```
http://localhost:4000/user
```

Get id

```
http://localhost:4000/user/1c36162f-171c-464b-ac7f-a827bf40e21f
```

#### artist

1. create artist
   curl -X 'POST' \
    'http://localhost:4000/artist' \
    -H 'accept: _/_' \
    -H 'Content-Type: application/json' \
    -d '{
   "name": "The Beatles",
   "grammy": true
   }'
