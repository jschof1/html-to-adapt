
const dialogButton = document.getElementById("show-dialog");
dialogButton.addEventListener('click', function (event) {
    showDialog();
});

const convertButton = document.getElementById("convertHtml");
convertButton.addEventListener('click', function (event) {
    convertHtmlToJson();
});


function showDialog() {
    var dialog = document.getElementById("instructions-dialog");
    dialog.showModal();
}

function escapeHTML(html) {
    return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function convertHtmlToJson() {
    var inputHtml = document.getElementById("inputHtml").value;
    var blockObjects = [];
    var componentObjects = [];
    var graphicObjects = [];

    // Parse the input HTML using DOMParser
    var parser = new DOMParser();
    var doc = parser.parseFromString(inputHtml, 'text/html');

    // Process each H1 element
    var h1Elements = doc.getElementsByTagName('h1');
    for (var i = 0; i < h1Elements.length; i++) {
        var h1 = h1Elements[i];
        var body = '';
        var nextElem = h1.nextElementSibling;
        var h2Array = [];
        while (nextElem && nextElem.tagName !== 'H1') {
            if (nextElem.tagName === 'P' && h2Array.length === 0) {
                body += escapeHTML(nextElem.outerHTML) + '\n';
            }
            if (nextElem.tagName === 'H2') {
                var h2Obj = {
                    title: nextElem.textContent,
                    body: ''
                };
                var h2Next = nextElem.nextElementSibling;
                while (h2Next && h2Next.tagName !== 'H1' && h2Next.tagName !== 'H2') {
                    if (h2Next.tagName === 'P') {
                        h2Obj.body += escapeHTML(h2Next.outerHTML) + '\n';
                    }
                    h2Next = h2Next.nextElementSibling;
                }
                h2Array.push(h2Obj);
            }
            nextElem = nextElem.nextElementSibling;
        }

        var blockID = "b-" + (i + 1);
        var componentID = "c-" + (i + 1);
        var graphicID = "g-" + (i + 1);

        var blockObj = {
            title: h1.textContent,
            displayTitle: "",
            body: "",
            _classes: "",
            _trackingId: i + 1,
            instruction: "",
            _isOptional: false,
            _isAvailable: true,
            _isHidden: false,
            _isVisible: true,
            _requireCompletionOf: -1,
            _ariaLevel: 0,
            _id: blockID,
            _parentId: "InsertYourArticleNumberHere",
            _type: "block",
            _onScreen: {
                _isEnabled: false,
                _classes: "",
                _percentInviewVertical: 50
            },
            _assessment: {
                _quizBankID: 1
            },
            _pageLevelProgress: {
                _isEnabled: true,
                _isCompletionIndicatorEnabled: true
            }
        };
        blockObjects.push(blockObj);

        if (h2Array.length > 0) {
            var accordionComponent = {
                _id: componentID,
                _parentId: blockID,
                _type: "component",
                _component: "accordion",
                _classes: "",
                _layout: "full",
                title: h1.textContent,
                displayTitle: h1.textContent,
                body: body,
                instruction: "Select the headings to find out more.",
                _shouldCollapseItems: true,
                _shouldExpandFirstItem: false,
                _setCompletionOn: "allItems",
                _items: h2Array.map(function (h2) {
                    return {
                        title: h2.title,
                        body: h2.body,
                        _imageAlignment: "full",
                        _graphic: {
                            src: "course/en/images/example.jpg",
                            alt: "",
                            attribution: "Copyright © 2019"
                        },
                        _classes: ""
                    }
                }),
                _pageLevelProgress: {
                    _isEnabled: true
                }
            };
            componentObjects.push(accordionComponent);
        } else {
            var textComponent = {
                _id: componentID,
                _parentId: blockID,
                _type: "component",
                _component: "text",
                _classes: "",
                _layout: i % 2 === 0 ? "left" : "right",
                title: h1.textContent,
                displayTitle: h1.textContent,
                body: body,
                instruction: "",
                _pageLevelProgress: {
                    _isEnabled: false
                }
            };
            componentObjects.push(textComponent);
        }

        var graphicComponent = {
            _id: graphicID,
            _parentId: blockID,
            _type: "component",
            _component: "graphic",
            _classes: "",
            _layout: i % 2 === 0 ? "left" : "right",
            title: `graphic for ${blockObj.title}`,
            displayTitle: "",
            body: "",
            instruction: "",
            _graphic: {
                alt: "",
                longdescription: "",
                large: "https://via.placeholder.com/600x400",
                small: "https://via.placeholder.com/600x400",
                attribution: "Copyright © 2019",
                _url: "",
                _target: ""
            },
            _isScrollable: false,
            _defaultScrollPercent: 0,
            _pageLevelProgress: {
                _isEnabled: true
            }
        };
        graphicObjects.push(graphicComponent);
    }

    // Display JSON output
    document.getElementById("blockObjectsOutput").value = JSON.stringify(blockObjects, null, 2);
    document.getElementById("componentObjectsOutput").value = JSON.stringify(componentObjects.concat(graphicObjects), null, 2);
}