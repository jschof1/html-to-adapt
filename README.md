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

### Examples
```
<h6>_component: dnd-multiple</h6>
<ul>
  <li>
    <h4>Category 1</h4>
    <ol>
      <li>Option 1</li>
      <li>Option 2</li>
      <li>Option 3</li>
    </ol>
  </li>
  <li>
    <h4>Category 2</h4>
    <ol>
      <li>Option 4</li>
      <li>Option 5</li>
      <li>Option 6</li>
    </ol>
  </li>
</ul>
```

```
<!-- verticalItems -->
<h6>_component: verticalItems</h6>
<div>
  <h3>Item 1 Title</h3>
  <p>Item 1 Body</p>
  <img src="icon1.png" alt="Item 1 Icon">
  <img src="graphic1.png" alt="Item 1 Graphic">
</div>
<div>
  <h3>Item 2 Title</h3>
  <p>Item 2 Body</p>
  <img src="icon2.png" alt="Item 2 Icon">
  <img src="graphic2.png" alt="Item 2 Graphic">
</div>
```
<!-- pairs -->
<h6>_component: pairs</h6>
<ul>
  <li>
    <span>Option 1</span>
    <span>Option 2</span>
  </li>
  <li>
    <span>Option 3</span>
    <span>Option 4</span>
  </li>
</ul>
```
<!-- cards -->
<h6>_component: cards</h6>
<div>
  <h3>Card 1 Title</h3>
  <p>Card 1 Body</p>
  <img src="graphic1.png" alt="Card 1 Graphic">
  <button>Action 1</button>
</div>
<div>
  <h3>Card 2 Title</h3>
  <p>Card 2 Body</p>
  <img src="graphic2.png" alt="Card 2 Graphic">
  <button>Action 2</button>
</div>
```

<h6>accordion</h6>
<p>
<h2>
## Credits

Developed by Jack Schofield

## License

MIT License
