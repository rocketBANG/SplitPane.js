
class Divider
{
    constructor(dividerEl, beforeEl, afterEl)
    {
        this._dividerWidth = 10;
        this._workingWidth = 0;
        this._moving = false;

        this.dividerEl = dividerEl;
        this.beforeEl = beforeEl;
        this.afterEl = afterEl;

        
        $(this.dividerEl).on("mousedown", this.mouseDown.bind(this));
        $(document).on("mousemove", this.documentMouseMove.bind(this));
        this.layout();
    }

    mouseDown(e)
    {
        this._moving = true;

        this.measureWidth();

        $(document).on("mouseup", this.stopMove.bind(this));

        e.preventDefault();
    }

    documentMouseMove(e)
    {
        if(this._moving)
        {
            this.dragDivider(e);
        }
    }

    draw(left, top, height, width)
    {
        console.log(this._dividerWidth);
    }

    stopMove()
    {
        this._moving = false;
        $(document).off("mouseup", this.stopMove.bind(this));
    }
}

class DividerVertical extends Divider
{
    layout()
    {
        $(this.dividerEl).css("position", "absolute");
        $(this.dividerEl).css("cursor", "e-resize");
        $(this.dividerEl).height($(this.afterEl).outerHeight());
        $(this.dividerEl).outerWidth(this._dividerWidth);
        $(this.dividerEl).css("background-color", "red");
        $(this.dividerEl).css("left", $(this.afterEl).position().left - parseInt($(this.afterEl).css("padding-left")));
        $(this.dividerEl).css("top", $(this.afterEl).position().top);
    }

    measureWidth()
    {
        this._workingWidth = ($(this.beforeEl).outerWidth() + $(this.afterEl).outerWidth()) / $(this.beforeEl).parent().outerWidth();
    }

    dragDivider(e)
    {
        $(this.dividerEl).css("left", (e.clientX - this._dividerWidth) / $(document).width() * 100 + "%");
        $(this.beforeEl).outerWidth((e.clientX - $(this.beforeEl).position().left) / $(this.beforeEl).parent().innerWidth() * 100 + "%");
        $(this.afterEl).outerWidth(this._workingWidth * 100 - (e.clientX - $(this.beforeEl).position().left) / $(this.beforeEl).parent().innerWidth() * 100 + "%");
        layoutDividers();
    }
}

class DividerHorizontal extends Divider
{
    layout()
    {
        var totalWidth = 0;

        this.beforeEl.forEach(function(element)
        {
            totalWidth += $(element).outerWidth();
        });

        $(this.dividerEl).css("position", "absolute");
        $(this.dividerEl).css("cursor", "n-resize");
        $(this.dividerEl).outerWidth(totalWidth);
        $(this.dividerEl).outerHeight(this._dividerWidth);
        $(this.dividerEl).css("background-color", "red");
        $(this.dividerEl).css("top", $(this.afterEl[0]).position().top);
    }

    measureWidth()
    {
        this._workingWidth = ($(this.beforeEl).outerHeight() + $(this.afterEl[0]).outerHeight()) / $(this.beforeEl).parent().outerHeight();
    }

    dragDivider(e)
    {
        $(this.dividerEl).css("top", (e.clientY - this._dividerWidth) / $(document).height() * 100 + "%");
        $(this.beforeEl).outerHeight((e.clientY - $(this.beforeEl).position().top) / $(this.beforeEl).parent().innerHeight() * 100 + "%");
        $(this.afterEl).outerHeight(this._workingWidth * 100 - (e.clientY - $(this.beforeEl).position().top) / $(this.beforeEl).parent().innerHeight() * 100 + "%");
        layoutDividers();
    }
}