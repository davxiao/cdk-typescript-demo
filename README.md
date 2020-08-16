# cdk-typescript-demo

## Reference

[AWS doc](https://docs.aws.amazon.com/cdk/latest/guide/ecs_example.html)

[Youtube: Introducing AWS CDK](https://youtu.be/bz4jTx4v-l8)

## Pre-requisite

Install cdk toolkit itself.

```
npm install -g awk-cdk
```

(optional if you want to create a git repo for the code)

Create an empty repo on github and make a local clone, on my case it's called `cdk-typescript-demo` and make sure it does not include `README.md`

And run

```bash
cd cdk-typescript-demo;
cdk init app --language=typescript
```

## Step by Step

For the types of resources we are going to create on this project, we need:

```
npm install --save @aws-cdk/aws-ec2 @aws-cdk/aws-ecs @aws-cdk/aws-ecs-patterns
```

Next, we will add the following code code in `lib/cdk-typescript-demo-stack.ts`

```ts
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');

export class CdkTypescriptDemoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // Import existing VPC
    const vpc = ec2.Vpc.fromVpcAttributes(this, 'test-us-east-1-vpc', {
      vpcId: 'vpc-06e2246f8c824b07f',
      availabilityZones: ['us-east-1a', 'us-east-1b'],
      publicSubnetRouteTableIds: ['rtb-0754c0b9a16800a88', 'rtb-0d33917bf17f51c5c'],
      publicSubnetIds: ['subnet-0fbdf0fe3c1eb197f', 'subnet-005b1272f9d18caf2'],
      privateSubnetRouteTableIds: ['rtb-04e3bd500ad8e23c4','rtb-0e8346d8fde14f831'],
      privateSubnetIds: ['subnet-05a41bbb256ade70f', 'subnet-003649e7ae9af838b'],
    });

    const cluster = new ecs.Cluster(this,'dxiao-cdk-test-ecs-cluster', {
      vpc: vpc,
    });
  }
}

```

The reason I specify subnets is because I want to import existing VPC as opppose to creating a new VPC for this example.

When it's done, go add the following code in `bin/cdk-typescript-demo.ts`

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

Then go deploy the stack:

```bash
CDK_DEFAULT_ACCOUNT='your-aws-account-id' CDK_DEFAULT_REGION='your-aws-region' cdk deploy --profile 'your-aws-profile-name'
```

Congrats! Your first cdk deployment is complete!

Now that it has a skeleton ecs cluster deployed with no actual workload, let's go ahead and make a simple container.

First, make a new directory `mkdir app`, then create a `Dockerfile`

Then create a simple Typescript file that will respond `Hello world` to `HTTP GET /` request.

Then run `npm install express typescript @types/express --save` to install the necessary libaries.

Next, make sure you have docker installed on the local machine, and test it by `docker build -t "hello-world" .` it should produce a docker image. Then run `docker run -d -p 3000:3000 hello-world:latest` to test the image.

When the docker image is ready, we need to run `cdk bootstrap` once so that it will compile the docker image and upload it to AWS ECR.

Finally, we need to add a few lines of code to stand up a ECS Fargate Cluster.

```ts
const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'dxiao-cdk-test-lb-farget', {
    cluster: cluster,
    cpu: 512, // Default is 256
    openListener: false,
    taskImageOptions: {
    image: ecs.ContainerImage.fromAsset(__dirname + '/../app'),
    containerPort: 3000,
    },
});

const process = require('process');
fargateService.loadBalancer.connections.allowFrom(
    ec2.Peer.ipv4(process.env.MY_IP), ec2.Port.tcp(80)
);
```

To keep the load balancer restrictive, I make `openListener: false,` and make use of an environment variable called `MY_IP` so that only myself will be able to access the LB.

Before we go ahead and deploy the changes, let's run `cdk diff` which will show you the differences between the code and the actual workloads on AWS.

If everything looks good, run `cdk synth` will actully show you the CloudFormation template it compiles for this deployment.

When everything looks good, run the following to deploy everything :<3

```bash
CDK_DEFAULT_ACCOUNT='your-aws-account-id' CDK_DEFAULT_REGION='your-aws-region' MY_IP='your-public-ip-address/32' cdk --profile 'your-aws-profile-name' deploy --tags Billing='billing-me' --tags Owner='my-name'
```

Give it a few minutes if everything works well, it will output something like this:

```bash
'Outputs:
CdkTypescriptDemoStack.dxiaocdktestlbfargetServiceURL391753FB = http://CdkTy-dxiao-1XYVV05TTDT5-419211149.us-east-1.elb.amazonaws.com
```

And go ahead and test it!

When you are satified with the test, you can destroy everything by running the last command and replacing `deploy` with `destroy`. 

That's it!
