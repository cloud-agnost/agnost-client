import { ClientError } from "./utils/ClientError";
import { checkRequired, normalizeUrl } from "./utils/helpers";
import { Fetcher } from "./utils/Fetcher";
import { KeyValuePair, ClientOptions } from "./types";
import { AuthManager } from "./AuthManager";
import { EndpointManager } from "./EndpointManager";
import { StorageManager } from "./StorageManager";
import { RealtimeManager } from "./RealtimeManager";

const DEFAULT_OPTIONS = {
	signInRedirect: undefined,
	localStorage: globalThis.window?.localStorage,
	realtime: {
		autoJoinChannels: true,
		echoMessages: true,
		reconnectionDelay: 1000,
		timeout: 20000,
		bufferMessages: true,
	},
};

/**
 * Javascript client for interacting with your backend applications developed in Agnost.
 *
 * AgnostClient is the main object that you will be using to issue commands to your backend apps. The commands that you can run are grouped below:
 * * {@link auth}: {@link AuthManager} - Manage users and user sessions
 * * {@link endpoint}: {@link EndpointManager} - Make http requests to your app endpoints and execute associated services
 * * {@link storage}: {@link StorageManager} - Provides methods to quickly upload files to your storage buckets
 * * {@link realtime}: {@link RealtimeManager} - Publish and subscribe (pub/sub) realtime messaging through websockets
 *
 * Each AgnostClient can interact with one of your app versions (e.g., development, test, production). You cannot create a single client to interact with multiple development, test or production versions at the same time. If you would like to issue commands to other versions, you need to create additional AgnostClient objects using the target environment's `baseUrl`.
 *
 * @export
 * @class AgnostClient
 */
export class AgnostClient {
	/**
	 * Agnost client options
	 * @protected
	 * @type {ClientOptions}
	 */
	protected settings: ClientOptions;

	/**
	 * HTTP client for the browser, Node or React Native. Primarily used to make RESTful API calls you your backend app. Each command that issue through the client library uses the fetcher to relay it to your backend app.
	 * @private
	 * @type {Fetcher}
	 */
	#fetcher: Fetcher;

	/**
	 * AuthManager object is used to manage user authentication and sessions
	 * @type {AuthManager}
	 */
	#authManager: AuthManager | null;

	/**
	 * EndpointManager object is used to make http requests to your app endpoints
	 * @type {EndpointManager}
	 */
	#epManager: EndpointManager | null;

	/**
	 * StorageManager object is used to manage the buckets and files of your app's cloud storage
	 * @type {StorageManager}
	 */
	#storageManager: StorageManager | null;

	/**
	 * RealtimeManager object is used to send and receive realtime message through websockets
	 * @type {RealtimeManager}
	 */
	#realtimeManager: RealtimeManager | null;

	/**
	 * Create a new client for web applications.
	 * @param {string} baseUrl The unique app version base URL which is generated when you create a version (e.g., development, test, production) for your backend app. You can access `baseUrl` of your app version from the **Version Settings/Environment** in Agnost Studio. Note that, an AgnostClient object can only access a single app version, you cannot use a development version `baseUrl` to access a test or production environment. To access other versions you need to create additional Agnost client objects with their respective `baseUrl` values.
	 * @param  {string} apiKey The API key key of the app version. You can create API keys from the **Version Settings/API Keys** panel in Agnost Studio. Besides authenticating your client, API keys are also used to define the authorization rights of each client, e.g., what operations they are allowed to perform on your backend app and define the authorized domains and IP addresses where the API key can be used (e.g., if you list your app domains or IP addresses in your API key configuration, that client key can only be used to make calls to your backend from a front-end app that runs on those specific domains or have a whitelisted IP address)
	 * @param {ClientOptions} [options] Configuration options for the api client
	 * @throws Throws an exception if `baseUrl` is not specified or not a valid URL path or `apiKey` is not specified
	 */
	constructor(baseUrl: string, apiKey: string, options?: ClientOptions) {
		if (
			!baseUrl ||
			!(
				baseUrl.trim().startsWith("https://") ||
				baseUrl.trim().startsWith("http://")
			)
		)
			throw new ClientError(
				"missing_required_value",
				"baseUrl is a required parameter and needs to start with http(s)://"
			);

		// Client key is also required
		checkRequired("apiKey", apiKey);
		if (typeof apiKey !== "string")
			throw new ClientError(
				"invalid_client_key",
				"apiKey needs to be a valid key string"
			);

		// Initialize internal objects
		this.#authManager = null;
		this.#epManager = null;
		this.#storageManager = null;
		this.#realtimeManager = null;

		// Create combination of default and custom options
		this.settings = { ...DEFAULT_OPTIONS, ...options };
		this.settings.realtime = {
			...DEFAULT_OPTIONS.realtime,
			...options?.realtime,
		};

		// Set the default headers
		const headers: KeyValuePair = {
			"X-Client": "agnost-js",
		};

		// Add the API key it to the headers
		headers.Authorization = apiKey;
		// Create the http client to manage RESTful API calls
		this.#fetcher = new Fetcher(this, normalizeUrl(baseUrl), headers);

		// If there is current session info stored in local storage get it an update fetcher session info
		const session = this.auth.getSession();
		this.#fetcher.setSession(session);
	}

	/**
	 * Returns the authentication manager that can be used to perform user and session management activities.
	 * @readonly
	 * @type {AuthManager}
	 */
	get auth(): AuthManager {
		if (this.#authManager) return this.#authManager;
		else {
			this.#authManager = new AuthManager(this, this.#fetcher, this.settings);
			return this.#authManager;
		}
	}

	/**
	 * Returns the endpoint manager which is used to make http requests to your app endpoints and execute associated services.
	 * @readonly
	 * @type {EndpointManager}
	 */
	get endpoint(): EndpointManager {
		if (this.#epManager) return this.#epManager;
		else {
			this.#epManager = new EndpointManager(this.#fetcher);
			return this.#epManager;
		}
	}

	/**
	 * Returns the storage manager, which is used to manage buckets and files of your app.
	 * @param {string} storageName The name of the storage
	 * @returns {StorageManager}
	 */
	storage(storageName: string): StorageManager {
		if (this.#storageManager) return this.#storageManager;
		else {
			this.#storageManager = new StorageManager(storageName, this.#fetcher);
			return this.#storageManager;
		}
	}

	/**
	 * Returns the realtime manager, which is used to publish and subscribe (pub/sub) messaging through websockets.
	 *
	 * > *If the realtime settings of the app version is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to establish a realtime connection.*
	 * @readonly
	 * @type {RealtimeManager}
	 */
	get realtime(): RealtimeManager {
		if (this.#realtimeManager) return this.#realtimeManager;
		else {
			this.#realtimeManager = new RealtimeManager(this.#fetcher, this.settings);
			return this.#realtimeManager;
		}
	}
}
