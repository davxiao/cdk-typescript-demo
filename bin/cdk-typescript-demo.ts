#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';

import { CdkTypescriptDemoStack } from '../lib/cdk-typescript-demo-stack';

const process = require('process');

const app = new cdk.App();
new CdkTypescriptDemoStack(app, 'CdkTypescriptDemoStack', {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT, 
      region: process.env.CDK_DEFAULT_REGION // your account here
    },
  });
