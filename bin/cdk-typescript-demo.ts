#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkTypescriptDemoStack } from '../lib/cdk-typescript-demo-stack';

const app = new cdk.App();
new CdkTypescriptDemoStack(app, 'CdkTypescriptDemoStack');
