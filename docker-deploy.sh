docker build -t --target production-stage pumpkin-api .
docker stop pumpkin-api
docker rm pumpkin-api
docker run -d -p 8090:8090 --name pumpkin-api --rm pumpkin-api
