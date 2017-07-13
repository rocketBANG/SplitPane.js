var _dividerWidth = 10;
var  count = 0;
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
                
                if(gIndex != 0)
                {
                    var divider = document.createElement("div");
                    divider.classList.add("column-divider");
                    divider.id = count + ""; count++;
                    divider.object = new DividerHorizontal(divider, verticalGroups[gIndex - 1][0], group[0], _dividerWidth);
                    
                    $(singleColumn).before(divider);
                }
            }
            singleColumn.column = new Column(20, singleColumn);
            $(singleColumn).height("calc(" + (100 / verticalGroups.length) + "% - " + _dividerWidth + "px)");
            $(singleColumn).css("float", "left");
            $(singleColumn).width("calc(" + (100 / group.length) + "% - " + _dividerWidth + "px)");
            
            if(cIndex > 0)
            {
                var divider = document.createElement("div");
                divider.classList.add("column-divider");
                divider.id = count + ""; count++;   
                divider.object = new DividerVertical(divider, group[cIndex - 1], singleColumn, _dividerWidth);
                
                $(singleColumn).before(divider);
            }
        });
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