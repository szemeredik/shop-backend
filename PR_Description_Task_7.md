# PR Description: Task 7 - Implement Authorization Service

## Key Changes

1. **Authorization Service Setup**

   - New `authorization-service` with a `basicAuthorizer` lambda function.

2. **Environment Configuration**

   - Credentials are stored in environment variables and secured by `.env` and `.gitignore`.

3. **Lambda Authorizer**

   - Validates Basic Authentication tokens.
   - Returns HTTP 403 for invalid tokens and HTTP 401 if no token is provided.

4. **Integration with Import Service**

   - `basicAuthorizer` is used for the `/import` path in the `import-service`.

5. **Client Application Updates**
   - Sends `Authorization: Basic {token}` header for `/import`.
   - Retrieves the `authorization_token` from browser **localStorage**.
   - During development, for temporary soulution, token is saved into **localStorage** just before it needs to be read out of it. If login page will be implemented, this solution can be deleted. The **localStorage** implementation in the frontend could be found here (line 21):
     https://github.com/szemeredik/shop-angular-cloudfront/blob/task-7/src/app/admin/manage-products/manage-products.service.ts

## Testing and Validation

- Local and AWS environment tests ensure robust authorization.
- The `/import` path's security is verified under different scenarios.

## Links

- **Product Service API:** https://ryb23pa0hh.execute-api.eu-central-1.amazonaws.com/dev
- **Import Service API:** https://q120n6y0u4.execute-api.eu-central-1.amazonaws.com/dev

- **Frontend Repository:** https://github.com/szemeredik/shop-angular-cloudfront/tree/task-7
- **Frontend CloudFront URL:** https://d305jm08ln0fde.cloudfront.net

- **template csv for testing purposes:** https://github.com/szemeredik/shop-backend/blob/task-6/import-service/products1.csv

Amazon S3 / Buckets / bucket-for-products / Permissions / Cross-origin resource sharing (CORS)
[
{
"AllowedHeaders": [
"*"
],
"AllowedMethods": [
"GET",
"PUT",
"POST",
"DELETE",
"HEAD"
],
"AllowedOrigins": [
"*"
],
"ExposeHeaders": [],
"MaxAgeSeconds": 3000
}
]
