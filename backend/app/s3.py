import boto3
import uuid

s3 = boto3.client("s3")
BUCKET = "ele-products-images"

def upload_image(file):
    filename = str(uuid.uuid4()) + "_" + file.filename

    s3.upload_fileobj(
        file.file,
        BUCKET,
        filename,
        ExtraArgs={"ACL": "public-read", "ContentType": file.content_type}
    )

    return f"https://{BUCKET}.s3.amazonaws.com/{filename}"
