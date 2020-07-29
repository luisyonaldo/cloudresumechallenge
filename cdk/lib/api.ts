import apigateway = require('@aws-cdk/aws-apigateway');
import dynamodb = require('@aws-cdk/aws-dynamodb');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');
import { Construct, CfnOutput } from '@aws-cdk/core';

export interface ApiProps {
  siteDomain: string;
}

export class Api extends Construct {
  constructor(parent: Construct, id: string, props: ApiProps) {
    super(parent, id);

    const { siteDomain } = props

    const dynamoTable = new dynamodb.Table(this, 'Visits', {
      partitionKey: {
        name: 'domain',
        type: dynamodb.AttributeType.STRING
      },
      tableName: 'SiteVisits',
      // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
      // the new table, and it will remain in your account until manually deleted. By setting the policy to
      // DESTROY, cdk destroy will delete the table (even if it has data in it)
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    const increaseAndGetVisitis = new lambda.Function(this, 'increaseAndGetVisitisFunction', {
      code: new lambda.AssetCode('../api'),
      handler: 'visits.handler',
      runtime: lambda.Runtime.PYTHON_3_8,
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: 'domain',
        SITE_DOMAIN: siteDomain,
      }
    });

    dynamoTable.grantReadWriteData(increaseAndGetVisitis)

    const api = new apigateway.RestApi(this, 'SiteViewsAPI', {
      restApiName: 'Site Visits Service',
      endpointConfiguration: { types: [apigateway.EndpointType.REGIONAL] },
    });
    new CfnOutput(this, 'ApiId', { value: api.restApiId, exportName: 'ApiId' })
    new CfnOutput(this, 'ApiOriginPath', { value: api.deploymentStage.stageName, exportName: 'ApiOriginPath' })

    const root = api.root.addResource('api');
    const visits = root.addResource('visits')
    visits.addMethod('PUT', new apigateway.LambdaIntegration(increaseAndGetVisitis));

    // CORS
    visits.addMethod('OPTIONS', new apigateway.MockIntegration({
      integrationResponses: [{
        statusCode: '200',
        responseParameters: {
          'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,PUT'",
          'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
          'method.response.header.Access-Control-Allow-Origin': "'*'", // `'${siteDomain}'`
        },
      }],
      passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
      requestTemplates: {
        'application/json': '{"statusCode": 200}',
      },
    }), {
      methodResponses: [{
        statusCode: '200',
        responseParameters: {
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
          'method.response.header.Access-Control-Allow-Origin': true,
        },
      }]
    })
  }
}
