# Pull Request (PR) Description

## What was done?

- [x] Task 6.1: Lambda function `catalogBatchProcess` was implemented to process records from the `catalogItemsQueue`.
- [x] Task 6.2: `importFileParser` Lambda was updated to send each parsed CSV record to the SQS queue.
- [x] Task 6.3: SNS topic `createProductTopic` and email subscription were created.
- [x] Task 6.4: All changes were committed to a separate branch `task-6`.

## Links

- **Product Service API:** https://1k2a51u50g.execute-api.eu-central-1.amazonaws.com/dev
- **Import Service API:** https://iof9qtnvlj.execute-api.eu-central-1.amazonaws.com/dev

- **Frontend Repository:** https://github.com/szemeredik/shop-angular-cloudfront/tree/task-5
- **Frontend CloudFront URL:** https://d305jm08ln0fde.cloudfront.net

- **template csv for testing purposes:** https://github.com/szemeredik/shop-backend/blob/task-6/import-service/products1.csv
