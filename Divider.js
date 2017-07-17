class Divider
{
    constructor(dividerEl, beforeEl, afterEl, width = 10)
    {
        this._dividerWidth = width;
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

        this.measureDimensions();

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
        $(this.dividerEl).css("cursor", "ew-resize");
        $(this.dividerEl).css("float", "left");
        $(this.dividerEl).height("100%");
        $(this.dividerEl).outerWidth(this._dividerWidth);
        $(this.dividerEl).css("background-color", "#eee");
    }

    measureDimensions()
    {
        this._maxWidth = $(this.beforeEl).outerWidth() + $(this.afterEl).outerWidth();
    }

    dragDivider(e)
    {
        var sizePrevBefore = this.beforeEl.style.width;
        var sizePrevAfter = this.afterEl.style.width;

        var beforeElSize = (e.clientX - $(this.beforeEl).offset().left) / $(this.beforeEl).parent().width() * 100;

        if(beforeElSize < this.beforeEl.pane.min)
        {
            return;
        }
        
        $(this.beforeEl).outerWidth("calc(" + beforeElSize + "% - " + this._dividerWidth + "px)");
        $(this.afterEl).outerWidth("0px");

        var afterElSize = (this._maxWidth - $(this.beforeEl).outerWidth() + this._dividerWidth) / $(this.afterEl).parent().width() * 100;
        $(this.afterEl).outerWidth("calc(" + afterElSize + "% - " + this._dividerWidth + "px)");        
   
        if(afterElSize < this.afterEl.pane.min)
        {
            $(this.beforeEl).css("width", sizePrevBefore);
            $(this.afterEl).css("width", sizePrevAfter);
        }
    }
}

class DividerHorizontal extends Divider
{
    layout()
    {
        $(this.dividerEl).css("cursor", "ns-resize");
        $(this.dividerEl).css("float", "left");
        $(this.dividerEl).width("100%");
        $(this.dividerEl).outerHeight(this._dividerWidth);
        $(this.dividerEl).css("background-color", "#eee");
    }

    measureDimensions()
    {
        this._maxHeight = $(this.beforeEl).outerHeight() + $(this.afterEl).outerHeight();
    }

    dragDivider(e)
    {
        var sizePrevBefore = this.beforeEl.style.height;
        var sizePrevAfter = this.afterEl.style.height;

        var beforeElSize = (e.clientY - $(this.beforeEl).offset().top) / $(this.beforeEl).parent().height() * 100;

        if(beforeElSize < this.beforeEl.pane.min)
        {
            return;
        }
        
        $(this.beforeEl).outerHeight("calc(" + beforeElSize + "% - " + this._dividerWidth + "px)");
        $(this.afterEl).outerHeight("0px");

        var afterElSize = (this._maxHeight - $(this.beforeEl).outerHeight() + this._dividerWidth) / $(this.afterEl).parent().height() * 100;
        $(this.afterEl).outerHeight("calc(" + afterElSize + "% - " + this._dividerWidth + "px)");        
   
        if(afterElSize < this.afterEl.pane.min)
        {
            $(this.beforeEl).css("height", sizePrevBefore);
            $(this.afterEl).css("height", sizePrevAfter);
        }
        
    }
}