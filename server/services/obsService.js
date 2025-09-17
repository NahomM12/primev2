const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const obsConfig = require("../config/obsConfig");

/**
 * OBS (Object Storage Service) Service
 * Provides comprehensive image storage operations for OBS-compatible storage
 */
class OBSService {
  constructor() {
    this.config = obsConfig;
  }

  /**
   * Make HTTP request to OBS
   * @param {string} method - HTTP method
   * @param {string} objectKey - Object key (optional)
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  async makeRequest(method, objectKey = "", options = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(
        objectKey
          ? this.config.getObjectUrl(objectKey)
          : this.config.getBucketUrl()
      );
      const isHttps = url.protocol === "https:";
      const httpModule = isHttps ? https : http;

      // Calculate payload hash for x-amz-content-sha256 header
      const payload = options.body || "";
      const payloadHash = crypto
        .createHash("sha256")
        .update(payload)
        .digest("hex");

      const headers = {
        Host: url.host,
        Date: new Date().toUTCString(),
        "Content-Type": options.contentType || "application/octet-stream",
        "x-amz-content-sha256": payloadHash, // Required for OBS/AWS Signature V4
        ...options.headers,
      };

      if (options.body) {
        headers["Content-Length"] = Buffer.byteLength(options.body);
        headers["Content-MD5"] = crypto
          .createHash("md5")
          .update(options.body)
          .digest("base64");
      }

      // Generate authorization header
      const authorization = this.config.generateSignature(
        method,
        url.pathname,
        headers,
        payload
      );
      headers["Authorization"] = authorization;

      const requestOptions = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname + url.search,
        method: method,
        headers: headers,
      };

      const req = httpModule.request(requestOptions, (res) => {
        const chunks = [];

        res.on("data", (chunk) => {
          chunks.push(chunk);
        });

        res.on("end", () => {
          // For binary data (like images), concatenate as Buffer
          // For text data, convert to string
          const isBinaryRequest =
            method === "GET" && objectKey && !objectKey.endsWith(".xml");
          const data = isBinaryRequest
            ? Buffer.concat(chunks)
            : Buffer.concat(chunks).toString();

          const response = {
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
          };

          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            const errorMessage = isBinaryRequest
              ? `Binary data error (${chunks.length} chunks)`
              : data;
            reject(
              new Error(
                `OBS request failed: ${res.statusCode} - ${errorMessage}`
              )
            );
          }
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      if (options.body) {
        req.write(options.body);
      }

      req.end();
    });
  }

  /**
   * Make HTTP request to a specific URL (for bucket listing)
   * @param {string} method - HTTP method
   * @param {string} fullUrl - Complete URL with query parameters
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  async makeRequestToUrl(method, fullUrl, options = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(fullUrl);
      const isHttps = url.protocol === "https:";
      const httpModule = isHttps ? https : http;

      // Calculate payload hash for x-amz-content-sha256 header
      const payload = options.body || "";
      const payloadHash = crypto
        .createHash("sha256")
        .update(payload)
        .digest("hex");

      const headers = {
        Host: url.host,
        Date: new Date().toUTCString(),
        "Content-Type": options.contentType || "application/octet-stream",
        "x-amz-content-sha256": payloadHash,
        ...options.headers,
      };

      if (options.body) {
        headers["Content-Length"] = Buffer.byteLength(options.body);
        headers["Content-MD5"] = crypto
          .createHash("md5")
          .update(options.body)
          .digest("base64");
      }

      // For bucket listing, we need to include query parameters in the signature
      const pathWithQuery = url.pathname + url.search;
      const authorization = this.config.generateSignature(
        method,
        pathWithQuery,
        headers,
        payload
      );
      headers["Authorization"] = authorization;

      const requestOptions = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: pathWithQuery,
        method: method,
        headers: headers,
      };

      console.log("🔗 Making request to:", url.href);
      console.log("📋 Request headers:", Object.keys(headers));

      const req = httpModule.request(requestOptions, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          const response = {
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
          };

          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(
              new Error(`OBS request failed: ${res.statusCode} - ${data}`)
            );
          }
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      if (options.body) {
        req.write(options.body);
      }

      req.end();
    });
  }

  /**
   * Create bucket if it doesn't exist
   * @returns {Promise<boolean>} Success status
   */
  async createBucket() {
    try {
      // First check if bucket exists
      await this.makeRequest("HEAD");
      console.log("✅ Bucket already exists");
      return true;
    } catch (error) {
      if (error.message.includes("404")) {
        try {
          // Create bucket
          await this.makeRequest("PUT", "", {
            headers: {
              "x-obs-acl": "private",
            },
          });
          console.log("✅ Bucket created successfully");
          return true;
        } catch (createError) {
          console.error("❌ Failed to create bucket:", createError.message);
          throw createError;
        }
      } else {
        console.error("❌ Error checking bucket:", error.message);
        throw error;
      }
    }
  }

