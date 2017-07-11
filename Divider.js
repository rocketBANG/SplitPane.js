var dividerWidth = 10;

function DividerVertical(dividerEl, leftEl, rightEl)
{
    var dividerEl = dividerEl;
    var leftEl = leftEl;
    var rightEl = rightEl;
    var moving = false;
    var workingWidth = 0;


    this.layout = function()
    {
        $(dividerEl).css("position", "absolute");
        $(dividerEl).height($(rightEl).outerHeight());
        $(dividerEl).outerWidth(dividerWidth);
        $(dividerEl).css("background-color", "red");
        $(dividerEl).css("left", $(rightEl).position().left - parseInt($(rightEl).css("padding-left")));
        $(dividerEl).css("top", $(rightEl).position().top);
    }

    this.layout();

    $(dividerEl).on("mousedown", function(e)
    {
        moving = true;
        $(document).on("mouseup", stopMove);
        workingWidth = ($(leftEl).outerWidth() + $(rightEl).outerWidth()) / $(leftEl).parent().outerWidth();

        console.log("start move");

        e.preventDefault();
    });

    $(document).on("mousemove", function(e)
    {
        if(moving)
        {
            $(dividerEl).css("left", (e.clientX - dividerWidth) / $(document).width() * 100 + "%");
            $(leftEl).outerWidth((e.clientX - $(leftEl).position().left) / $(leftEl).parent().innerWidth() * 100 + "%");
            $(rightEl).outerWidth(workingWidth * 100 - (e.clientX - $(leftEl).position().left) / $(leftEl).parent().innerWidth() * 100 + "%");
            console.log("moving");
            layoutDividers();
        }
    });

    function stopMove()
    {
        moving = false;
        $(document).off("mouseup", stopMove);
        console.log("stop move");
    }
}

function DividerHorizontal(dividerEl, topEls, bottomEls)
{
    var dividerEl = dividerEl;
    var topEl = topEls;
    var bottomEl = bottomEls;
    var moving = false;
    var workingWidth = 0;
    $(dividerEl).css("position", "absolute");


    this.layout = function()
    {
        var totalWidth = 0;

        topEl.forEach(function(element)
        {
            totalWidth += $(element).outerWidth();
        });

        $(dividerEl).outerWidth(totalWidth);
        $(dividerEl).outerHeight(dividerWidth);
        $(dividerEl).css("background-color", "red");
        $(dividerEl).css("top", $(bottomEl[0]).position().top);
    }
    
    this.layout();

    $(dividerEl).on("mousedown", function(e)
    {
        moving = true;
        $(document).on("mouseup", stopMove);
        workingWidth = ($(topEl).outerHeight() + $(bottomEl[0]).outerHeight()) / $(topEl).parent().outerHeight();
        console.log("start move");
        e.preventDefault();
    });

    $(document).on("mousemove", function(e)
    {
        if(moving)
        {
            console.log($(bottomEl[0]).width());
            // console.log($(topEl)).position().top;
            $(dividerEl).css("top", (e.clientY - dividerWidth) / $(document).height() * 100 + "%");
            $(topEl).outerHeight((e.clientY - $(topEl).position().top) / $(topEl).parent().innerHeight() * 100 + "%");
            $(bottomEl).outerHeight(workingWidth * 100 - (e.clientY - $(topEl).position().top) / $(topEl).parent().innerHeight() * 100 + "%");
            layoutDividers();
        }
    });

    function stopMove()
    {
        moving = false;
        $(document).off("mouseup", stopMove);
        console.log("stop move");
    }
}