import json
import base64
import boto3

s3 = boto3.client('s3')

def lambda_handler(event, context):
    try:
        print(event)
        request_body = json.loads(event['body'])
        image_file = request_body['body']
        file_name = request_body['name']
        file_type = request_body['type']
        
        print(file_name)
        print(file_type)
        
        image_buffer = base64.b64decode(image_file)

        # Generate a unique filename for the image
        image_key = f"uploads/{file_name}"  # Customize the key as per your requirements

        # Set up the parameters for S3 upload
        bucket_name = 'photostoragedata1'  # Replace with your actual S3 bucket name
        params = {
            'Bucket': bucket_name,
            'Key': image_key,
            'Body': image_buffer,
            'ContentType': file_type,  # Set the appropriate content type for your images
            'ContentDisposition': 'attachment',
        }

        # Upload the image to S3
        s3.put_object(**params)

        # Return a response with the URL of the uploaded image
        image_url = f"https://{bucket_name}.s3.amazonaws.com/{image_key}"
        response = {
            'statusCode': 200,
            'body': json.dumps({'imageURL': image_url}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST',
            },
        }
        return response
    except Exception as e:
        print('Error uploading image:', e)
        response = {
            'statusCode': 500,
            'body': json.dumps({'message': 'Failed to upload image'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST',
            },
        }
        return response
