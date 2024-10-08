pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from Git
                git branch: 'master', url: 'https://github.com/YuCheng1122/api_web_frontend.git'
            }
        }
        
        stage('Display Current Directory') {
            steps {
                // Display current directory and contents
                script {
                    sh 'echo "Current directory: $(pwd)"'
                    sh 'ls -l'
                }
            }
        }
        
        stage('Check Git Repo') {
            steps {
                // Ensure we are in a git repository
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
                // Pull the latest changes from master
                sh 'git pull origin master'
            }
        }
        
        stage('Switch to Docker Directory') {
            steps {
                // Change to Docker directory and display its contents
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
                // Ensure docker-compose.yml exists
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
                // Stop running containers
                sh 'docker-compose down'
            }
        }
        
        stage('Build and Start New Containers') {
            steps {
                // Build and start new containers
                sh 'docker-compose up --build -d'
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
