import fs from "fs";

async function cleanOpenApi() {
	const openapi = fs.readFileSync('src/types/openapi.ts', 'utf8');

	const pattern = /.*\?: never;\n/g;

	// Remove lines that match the pattern
	const cleaned = openapi.replace(pattern, '').trim();
	fs.writeFileSync("src/types/openapi.ts", cleaned);
}

cleanOpenApi();