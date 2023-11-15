import { APIBase } from "./APIBase";
import { Fetcher } from "./utils/Fetcher";
import { APIError, FileUploadOptions } from "./types";
import { ClientError } from "./utils/ClientError";

const DEFAULT_FILE_OPTIONS = {
  upsert: false,
};

/**
 * BucketManager is primarily used to manage a bucket and its contents (e.g., files, documents, images). Using the {@link StorageManager.bucket} method, you can create a BucketManager instance for a specific bucket identified by its unique name.
 *
 * > Each object uploaded to a bucket needs to have a unique name. You cannot upload a file with the same name multiple times to a bucket.
 *
 * @export
 * @class BucketManager
 */
export class BucketManager extends APIBase {
  /**
   * The name of the storage that the bucket manager will be operating on
   * @private
   * @type {string}
   */
  #storageName: string;
  /**
   * The name of the bucket that the bucket manager will be operating on
   * @private
   * @type {string}
   */
  #bucketName: string;

  /**
   * Creates an instance of BucketManager to manage a specific bucket of your cloud storage
   * @param {string} name The name or id of the bucket that this bucket manager will be operating on
   * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
   */
  constructor(storageName: string, bucketName: string, fetcher: Fetcher) {
    super(fetcher);
    this.#storageName = storageName;
    this.#bucketName = bucketName;
  }

  /**
   * Uploads a file to an existing bucket. If there already exists a file with the same name in destination bucket, it ensures the uploaded file name to be unique in its bucket.
   *
   * If `onProgress` callback function is defined in {@link FileUploadOptions}, it periodically calls this function to inform about upload progress. Please note that for the moment **`onProgress` callback function can only be used in clients where `XMLHttpRequest` object is available (e.g., browsers).**
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @param {string} fileName The name of the file e.g., *filename.jpg*
   * @param {any} fileBody The body of the file that will be stored in the bucket
   * @param {FileUploadOptions} options Content type of the file, privacy setting of the file and whether to create the bucket if not exists. If `isPublic` is not specified, defaults to the bucket's privacy setting. If `upsert` is set to true (defaults to false), then overwrites an existing file or creates a new one.
   * @returns Returns the metadata of the uploaded file
   */
  async upload(
    fileName: string,
    fileBody: any,
    options?: FileUploadOptions,
  ): Promise<{ data: object | null; errors: APIError | null }> {
    if (
      (typeof FormData !== "undefined" && fileBody instanceof FormData) ||
      (typeof Blob !== "undefined" && fileBody instanceof Blob) ||
      (typeof File !== "undefined" && fileBody instanceof File)
    ) {
      if (typeof XMLHttpRequest !== "undefined" && options?.onProgress) {
        return await this.fetcher.upload(
          `/storage/${this.#storageName}/bucket/${
            this.#bucketName
          }/upload-formdata`,
          fileBody,
          {
            fileName,
            options: {
              ...DEFAULT_FILE_OPTIONS,
              ...options,
              onProgress: undefined,
            },
          },
          null,
          options.onProgress,
        );
      } else {
        return await this.fetcher.post(
          `/storage/${this.#storageName}/bucket/${
            this.#bucketName
          }/upload-formdata`,
          fileBody,
          {
            fileName,
            options: {
              ...DEFAULT_FILE_OPTIONS,
              ...options,
              onProgress: undefined,
            },
          },
        );
      }
    } else {
      throw new ClientError(
        "unsupported_file_format",
        "You can only upload FormData, Blog or File objects through the Agnost client library",
      );
    }
  }
}