  /**
   * Upload image to OBS
   * @param {Buffer|string} imageData - Image data (Buffer or base64 string)
   * @param {string} fileName - File name
   * @param {Object} options - Upload options
   * @param {string} options.folder - Folder path (e.g., 'products/front', 'products/back', 'images')
   * @param {Object} options.metadata - Additional metadata
   * @returns {Promise<Object>} Upload result with Cloudinary-compatible structure
   */
  async uploadImage(imageData, fileName, options = {}) {
    try {
      const { folder = "images", metadata = {} } = options;

      // Ensure bucket exists
      await this.createBucket();

      // Process image data
      let buffer;
      let contentType = "image/jpeg";

      if (typeof imageData === "string") {
        // Handle base64 data
        if (imageData.startsWith("data:")) {
          const matches = imageData.match(/^data:([^;]+);base64,(.+)$/);
          if (matches) {
            contentType = matches[1];
            buffer = Buffer.from(matches[2], "base64");
          } else {
            throw new Error("Invalid base64 data format");
          }
        } else {
          // Assume it's a file path
          buffer = fs.readFileSync(imageData);
          contentType = this.getContentType(imageData);
        }
      } else if (Buffer.isBuffer(imageData)) {
        buffer = imageData;
      } else {
        throw new Error("Invalid image data format");
      }

      // Generate unique object key with folder
      const timestamp = Date.now();
      const randomString = crypto.randomBytes(8).toString("hex");
      const extension =
        this.getFileExtension(fileName) ||
        this.getExtensionFromContentType(contentType);
      const objectKey = `${folder}/${timestamp}-${randomString}${extension}`;

      // Get image dimensions (basic implementation)
      let width = 1000; // Default width
      let height = 1000; // Default height

      // Prepare headers
      const headers = {
        "Content-Type": contentType,
        "x-obs-meta-original-name": fileName,
        "x-obs-meta-upload-time": new Date().toISOString(),
        "x-obs-meta-folder": folder,
        ...metadata,
      };

      // Upload to OBS
      const response = await this.makeRequest("PUT", objectKey, {
        body: buffer,
        contentType: contentType,
        headers: headers,
      });

      // Return Cloudinary-compatible structure
      const result = {
        success: true,
        url: this.config.getObjectUrl(objectKey),
        secure_url: this.config.getObjectUrl(objectKey),
        public_id: objectKey,
        width: width,
        height: height,
        format: this.getFormatFromContentType(contentType),
        resource_type: "image",
        bytes: buffer.length,
        created_at: new Date().toISOString(),
        folder: folder,
        etag: response.headers.etag,
        // OBS-specific fields
        objectKey: objectKey,
        contentType: contentType,
        fileName: fileName,
      };

      console.log("✅ Image uploaded successfully:", objectKey);
      return result;
    } catch (error) {
      console.error("❌ Image upload failed:", error.message);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  /**
   * Download image from OBS
   * @param {string} objectKey - Object key
   * @returns {Promise<Buffer>} Image data
   */
  async downloadImage(objectKey) {
    try {
      const response = await this.makeRequest("GET", objectKey);
      // response.body is already a Buffer for binary requests
      return Buffer.isBuffer(response.body)
        ? response.body
        : Buffer.from(response.body, "binary");
    } catch (error) {
      console.error("❌ Image download failed:", error.message);
      throw new Error(`Failed to download image: ${error.message}`);
    }
  }

  /**
   * Delete image from OBS
   * @param {string} objectKey - Object key
   * @returns {Promise<boolean>} Success status
   */
  async deleteImage(objectKey) {
    try {
      await this.makeRequest("DELETE", objectKey);
      console.log("✅ Image deleted successfully:", objectKey);
      return true;
    } catch (error) {
      console.error("❌ Image deletion failed:", error.message);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }

  /**
   * Delete image from OBS by URL
   * @param {string} imageUrl - Full image URL
   * @returns {Promise<boolean>} Success status
   */
  async deleteImageByUrl(imageUrl) {
    try {
      if (!imageUrl || !imageUrl.includes(this.config.endpoint)) {
        console.log(
          "⚠️ Image URL is not from OBS, skipping deletion:",
          imageUrl
        );
        return false;
      }

      // Extract object key from URL
      const urlParts = imageUrl.split("/");
      const bucketIndex = urlParts.findIndex((part) =>
        part.includes(this.config.endpoint)
      );
      if (bucketIndex === -1) {
        throw new Error("Invalid OBS URL format");
      }

      // Get the object key (everything after the bucket name)
      const objectKey = urlParts.slice(bucketIndex + 1).join("/");

      if (!objectKey) {
        throw new Error("Could not extract object key from URL");
      }

      console.log("🗑️ Deleting image:", objectKey);
      await this.makeRequest("DELETE", objectKey);
      console.log("✅ Image deleted successfully:", objectKey);
      return true;
    } catch (error) {
      console.error("❌ Image deletion failed:", error.message);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }

  /**
   * Check if URL is from OBS
   * @param {string} url - Image URL
   * @returns {boolean} True if URL is from OBS
   */
  isOBSUrl(url) {
    return url && url.includes(this.config.endpoint);
  }

  /**
   * Get image metadata
   * @param {string} objectKey - Object key
   * @returns {Promise<Object>} Image metadata
   */
  async getImageMetadata(objectKey) {
    try {
      const response = await this.makeRequest("HEAD", objectKey);

      return {
        objectKey: objectKey,
        size: parseInt(response.headers["content-length"]) || 0,
        contentType: response.headers["content-type"],
        lastModified: response.headers["last-modified"],
        etag: response.headers.etag,
        metadata: this.extractCustomMetadata(response.headers),
      };
    } catch (error) {
      console.error("❌ Failed to get image metadata:", error.message);
      throw new Error(`Failed to get image metadata: ${error.message}`);
    }
  }

  /**
   * List images in bucket
   * @param {Object} options - List options
   * @returns {Promise<Array>} List of images
   */
  async listImages(options = {}) {
    try {
      console.log("🔍 Listing objects in OBS bucket...");

      // For listing bucket contents, we need to make a request to the bucket root
      // with query parameters for listing
      const queryParams = new URLSearchParams({
        prefix: options.prefix || "", // Get all objects, not just images/ folder
        "max-keys": options.maxKeys || 1000,
      });

      if (options.marker) {
        queryParams.set("marker", options.marker);
      }

      // Create a custom URL for bucket listing
      const bucketUrl = this.config.getBucketUrl();
      const listUrl = `${bucketUrl}?${queryParams.toString()}`;

      console.log("📋 Listing URL:", listUrl);

      // Make request to bucket root with query parameters
      const response = await this.makeRequestToUrl("GET", listUrl);

      console.log("📊 List response status:", response.statusCode);
      console.log("📄 Response body preview:", response.body.substring(0, 200));

      // Parse XML response
      const images = this.parseListResponse(response.body);
      console.log(`✅ Found ${images.length} objects in bucket`);

      return images;
    } catch (error) {
      console.error("❌ Failed to list images:", error.message);
      throw new Error(`Failed to list images: ${error.message}`);
    }
  }

  /**
   * Generate presigned URL for temporary access
   * @param {string} objectKey - Object key
   * @param {number} expiresIn - Expiration time in seconds
   * @param {string} method - HTTP method
   * @returns {string} Presigned URL
   */
  generatePresignedUrl(objectKey, expiresIn = 3600, method = "GET") {
    return this.config.generatePresignedUrl(objectKey, expiresIn, method);
  }

  // Helper methods
  getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
    };
    return mimeTypes[ext] || "application/octet-stream";
  }

  getFileExtension(fileName) {
    return path.extname(fileName);
  }

  getExtensionFromContentType(contentType) {
    const extensions = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/gif": ".gif",
      "image/webp": ".webp",
      "image/svg+xml": ".svg",
    };
    return extensions[contentType] || ".jpg";
  }

  getFormatFromContentType(contentType) {
    const formats = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
      "image/svg+xml": "svg",
    };
    return formats[contentType] || "jpg";
  }

