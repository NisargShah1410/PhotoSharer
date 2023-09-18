import json
import boto3

sqs = boto3.client('sqs', region_name='us-east-1')

def lambda_handler(event, context):
    print(event['body'])
    request_body = json.loads(event['body'])
    receipt_handle = request_body['receiptHandle']
    print(receipt_handle)

    try:
        response = sqs.delete_message(
            QueueUrl="https://sqs.us-east-1.amazonaws.com/945993880090/sqsCloud",
            ReceiptHandle=receipt_handle
        )

        print('Deletion successful:', response)
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
        print('Failed to delete invitation:', e)
        return {
            'statusCode': 500,
            'body': json.dumps(e),
            'headers': {
                'Access-Control-Allow-Origin': '*',  # You may restrict this to specific domains
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST',
            },
        }
