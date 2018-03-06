var _dividerWidth;
//TODO change to object
function SplitPane(rootEl, dividerWidth = 10) {
    _dividerWidth = dividerWidth;

    if (rootEl == undefined) {
        rootEl = document.body;
    }

    var horizontal = 0;
    var vertical = 0;
    var rootPanes = [];

    let rootChildren = Array.from(rootEl.children);

    if (rootChildren.filter(c => c.classList.contains("pane-horizontal")).length > 0) {
        rootEl.style.display = "flex";
    }

    rootChildren.filter(c => c.classList.contains("split-pane")).forEach(function (el) {
        if (el.classList.contains("pane-vertical")) {
            el.type = "vertical";
        }
        else if (el.classList.contains("pane-horizontal")) {
            el.type = "horizontal";
        }

        if (!el.added) {
            addChildren(el);
            rootPanes.push(el);
        }
    });

    layoutChildren(rootPanes);
}

function addChildren(el) {
    el.added = true;

    if (el.childPanes == undefined) {
        el.childPanes = [];
    }

    let rootChildren = Array.from(el.children);

    rootChildren.filter(c => c.classList.contains("split-pane")).forEach(function (childEl) {
        el.style.display = "flex";
        el.style.flex = "none";
        if (el.classList.contains("pane-horizontal")) {
            el.style.flexDirection = "column";
        }
        el.childPanes.push(childEl);
        addChildren(childEl);
    });
}

function layoutChildren(children) {
    if (children == undefined || children.length < 1) {
        return;
    }

    children = Array.from(children);

    layoutSquare(children);

    children.forEach(function (child) {
        layoutChildren(child.children);
    });
}

function getClassValue(element, findClass, callback) {
    element.classList.forEach(function (classname) {
        if (classname.substr(0, findClass.length) == findClass) {
            callback(classname.substr(findClass.length));
        }
    });
}

function layoutSquare(square) {
    var verticalGroups = [];
    var group = [];

    square.forEach(function (el) {
        if (el.classList.contains("pane-vertical")) {
            group.push(el);
        }

        if (el.classList.contains("pane-horizontal")) {
            group.push(el);
        }
    });


    var weightTotal = 0;

    group.forEach(function (singlePane, cIndex) {
        var paneWeight;
        var paneMin;
        var paneMinPx;

        getClassValue(singlePane, "pane-weight-", (value) => { paneWeight = parseInt(value); });
        getClassValue(singlePane, "pane-min-", (value) => { paneMin = parseInt(value); });
        getClassValue(singlePane, "pane-minpx-", (value) => { paneMinPx = parseInt(value); });

        if (paneWeight != undefined) {
            weightTotal += paneWeight;
        }
        else {
            weightTotal += 1;
        }
        if (singlePane.classList.contains("pane-vertical")) {
            singlePane.pane = new PaneVertical(paneMin, singlePane, paneWeight, paneMinPx);
        }
        else {
            singlePane.pane = new PaneHorizontal(paneMin, singlePane, paneWeight, paneMinPx);
        }
    });

    group.forEach(function (singlePane, cIndex) {
        var pane = singlePane.pane;

        var widthPercent = 100 / weightTotal * pane.weight;
        var heightPercent = 100 / weightTotal * pane.weight;

        if (singlePane.classList.contains("pane-vertical")) {
            var divider = document.createElement("div");
            divider.classList.add("pane-divider");

            if (cIndex > 0) {
                divider.divder = new DividerHorizontal(divider, group[cIndex - 1], singlePane, _dividerWidth);
            }

            widthPercent = 100;
        }

        if (singlePane.classList.contains("pane-horizontal")) {
            var divider = document.createElement("div");
            divider.classList.add("pane-divider");

            if (cIndex > 0) {
                divider.divder = new DividerVertical(divider, group[cIndex - 1], singlePane, _dividerWidth);
            }

            heightPercent = 100;
        }

        if (cIndex > 0) {
            singlePane.parentNode.insertBefore(divider, singlePane);
        }

        singlePane.style.height = heightPercent + "%";
        singlePane.style.width = widthPercent + "%";
    });

    group.forEach(function (singlePane, cIndex) {
        if (singlePane.classList.contains("pane-horizontal")) {
            singlePane.pane.resize();
        }
        if (singlePane.classList.contains("pane-vertical")) {
            singlePane.pane.resize();
        }
        singlePane.pane.layout();
    });

}

function createPane(element) {

}
