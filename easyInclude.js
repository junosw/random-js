const local = {
	redis: {
		domain: "localhost",
		apiToken: "4232",
	}
};

const development = {
	redis: {
		domain: "redis.dev.env.sketchdeck.com"
	}
};

const configMap = new Map([
	["local", local],
	["dev", development]
]);

// returns a promise that resolves when the connect to Redis is established
function connectToRedis(env) {
	const config = configMap.get(env);

	if (config.redis) {
		console.log(`Connecting to Redis at ${config.redis.domain}`)

		let auth = config.redis.apiToken
		if (!auth) {
			auth = local.redis.apiToken
		}
		return new Promise((resolve, reject) => {
			if (!auth) {
				reject(new Error("Connection to Redis failed - no valid auth token found"))
			}
			console.log(`Redis connect with auth token ${auth}`)
			resolve("We connected!")
		})
	} else {
		return Promise.reject(new Error("Connection to Redis failed - No valid Redis config found"))
	}
}

connectToRedis("dev").then((res) => {
	console.log(res)
}).catch((error) => {
	console.log("Error", error)
})
console.log("Connecting")

/*

[Output]
Connecting to Redis at redis.dev.env.sketchdeck.com
Redis connect with auth token 4232
Connecting
We connected!

*/
