### What was done?

1. **Task 5.1:**

   - Created a new service called `import-service`.
   - Created and configured an S3 bucket with an `uploaded` folder.

2. **Task 5.2:**

   - Created the `importProductsFile` lambda function.
   - Implemented logic to create a signed URL for uploading files.
   - Successfully tested the signed URL generation and file upload to the S3 bucket.

3. **Task 5.3:**
   - Created the `importFileParser` lambda function.
   - Configured it to trigger on S3 events for the `uploaded` folder.
   - Implemented logic to parse CSV files and move them from the `uploaded` folder to the `parsed` folder.
   - Successfully tested file parsing and movement.

### API Endpoints:

- **GET** /import: Generates a signed URL for uploading files.

[https://p2th1l7x55.execute-api.eu-central-1.amazonaws.com/dev/import?name=products.csv](https://p2th1l7x55.execute-api.eu-central-1.amazonaws.com/dev/import?name=products.csv)

### Links:

- **CloudFront URL:** [https://d305jm08ln0fde.cloudfront.net/](https://d305jm08ln0fde.cloudfront.net/)
- **Frontend Repository:** [https://github.com/szemeredik/shop-angular-cloudfront/tree/task-5](https://github.com/szemeredik/shop-angular-cloudfront/tree/task-5)
- **Backend Repository:** [https://github.com/szemeredik/shop-backend/tree/task-5](https://github.com/szemeredik/shop-backend/tree/task-5)

### Notes:

- Async/await is used in lambda functions.
- Parsed CSV files are moved to the `parsed` folder after processing.
