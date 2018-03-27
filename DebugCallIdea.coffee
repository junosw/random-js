
When					= require 'when'
rp						= require 'request-promise'
_							= require 'underscore'
trace 			  = require('debug')('sketchdeck.worker.handler.PollFilePreviewsIO:trace')
Handler				= require './Handler.coffee'
HttpResponse 	= require './../HttpResponse'
FilePreviews  = require '@sketchdeck/lib-server/storage/FilePreviews'
Panic					= require '@sketchdeck/lib-server/model/Panic'

class DebugCall
	constructor: (endpoint) -> 
		@endpoint = endpoint

	send: (msg) =>
		opts = 
			method: 'POST'
			uri: @endpoint
			body: 
				message: msg
			json: true 
		
		rp(opts)
			.then (res) -> 
				trace "DebugCall response:", res
			.catch (err) ->
				trace "DebugCall err:", err

class StatusProps
	constructor: (id, debugCall) -> 
		@id = id
		@retryTimeoutScalar = 1
		@attempts = 0
		@dc = debugCall

	addAttempt: =>
		@attempts += 1
		@dc.send "adding test attempt: " + @attempts
		# after 20 attempts (retry 20 times, once per second), start backing off
		if @retryTimeoutScalar > 20
			@retryTimeoutScalar = @retryTimeoutScalar + @retryTimeoutScalar/2

	getRetryMS: =>
		@retryTimeoutScalar * 1000

	atMaxAttempts: =>
		# this should mean we've retried about 38 times over 50 minutes... or something like that 
		@retryTimeoutScalar > 900 

	testing: =>
		@dc.send "testing attemps: " + @attempts
		if @attempts < 23
			@dc.send "testing attemps returning true"
			true
		else
			@dc.send "testing attemps returning false"
			false
		

class PollFilePreviewsIO extends Handler		
	constructor: -> 
		@dc = new DebugCall 'http://c329880f.ngrok.io/'
		@dc.send 'started PollFilePreviewsIO'

	handle: (req) =>
		if req?.body?.properties?.id?
			#trace "handling PollFilePreviewsIO", req.body.properties.id
			@dc.send "handling PollFilePreviewsIO: " + req.body.properties.id
			@getStatus(new StatusProps(req.body.properties.id, @dc))
		else 
			When.reject new HttpResponse "Event must have properties - killing", 200

	retry: (ms, fn) =>
		setTimeout fn, ms

	getStatus: (statusProps) =>
		FilePreviews.getStatus(statusProps.id).then (res) =>
			if res.status != 'success'
				statusProps.addAttempt()
				if statusProps.atMaxAttempts()
					Panic.now "Filepreviews rendering timed out for job", {
							jobId: statusProps.id
						}
					throw new Error "Filepreviews rendering timed out" + statusProps.id
				else
					@retry statusProps.getRetryMS(), => @getStatus statusProps

			else if statusProps.testing()
				statusProps.addAttempt()
				@retry statusProps.getRetryMS(), => @getStatus statusProps

			else # succcess, stash data
				FilePreviews.handleJobResponse(res)

module.exports = PollFilePreviewsIO
