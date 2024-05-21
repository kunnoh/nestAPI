dev:
	# docker stop nest-postgres
	docker run -d --name nest-postgres -p 5432:5432 -v ./db:/var/lib/postgresql/data -e POSTGRES_USER=nestuser -e POSTGRES_PASSWORD=Fwe42r3t4@@R23q -e POSTGRES_DB=nestdb postgres:latest
	npm run start:dev

build:
	docker image build -t nestapi:v1.0.0 .