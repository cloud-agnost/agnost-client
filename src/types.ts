/**
 * Represents a basic javascript object with key-value pairs
 * @export
 * @interface KeyValuePair
 */
export interface KeyValuePair {
	[key: string]: any;
}

/**
 * Provides info about a user.
 * @export
 * @interface User
 */
export interface User {
	/**
	 * The unique identifier of the user
	 * @type {string}
	 */
	_id: string;
	/**
	 * The authentication provider name, can be either Agnost, Google, Faceboo, Twitter, Apple etc.
	 * @type {string}
	 */
	provider: string;
	/**
	 * The user id value that is retrieved from the provider after successful user authentication. The format of this field value can be different for each provider. If the provider is Agnost, providerUserId value is not populated.
	 * @type {string}
	 */
	providerUserId: string;
	/**
	 * User's email address
	 * @type {string}
	 */
	email: string;
	/**
	 * User's phone number
	 * @type {string}
	 */
	phone: string;
	/**
	 * User's password, valid only if Agnost is used as the authentication provider.
	 * @type {string}
	 */
	password?: string;
	/**
	 * User's profile picture url.
	 * @type {string}
	 */
	profilePicture?: string;
	/**
	 * The name of the user
	 * @type {string}
	 */
	name?: string;
	/**
	 * The last login date and time of the user. For each successful sign-in, this field is updated in the database.
	 * @type {string}
	 */
	lastLoginAt: string;
	/**
	 * The sign up date and time of the user
	 * @type {string}
	 */
	signUpAt: string;
	/**
	 * Whether user's phone number has been already been verified or not
	 * @type {boolean}
	 */
	phoneVerified: boolean;
	/**
	 * Whether user's email has been already been verified or not
	 * @type {boolean}
	 */
	emailVerified: boolean;
}

/**
 * Keeps session information of a specific user
 * @export
 * @interface Session
 */
export interface Session {
	/**
	 * The id of the application end user this session is associated with
	 * @type {string}
	 */
	userId: string;

	/**
	 * Unique session token string
	 * @type {string}
	 */
	token: string;

	/**
	 * Creation date and time of the session token
	 * @type {string}
	 */
	creationDtm: string;

	/**
	 * The user-agent (device) information of the user's session
	 * @type {object}
	 */
	userAgent: {
		family: string;
		major: string;
		minor: string;
		patch: string;
		device: {
			family: string;
			major: string;
			minor: string;
			patch: string;
		};
		os: {
			family: string;
			major: string;
			minor: string;
			patch: string;
		};
	};
}

/**
 * The options that can be passed to the Agnost client instance
 *
 * @export
 * @interface ClientOptions
 */
export interface ClientOptions {
	/**
	 * Client storage handler to store user and session data. By default uses Window.localStorage of the browser. If client is not a browser then you need to provide an object with setItem(key:string, data:object), getItem(key:string) and removeItem(key:string) methods to manage user and session data storage.
	 * @type Storage
	 */
	localStorage?: ClientStorage;

	/**
	 * The sign in page URL to redirect the user when user's session becomes invalid. Agnost client library observes the responses of the requests made to your app backend. If it detects a response with an error code of missing or invalid session token, it can redirect the users to this signin url.
	 * @type {string}
	 */
	signInRedirect?: string;

	/**
	 * The configuration parameters for websocket connections
	 * @type {RealtimeOptions}
	 */
	realtime?: RealtimeOptions;
}

/**
 * The options that can be passed to the client instance realtime module
 *
 * @export
 * @interface RealtimeOptions
 */
export interface RealtimeOptions {
	/**
	 * The flag to enable or prevent automatic join to channels already subscribed in case of websocket reconnection. When websocket is disconnected, it automatically leaves subscribed channels. This parameter helps re-joining to already joined channels when the connection is restored.
	 * @type {boolean}
	 */
	autoJoinChannels?: boolean;

	/**
	 * The flag to enable or prevent realtime messages originating from this connection being echoed back on the same connection.
	 * @type {boolean}
	 */
	echoMessages?: boolean;

	/**
	 * The initial delay before realtime reconnection in milliseconds.
	 * @type {number}
	 */
	reconnectionDelay?: number;

	/**
	 * The timeout in milliseconds for each realtime connection attempt.
	 * @type {number}
	 */
	timeout?: number;

	/**
	 * By default, any event emitted while the realtime socket is not connected will be buffered until reconnection. You can turn on/off the message buffering using this parameter.
	 * @type {number}
	 */
	bufferMessages?: boolean;
}
/**
 * Client lcoal storage handler definition. By default Atlogic client library uses Window.localStorage of the browser.
 *
 * If you prefer to use a different storage handler besides Window.localStorage or if you are using the Agnost client library at the server (not browser) then you need to provide your storage implementation.
 * This implementation needs to support mainly three methods, getItem, setItem and removeItem
 *
 * @interface ClientStorage
 */
export interface ClientStorage {
	getItem(key: string): null | string;
	setItem(key: string, value: string): void;
	removeItem(key: string): void;
}

/**
 * Provides information about the errors happened during execution of the requests
 * @export
 * @interface APIError
 */
