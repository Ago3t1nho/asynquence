// "any"
ASQ.extend("any",function __extend__(api,internals){
	return function __any__() {
		if (internals("seq_error") || internals("seq_aborted") ||
			arguments.length === 0
		) {
			return api;
		}

		function reset() {
			finished = true;
			error_messages.length = 0;
			success_messages.length = 0;
		}

		function complete(trigger) {
			if (success_messages.length > 0) {
				// any successful segment's message(s) sent
				// to main sequence to proceed as success
				success_messages.length = fns.length;
				trigger.apply(ø,success_messages);
			}
			else {
				// send errors into main sequence
				error_messages.length = fns.length;
				trigger.fail.apply(ø,error_messages);
			}

			reset();
		}

		function success(trigger,idx,args) {
			if (!finished) {
				completed++;
				success_messages[idx] =
					args.length > 1 ?
					ASQ.messages.apply(ø,args) :
					args[0]
				;

				// all segments complete?
				if (completed === fns.length) {
					finished = true;

					complete(trigger);
				}
			}
		}

		function failure(trigger,idx,args) {
			if (!finished &&
				!(idx in error_messages)
			) {
				completed++;
				error_messages[idx] =
					args.length > 1 ?
					ASQ.messages.apply(ø,args) :
					args[0]
				;
			}

			// all segments complete?
			if (!finished &&
				completed === fns.length
			) {
				finished = true;

				complete(trigger);
			}
		}

		var completed = 0, error_messages = [], finished = false, fns,
			success_messages = []
		;

		fns = ARRAY_SLICE.call(arguments);

		wrapGate(api,fns,success,failure,reset);

		return api;
	};
});
