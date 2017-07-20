var _dividerWidth;
//TODO change to object
function SplitPane(rootEl, dividerWidth = 10)
{
    _dividerWidth = dividerWidth;

    if(rootEl == undefined)
    {
        rootEl = $("body");
    }

    var horizontal = 0;
    var vertical = 0;
    var rootPanes = [];

    $(rootEl).children(".split-pane").each(function(index, el)
    {
        if(el.classList.contains("pane-vertical"))
        {
            el.type = "vertical";
        }
        else if(el.classList.contains("pane-horizontal"))
        {
            el.type = "horizontal";
        }

        if(!el.added)
        {
            addChildren(el);
            rootPanes.push(el);
        }
    });

    layoutChildren(rootPanes);
}

function addChildren(el)
{
    el.added = true;

    if(el.childPanes == undefined)
    {
        el.childPanes = [];
    }

    $(el).children(".split-pane").each(function(index, childEl)
    {
        el.childPanes.push(childEl);
        addChildren(childEl);
    });
}

function layoutChildren(children)
{
    if(children == undefined || children.length < 1)
    {
        return;
    }

    layoutSquare(children);

    $(children).each(function(index, child)
    {
        layoutChildren(child.children);
    });
}

function getClassValue(element, findClass, callback)
{
    $(element).filter("div[class^='" + findClass + "'],div[class*=' " + findClass + "']").each(function(index, el)
    {
        el.classList.forEach(function(classname)
        {
            if(classname.substr(0, findClass.length) == findClass)
            {
                callback(classname.substr(findClass.length));
            }
        });
    });
}

function layoutSquare(square)
{
    var verticalGroups = [];
    var group = [];

    $(square).each(function(index, el)
    {
        if(el.classList.contains("pane-vertical"))
        {
            group.push(el);
        }

        if(el.classList.contains("pane-horizontal"))
        {
            group.push(el);
        }
    });


    var weightTotal = 0;

    group.forEach(function(singlePane, cIndex)
    {
        var paneWeight;
        var paneMin;
        var paneMinPx;

        getClassValue(singlePane, "pane-weight-", function(value) { paneWeight = parseInt(value);});
        getClassValue(singlePane, "pane-min-", function(value) { paneMin = parseInt(value);});
        getClassValue(singlePane, "pane-minpx-", function(value) { paneMinPx = parseInt(value);});

        if(paneWeight != undefined)
        {
            weightTotal += paneWeight;
        }
        else
        {
            weightTotal += 1;
        }

        singlePane.pane = new Pane(paneMin, singlePane, paneWeight, paneMinPx);
    });

    group.forEach(function(singlePane, cIndex)
    {
        var pane = singlePane.pane;
        
        $(singlePane).css("display", "flex");
        $(singlePane).css("flex", "none");

        var widthPercent = 100 / weightTotal * pane.weight; 
        var heightPercent = 100 / weightTotal * pane.weight; 
        
        if(singlePane.classList.contains("pane-vertical"))
        {
            // $(singlePane).css("clear", "left");
            
            var divider = document.createElement("div");
            divider.classList.add("pane-divider");

            if(cIndex > 0)
            {
                divider.divder = new DividerHorizontal(divider, group[cIndex - 1], singlePane, _dividerWidth);
            }
            
            widthPercent = 100;
        }

        if(singlePane.classList.contains("pane-horizontal"))
        {
            $(singlePane).css("flex-direction", "column");
            var divider = document.createElement("div");
            divider.classList.add("pane-divider");

            if(cIndex > 0)
            {
                divider.divder = new DividerVertical(divider, group[cIndex - 1], singlePane, _dividerWidth);
            }                
            
            heightPercent = 100;
        }

        if(cIndex > 0)
        {
            $(singlePane).before(divider);
        }

        $(singlePane).height(heightPercent + "%");
        $(singlePane).width(widthPercent + "%");
    });

    group.forEach(function(singlePane, cIndex)
    {
        if(singlePane.classList.contains("pane-horizontal"))
        {
            singlePane.pane.setWidth();
        }
        if(singlePane.classList.contains("pane-vertical"))
        {
            singlePane.pane.setHeight();
        }
        singlePane.pane.tryResize();
    });

}

function createPane(element)
{
    
}
