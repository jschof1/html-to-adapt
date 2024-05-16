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
  var lastLayout = "right"; // Assume the first text component starts on the left
  // Process each H1 element
  var h1Elements = doc.getElementsByTagName("h1");
  for (var i = 0; i < h1Elements.length; i++) {
    var h1 = h1Elements[i];
    console.log(h1.textContent);
    var body = "";

    var nextElem = h1.nextElementSibling;
    var h2Array = [];
    var options = [];
    var feedback = {};

    while (nextElem && nextElem.tagName !== "H1") {
      if (h2Array.length === 0) {
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
          feedbackText = feedbackText.replace(/<strong>/g, "");
          feedbackText = feedbackText.replace(/<\/strong><\/p>/g, "");

        

          feedback.correct =
            "<p><strong>" +
            "That's right!" +
            "</p></strong>"
            + "<p>" + feedbackText + "</p>";
          feedback._incorrect = {
            notFinal:
              "<p><strong>" +
              "Are you sure about that?" +
              "</p></strong>"
                     + "<p>" + feedbackText + "</p>",
            final:
              "<p><strong>" +
              "Are you sure about that?" +
              "</p></strong>"
                     + "<p>" + feedbackText + "</p>"
          };
        }
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
    var layout;
    if (h1.textContent.includes("Q:")) {
      layout = lastLayout === "left" ? "right" : "left";
      lastLayout = layout; // Update lastLayout for the next iteration
      let mcqBody = body
        .split("<ul>")[0]
        .split("<ol>")[0]
        .split("<p><strong>")[0];
      var mcqComponent = {
        _id: componentID,
        _parentId: blockID,
        _type: "component",
        _component: "mcq",
        _classes: "",
        _layout: layout,
        title: h1.textContent,
        displayTitle: "",
        body: mcqBody,
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
      layout = "full";
      var accordionComponent = {
        _id: componentID,
        _parentId: blockID,
        _type: "component",
        _component: "accordion",
        _classes: "",
        _layout: "full",
        title: h1.textContent,
        displayTitle: "",
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
              src: "",
              alt: "",
              attribution: "",
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
      var wordCount = body
        .replace(/<[^>]+>/g, "")
        .trim()
        .split(/\s+/)
        .filter(function (n) {
          return n != "";
        }).length;

      if (wordCount > 150) {
        layout = "full"; // If it's a "full" layout, don't update lastLayout
      } else {
        layout = lastLayout === "left" ? "right" : "left";
        lastLayout = layout; // Update lastLayout for the next iteration
      }

      // Decide the layout based on the word count

      var textComponent = {
        _id: componentID,
        _parentId: blockID,
        _type: "component",
        _component: "text",
        _classes: "",
        _layout: layout,
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

    if (layout !== "full") {
      var graphicLayout = layout === "left" ? "right" : "left";
      var graphicComponent = {
        _id: graphicID,
        _parentId: blockID,
        _type: "component",
        _component: "graphic",
        _classes: "mobile-hide",
        _layout: graphicLayout,
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
