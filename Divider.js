/**
 * Class in control of the divider inbetween panes
 * Handles the resizing of panes before and after when divider is dragged
 */
class Divider
{
    /**
     * Creates a new divider
     * @param {number} dividerEl The DOM element of the divider
     * @param {*} beforeEl The DOM element of the pane before
     * @param {*} afterEl The DOM element of the pane after
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

    resize(size, target)
    {
        target.pane.resize(size + this.getElSize(target));
    }

    moveBack(size)
    {
        this.resize(size, this.beforeEl);
    }

    moveForward(size)
    {
        this.resize(size, this.afterEl);
    }

    avaliableBefore()
    {
        return this.getElSize(this.beforeEl) - this.beforeEl.pane.getMinSize();
    }

    avaliableAfter()
    {
        return this.getElSize(this.afterEl) - this.afterEl.pane.getMinSize();
    }
    
    dragDivider(e)
    {
        var beforeElSize = this.getMousePos(e) - this.getOffset(this.beforeEl);

        this.resizeWithProposals(beforeElSize, this._maxSize - beforeElSize);
    }

    resizeWithProposals(beforePropose, afterPropose, calls = 0)
    {
        if(calls > 2)
        {
            return;
        }
        var fitBefore = beforePropose >= this.beforeEl.pane.getMinSize();
        var fitAfter = afterPropose >= this.afterEl.pane.getMinSize();
        if(fitBefore && fitAfter)
        {
            $(this.beforeEl).siblings().css("display", "none");
            this.beforeEl.pane.resize(beforePropose);
            this.afterEl.pane.resize(afterPropose);
            $(this.beforeEl).siblings().css("display", "flex");
        }
        else if(!fitBefore && fitAfter)
        {
            this.resizeWithProposals(this.beforeEl.pane.getMinSize(), this._maxSize - this.beforeEl.pane.getMinSize(), calls + 1);
        }
        else if(fitBefore && !fitAfter)
        {
            this.resizeWithProposals(this._maxSize - this.afterEl.pane.getMinSize(), this.afterEl.pane.getMinSize(), calls + 1);
        }
    }

    measureDimensions()
    {
        this._maxSize = this.getElSize(this.beforeEl) + this.getElSize(this.afterEl);
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

    getElSize(el)
    {
        return $(el).width();
    }

    getOffset(el)
    {
        return $(el).offset().left;
    }

    getMousePos(e)
    {
        return e.clientX;
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

    getElSize(el)
    {
        return $(el).height();
    }

    getOffset(el)
    {
        return $(el).offset().top;
    }

    getMousePos(e)
    {
        return e.clientY;
    }
}
