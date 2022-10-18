

// let init = new Promise((resolve, reject) => {
// 	console.log("promise is invoked - make an HTTP call to see if things are working right");
// 	resolve("things worked")
// })


// function makeRpcCall() {
// 	init.then((res) => {
// 		console.log("got res", res);
// 		console.log("now making RPC call")
// 	})
// }


// makeRpcCall();
// makeRpcCall();


// let init =

function init() {
	return new Promise((resolve, reject) => {
		console.log("promise is invoked - make an HTTP call to see if things are working right");
		resolve("things worked")
	})
}


function makeRpcCall() {
	init().then((res) => {
		console.log("got res", res);
		console.log("now making RPC call")
	})
}


makeRpcCall();
makeRpcCall();
