const lght = {
  newInstanceOfTemplate: function({ templateSelector, templateData }) {
    const template = document.querySelector(templateSelector).innerHTML;
    let newTemplate = template;

    for (let prop in templateData) {
      const searchString = `{${prop}}`;
      const searchRegexp = new RegExp(searchString, "g");
      const newString = templateData[prop];
      if (
        newTemplate.includes("{" + prop + "}") &&
        typeof newString === "object"
      ) {
        throw new Error(
          `Properties in the 'templateData' object must evaluate to strings, booleans or numbers in order for the template to render correctly, ${prop} has type of: ${typeof newString}`
        );
      }
      newTemplate = newTemplate.replace(searchRegexp, templateData[prop]);
    }

    if (newTemplate.match(/{.*}/g)) {
      const matches = newTemplate.match(/{.*}/g);
      matches.forEach((match, index) => {
        if (!match.includes("!")) {
          const searchRegexp = new RegExp(match, "g");
          newTemplate = newTemplate.replace(searchRegexp, "");
        } else {
          const excapedTemplateCode = match.replace("!", "");
          newTemplate = newTemplate.replace(match, excapedTemplateCode);
        }
      });

      const unEscapedMatches = matches.filter(item => !item.includes("!"));
      console.warn(
        `The following properties were referred to in the template HTML but not found in the related template data object, and have been replaced with empty strings. This may be totally fine, but here are the properties that were ignored, just in case: `,
        unEscapedMatches
      );
    }
    return newTemplate;
  },

  addContentToTarget: function({
    templateSelector, // identifies the element containing the template in your HTML. Usually an ID written like "#article-template".
    targetSelector, // identifies the element where we should place that template after it gets its content. Usually an ID written like "#article-container", "#article-targe" or even just "#article".
    templateData // can a javascript object, or array of objects, whose values all return strings or numbers.
  }) {
    const target = document.querySelector(targetSelector);
    if (Array.isArray(templateData)) {
      templateData.forEach((item, index) => {
        item.index = index;
        addContentToTarget(item);
      });
    } else {
      addContentToTarget(templateData);
    }
    function addContentToTarget(templateData) {
      if (target.querySelector(".loading")) {
        lght.removeLoader({ targetElement: target });
      }
      target.innerHTML += lght.newInstanceOfTemplate({
        templateSelector,
        templateData
      });
      if (templateData.$callback) {
        templateData.$callback(templateData.index);
      } else {
        // remove all loaders, cause without callbacks nothing else will happen
        let loaders = Array.from(target.querySelectorAll(".loading"));
        if (loaders) {
          loaders.forEach(element => {
            element.remove();
          });
        }
      }
    }
  },

  removeLoader: function({ targetElement, loadingClass = "loading" }) {
    const loadingElement = Array.from(targetElement.children).find(element =>
      element.className.includes(loadingClass)
    ); // will be undefined if there is not a direct child of the element that contains the loader... in which case the loader is deeply nested so we don't know yet if we can remove it.

    if (loadingElement) {
      loadingElement.remove();
    }
  }
};

if (window) {
  // make this globally available in spite of potential bundler-related shenanigans
  window.lght = lght;
}
