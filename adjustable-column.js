var _dividerWidth = 10;

function addChildren(el)
{
    el.added = true;

    if(el.children == undefined)
    {
        el.children = [];
    }

    $(el).children(".adjustable-column").each(function(index, childEl)
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
        if(el.classList.contains("column-vertical"))
        {
            group.push(el);
        }

        if(el.classList.contains("column-horizontal"))
        {
            group.push(el);
        }
    });


    var weightTotal = 0;

    group.forEach(function(singleColumn, cIndex)
    {
        if(singleColumn.columnWeight != undefined)
        {
            weightTotal += parseInt(singleColumn.columnWeight);
        }
        else
        {
            weightTotal += 1;
        }
    });

    group.forEach(function(singleColumn, cIndex)
    {
        singleColumn.column = new Column(singleColumn.columnMin, singleColumn);
        
        $(singleColumn).css("float", "left");

        var columnWeight = singleColumn.columnWeight != undefined ? singleColumn.columnWeight: 1;
        var widthPercent = 100 / weightTotal * columnWeight; 
        var heightPercent = 100 / weightTotal * columnWeight; 
        
        if(singleColumn.classList.contains("column-vertical"))
        {
            $(singleColumn).css("clear", "left");
            
            var divider = document.createElement("div");
            divider.classList.add("column-divider");

            divider.object = new DividerHorizontal(divider, group[cIndex - 1], singleColumn, _dividerWidth);
            
            widthPercent = 100;
        }

        if(singleColumn.classList.contains("column-horizontal"))
        {
            var divider = document.createElement("div");
            divider.classList.add("column-divider");

            divider.object = new DividerVertical(divider, group[cIndex - 1], singleColumn, _dividerWidth);
            
            heightPercent = 100;
        }

        if(cIndex > 0)
        {
            $(singleColumn).before(divider);
        }

        $(singleColumn).height("calc(" + heightPercent + "% - " + _dividerWidth + "px)");
        $(singleColumn).width("calc(" +  widthPercent + "% - " + _dividerWidth + "px)");
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

$(document).ready(function()
{
    var horizontal = 0;
    var vertical = 0;
    var rootColumns = [];

    $("div[class^='column-weight-'],div[class*=' column-weight-']").each(function(index, el)
    {
        el.classList.forEach(function(classname)
        {
            if(classname.substr(0, 14) == "column-weight-")
            {
                el.columnWeight = classname.substr(14);
            }
        });
    });

    $("div[class^='column-min-'],div[class*=' column-min-']").each(function(index, el)
    {
        el.classList.forEach(function(classname)
        {
            if(classname.substr(0, 11) == "column-min-")
            {
                el.columnMin = classname.substr(11);
            }
        });
    });

    $(".adjustable-column").each(function(index, el)
    {
        if(el.classList.contains("column-vertical"))
        {
            el.type = "vertical";
        }
        else if(el.classList.contains("column-horizontal"))
        {
            el.type = "horizontal";
        }

        if(!el.added)
        {
            addChildren(el);
            rootColumns.push(el);
        }
    });

    layoutChildren(rootColumns);

});