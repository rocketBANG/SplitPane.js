class Divider
{
    constructor(dividerEl, beforeEl, afterEl, width = 10)
    {
        this.dividerWidth = width;
        this._moving = false;

        this.dividerEl = dividerEl;
        this.beforeEl = beforeEl;
        this.afterEl = afterEl;

        if(this.beforeEl != undefined)
        {
            this.beforeEl.pane.dividerAfter = this;
        }
        if(this.afterEl != undefined)
        {
            this.afterEl.pane.dividerBefore = this;
        }

        
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
        $(this.dividerEl).outerWidth(this.dividerWidth);
    }

    measureDimensions()
    {
        this._maxWidth = $(this.beforeEl).width() + $(this.afterEl).width();
    }

    dragDivider(e)
    {
        var sizePrevBefore = this.beforeEl.style.width;
        var sizePrevAfter = this.afterEl.style.width;

        var beforeElSize = e.clientX - $(this.beforeEl).offset().left;
        $(this.beforeEl).siblings().css("display", "none");

        this.beforeEl.pane.setWidth(beforeElSize);
        var afterElSize = this._maxWidth - $(this.beforeEl).width();

        var success = this.afterEl.pane.setWidth(afterElSize);
        $(this.beforeEl).siblings().css("display", "initial");

        if(!success)
        {
            $(this.afterEl).siblings().css("display", "none");

            beforeElSize = this._maxWidth - $(this.afterEl).width();
            this.beforeEl.pane.setWidth(beforeElSize);

            $(this.afterEl).siblings().css("display", "initial");
        }
    }

    resize(width, target, affected)
    {
        var prevWidth = $(affected).width();
        affected.pane.setWidth(prevWidth + width);
    }

    resizeBefore(width)
    {
        this.resize(width, this.beforeEl, this.afterEl);
    }

    resizeAfter(width)
    {
        this.resize(width, this.afterEl, this.beforeEl);
    }
}

class DividerHorizontal extends Divider
{
    layout()
    {
        $(this.dividerEl).css("cursor", "ns-resize");
        $(this.dividerEl).css("float", "left");
        $(this.dividerEl).width("100%");
        $(this.dividerEl).outerHeight(this.dividerWidth);
    }

    measureDimensions()
    {
        this._maxHeight = $(this.beforeEl).height() + $(this.afterEl).height();
    }

    dragDivider(e)
    {
        var sizePrevBefore = this.beforeEl.style.height;
        var sizePrevAfter = this.afterEl.style.height;

        var beforeElSize = e.clientY - $(this.beforeEl).offset().top;

        if(!this.beforeEl.pane.setHeight(beforeElSize))
        {
            return;
        }
        
        $(this.afterEl).outerHeight("0px");
        var afterElSize = this._maxHeight - $(this.beforeEl).outerHeight();
   
        if(!this.afterEl.pane.setHeight(afterElSize))
        {
            $(this.beforeEl).css("height", sizePrevBefore);
            $(this.afterEl).css("height", sizePrevAfter);
        }
        
    }
}