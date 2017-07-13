
var dividers = [];

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
    var horizontalColumns = [];
    var verticalGroups = [];

    $(square).each(function(index, el)
    {
        if(el.classList.contains("column-vertical"))
        {
            if(horizontalColumns.length > 0)
            {
                verticalGroups.push(horizontalColumns.splice(0));
            }
            verticalGroups.push([el]);
        }

        if(el.classList.contains("column-horizontal"))
        {
            horizontalColumns.push(el);
        }
    });

    if(horizontalColumns.length > 0)
    {
        verticalGroups.push(horizontalColumns.splice(0));
    }

    verticalGroups.forEach(function(group, gIndex)
    {
        group.forEach(function(singleColumn, cIndex)
        {
            if(cIndex == 0)
            {
                $(singleColumn).css("clear", "left");
            }

            $(singleColumn).outerHeight((100 / verticalGroups.length) + "%");
            $(singleColumn).css("float", "left");
            $(singleColumn).outerWidth((100 / group.length) + "%");
            
            if(cIndex > 0)
            {
                var divider = document.createElement("div");
                divider.classList.add("column-divider");
                divider.object = new DividerVertical(divider, group[cIndex - 1], singleColumn);
                dividers.push(divider.object);
                $(singleColumn).after(divider);
            }

            if(gIndex > 0 && cIndex == group.length - 1)
            {
                var divider = document.createElement("div");
                divider.classList.add("column-divider");
                divider.object = new DividerHorizontal(divider, verticalGroups[gIndex - 1], group);
                dividers.push(divider.object);
                $(singleColumn).after(divider);
            }
        });
    });

}

function layoutDividers()
{
    dividers.forEach(function(divider)
    {
        divider.layout();
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