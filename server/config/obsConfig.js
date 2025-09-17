const crypto = require("crypto");

/**
 * OBS (Object Storage Service) Configuration
 * This configuration supports Huawei OBS and other S3-compatible storage services
 */
class OBSConfig {
  constructor() {
    this.accessKeyId = process.env.OBS_ACCESS_KEY_ID;
    this.secretAccessKey = process.env.OBS_SECRET_ACCESS_KEY;
    this.region = process.env.OBS_REGION || "us-east-1";
    this.endpoint = process.env.OBS_ENDPOINT;
    this.bucketName = process.env.OBS_BUCKET_NAME || "onprintz-images";
    this.signatureVersion = "v4";
    this.serviceName = "obs";

    // Validate required configuration
    this.validateConfig();
  }

  validateConfig() {
    const required = ["accessKeyId", "secretAccessKey", "endpoint"];
    const missing = required.filter((key) => !this[key]);

    if (missing.length > 0) {
      throw new Error(
        `Missing required OBS configuration: ${missing.join(", ")}`
      );
    }
  }

  /**
   * Generate AWS Signature Version 4
   * @param {string} method - HTTP method
   * @param {string} path - Request path
   * @param {Object} headers - Request headers
   * @param {string} payload - Request payload
   * @returns {string} Authorization header value
   */
  generateSignature(method, pathWithQuery, headers, payload = "") {
    const now = new Date();
    const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, "");
    const timeStamp = now.toISOString().slice(0, 19).replace(/[-:]/g, "") + "Z";

    // Split path and query string
    const [path, queryString = ""] = pathWithQuery.split("?");

    // Create canonical request
    const canonicalHeaders =
      Object.keys(headers)
        .sort()
        .map((key) => {
          const value = headers[key];
          const stringValue = typeof value === "string" ? value : String(value);
          return `${key.toLowerCase()}:${stringValue.trim()}`;
        })
        .join("\n") + "\n";

    const signedHeaders = Object.keys(headers)
      .sort()
      .map((key) => key.toLowerCase())
      .join(";");

    const payloadHash = crypto
      .createHash("sha256")
      .update(payload)
      .digest("hex");

    // Canonical query string (sort parameters)
    const canonicalQueryString = queryString
      ? queryString
          .split("&")
          .sort()
          .map((param) => {
            const [key, value = ""] = param.split("=");
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
          })
          .join("&")
      : "";

    const canonicalRequest = [
      method,
      path,
      canonicalQueryString,
      canonicalHeaders,
      signedHeaders,
      payloadHash,
    ].join("\n");

    // Create string to sign
    const credentialScope = `${dateStamp}/${this.region}/${this.serviceName}/aws4_request`;
    const stringToSign = [
      "AWS4-HMAC-SHA256",
      timeStamp,
      credentialScope,
      crypto.createHash("sha256").update(canonicalRequest).digest("hex"),
    ].join("\n");

    // Calculate signature
    const kDate = crypto
      .createHmac("sha256", `AWS4${this.secretAccessKey}`)
      .update(dateStamp)
      .digest();
    const kRegion = crypto
      .createHmac("sha256", kDate)
      .update(this.region)
      .digest();
    const kService = crypto
      .createHmac("sha256", kRegion)
      .update(this.serviceName)
      .digest();
    const kSigning = crypto
      .createHmac("sha256", kService)
      .update("aws4_request")
      .digest();
    const signature = crypto
      .createHmac("sha256", kSigning)
      .update(stringToSign)
      .digest("hex");

    return `AWS4-HMAC-SHA256 Credential=${this.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  }

  /**
   * Get base URL for OBS requests
   * @returns {string} Base URL
   */
  getBaseUrl() {
    return `https://${this.bucketName}.${this.endpoint}`;
  }

  /**
   * Get bucket URL
   * @returns {string} Bucket URL
   */
  getBucketUrl() {
    return `https://${this.endpoint}/${this.bucketName}`;
  }

  /**
   * Generate object URL
   * @param {string} objectKey - Object key/path
   * @returns {string} Object URL
   */
  getObjectUrl(objectKey) {
    return `${this.getBaseUrl()}/${objectKey}`;
  }

  /**
   * Generate presigned URL for temporary access
   * @param {string} objectKey - Object key
   * @param {number} expiresIn - Expiration time in seconds (default: 1 hour)
   * @param {string} method - HTTP method (default: GET)
   * @returns {string} Presigned URL
   */
  generatePresignedUrl(objectKey, expiresIn = 3600, method = "GET") {
    const now = new Date();
    const expires = new Date(now.getTime() + expiresIn * 1000);
    const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, "");
    const timeStamp = now.toISOString().slice(0, 19).replace(/[-:]/g, "") + "Z";

    const credentialScope = `${dateStamp}/${this.region}/${this.serviceName}/aws4_request`;
    const credential = `${this.accessKeyId}/${credentialScope}`;

    const queryParams = new URLSearchParams({
      "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
      "X-Amz-Credential": credential,
      "X-Amz-Date": timeStamp,
      "X-Amz-Expires": expiresIn.toString(),
      "X-Amz-SignedHeaders": "host",
    });

    const canonicalRequest = [
      method,
      `/${objectKey}`,
      queryParams.toString(),
      `host:${this.bucketName}.${this.endpoint}\n`,
      "host",
      "UNSIGNED-PAYLOAD",
    ].join("\n");

    const stringToSign = [
      "AWS4-HMAC-SHA256",
      timeStamp,
      credentialScope,
      crypto.createHash("sha256").update(canonicalRequest).digest("hex"),
    ].join("\n");

    const kDate = crypto
      .createHmac("sha256", `AWS4${this.secretAccessKey}`)
      .update(dateStamp)
      .digest();
    const kRegion = crypto
      .createHmac("sha256", kDate)
      .update(this.region)
      .digest();
    const kService = crypto
      .createHmac("sha256", kRegion)
      .update(this.serviceName)
      .digest();
    const kSigning = crypto
      .createHmac("sha256", kService)
      .update("aws4_request")
      .digest();
    const signature = crypto
      .createHmac("sha256", kSigning)
      .update(stringToSign)
      .digest("hex");

    queryParams.set("X-Amz-Signature", signature);

    return `${this.getBaseUrl()}/${objectKey}?${queryParams.toString()}`;
  }
}

module.exports = new OBSConfig();
