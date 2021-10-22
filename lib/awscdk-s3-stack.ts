import * as cdk from '@aws-cdk/core';
import {Bucket, BucketEncryption, BucketPolicy, IBucket} from "@aws-cdk/aws-s3";
import { AnyPrincipal, Effect, PolicyStatement} from '@aws-cdk/aws-iam';

export class AwscdkS3Stack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        //Creating a bucket
        const s3Bucket = new Bucket(this, 'S3Bucket', {
            encryption: BucketEncryption.S3_MANAGED,
            versioned: true,
            serverAccessLogsBucket: this.createServerAccessLogsBucket(),
        });

        //Creating a S3 bucket policy object
        const s3BucketPolicy = new BucketPolicy(this, 'S3BucketPolicy', {
            bucket: s3Bucket
        })

        //Adding the bucket policy statement to deny object and object version deletion
        s3BucketPolicy.document.addStatements(
            new PolicyStatement({
                effect: Effect.DENY,
                principals: [new AnyPrincipal()],
                actions: ['s3:DeleteObject', 's3:DeleteObjectVersion'],
                resources: [`${s3Bucket.bucketArn}/*`]
            })
        )

    }

    //Creating a bucket for access logs
    private createServerAccessLogsBucket = (): IBucket => {
        return new Bucket(this, 'ServerAccessLogsBucket');
    }
}
