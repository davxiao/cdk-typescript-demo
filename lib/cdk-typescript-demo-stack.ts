import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import ecs_patterns = require('@aws-cdk/aws-ecs-patterns');

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

    const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'dxiao-cdk-test-lb-farget', {
      cluster: cluster,
      cpu: 512, // Default is 256
      openListener: false,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset(__dirname + '/../app'),
        containerPort: 3000,
      },
      //if you prefer to use pre-built docker image for testing, use the following instead:
      /*
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
      },
      */
    });

    const process = require('process');
    fargateService.loadBalancer.connections.allowFrom(
      ec2.Peer.ipv4(process.env.MY_IP), ec2.Port.tcp(80)
    );
  }
}
