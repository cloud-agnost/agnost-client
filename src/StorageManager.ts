import { APIBase } from "./APIBase";
import { Fetcher } from "./utils/Fetcher";
import { BucketManager } from "./BucketManager";

/**
 * Allows you access your app's cloud storage buckets. With StorageManager you can upload files to a specific bucket.
 *
 * You store your files, documents, images etc. under buckets, which are the basic containers that hold your application data. You typically create a bucket and upload files/objects to this bucket. The Agnost client library only provides a single convenience method to upload a file to a specific bucket of your storage. In order to manage buckets or files contained in bucktes you need to crate your own endpoints and user Agnost's server-side library.
 *
 * @export
 * @class StorageManager
 */
export class StorageManager extends APIBase {
	/**
	 * The name of the storage that the storage manager will be operating on
	 * @private
	 * @type {string}
	 */
	#storageName: string;

	/**
	 * Creates an instance of StorageManager to manage storage (i.e., files) of your application.
	 * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
	 */
	constructor(storageName: string, fetcher: Fetcher) {
		super(fetcher);
		this.#storageName = storageName;
	}

	/**
	 * Creates a new {@link BucketManager} object for the specified bucket.
	 *
	 * Buckets are the basic containers that hold your application data (i.e., files). Everything that you store in your app storage must be contained in a bucket. You can use buckets to organize your data and control access to your data, but unlike directories and folders, you cannot nest buckets.
	 *
	 * @param {string} name The name of the bucket.
	 * @returns Returns a new {@link BucketManager} object that will be used for managing the bucket
	 */
	bucket(name: string): BucketManager {
		return new BucketManager(this.#storageName, name, this.fetcher);
	}
}
