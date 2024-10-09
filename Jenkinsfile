pipeline {
    agent any
    environment {
        TMPDIR = '/tmp'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/YuCheng1122/api_web_frontend.git'
            }
        }
        
        stage('Display Current Directory') {
            steps {
                script {
                    sh 'echo "Current directory: $(pwd)"'
                    sh 'ls -l'
                }
            }
        }

        stage('Check Write Permissions') {
            steps {
                script {
                    sh '''
                    if [ ! -w /home/docker ]; then
                        echo "Error: Jenkins does not have write access to /home/docker"
                        exit 1
                    fi
                    '''
                }
            }
        }
        
        stage('Check Git Repo') {
            steps {
                script {
                    sh '''
                    if [ ! -d .git ]; then
                        echo "Error: Not in a git repository"
                        exit 1
                    fi
                    '''
                }
            }
        }
        
        stage('Pull Latest Changes') {
            steps {
                sh 'git pull origin master'
            }
        }
        
        stage('Switch to Docker Directory') {
            steps {
                dir('/home/docker') {
                    sh '''
                    echo "Switched to Docker directory: $(pwd)"
                    ls -l
                    '''
                }
            }
        }
        
        stage('Check docker-compose.yml') {
            steps {
                script {
                    sh '''
                    if [ ! -f docker-compose.yml ]; then
                        echo "Error: docker-compose.yml not found"
                        exit 1
                    fi
                    '''
                }
            }
        }
        
        stage('Stop Old Containers') {
            steps {
                sh 'sudo docker-compose down'
            }
        }
        
        stage('Build and Start New Containers') {
            steps {
                sh 'sudo docker-compose up --build -d'
            }
        }

        stage('Debug Permissions') {
            steps {
                sh '''
                echo "Checking permissions for /home/docker"
                ls -ld /home/docker
                echo "Checking permissions for docker-compose.yml"
                ls -l /home/docker/docker-compose.yml
                '''
            }
        }
    }
    
    post {
        success {
            echo 'Deployment completed successfully!'
        }
        failure {
            echo 'Deployment failed.'
        }
    }
}