  extractCustomMetadata(headers) {
    const metadata = {};
    Object.keys(headers).forEach((key) => {
      if (key.startsWith("x-obs-meta-")) {
        const metaKey = key.replace("x-obs-meta-", "");
        metadata[metaKey] = headers[key];
      }
    });
    return metadata;
  }

  parseListResponse(xmlBody) {
    // Simplified XML parsing - in production, use a proper XML parser
    const images = [];
    const keyRegex = /<Key>(.*?)<\/Key>/g;
    const sizeRegex = /<Size>(.*?)<\/Size>/g;
    const lastModifiedRegex = /<LastModified>(.*?)<\/LastModified>/g;

    let keyMatch, sizeMatch, lastModifiedMatch;
    let index = 0;

    while ((keyMatch = keyRegex.exec(xmlBody)) !== null) {
      sizeMatch = sizeRegex.exec(xmlBody);
      lastModifiedMatch = lastModifiedRegex.exec(xmlBody);

      images.push({
        key: keyMatch[1],
        size: sizeMatch ? parseInt(sizeMatch[1]) : 0,
        lastModified: lastModifiedMatch ? lastModifiedMatch[1] : null,
        url: this.config.getObjectUrl(keyMatch[1]),
      });
      index++;
    }

    return images;
  }
}

module.exports = new OBSService();
