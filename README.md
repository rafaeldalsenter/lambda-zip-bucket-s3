# lambda-zip-bucket-s3
⚡ Function Lambda para Zipar Buckets do Amazon S3. Para acioná-lo, deverão ser passados os seguintes parâmetros:
```
{
      "bucket_name_source" : "bucket-source-test",
      "bucket_name_dest" : "bucket-dest-test",
      "archive_name_dest" : "test.zip",
      "archive_public_access" : true,
      "amount_of_files_to_upload" : 10
}
```

Parâmetros:
- bucket_name_source: Nome do bucket que estão os arquivos que deverão ser compactados.
- bucket_name_dest: Nome do bucket onde será criado o arquivo zipado.
- archive_name_dest: Nome do arquivo zipado.
- archive_public_access: Passar true, se desejar que o arquivo zipado seja público.
- amount_of_files_to_upload: Caso queira fazer o Upload dos arquivos no ZIP em páginas, especificar a quantidade por página. Caso contrário, preencher o valor 0.

| CodeFactor | Deploy |
|:---:|:---:|
|[![CodeFactor](https://www.codefactor.io/repository/github/rafaeldalsenter/lambda-zip-bucket-s3/badge?s=f6c7b966804d5fda1d060c0d0513f16c90e7fb33)](https://www.codefactor.io/repository/github/rafaeldalsenter/lambda-zip-bucket-s3)|![Lambda deploy](https://github.com/rafaeldalsenter/lambda-zip-bucket-s3/workflows/Lambda%20deploy/badge.svg)
