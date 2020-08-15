import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import ecs_patterns = require('@aws-cdk/aws-ecs-patterns');

export class CdkTypescriptDemoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const vpc = ec2.Vpc.fromLookup(this,'dev-us-east-1-vpc',{vpcId: 'vpc-2a8a5f53'});
    const cluster = new ecs.Cluster(this,'dxiao-cdk-test-ecs-cluster', {
      vpc: vpc,
    });

    const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'dxiao-cdk-test-lb-farget', {
      cluster: cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset(__dirname + '/../app'),
        containerPort: 3000,
      },
    });
//    console.log(fargateService.service.connections.securityGroups);
  }
}
