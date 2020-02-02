# lambda-zip-bucket-s3
⚡ Function Lambda para Zipar Buckets do Amazon S3. Para acioná-lo, deverão ser passados os seguintes parâmetros:
```
"event": {
      "bucket_name_source" : "bucket-source-test",
      "bucket_name_dest" : "bucket-dest-test",
      "archive_name_dest" : "test.zip",
      "archive_public_access" : True,
      "amount_of_files_to_upload" : 10
}
```

| CodeFactor |
|:---:|
|[![CodeFactor](https://www.codefactor.io/repository/github/rafaeldalsenter/lambda-zip-bucket-s3/badge?s=f6c7b966804d5fda1d060c0d0513f16c90e7fb33)](https://www.codefactor.io/repository/github/rafaeldalsenter/lambda-zip-bucket-s3)|
