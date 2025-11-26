# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
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

###### bash terminal

#### USER
##### Декоратор @ApiProperty:

Adds field descriptions to Swagger documentation
Shows example values
Helps you understand what each field means
CreateUserDto and other DTO -> @ApiProperty- used for Swagger documentation

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
