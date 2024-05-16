dev:
	# docker stop sapient-postgres
	docker run -d --name sapient-postgres -p 5432:5432 -v ./db:/var/lib/postgresql/data -e POSTGRES_USER=sapientuser -e POSTGRES_PASSWORD=Fwe42r3t4@@R23q -e POSTGRES_DB=sapientdb postgres:latest
	npm run start:dev