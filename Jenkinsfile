pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'isresearch/khajura-integrated-profile'
        DOCKER_CREDENTIALS = credentials('docker-hub-credentials')
        NODE_VERSION = '20'
        
        // Define environment variables from Jenkins credentials
        DATABASE_URL = credentials('khajura-profile-database-url')
        NEXT_PUBLIC_APP_URL = credentials('khajura-profile-next-public-app-url')
        MINIO_ENDPOINT = credentials('khajura-profile-minio-endpoint')
        MINIO_PORT = credentials('khajura-profile-minio-port')
        MINIO_CLIENT_ACCESS_KEY = credentials('khajura-profile-minio-client-access-key')
        MINIO_CLIENT_SECRET_KEY = credentials('khajura-profile-minio-client-secret-key')
        MINIO_USE_SSL = credentials('khajura-profile-minio-use-ssl')
        BUCKET_NAME = credentials('khajura-profile-bucket-name')
        REDIS_URL = credentials('khajura-profile-redis-url')
        REDIS_PASSWORD = credentials('khajura-profile-redis-password')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Test') {
            steps {
                sh """
                    docker --version
                    docker info
                    echo ${DOCKER_CREDENTIALS_PSW} | docker login -u ${DOCKER_CREDENTIALS_USR} --password-stdin
                    docker logout
                """
            }
        }

        stage('Docker Build') {
            steps {
                sh """
                    docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} \
                    --build-arg DATABASE_URL=${DATABASE_URL} \
                    --build-arg NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL} \
                    --build-arg MINIO_ENDPOINT=${MINIO_ENDPOINT} \
                    --build-arg MINIO_PORT=${MINIO_PORT} \
                    --build-arg MINIO_CLIENT_ACCESS_KEY=${MINIO_CLIENT_ACCESS_KEY} \
                    --build-arg MINIO_CLIENT_SECRET_KEY=${MINIO_CLIENT_SECRET_KEY} \
                    --build-arg MINIO_USE_SSL=${MINIO_USE_SSL} \
                    --build-arg BUCKET_NAME=${BUCKET_NAME} \
                    --build-arg REDIS_URL=${REDIS_URL} \
                    --build-arg REDIS_PASSWORD=${REDIS_PASSWORD} \
                    .
                    
                    docker tag ${DOCKER_IMAGE}:${BUILD_NUMBER} ${DOCKER_IMAGE}:latest
                """
            }
        }

        stage('Docker Push') {
            steps {
                sh """
                    echo ${DOCKER_CREDENTIALS_PSW} | docker login -u ${DOCKER_CREDENTIALS_USR} --password-stdin
                    docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                    docker push ${DOCKER_IMAGE}:latest
                    docker logout
                """
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
