# 🕵️ Webhook Spy

_Super-simple Serverless webhook (request) spy service_

## Overview

- Requests are accessed via the defined _path name_; making it easy to group requests based on different use-cases.
- One Lambda for incoming requests (_spying_) and another Lambda for listing them.
- Requests are persisted to a DynamoDB table.
- Old requests are cleaned up automatically based on DynamoDB TTL rules.
- Cheap, cheap, cheap - no need to worry about expring endpoints when using providers free tiers.

## Deployment

- (Optional) update the desired request TTL (default 1 day).
- Deploy using Serverless Framework.
- Pick a desired _path name_.
- Use the deployed _spy_ function for incoming requests i.e. `https://spy-lambda-function-url/{path-name*}`
- Use the deployed _list_ function for viewing these requests i.e. `https://list-lambda-function-url/{path-name*}`
