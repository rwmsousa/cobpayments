# CobPayments

This is a full-stack project developed with NestJS for the backend and Next.js for the frontend. It provides functionalities to manage users and payments.

## Architecture

- **Backend:** NestJS (Modular monolithic)
  - **Database:** PostgreSQL
  - **ORM:** TypeORM
  - **API Documentation:** Swagger
  - **Testing:** Jest
- **Frontend:** React.js

## Features

- Payment CRUD
- API documentation with Swagger
- Frontend interface to manage payments

## Functionalities

### Payments

- Register new payments 
- List all payments
- List payments paginated 
- Upload csv file with payments
- Get payment details by ID
- Update payment data 
- Delete a payment 

## Routes

The complete route documentation can be accessed via Swagger at `http://localhost:3001/api`.

## Prerequisites

- Docker
- Docker Compose

## Installation and Usage

To run the project using Docker Compose, follow the steps below:

1. Clone the repository:
   ```shell
   git clone git@github.com:rwmsousa/cobpayments.git
   cd cobpayments
   ```

2. Configure the environment variables:
   Create a `.env` file at the root of the project and add the following variables:
   ```env
         NODE_ENV=development
         PORT=3001
         DOCKER_IMAGE_NAME=cobpayments
         COMPANY_NAME=Cobuccio
         DATABASE_HOST=localhost
         DATABASE_PORT=5432
         DATABASE_USER=postgres
         DATABASE_PASSWORD=postgres
         DATABASE_NAME=cobpayments_postgres
         DATABASE_SCHEMA=public
         DATABASE_LOGGING=true
         DATABASE_SYNCHRONIZE=false
   ```

3. Build the Docker images:
   ```shell
   docker-compose build
   ```

4. Run the containers:
   ```shell
   docker-compose up
   ```

5. To stop the containers, use the command:
   ```shell
   docker-compose down
   ```

6. Access the frontend in the browser:
   ```
   http://localhost:3000
   ```

7. Access the API documentation in the browser:
   ```
   http://localhost:3001/api
   ```

## Tests

To run tests inside the container, use the following commands:

### Backend

1. Run tests:
   ```shell
   docker-compose exec app yarn test
   ```

2. Run the database migrations inside the container:
   ```shell
   docker-compose exec app yarn migration:run
   ```

### Frontend

1. Run tests:
   ```shell
   docker-compose exec frontend yarn test
   ```

## Contribution

Contributions are welcome! Feel free to open issues and pull requests.

## License

This project is licensed under the MIT license. See the LICENSE file for more details.

```
MIT License

Copyright (c) 2023 <Your Name>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
