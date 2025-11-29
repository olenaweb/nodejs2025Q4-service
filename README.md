# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading and Install

```
git clone https://github.com/olenaweb/nodejs2025Q4-service.git
cd nodejs2025Q4-service
git checkout -b dev origin/dev

```

#### Important!!! (because old project!!!)

#### Installing NPM modules

The --legacy-peer-deps flag is used to resolve dependency version conflicts.

```
npm install --legacy-peer-deps
```

## Running application

```
npm run start:dev
```

1. Start the app (4000 as default) : http://localhost:4000
2. After starting the app on port (4000 as default) you can open
   in your browser OpenAPI documentation by typing http://localhost:4000/doc/ or press the button "Open Docs" and check work of application.
3. To test, click the "Try it out" button. If necessary, enter body and click the button "Execute".
4. See doc\api.yaml - yaml documentation of the App

5. For more information about OpenAPI/Swagger visit https://swagger.io/.

6. On http://localhost:4000/doc-json enable json version of yaml

7. Or download json by Powershell terminal :

```
   Invoke-WebRequest -Uri http://localhost:4000/doc-json -OutFile doc/openapi-check.json
```

8. You can also use Json-> Yaml online generator on site: https://www.bairesdev.com/tools/json2yaml/ to get actual Yaml documentation.

## Testing

#### !!! First start the server with the command:

```
npm run start
```

After application running open new terminal and enter:

To run all tests (67 tests should pass)

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

example:

```
npm test -- test/users.e2e.spec.ts

npm test -- test/artists.e2e.spec.ts

npm test -- test/albums.e2e.spec.ts

npm test -- test/tracks.e2e.spec.ts

```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

## Modules

This application includes 5 main modules:

- **User** - User management with authentication
- **Artist** - Artist management
- **Album** - Album management with artist relationships
- **Track** - Track management with artist and album relationships
- **Favorites** - Favorites management for artists, albums, and tracks

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
       "password": "Password123"
     }
     ```
   - Click "Execute"
   - You will receive a response with the created user (without password!)
4. continue with others endpoints

##### @Api Decorators: @ApiProperty; @ApiTags ; @ApiOperation ; @ApiResponse. See OpenAPI/Swagger documentation: http://localhost:4000/doc

1. Adds field descriptions to Swagger documentation
   Shows example values.
2. Helps you understand what each field means.
3. In CreateUserDto and other DTO , in Controllers -> @Api Decorators used for OpenAPI/Swagger documentation.

#### USER

**Example endpoints:**

- `POST http://localhost:4000/user` - create user
- `GET http://localhost:4000/user` - all users
- `GET http://localhost:4000/user/123e4567-e89b-12d3-a456-426614174000` - one user
- `PUT http://localhost:4000/user/123e4567-e89b-12d3-a456-426614174000` - renew password
- `DELETE http://localhost:4000/user/123e4567-e89b-12d3-a456-426614174000` - delete user

###### Check on bash terminal

1. all users

```
curl -X 'GET' \
 'http://localhost:4000/user' \
 -H 'accept: */*'
```

2. create user

```
   curl -X 'POST' \
    'http://localhost:4000/user' \
    -H 'accept: */*' \
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
    -H 'accept: */*'
```

4. change password : Password_123 ->newPassword_123

```
   curl -X 'PUT' \
    'http://localhost:4000/user/71da8eb5-5bf7-4204-a023-986089609144' \
    -H 'accept: */*' \
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
    -H 'accept: */*'
```

###### You can continue do it for others endpoints (artist, album, track, favs) or check using Swagger site http://localhost:4000/doc (press button "Try it out",then button "Execute")

#### Browser

Get

```
http://localhost:4000/user
http://localhost:4000/artist
http://localhost:4000/album
http://localhost:4000/track
http://localhost:4000/favs/track
http://localhost:4000/favs/artist
http://localhost:4000/favs/album

```

Get id

```
http://localhost:4000/user/1c36162f-171c-464b-ac7f-a827bf40e21f
http://localhost:4000/user/[id]
http://localhost:4000/artist/[id]
http://localhost:4000/album/[id]
http://localhost:4000/track/[id]
http://localhost:4000/favs/track/[id]
http://localhost:4000/favs/artist/[id]
http://localhost:4000/favs/album/[id]
```

#### Example body with all fields or not:

###### Album Innuendo

```
{
"name": "Innuendo",
"year": 1991,
"artistId": "b2c3d4e5-f6a7-8901-bcde-f12345678901"
}
```

###### Answer :

```
{
"id": "04e66221-0410-4a67-8d37-c7f8f5022e1b",
"name": "Innuendo",
"year": 1991,
"artistId": "b2c3d4e5-f6a7-8901-bcde-f12345678901"
}
```

###### Unknown album

```
{
"name": "Unknown Album",
"year": 2020
}
```

###### Answer :

```
{
"id": "04e66221-0410-4a67-8d37-c7f8f5022e1b",
"name": "Unknown Album",
"year": 2020,
"artistId": null
}
```
