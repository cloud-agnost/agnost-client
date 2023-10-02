import { AgnostClient } from "./AgnostClient";
import { APIBase } from "./APIBase";
import { AuthManager } from "./AuthManager";
import { EndpointManager } from "./EndpointManager";
import { StorageManager } from "./StorageManager";
import { BucketManager } from "./BucketManager";
import { RealtimeManager } from "./RealtimeManager";
import { Fetcher } from "./utils/Fetcher";
import {
	KeyValuePair,
	Session,
	ClientOptions,
	ClientStorage,
	User,
	APIError,
	ErrorEntry,
	FileUploadOptions,
	CookieOptions,
	ListenerFunction,
	EventData,
	RealtimeOptions,
	MemberData,
	UserEventListenerFunction,
} from "./types";
import { polyfillGlobalThis } from "./utils/polyfills";

// Make globalThis available
polyfillGlobalThis();

/**
 * Creates a new client to interact with your backend application developed in Agnost. You need to specify the `baseUrl` and `apiKey` to create a new client object. You can access your app `baseUrl` from the **Version Settings/Environment** view and create a new `apiKey` from **Version Settings/API Keys** view in Agnost Studio.
 * @param  {string} baseUrl The base URL of the Agnost application version
 * @param  {string} apiKey The API key of the app version
 * @param  {string} options Additional configuration parameters
 * @returns {AgnostClient} The newly created client instance
 */
const createClient = (
	baseUrl: string,
	apiKey: string,
	options?: ClientOptions
): AgnostClient => {
	return new AgnostClient(baseUrl, apiKey, options);
};

export {
	createClient,
	APIBase,
	AgnostClient,
	AuthManager,
	EndpointManager,
	Fetcher,
	KeyValuePair,
	Session,
	ClientOptions,
	ClientStorage,
	User,
	APIError,
	ErrorEntry,
	StorageManager,
	BucketManager,
	FileUploadOptions,
	RealtimeManager,
	CookieOptions,
	ListenerFunction,
	EventData,
	RealtimeOptions,
	MemberData,
	UserEventListenerFunction,
};
