import json
import os

import boto3
from botocore.exceptions import ClientError


# set environment variable
ENDPOINT_URL = os.environ["ENDPOINT_URL"]
TABLE_NAME = os.environ["TABLE_NAME"]
SITE_DOMAIN = os.environ["SITE_DOMAIN"]  # TODO: get this from event

# Get the service resource.
dynamodb = boto3.resource("dynamodb", endpoint_url=ENDPOINT_URL)


def increase():
    table = dynamodb.Table(TABLE_NAME)

    visits = table.update_item(
        Key={"domain": SITE_DOMAIN},
        # increase site visits
        UpdateExpression="ADD visits :inc",
        ExpressionAttributeValues={":inc": 1},
        ReturnValues="UPDATED_NEW",
    )

    return int(visits["Attributes"]["visits"])


def handler(event, context):
    visits = increase()

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps({"visits": visits}),
    }
