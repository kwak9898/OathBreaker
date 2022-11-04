docker build --target production-stage -t pumpkin-api .
docker stop pumpkin-api
docker run -d -p 8090:8090 --name pumpkin-api --rm pumpkin-api
