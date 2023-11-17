const dialogButton = document.getElementById("show-dialog");
dialogButton.addEventListener("click", function (event) {
  showDialog();
});

const convertButton = document.getElementById("convertHtml");
convertButton.addEventListener("click", function (event) {
  convertHtmlToJson();
});

function showDialog() {
  var dialog = document.getElementById("instructions-dialog");
  dialog.showModal();
}

// function escapeHTML(html) {
//   return html
//     .replace(/&/g, rawString("<p>"))
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;")
//     .replace(/'/g, "&#039;");
// }

function convertHtmlToJson() {
  var inputHtml = document.getElementById("inputHtml").value;
  var blockObjects = [];
  var componentObjects = [];
  var graphicObjects = [];

  // Parse the input HTML using DOMParser
  var parser = new DOMParser();
  var doc = parser.parseFromString(inputHtml, "text/html");

  // Process each H1 element
  var h1Elements = doc.getElementsByTagName("h1");
  for (var i = 0; i < h1Elements.length; i++) {
    var h1 = h1Elements[i];
    // console.log(h1.textContent);
    var body = "";

    var nextElem = h1.nextElementSibling;
    var h2Array = [];
    var options = [];
    var feedback = {};

    while (nextElem && nextElem.tagName !== "H1") {
      if (h2Array.length === 0 && !h1.textContent.includes("?")) {
        // but remove the h2 tag after it
        body += nextElem.outerHTML.replace(/<h2.*h2>/g, "");
      }
      if (nextElem.tagName === "H2") {
        var h2Obj = {
          title: nextElem.textContent,
          body: "",
        };
        var h2Next = nextElem.nextElementSibling;
        while (h2Next && h2Next.tagName !== "H1" && h2Next.tagName !== "H2") {
          if (h2Next.tagName === "P") {
            h2Obj.body += h2Next.outerHTML;
          }
          h2Next = h2Next.nextElementSibling;
        }
        h2Array.push(h2Obj);
      }
      if (h1.textContent.includes("Q:")) {
        if (nextElem.tagName === "OL" || nextElem.tagName === "UL") {
          // loop through li elements and create options array
          const liElements = nextElem.getElementsByTagName("li");
          for (var j = 0; j < liElements.length; j++) {
            const li = liElements[j];
            let option = {
              text: li.textContent,
              _shouldBeSelected: li.innerHTML.includes("<strong>")
                ? true
                : false,
              _isPartlyCorrect: false,
            };
            options.push(option);
          }

          // After processing the list, traverse the siblings to collect feedback
          let feedbackText = "";
          let currentElem = nextElem.nextElementSibling;

          while (currentElem && currentElem.tagName !== "H1") {
            feedbackText += currentElem.outerHTML;
            currentElem = currentElem.nextElementSibling;
          }
          console.log(feedbackText);

          const feedbackSplit = feedbackText.split("</strong>");
          feedback.correct = feedbackSplit[1];

          feedback.correct =
            "<p><strong>" +
            "That's right!" +
            "</p></strong>" +
            feedbackSplit[1];
          feedback._incorrect = {
            notFinal:
              "<p><strong>" +
              "Are you sure about that?" +
              "</p></strong>" +
              feedbackSplit[1],
            final:
              "<p><strong>" +
              "Are you sure about that?" +
              "</p></strong>" +
              feedbackSplit[1],
          };
        }
        // if elemenet after h1 is a p tag, add add it body but stop when you reach the next an element that says this <p><strong>

        // Check if the next element is a P tag and does not include a strong tag
        // if (nextElem.tagName === "P") {
        //   // If the P tag contains a strong tag, we stop adding to body
        //   if (nextElem.innerHTML.includes("<strong>")) {
        //     break; // Exit the loop as we've encountered a P with a strong tag
        //   } else {
        //     body += nextElem.innerHTML; // Add the P tag to body
        //   }
        // }
      }
      nextElem = nextElem.nextElementSibling;
    }

    // get input value from #moduleId input field before running this script

    const moduleId = document.getElementById("moduleID").value;
    const articleID = document.getElementById("articleID").value;

    var blockID = moduleId + "-b-" + (i + 1);
    var componentID = moduleId + "-c-" + (i + 1);
    var graphicID = moduleId + "-g-" + (i + 1);

    var blockObj = {
      title: h1.textContent,
      displayTitle: h1.textContent,
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
      _parentId: articleID,
      _type: "block",
      _onScreen: {
        _isEnabled: false,
        _classes: "",
        _percentInviewVertical: 50,
      },
      _assessment: {
        _quizBankID: 1,
      },
      _pageLevelProgress: {
        _isEnabled: true,
        _isCompletionIndicatorEnabled: false,
      },
    };
    blockObjects.push(blockObj);

    if (h1.textContent.includes("Q:")) {
      var mcqComponent = {
        _id: componentID,
        _parentId: blockID,
        _type: "component",
        _component: "mcq",
        _classes: "",
        _layout: "left",
        title: h1.textContent,
        displayTitle: h1.textContent.split("Q:")[1],
        body: body.split("<ul>")[0],
        instruction: "Choose one option then select Submit.",
        ariaQuestion: "Question text specifically for screen readers.",
        _attempts: 1,
        _shouldDisplayAttempts: false,
        _isRandom: false,
        _hasItemScoring: false,
        _questionWeight: 1,
        _selectable: 1,
        _canShowModelAnswer: true,
        _canShowFeedback: true,
        _canShowMarking: true,
        _recordInteraction: true,
        _items: options,
        _feedback: feedback,
        _comment:
          "You only need to include _buttons if you want to override the button labels that are set in course.json",
        _buttons: {
          _submit: {
            buttonText: "Submit",
            ariaLabel: "Select here to submit your answer.",
          },
          _reset: {
            buttonText: "Reset",
            ariaLabel: "",
          },
          _showCorrectAnswer: {
            buttonText: "Correct Answer",
            ariaLabel: "",
          },
          _hideCorrectAnswer: {
            buttonText: "My Answer",
            ariaLabel: "",
          },
          _showFeedback: {
            buttonText: "Show feedback",
            ariaLabel: "",
          },
          remainingAttemptsText: "attempts remaining",
          remainingAttemptText: "final attempt",
        },
        _pageLevelProgress: {
          _isEnabled: false,
        },
      };
      componentObjects.push(mcqComponent);
    } else if (h2Array.length > 0) {
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
              attribution: "Copyright © 2019",
            },
            _classes: "",
          };
        }),
        _pageLevelProgress: {
          _isEnabled: false,
        },
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
        displayTitle: "",
        body: body,
        instruction: "",
        _pageLevelProgress: {
          _isEnabled: false,
        },
      };
      componentObjects.push(textComponent);
    }

    var graphicComponent = {
      _id: graphicID,
      _parentId: blockID,
      _type: "component",
      _component: "graphic",
      _classes: "mobile-hide",
      _layout: i % 2 === 0 ? "right" : "left",
      title: `graphic for ${blockObj.title}`,
      displayTitle: "",
      body: "",
      instruction: "",
      _graphic: {
        alt: "",
        longdescription: "",
        large: "https://via.placeholder.com/600x400",
        small: "https://via.placeholder.com/600x400",
        attribution: "NO ATTRIBUTION",
        _url: "",
        _target: "",
      },
      _isScrollable: false,
      _defaultScrollPercent: 0,
      _pageLevelProgress: {
        _isEnabled: false,
      },
    };
    graphicObjects.push(graphicComponent);
  }

  // Display JSON output
  document.getElementById("blockObjectsOutput").value = JSON.stringify(
    blockObjects,
    null,
    2
  );
  document.getElementById("componentObjectsOutput").value = JSON.stringify(
    componentObjects.concat(graphicObjects),
    null,
    2
  );
}
