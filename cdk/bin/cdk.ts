#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
import { Fn } from '@aws-cdk/core';
import { Api } from '../lib/api';
import { StaticSite } from '../lib/static-site';

class MyAPIStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props: cdk.StackProps) {
    super(parent, name, props);

    new Api(this, 'API', {
      siteDomain: this.node.tryGetContext('domain')
    });
  }
}


class MyStaticSiteStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props: cdk.StackProps) {
    super(parent, name, props);

    new StaticSite(this, 'StaticSite', {
      siteDomain: this.node.tryGetContext('domain'),
      api: {
        id: Fn.importValue('ApiId'),
        originPath: Fn.importValue('ApiOriginPath'),
      },
    });
  }
}

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
}

new MyAPIStack(app, 'MyApi', { env });
new MyStaticSiteStack(app, 'MyStaticSite', { env });

app.synth();
