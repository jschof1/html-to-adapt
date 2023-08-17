# HTML to Adapt Framework JSON Converter

This tool converts an HTML document or Google Document into a JSON structure that can be used within the Adapt Framework.

## Usage

1. Open the `index.html` file in your web browser.
2. Click the "Instructions" button to read the guidelines for formatting your HTML or Google Document.
3. Copy and paste your formatted HTML or Google Document into the "Input HTML" text area.
4. Click the "Convert" button.
5. The JSON output will appear in the "Block Objects" and "Component Objects" text areas. You can copy the JSON output and use it in the Adapt Framework.

## HTML Formatting Guidelines

* Use `<h1>` tags for main titles that you want to be treated as separate sections in the JSON output.
* Use `<h2>` tags for sub-sections within an `<h1>` section. These will be treated as accordion items in the JSON output.
* Use `<p>` tags for the content of each section or sub-section. The content inside these tags will be included in the body of the corresponding block or component object in the JSON output.
* Ensure that all HTML elements are properly nested and closed. Use a code editor or HTML validator to check your HTML code for errors.

**Tip:** If you are using a Google Document, you can clean the HTML using [this tool](https://www.gdoctohtml.com/).

## Credits

Developed by Jack Schofield

## License

MIT License
