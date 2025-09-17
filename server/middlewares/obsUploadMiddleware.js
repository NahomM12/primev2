const multer = require("multer");
const path = require("path");
const fs = require("fs");
const obsService = require("../services/obsService");

/**
 * OBS Upload Middleware
 * Handles file uploads specifically for OBS storage
 */

// Configure multer for temporary file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tempDir = path.join(__dirname, "../temp/obs-uploads");

    // Ensure temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10, // Maximum 10 files
  },
});

/**
 * Middleware to upload files to OBS and clean up temp files
 */
const obsUploadMiddleware = (fieldName = "images") => {
  return [
    upload.array(fieldName, 10), // Allow up to 10 files
    async (req, res, next) => {
      try {
        if (!req.files || req.files.length === 0) {
          return res.status(400).json({
            success: false,
            error: "No files uploaded",
          });
        }

        const uploadResults = [];
        const tempFiles = [];

        // Upload each file to OBS
        for (const file of req.files) {
          tempFiles.push(file.path); // Track temp files for cleanup

          try {
            const metadata = {
              "x-obs-meta-original-name": file.originalname,
              "x-obs-meta-mime-type": file.mimetype,
              "x-obs-meta-size": file.size.toString(),
              "x-obs-meta-uploader": req.user
                ? req.user._id.toString()
                : "anonymous",
              "x-obs-meta-upload-source": "onprintz-middleware",
            };

            const result = await obsService.uploadImage(
              file.path,
              file.originalname,
              metadata
            );

            uploadResults.push({
              originalName: file.originalname,
              size: file.size,
              mimetype: file.mimetype,
              obsResult: result,
            });
          } catch (uploadError) {
            console.error(
              `Failed to upload ${file.originalname} to OBS:`,
              uploadError
            );
            uploadResults.push({
              originalName: file.originalname,
              error: uploadError.message,
            });
          }
        }

        // Clean up temporary files
        tempFiles.forEach((tempFile) => {
          try {
            if (fs.existsSync(tempFile)) {
              fs.unlinkSync(tempFile);
              console.log(`🗑️ Cleaned up temp file: ${tempFile}`);
            }
          } catch (cleanupError) {
            console.error(
              `Failed to clean up temp file ${tempFile}:`,
              cleanupError
            );
          }
        });

        // Attach results to request object
        req.obsUploadResults = uploadResults;

        // Check if any uploads failed
        const failedUploads = uploadResults.filter((result) => result.error);
        if (failedUploads.length > 0) {
          return res.status(500).json({
            success: false,
            error: "Some files failed to upload",
            details: failedUploads,
          });
        }

        next();
      } catch (error) {
        console.error("OBS upload middleware error:", error);

        // Clean up any temp files on error
        if (req.files) {
          req.files.forEach((file) => {
            try {
              if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
              }
            } catch (cleanupError) {
              console.error(
                `Failed to clean up temp file on error:`,
                cleanupError
              );
            }
          });
        }

        res.status(500).json({
          success: false,
          error: "Upload processing failed",
          details: error.message,
        });
      }
    },
  ];
};

/**
 * Middleware for single file upload
 */
const obsUploadSingle = (fieldName = "image") => {
  return [
    upload.single(fieldName),
    async (req, res, next) => {
      try {
        if (!req.file) {
          return res.status(400).json({
            success: false,
            error: "No file uploaded",
          });
        }

        const tempFile = req.file.path;

        try {
          const metadata = {
            "x-obs-meta-original-name": req.file.originalname,
            "x-obs-meta-mime-type": req.file.mimetype,
            "x-obs-meta-size": req.file.size.toString(),
            "x-obs-meta-uploader": req.user
              ? req.user._id.toString()
              : "anonymous",
            "x-obs-meta-upload-source": "onprintz-middleware",
          };

          const result = await obsService.uploadImage(
            req.file.path,
            req.file.originalname,
            metadata
          );

          // Attach result to request object
          req.obsUploadResult = {
            originalName: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
            obsResult: result,
          };

          // Clean up temporary file
          if (fs.existsSync(tempFile)) {
            fs.unlinkSync(tempFile);
            console.log(`🗑️ Cleaned up temp file: ${tempFile}`);
          }

          next();
        } catch (uploadError) {
          // Clean up temp file on error
          if (fs.existsSync(tempFile)) {
            fs.unlinkSync(tempFile);
          }

          console.error("Failed to upload file to OBS:", uploadError);
          res.status(500).json({
            success: false,
            error: "File upload failed",
            details: uploadError.message,
          });
        }
      } catch (error) {
        console.error("OBS upload single middleware error:", error);

        // Clean up temp file on error
        if (req.file && fs.existsSync(req.file.path)) {
          try {
            fs.unlinkSync(req.file.path);
          } catch (cleanupError) {
            console.error(
              "Failed to clean up temp file on error:",
              cleanupError
            );
          }
        }

        res.status(500).json({
          success: false,
          error: "Upload processing failed",
          details: error.message,
        });
      }
    },
  ];
};

/**
 * Error handling middleware for multer errors
 */
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({
          success: false,
          error: "File too large. Maximum size is 10MB.",
        });
      case "LIMIT_FILE_COUNT":
        return res.status(400).json({
          success: false,
          error: "Too many files. Maximum is 10 files.",
        });
      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({
          success: false,
          error: "Unexpected file field.",
        });
      default:
        return res.status(400).json({
          success: false,
          error: "File upload error: " + error.message,
        });
    }
  } else if (error.message === "Only image files are allowed!") {
    return res.status(400).json({
      success: false,
      error: "Only image files are allowed!",
    });
  }

  next(error);
};

module.exports = {
  obsUploadMiddleware,
  obsUploadSingle,
  handleMulterError,
};
