#!groovy

// Uses the Jenkins Declarative Pipeline -
// https://jenkins.io/doc/book/pipeline/syntax/#declarative-pipeline

// ProTip: If you're debugging changes to this file, use the replay feature in
// Jenkins rather than the commit/watch/fix cycle:
//   1. Go to https://jenkins.zooniverse.org/job/Zooniverse%20GitHub/job/front-end-monorepo/
//   2. Find your branch and click on it
//   3. Pick a build from the list in the sidebar
//   4. Click 'Replay' in the sidebar
//   5. You should get an editor where you can modify the pipeline and run it
//      again immediately <3

pipeline {
  agent none

  options {
    quietPeriod(120) // builds happen at least 120 seconds apart
    disableConcurrentBuilds()
  }

  stages {

    // Right now, we're *only* building and deploying on the `master` branch;
    // longer-term, we'll want to deploy feature branches as well.
    stage('`master` branch') {
      when { branch 'master' }
      stages {

        stage('Build base Docker image') {
          agent any
          steps {
            script {
              def dockerRepoName = 'zooniverse/zoo-ml-subject-assistant'
              def dockerImageName = "${dockerRepoName}:${GIT_COMMIT}"
              def newImage = docker.build(dockerImageName)
              newImage.push()
              newImage.push('latest')
            }
          }
        }

        stage('Deploy to Kubernetes') {
          agent any
          steps {
            sh "kubectl --context azure apply --record -f kubernetes/"
            sh "sed 's/__IMAGE_TAG__/${GIT_COMMIT}/g' kubernetes/deployment.tmpl | kubectl --context azure apply --record -f -"
          }
        }
      }

      post {
        unsuccessful {
          slackSend (
            color: '#FF0000',
            message: "DEPLOY FAILED: Job '${JOB_NAME} [${BUILD_NUMBER}]' (${BUILD_URL})",
            channel: "#ms-machine-learning"
          )
        }
      }
    }

  }
}
