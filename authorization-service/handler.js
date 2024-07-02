const buffer = require("buffer");

module.exports.basicAuthorizer = async (event, context, callback) => {
  if (!event.authorizationToken) {
    console.log("Unauthorized, Missing authorization token, returns 401");
    callback(null, generatePolicy("user", "Deny", event.methodArn)); // Denies all requests
    return;
  }

  const tokenParts = event.authorizationToken.split(" ");
  if (tokenParts[0] !== "Basic" || tokenParts.length !== 2) {
    console.log("Unauthorized, Malformatted token, returns 401");
    callback(null, generatePolicy("user", "Deny", event.methodArn)); // Denies all requests
    return;
  }

  const encodedCreds = tokenParts[1];
  const plainCreds = buffer.Buffer.from(encodedCreds, "base64").toString();
  const [incomingUsername, incomingPassword] = plainCreds.split(":");

  // Directly use the username as the key and the environment variable value as the password
  const storedUsername = "szemeredik"; // The username is hardcoded as the key
  const storedPassword = process.env.szemeredik; // Fetching the password using the key

  console.log("Incoming:", incomingUsername, incomingPassword);
  console.log("Stored:", storedUsername, storedPassword);

  if (
    incomingUsername === storedUsername &&
    incomingPassword === storedPassword
  ) {
    console.log("Authorized, Correct credentials, returns 200");
    callback(null, generatePolicy("user", "Allow", event.methodArn));
  } else {
    console.log("Unauthorized, Incorrect credentials, returns 403");
    callback(null, generatePolicy("user", "Deny", event.methodArn)); // Denies all requests
  }
};

function generatePolicy(principalId, effect, resource) {
  const policyDocument = {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: resource,
      },
    ],
  };
  return {
    principalId: principalId,
    policyDocument: policyDocument,
  };
}
