var _dividerWidth = 10;

function SplitPane(rootEl, dividerWidth)
{
    if(dividerWidth != undefined)
    {
        _dividerWidth = dividerWidth;
    }

    if(rootEl == undefined)
    {
        rootEl = $("body");
    }

    var horizontal = 0;
    var vertical = 0;
    var rootPanes = [];

    $(rootEl).find("div[class^='pane-weight-'],div[class*=' pane-weight-']").each(function(index, el)
    {
        el.classList.forEach(function(classname)
        {
            if(classname.substr(0, 12) == "pane-weight-")
            {
                el.paneWeight = classname.substr(12);
            }
        });
    });

    $(rootEl).find("div[class^='pane-min-'],div[class*=' pane-min-']").each(function(index, el)
    {
        el.classList.forEach(function(classname)
        {
            if(classname.substr(0, 9) == "pane-min-")
            {
                el.paneMin = classname.substr(9);
            }
        });
    });

    $(rootEl).find(".split-pane").each(function(index, el)
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

    if(el.children == undefined)
    {
        el.children = [];
    }

    $(el).children(".split-pane").each(function(index, childEl)
    {
        addChildren(childEl);
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
        if(singlePane.paneWeight != undefined)
        {
            weightTotal += parseInt(singlePane.paneWeight);
        }
        else
        {
            weightTotal += 1;
        }
    });

    group.forEach(function(singlePane, cIndex)
    {
        singlePane.pane = new Pane(singlePane.paneMin, singlePane);
        
        $(singlePane).css("float", "left");

        var paneWeight = singlePane.paneWeight != undefined ? singlePane.paneWeight: 1;
        var widthPercent = 100 / weightTotal * paneWeight; 
        var heightPercent = 100 / weightTotal * paneWeight; 
        
        if(singlePane.classList.contains("pane-vertical"))
        {
            $(singlePane).css("clear", "left");
            
            var divider = document.createElement("div");
            divider.classList.add("pane-divider");

            divider.object = new DividerHorizontal(divider, group[cIndex - 1], singlePane, _dividerWidth);
            
            widthPercent = 100;
        }

        if(singlePane.classList.contains("pane-horizontal"))
        {
            var divider = document.createElement("div");
            divider.classList.add("pane-divider");

            divider.object = new DividerVertical(divider, group[cIndex - 1], singlePane, _dividerWidth);
            
            heightPercent = 100;
        }

        if(cIndex > 0)
        {
            $(singlePane).before(divider);
        }

        $(singlePane).height("calc(" + heightPercent + "% - " + _dividerWidth + "px)");
        $(singlePane).width("calc(" +  widthPercent + "% - " + _dividerWidth + "px)");
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