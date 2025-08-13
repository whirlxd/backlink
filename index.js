// Local storage key for custom URLs
const CUSTOM_URLS_KEY = "backlink_custom_urls";

// Default custom URLs
const DEFAULT_CUSTOM_URLS = [
	{ name: "Cryptx.co", url: "https://cryptx.co/$URL" },
	{ name: "Cryptichunt", url: "https://cryptichunt.paradigmclub.co/$URL" },
];

// Load custom URLs from local storage
function loadCustomUrls() {
	const stored = localStorage.getItem(CUSTOM_URLS_KEY);
	if (!stored) {
		// First time - save defaults
		saveCustomUrls(DEFAULT_CUSTOM_URLS);
		return DEFAULT_CUSTOM_URLS;
	}
	return JSON.parse(stored);
}

// Save custom URLs to local storage
function saveCustomUrls(urls) {
	localStorage.setItem(CUSTOM_URLS_KEY, JSON.stringify(urls));
}

// Enhanced search function
async function searchBacklinks() {
	const input = document.getElementById("txt").value.trim();
	if (!input) return;

	// Load JSON patterns
	const response = await fetch("links.json");
	const patterns = await response.json();

	// Load custom URLs
	const customUrls = loadCustomUrls();

	const matches = [];

	// Check against JSON patterns
	// biome-ignore lint/complexity/noForEach: <explanation>
	patterns.forEach((pattern) => {
		const regex = new RegExp(pattern.regex);
		if (regex.test(input)) {
			matches.push({
				name: pattern.name,
				url: pattern.url.replace("$URL", input),
				type: pattern.type,
			});
		}
	});

	// Check against custom URLs (assume they match any alphanumeric string)
	const customRegex = /^[a-zA-Z0-9_-]+$/;
	if (customRegex.test(input)) {
		// biome-ignore lint/complexity/noForEach: <explanation>
		customUrls.forEach((custom) => {
			matches.push({
				name: custom.name,
				url: custom.url.replace("$URL", input),
				type: "Custom URL",
			});
		});
	}

	displayResults(matches);
}

// Display search results
function displayResults(matches) {
	const tableDiv = document.getElementById("tableDIV");

	if (matches.length === 0) {
		tableDiv.innerHTML = "<h3>No matches found</h3>";
		return;
	}

	const tableHTML = `
        <h3>${matches.length} matches found</h3>
        <table>
            <thead>
                <tr>
                    <th>Domain</th>
                    <th>URL</th>
                    <th>Type</th>
                </tr>
            </thead>
            <tbody>
                ${matches
									.map(
										(match) => `
                    <tr>
                        <td>${match.name}</td>
                        <td><a href="${match.url}" target="_blank" rel="noopener noreferrer">${match.url}</a></td>
                        <td>${match.type}</td>
                    </tr>
                `,
									)
									.join("")}
            </tbody>
        </table>
    `;

	tableDiv.innerHTML = tableHTML;
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
	// Add event listeners
	document.getElementById("mybtn").addEventListener("click", searchBacklinks);
	document.getElementById("txt").addEventListener("keypress", (e) => {
		if (e.key === "Enter") {
			searchBacklinks();
		}
	});
});
displayResults(matches);
