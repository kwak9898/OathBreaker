docker build -t pumpkin-api .
docker stop pumpkin-api
docker rm pumpkin-api
docker run -d -p 8090:8090 --name pumpkin-api pumpkin-api
