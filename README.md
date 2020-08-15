# cdk-typescript-demo

## Pre-requisite

`npm install -g awk-cdk`

(optional) Create an empty repo on github and make a local clone, on my case it's called `cdk-typescript-demo`

Make sure it does not include `README.md`.

Run

```bash
cd cdk-typescript-demo;
cdk init app --language=typescript
```

For the types of resources we are going to create on this project, we need:

npm install --save @aws-cdk/aws-ec2 @aws-cdk/aws-ecs @aws-cdk/aws-ecs-patterns

Next, add code in `lib/cdk-typescript-demo-stack.ts`

```ts
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');

export class CdkTypescriptDemoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const vpc = ec2.Vpc.fromLookup(this,'dev-us-east-1-vpc',{vpcId: 'vpc-2a8a5f53'});
    const cluster = new ecs.Cluster(this,'dxiao-cdk-test-ecs-cluster', {vpc: vpc});
  }
}
```

When it's done, add code in `bin/cdk-typescript-demo.ts`

```ts
const process = require('process');
const app = new cdk.App();

new CdkTypescriptDemoStack(app, 'CdkTypescriptDemoStack', {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT, 
      region: process.env.CDK_DEFAULT_REGION // your account here
    },
  });
```

When it's done, run the following to deploy the stack:

```bash
CDK_DEFAULT_ACCOUNT='your-aws-account-id' CDK_DEFAULT_REGION='your-aws-region' cdk deploy --profile sandbox-cdk
```

When it's done, run the following to see the difference, and you should exepect to see there's no difference:

```bash
 cdk diff --profile sandbox-cdk
```

Now that it has a skeleton ecs cluster deployed with no actual workload, let's go ahead and make a simple container.

First, add 





This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