export interface APIError {
	/**
	 *  HTTP response code in the 100–599 range
	 * @type {number}
	 */
	status: number;

	/**
	 * Status text as reported by the server, e.g. "Unauthorized"
	 * @type {string}
	 */
	statusText: string;

	/**
	 * Array of error entries that provide detailed information about the errors occured during excution of the request
	 * @type {ErrorEntry[]}
	 */
	items: ErrorEntry[];
}

/**
 * Provides info about an error.
 * @export
 * @interface ErrorEntry
 */
export interface ErrorEntry {
	/**
	 * Originator of the error either a client error or an internal server error
	 * @type {string}
	 */
	origin: string;

	/**
	 * Specific short code of the error message (e.g., validation_error, content_type_error)
	 * @type {string}
	 */
	code: string;

	/**
	 * Short description of the error
	 * @type {string}
	 */
	message: string;

	/**
	 * Any additional details about the error. Details is a JSON object and can have a different structure for different error types.
	 * @type {object}
	 */
	details?: object;
}

/**
 * Defines the options available that can be set during file upload
 * @export
 * @interface FileUploadOptions
 */
export interface FileUploadOptions {
	/**
	 * Specifies whether file is publicy accessible or not. Defaults to the bucket's privacy setting if not specified.
	 * @type {boolean}
	 */
	isPublic?: boolean;
	/**
	 * Specifies whether to create the bucket while uploading the file. If a bucket with the provided name does not exists and if `createBucket` is marked as true then creates a new bucket. Defaults to false.
	 * @type {boolean}
	 */
	createBucket?: boolean;
	/**
	 * Key-value pairs that will be added to the file metadata.
	 * @type {KeyValuePair}
	 */
	tags?: KeyValuePair;
	/**
	 * Callback function to call during file upload.
	 *
	 * **For the moment, this method can only be used in clients where `XMLHttpRequest` object is available (e.g., browsers).**
	 * @param uploaded Total bytes uploaded
	 * @param total Total size of file in bytes
	 * @param percentComplete Percent uploaded (an integer between 0-100), basicly `uploaded/total` rounded to the nearest integer
	 */
	onProgress(uploaded: number, total: number, percentComplete: number): any;
}

/**
 * Defines the cookie options. Primarly used to specify the options when setting the sessionToken cookie which is used to pass session token from the client (e.g., browser) to the server (e.g., next.js, express) in an app where server side rendering is used.
 * @export
 * @interface CookieOptions
 */
export interface CookieOptions {
	/**
	 * Specifies the path that must exist in the requested URL for the browser to send the Cookie header.
	 * @type {string}
	 */
	path: string;
	/**
	 * Indicates the number of seconds until the cookie expires. A zero or negative number will expire the cookie immediately.
	 * @type {number}
	 */
	maxAge: number;
	/**
	 * Controls whether or not a cookie is sent with cross-origin requests, providing some protection against cross-site request forgery attacks.
	 * @type {string}
	 */
	sameSite: "strict" | "lax" | "none";
	/**
	 * If set to `true`, forbids JavaScript from accessing the cookie.
	 * @type {boolean}
	 */
	httpOnly: boolean;
	/**
	 * If set to `true`, indicates that the cookie is sent to the server only when a request is made with the https: scheme (except on localhost), and therefore, is more resistant to man-in-the-middle attacks.
	 * @type {boolean}
	 */
	secure: boolean;
}

/**
 * Defines the structure of the realtime event data (message) delivered to the clients.
 * @export
 * @interface EventData
 */
export interface EventData {
	/**
	 * The name of the channel this message is sent to. If channel is null, this means that that message is broadcasted to all connected clients of your app.
	 * @type {string}
	 */
	channel: string | null;
	/**
	 * Contents of the message. All serializable datastructures are supported for the message, including Buffer.
	 * @type {any}
	 */
	message: any;
}
/**
 * Defines the structure of listener (callback) functions for realtime events (messages). Basically a listener function accepts only a single parameter of event data.
 * @export
 * @type ListenerFunction
 */
export type ListenerFunction = (payload: EventData) => void;

/**
 * Defines the structure of the channel member data.
 * @export
 * @interface MemberData
 */
export interface MemberData {
	/**
	 * The unique socket id of the channel member
	 * @type {string}
	 */
	id: string;
	/**
	 * Data payload for the channel member. The supported payload types are strings, JSON objects and arrays, buffers containing arbitrary binary data, and null. This data is typically set calling the {@link RealtimeManager.updateProfile} method.
	 * @type {any}
	 */
	data: any;
}

/**
 * Defines the structure of listener (callback) functions for user generated events (messages).
 *
 * **eventName** - The user event that has been triggered. Possible value are `user:signin`, `user:signout`, `user:pwdchange`, `user:emailchange`, `user:phonechange`.
 *
 * **session** - The user session object that has triggered the event. If the event is triggered by the user without a session then this value will be `null`.
 *
 * **user** - The user object associated with the event.
 * @export
 * @type ListenerFunction
 */
export type UserEventListenerFunction = (
	eventName: string,
	session: Session | null,
	user: User | null
) => void;
