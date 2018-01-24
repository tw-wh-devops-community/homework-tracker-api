set -e

docker login registry.cn-hangzhou.aliyuncs.com -u  -p

docker build -t homework-tracker-api .

docker tag homework-tracker-api:latest registry.cn-hangzhou.aliyuncs.com/wjyao/homework-tracker-api:latest

docker push registry.cn-hangzhou.aliyuncs.com/wjyao/homework-tracker-api:latest

docker rmi registry.cn-hangzhou.aliyuncs.com/wjyao/homework-tracker-api:latest

docker logout