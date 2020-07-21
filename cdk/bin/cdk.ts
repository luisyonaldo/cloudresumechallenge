#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
import { StaticSite } from '../lib/static-site';

class MyStaticSiteStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props: cdk.StackProps) {
    super(parent, name, props);

    new StaticSite(this, 'StaticSite', {
      domainName: this.node.tryGetContext('domain'),
      siteSubDomain: this.node.tryGetContext('subdomain'),
    });
  }
}

const app = new cdk.App();

new MyStaticSiteStack(app, 'MyStaticSite', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
});

app.synth();
