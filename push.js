
function execShellCommand(cmd) {
	const exec = require('child_process').exec;
	return new Promise((resolve, reject) => {
		exec(cmd, (error, stdout, stderr) => {
			let result = {};
			if (error) {
				result.error = error;
			}
			result.message = stdout? stdout : stderr;
			resolve(result);
		});
	});
}

async function main() {

	function log(data) {
		const fs = require('fs');
		fs.appendFile('history.log', data+'\n', function (err) {
			if (err) throw err;
		});
	}

	async function run(cmd,showCmd=false,showErrors=true) {
		if( showCmd) {
			console.log(cmd);
		}
		let result = await execShellCommand( cmd );
		log( cmd );
		log( JSON.stringify(result) );
		if( result.error ) {
			console.log(result);
		}
		return result;
	}

	async function addImage(fileSpec) {
		let status = await run('git status '+fileSpec+' -s');
		if( status.message != '' ) {
			console.log(status.message.trim());
			let result = await run('git add '+fileSpec);
			if( result.message !== '' ) {
				console.log(result);
			}
			imageCount += result.message.split('\n').length;
		}
	}

	log( '\nRUN: '+new Date().toISOString() );
	let imageCount = 0;
	await run('git pull');
	await addImage('*.png');
	await addImage('*.jpg');
	await addImage('*.jpeg');
	if( imageCount <= 0 ) {
		console.log("Nothing to do.");
	}
	else {
		await run('git commit -m "updating '+imageCount+' images"');
		await run('git push --force');
		console.log( 'Published '+imageCount+' images.' );
	}

//	console.log( 'You can view an image on the browser at:\nhttps://kdemarest.github.io/jenemail/IMAGE_NAME.png' );
}

main();

