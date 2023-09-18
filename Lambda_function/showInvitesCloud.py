import boto3
import json

sqs = boto3.client('sqs', region_name='us-east-1')

def lambda_handler(event, context):
    try:
        response = sqs.receive_message(
            QueueUrl="https://sqs.us-east-1.amazonaws.com/945993880090/sqsCloud",
            MaxNumberOfMessages=10,
            WaitTimeSeconds=10,
            VisibilityTimeout=0
        )

        messages = response['Messages']
        print('Invitation sent:', messages)
        return {
            'statusCode': 200,
            'body': json.dumps(messages),
            'headers': {
                'Access-Control-Allow-Origin': '*',  # You may restrict this to specific domains
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST',
            },
        }
    except Exception as e:
        print('Failed to receive messages:', e)
        return {
            'statusCode': 500,
            'body': json.dumps(e),
            'headers': {
                'Access-Control-Allow-Origin': '*',  # You may restrict this to specific domains
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST',
            },
        }
