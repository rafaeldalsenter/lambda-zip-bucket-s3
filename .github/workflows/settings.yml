workflow "Build & deploy" {
  on = "push"
  resolves = ["py-lambda-deploy"]
}

action "py-lambda-deploy" {
  needs = "Master"
  uses = "mariamrf/py-lambda-action@master"
  secrets = [
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "AWS_DEFAULT_REGION",
    "LAMBDA_FUNCTION_NAME",
    "LAMBDA_LAYER_ARN",
  ]
}

# Filter for master branch
action "Master" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}
