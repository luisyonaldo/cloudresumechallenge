#!/usr/bin/env node
import cloudfront = require('@aws-cdk/aws-cloudfront');
import route53 = require('@aws-cdk/aws-route53');
import s3 = require('@aws-cdk/aws-s3');
import s3deploy = require('@aws-cdk/aws-s3-deployment');
import acm = require('@aws-cdk/aws-certificatemanager');
import cdk = require('@aws-cdk/core');
import targets = require('@aws-cdk/aws-route53-targets/lib');
import { Construct, Stack } from '@aws-cdk/core';

export interface StaticSiteProps {
  siteDomain: string;
  api: {
    id: string;
    originPath: string;
  }
}

/**
 * Static site infrastructure, which deploys site content to an S3 bucket.
 *
 * The site redirects from HTTP to HTTPS, using a CloudFront distribution,
 * Route53 alias record, and ACM certificate.
 */
export class StaticSite extends Construct {
  constructor(parent: Construct, id: string, props: StaticSiteProps) {
    super(parent, id);

    const { siteDomain, api } = props

    const zone = route53.HostedZone.fromLookup(this, 'Zone', { domainName: siteDomain });
    new cdk.CfnOutput(this, 'Site', { value: 'https://' + siteDomain });

    // Content bucket
    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      bucketName: siteDomain,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html',
      // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
      // the new bucket, and it will remain in your account until manually deleted. By setting the policy to
      // DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });
    new cdk.CfnOutput(this, 'Bucket', { value: siteBucket.bucketName });

    // Restrict access to the bucket only through CloudFront
    const oai = new cloudfront.OriginAccessIdentity(this, 'OAI')
    siteBucket.grantRead(oai)

    // TLS certificate
    const certificateArn = new acm.DnsValidatedCertificate(this, 'SiteCertificate', {
      domainName: props.siteDomain,
      // subjectAlternativeNames:
      hostedZone: zone,
      region: 'us-east-1', // Cloudfront only checks this region for certificates.
    }).certificateArn;
    new cdk.CfnOutput(this, 'Certificate', { value: certificateArn });

    // const api = new URL()
    // CloudFront distribution that provides HTTPS
    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'SiteDistribution', {
      aliasConfiguration: {
        acmCertRef: certificateArn,
        names: [siteDomain],
        sslMethod: cloudfront.SSLMethod.SNI,
        securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2018,
      },
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: siteBucket,
            originAccessIdentity: oai,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
        {
          customOriginSource: {
            domainName: `${api.id}.execute-api.${Stack.of(this).region}.amazonaws.com`,
            originPath: `/${api.originPath}`,
          },
          behaviors: [{
            pathPattern: '/api/*',
            allowedMethods: cloudfront.CloudFrontAllowedMethods.ALL,
            forwardedValues: {
              queryString: false,
              headers: [
                'Access-Control-Request-Method',
                'Access-Control-Request-Headers',
                'Origin',
              ],
            },
          }],
        },
      ],
      errorConfigurations: [{
        errorCode: 404,
        responsePagePath: '/404.html',
        responseCode: 404,
      }]
    });
    new cdk.CfnOutput(this, 'DistributionId', { value: distribution.distributionId });

    // Route53 alias record for the CloudFront distribution
    new route53.ARecord(this, 'SiteAliasRecord', {
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      zone
    });

    // Deploy site contents to S3 bucket
    new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3deploy.Source.asset('../out')],
      destinationBucket: siteBucket,
      distribution,
      // paths to invalidate
      distributionPaths: [
        '/index.html',
        '/404.html',
        '/_next/*',
      ],
    });
  }
}
