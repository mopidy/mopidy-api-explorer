function scrollParentToChild(parent, child) {
    // Where is the parent on page
    const parentRect = parent.getBoundingClientRect();
    // What can you see?
    const parentViewableArea = {
        height: parent.clientHeight,
        width: parent.clientWidth,
    };

    // Where is the child
    const childRect = child.getBoundingClientRect();
    // Is the child viewable?
    const isViewable = (childRect.top >= parentRect.top) &&
        (childRect.top <= parentRect.top + parentViewableArea.height);

    // if you can't see the child try to scroll parent
    if (!isViewable) {
        // scroll by offset relative to parent
        parent.scrollTop = (childRect.top + parent.scrollTop) - parentRect.top;
    }
}
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

function snakeToCamel(identifier) {
    return identifier.replace(/(_[a-z])/g, function(match) {
        return match.toUpperCase().replace("_", "");
    });
}

Handlebars.registerHelper("snakeToCamel", function(identifier) {
    return snakeToCamel(identifier);
});
Handlebars.registerHelper("concat", function() {
    const values = Array.prototype.slice.call(arguments, 0, -1);
    return values.join("");
});

Handlebars.registerHelper("apiMethodCurlCall", function(apiMethod) {
    const cmd = {
        jsonrpc: "2.0",
        id: 1,
        method: apiMethod.methodName,
    };
    if (Object.keys(apiMethod.methodData.params).length > 0) {
        cmd.params = apiMethod.methodData.params;
    }

    return "curl -X POST -H 'Content-Type: application/json'" +
        ` -d '${JSON.stringify(cmd, null, 2)}' ` +
        window.location.origin + "/mopidy/rpc";
});
Handlebars.registerHelper("apiMethodJsCall", function(apiMethod) {
    let call = "mopidy." + snakeToCamel(apiMethod.methodName.replace("core.", ""));
    if (Object.keys(apiMethod.methodData.params).length > 0) {
        const paramsStr = JSON.stringify(apiMethod.methodData.params).replace(/":/g, '": ').replace(/,"/g, ', "');
        call += `(${paramsStr})`;
    } else {
        call += "()";
    }

    call += ".then(function(data) {\n";
    call += "  console.log(data);\n";
    call += "});";

    return call;
});

function prepareMopidyApiToc(describeData) {
    const apiMethods = new Map();
    const methodKeys = Object.keys(describeData).map(function(methodKey) {
        return String(methodKey).replace("core.", "");
    });
    for (const methodKey of methodKeys) {
        let [apiClass, classMethod] = methodKey.split(".");
        if (!classMethod) {
            classMethod = apiClass;
            apiClass = "core";
        }

        if (apiMethods.has(apiClass)) {
            apiMethods.get(apiClass).push(classMethod);
        } else {
            apiMethods.set(apiClass, [classMethod]);
        }
    }

    const apiMethodsToc = [];
    for (const [apiClass, classMethods] of apiMethods.entries()) {
        apiMethodsToc.push({ apiClass, classMethods });
    }
    return apiMethodsToc;
}

function prepareMopidyApiMethodsData(describeData) {
    const apiMethodsData = {};

    for (const [apiMethod, apiMethodData] of Object.entries(describeData)) {
        const params = {};
        for (const param of apiMethodData.params) {
            if (param["name"] === "kwargs") {
                continue;
            }

            if (param["default"] !== undefined) {
                params[param["name"]] = param["default"];
            } else {
                params[param["name"]] = null;
            }
        }

        let [_core, apiClass, classMethod] = apiMethod.split(".");
        if (!classMethod) {
            classMethod = apiClass;
            apiClass = "core";
        }

        apiMethodsData[apiClass + "." + classMethod] = {
            methodName: apiMethod,
            methodData: {
                description: apiMethodData.description,
                params,
            },
        };
    }

    return apiMethodsData;
}

(function() {
    window.mopidy = new Mopidy();

    const consoleEl = document.getElementById("ws-console");
    window.mopidy.on("websocket:incomingMessage", function(message) {
        const newLine = (new Date()).toLocaleTimeString() + ': ' + message.data + "\n";
        consoleEl.innerHTML = Handlebars.escapeExpression(newLine) + consoleEl.innerHTML;
    });

    const tocTemplateHtml = document.getElementById("toc-template").innerHTML;
    const bodyTemplateHtml = document.getElementById("body-template").innerHTML;

    const tocTemplate = Handlebars.compile(tocTemplateHtml);
    const bodyTemplate = Handlebars.compile(bodyTemplateHtml);

    const tocContainer = document.getElementById("toc-container");
    const apiMethodsList = document.getElementById("api-methods-list");

    window.mopidy.on("state:online", function() {
        window.mopidy._send({ method: "core.describe" }).then(function(data) {
            window.mopidyDescribeData = data;

            const toc = prepareMopidyApiToc(data);
            const tocHtml = tocTemplate({ toc });

            const methodsData = prepareMopidyApiMethodsData(data);
            const bodyHtml = bodyTemplate({ toc, methodsData });

            tocContainer.innerHTML = tocHtml;
            apiMethodsList.innerHTML = bodyHtml;

            setTimeout(function() {
                const spyEl = document.querySelector("[data-bs-spy='scroll']");
                bootstrap.ScrollSpy.getInstance(spyEl).refresh();
            }, 500);
        });
    });
})();

(function() {
    const tocContainer = document.getElementById("toc-container");

    const debouncedScroller = debounce(
        function(targetSelector) {
            const tocLink = tocContainer.querySelector("[href='" + targetSelector + "']");
            scrollParentToChild(tocLink.parentElement, tocLink);
        },
        300
    );

    window.addEventListener("activate.bs.scrollspy", function(ev) {
        debouncedScroller(ev.relatedTarget);
    });
})();
