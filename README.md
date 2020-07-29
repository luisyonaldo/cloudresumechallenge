# cloudresumechallenge
A cloud project to advance your career https://cloudresumechallenge.dev/

## Architecture

### Frontend

Static site built using [next.js](https://nextjs.org/) and serve via Cloudfront and S3.

### Backend

Serverless lambda API via API Gateway (Regional deployment using the same CloudFront distribution as the frontend).

## Infraestructure as Code

Cloud Development Kit ([CDK](https://aws.amazon.com/cdk/)) framework to model and provision cloud resources using Typescript as programming language.

## CI/CD

Github actions to test, build, and deploy Static Site + API.

### Frontend

`api.yaml` workflow to test python application. If successful, CDK is used to deploy resources when code has been merged to `master`.

### Backend

`site.yaml` workflow to build the Static Site (nextjs build & export to convert [React](https://reactjs.org/) components to HTML for static side rendering). If successful, CDK is used to deploy resources when code has been merged to `master`.
