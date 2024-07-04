# Leetcode Complexity Analyser

Complexity Analyser is a Tampermonkey script designed to analyze the time and space complexity of code on LeetCode using the Gemini API. This script adds an "Analyze Complexity with Gemini" button to the LeetCode UI, which, when clicked, sends the code to the Gemini API for analysis and displays the results.

## Features

- Adds an "Analyze Complexity with Gemini" button to LeetCode problem pages.
- Fetches the code from the page and sends it to the Gemini API for complexity analysis.
- Displays the time and space complexity along with a brief description.

## Installation

1. **Install Tampermonkey**:
   If you haven't already, install Tampermonkey for your browser from [tampermonkey.net](https://www.tampermonkey.net/).

2. **Install the User Script**:
   Click [here](https://github.com/dev-aslam/Leetcode-Complexity-Analyser/raw/main/complexityAnalyser.user.js) to install the Leetcode Complexity Analyser userscript.

3. **Activate the Script**:
   Once installed,
   - Navigate to any LeetCode problem page.
   - Solve the problem and submit your code.
   - Click on the "Analyze Complexity with Gemini" button added to the LeetCode UI.
   - The script will fetch the code from the page and send it to the Gemini API.
   - A modal will display the time and space complexity along with a brief description.

## Configuration

### API Key

The script requires a Gemini API key to function. Follow these steps to set it up:

1. Obtain a Gemini API key from Google. Click [here](https://ai.google.dev/gemini-api) to get the API key.
2. When you run the script for the first time, you will be prompted to enter an encryption key and the Gemini API key:
   - Enter a random string as the encryption key.
   - Enter your Gemini API key.
3. To change the API key later, use the Tampermonkey menu:
   - Open the Tampermonkey dashboard.
   - Click on the "Complexity Analyser" script.
   - Click on the "Change API Key" menu command.

## License

This project is licensed under the MIT License.

## Security Considerations

### Storage of API Key

The script securely stores your Gemini API key using Tampermonkey's storage mechanism. However, it's important to note:

- **Tampermonkey Storage:** Tampermonkey uses browser storage (local storage or sync storage) to store user scripts and their data, including API keys.
- **Security Implications:** While Tampermonkey encrypts stored data, any script running in the browser environment is susceptible to potential security vulnerabilities.
- **Risk of Exposure:** Malicious scripts or extensions with escalated privileges could potentially access stored API keys.

### Best Practices

To mitigate risks associated with storing API keys:

- **Encryption:** Always use a strong encryption key when prompted by the script for storing sensitive information.
- **Regular Audits:** Periodically review and rotate API keys to limit exposure in case of a compromise.
- **Secure Environment:** Avoid running Tampermonkey scripts on untrusted or shared computers to prevent unauthorized access to stored data.

### Disclaimer

This script is provided as-is without warranty of any kind. Use it at your own risk. Keep in mind:

- The API-generated results may be inaccurate; use with caution.
- The API key is stored in Tampermonkey's data storage, which could potentially be accessed by attackers.
