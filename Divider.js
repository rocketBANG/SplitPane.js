
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
        $(this.dividerEl).css("cursor", "e-resize");
        $(this.dividerEl).css("float", "left");
        $(this.dividerEl).height("100%");
        $(this.dividerEl).outerWidth(this._dividerWidth);
        $(this.dividerEl).css("background-color", "red");
    }

    dragDivider(e)
    {
        var widthPrev = $(this.beforeEl).outerWidth();
        $(this.beforeEl).outerWidth("calc(" + (e.clientX - $(this.beforeEl).position().left) / $(this.beforeEl).parent().width() * 100 + "% - 10px)");
        var widthDif = $(this.beforeEl).outerWidth() - widthPrev;        
        // $(this.afterEl).outerWidth(this._workingWidth * 100 - (e.clientX - $(this.beforeEl).position().left) / $(this.beforeEl).parent().innerWidth() * 100 + "%");
        $(this.afterEl).outerWidth("calc(" + ($(this.afterEl).outerWidth() - widthDif + 10) / $(this.afterEl).parent().width() * 100 + "% - 10px)");        
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

        $(this.dividerEl).css("cursor", "n-resize");
        $(this.dividerEl).css("float", "left");
        $(this.dividerEl).width("100%");
        $(this.dividerEl).outerHeight(this._dividerWidth);
        $(this.dividerEl).css("background-color", "red");
    }

    dragDivider(e)
    {
        var heightPrev = $(this.beforeEl).outerHeight();        
        $(this.beforeEl).outerHeight("calc(" + (e.clientY - $(this.beforeEl).position().top) / $(this.beforeEl).parent().height() * 100 + "% - 10px)");
        var heightDif = $(this.beforeEl).outerHeight() - heightPrev;        
        $(this.afterEl).outerHeight("calc(" + ($(this.afterEl).outerHeight() - heightDif + 10) / $(this.afterEl).parent().height() * 100 + "% - 10px");
        
    }
}