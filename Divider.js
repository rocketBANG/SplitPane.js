/**
 * Class in control of the divider inbetween panes
 * Handles the resizing of panes before and after when divider is dragged
 */
class Divider
{
    /**
     * Creates a new divider
     * @param {number} dividerEl The DOM element of the divider
     * @param {number} beforeEl The DOM element of the pane before
     * @param {number} afterEl The DOM element of the pane after
     * @param {number} width The that the divider should be
     */
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
        $(this.dividerEl).css("flex", "none");
        $(this.dividerEl).height("100%");
        $(this.dividerEl).outerWidth(this.dividerWidth);
    }

    measureDimensions()
    {
        this._maxWidth = $(this.beforeEl).width() + $(this.afterEl).width();
    }

    resizeWithProposals(beforePropose, afterPropose, calls = 0)
    {
        if(calls > 2)
        {
            return;
        }
        var fitBefore = beforePropose >= this.beforeEl.pane.getMinWidth();
        var fitAfter = afterPropose >= this.afterEl.pane.getMinWidth();
        if(fitBefore && fitAfter)
        {
            $(this.beforeEl).siblings().css("display", "none");
            this.beforeEl.pane.setWidth(beforePropose);
            this.afterEl.pane.setWidth(afterPropose);
            $(this.beforeEl).siblings().css("display", "initial");
        }
        else if(!fitBefore && fitAfter)
        {
            this.resizeWithProposals(this.beforeEl.pane.getMinWidth(), this._maxWidth - this.beforeEl.pane.getMinWidth(), calls + 1);
        }
        else if(fitBefore && !fitAfter)
        {
            this.resizeWithProposals(this._maxWidth - this.afterEl.pane.getMinWidth(), this.afterEl.pane.getMinWidth(), calls + 1);
        }
    }

    dragDivider(e)
    {
        var sizePrevBefore = this.beforeEl.style.width;
        var sizePrevAfter = this.afterEl.style.width;

        var beforeElSize = e.clientX - $(this.beforeEl).offset().left;

        this.resizeWithProposals(beforeElSize, this._maxWidth - beforeElSize);
    }

    resize(width, target)
    {
        var prevWidth = $(target).width();
        target.pane.setWidth(width + prevWidth);
    }

    moveBack(width)
    {
        this.resize(width, this.beforeEl);
    }

    moveForward(width)
    {
        this.resize(width, this.afterEl);
    }

    avaliableBefore()
    {
        return $(this.beforeEl).width() - this.beforeEl.pane.getMinWidth();
    }

    avaliableAfter()
    {
        return $(this.afterEl).width() - this.afterEl.pane.getMinWidth();
    }
}

class DividerHorizontal extends Divider
{
    layout()
    {
        $(this.dividerEl).css("cursor", "ns-resize");
        $(this.dividerEl).css("flex", "none");
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