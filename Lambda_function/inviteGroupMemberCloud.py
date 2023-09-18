import json
import boto3
import os

sns = boto3.client('sns', region_name='us-east-1')

def lambda_handler(event, context):
    print(event['body'])
    request_body = json.loads(event['body'])
    email = request_body['email']
    group_name = request_body['group_name']
    group_id = request_body['group_id']
    mess = request_body['message']
    sns_topic_arn = os.environ['SNSTopicARN']
    print(mess)
    print(email)
    print(group_name)
    print(group_id)

    try:
        response = sns.publish(
            Message=mess,
            TopicArn=sns_topic_arn,
            MessageAttributes={
                'email': {
                    'DataType': 'String',
                    'StringValue': email,
                },
                'group_name': {
                    'DataType': 'String',
                    'StringValue': group_name,
                },
                'group_id': {
                    'DataType': 'String',
                    'StringValue': str(group_id),
                },
            },
        )

        print('Invitation sent:', response)
        return {
        'statusCode': 200,
        'body': json.dumps(response),
        'headers': {
                    'Access-Control-Allow-Origin': '*',  # You may restrict this to specific domains
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST',
                },
        }
    except Exception as e:
        print('Failed to send invitation:', e)
        return {
        'statusCode': 500,
        'body': json.dumps(e),
        'headers': {
                    'Access-Control-Allow-Origin': '*',  # You may restrict this to specific domains
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST',
                },
        }
