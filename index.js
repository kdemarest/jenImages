function execShellCommand(cmd) {
	const exec = require('child_process').exec;
	return new Promise((resolve, reject) => {
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				console.warn(error);
			}
			resolve(stdout? stdout : stderr);
		});
	});
}

let commandList = `
git pull
git add .
git commit -m "no comment"
git push --force
`.trim().split('\n');

async function main() {

	console.log('Publishing images now.');
	for( let i=0 ; i<commandList.length ; ++i ) {
		console.log(commandList[i]);
		let result = await execShellCommand( commandList[i] );
		console.log(result);
	}
	console.log( 'Published.' );
	console.log( 'You can view an image on the browser at https://kdemarest.github.io/jenemail/IMAGE_NAME.png' );
}

main();

