@Library('jenkins-shared-library@main') _

buildAngularPipeline(
    deploymentEnvironment: 'dev',
    imageRepo: 'webapp-angular',
    awsRegion: 'us-east-1'
)