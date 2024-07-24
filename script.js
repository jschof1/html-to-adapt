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
  const inputHtml = document.getElementById("inputHtml").value;
  const blockObjects = [];
  const componentObjects = [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(inputHtml, "text/html");
  let lastLayout = "right";

  const h1Elements = doc.getElementsByTagName("h1");
  for (let i = 0; i < h1Elements.length; i++) {
    const h1 = h1Elements[i];
    const blockObj = createBlockObject(h1, i);
    blockObjects.push(blockObj);

    let body = "";
    let nextElem = h1.nextElementSibling;
    const h2Array = [];
    const options = [];
    const feedback = {};

    // Check for H6 element after H1
    let componentType = "";
    if (nextElem && nextElem.tagName === "H6") {
      componentType = nextElem.textContent.trim();
      nextElem = nextElem.nextElementSibling;
    }

    while (nextElem && nextElem.tagName !== "H1") {
      if (h2Array.length === 0) {
        body += nextElem.outerHTML.replace(/<h2.*h2>/g, "");
      }

      if (nextElem.tagName === "H2") {
        const h2Obj = createH2Object(nextElem);
        h2Array.push(h2Obj);
      }

      if (h1.textContent.includes("Q:")) {
        processQuestionElement(nextElem, options, feedback);
      }

      nextElem = nextElem.nextElementSibling;
    }

    const moduleId = document.getElementById("moduleID").value;
    const articleID = document.getElementById("articleID").value;

    const blockID = `${moduleId}-b-${i + 1}`;
    const componentID = `${moduleId}-c-${i + 1}`;
    const graphicID = `${moduleId}-g-${i + 1}`;

    let layout;
    if (componentType === "mcq") {
      layout = lastLayout === "left" ? "right" : "left";
      lastLayout = layout;
      const mcqComponent = createMcqComponent(componentID, blockID, layout, body, options, feedback);
      componentObjects.push(mcqComponent);
    } else if (componentType === "accordion") {
      layout = "full";
      const accordionComponent = createAccordionComponent(componentID, blockID, body, h2Array);
      componentObjects.push(accordionComponent);
    } else {
      const wordCount = countWords(body);
      layout = wordCount > 150 ? "full" : (lastLayout === "left" ? "right" : "left");
      lastLayout = layout !== "full" ? layout : lastLayout;

      const textComponent = createTextComponent(componentID, blockID, layout, body, h1.textContent);
      componentObjects.push(textComponent);
    }

    if (layout !== "full") {
      const graphicLayout = layout === "left" ? "right" : "left";
      const graphicComponent = createGraphicComponent(graphicID, blockID, graphicLayout, blockObj.title);
      componentObjects.push(graphicComponent);
    }
  }

  document.getElementById("blockObjectsOutput").value = JSON.stringify(blockObjects, null, 2);
  document.getElementById("componentObjectsOutput").value = JSON.stringify(componentObjects, null, 2);
}
function createBlockObject(h1, index) {
  const moduleId = document.getElementById("moduleID").value;
  const articleID = document.getElementById("articleID").value;
  const blockID = `${moduleId}-b-${index + 1}`;

  return {
    title: h1.textContent,
    displayTitle: h1.textContent,
    body: "",
    _classes: "",
    _trackingId: index + 1,
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
}

function createH2Object(h2) {
  const h2Obj = {
    title: h2.textContent,
    body: "",
  };
  let h2Next = h2.nextElementSibling;
  while (h2Next && h2Next.tagName !== "H1" && h2Next.tagName !== "H2") {
    if (h2Next.tagName === "P") {
      h2Obj.body += h2Next.outerHTML;
    }
    h2Next = h2Next.nextElementSibling;
  }
  return h2Obj;
}

function processQuestionElement(element, options, feedback) {
  if (element.tagName === "OL" || element.tagName === "UL") {
    const liElements = element.getElementsByTagName("li");
    for (let j = 0; j < liElements.length; j++) {
      const li = liElements[j];
      const option = {
        text: li.textContent,
        _shouldBeSelected: li.innerHTML.includes("<strong>"),
        _isPartlyCorrect: false,
      };
      options.push(option);
    }

    let feedbackText = "";
    let currentElem = element.nextElementSibling;

    while (currentElem && currentElem.tagName !== "H1") {
      feedbackText += currentElem.outerHTML;
      currentElem = currentElem.nextElementSibling;
    }
    feedbackText = feedbackText.replace(/<strong>/g, "").replace(/<\/strong><\/p>/g, "");

    feedback.correct = `<p><strong>That's right!</p></strong><p>${feedbackText}</p>`;
    feedback._incorrect = {
      notFinal: `<p><strong>Are you sure about that?</p></strong><p>${feedbackText}</p>`,
      final: `<p><strong>Are you sure about that?</p></strong><p>${feedbackText}</p>`,
    };
  }
}

function createMcqComponent(componentID, blockID, layout, body, options, feedback) {
  const mcqBody = body.split("<ul>")[0].split("<ol>")[0].split("<p><strong>")[0];

  return {
    _id: componentID,
    _parentId: blockID,
    _type: "component",
    _component: "mcq",
    _classes: "",
    _layout: layout,
    title: "",
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
    _comment: "You only need to include _buttons if you want to override the button labels that are set in course.json",
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
}

function createAccordionComponent(componentID, blockID, body, h2Array) {
  return {
    _id: componentID,
    _parentId: blockID,
    _type: "component",
    _component: "accordion",
    _classes: "",
    _layout: "full",
    title: "",
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
}

function createTextComponent(componentID, blockID, layout, body, title) {
  return {
    _id: componentID,
    _parentId: blockID,
    _type: "component",
    _component: "text",
    _classes: "",
    _layout: layout,
    title: title,
    displayTitle: "",
    body: body,
    instruction: "",
    _pageLevelProgress: {
      _isEnabled: false,
    },
  };
}

function createGraphicComponent(graphicID, blockID, graphicLayout, blockTitle) {
  return {
    _id: graphicID,
    _parentId: blockID,
    _type: "component",
    _component: "graphic",
    _classes: "mobile-hide",
    _layout: graphicLayout,
    title: `graphic for ${blockTitle}`,
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
}

function countWords(text) {
  return text.replace(/<[^>]+>/g, "").trim().split(/\s+/).filter(Boolean).length;
}