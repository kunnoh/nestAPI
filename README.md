# NestAPI

## Installation
Clone repo
```bash
git clone 
```

Install dependencies

```bash
cd nestAPI
```

```bash
$ npm install
```

## Running the app

### Set envinornment variables
```bash
mv example.env .env
```

Change this variables to your preference
```conf
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_DB=
PORT=
```

### Start postgres on background for the app to funtion properly

```bash
make dev
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```