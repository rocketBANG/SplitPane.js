class Pane
{
    constructor(min = 5, el, weight = 1, minPx = 100)
    {
        this.min = min;
        this.minPx = minPx;
        this.el = el;
        this.dividerBefore = undefined;
        this.dividerAfter = undefined;
        this.weight = weight;
        this.actualWidth = undefined;
    }

    //Works with plain numbers (assume pixels)
    //With pixels (10px)
    //With percent (40%)
    _getInPercent(measurement, parentMeasure)
    {
        if(typeof measurement == "number")
        {
            var sizePx = measurement;
            return measurement / parentMeasure * 100;
        }
        else if(measurement.substring(measurement.length - 1) == "%")
        {
            var sizePercent = parseFloat(measurement.substring(0, measurement.length - 1));
            return sizePercent;
        }
        else
        {
            var sizePx = parseFloat(measurement);
            return measurement / parentMeasure * 100;
        }
    }

    _getInPx(measurement, parentMeasure)
    {
        if(typeof measurement == "number")
        {
            return measurement;
        }
        else if(measurement.substring(measurement.length - 1) == "%")
        {
            var sizePercent = parseFloat(measurement.substring(0, measurement.length - 1));
            return sizePercent * parentMeasure / 100;
        }
        else
        {
            return parseFloat(measurement);
        }
    }

    adjustWidth(width)
    {
        var dividerWidths = 0;
        dividerWidths += this.dividerBefore != undefined ? this.dividerBefore.dividerWidth/2 : 0;
        dividerWidths += this.dividerAfter != undefined ? this.dividerAfter.dividerWidth/2 : 0;

        var widthPx = this._getInPx(width, $(this.el).parent().width());
        widthPx += dividerWidths;

        var widthDif = $(this.el).width() - widthPx;

        if(this.dividerBefore != undefined && this.dividerAfter != undefined)
        {
            widthDif = widthDif / 2;
        }

        $(this.el).width("0px");

        if(this.dividerBefore != undefined)
        {
            this.dividerBefore.resizeAfter(widthDif);
        }
        if(this.dividerAfter != undefined)
        {
            this.dividerAfter.resizeBefore(widthDif);
        }

        this.setWidth(width);
    }

    /**
     * Sets the width of the pane
     * @param {int} width The width
     * @return {bool}
     */
    setWidth(width)
    {
        var dividerWidths = 0;
        dividerWidths += this.dividerBefore != undefined ? this.dividerBefore.dividerWidth/2 : 0;
        dividerWidths += this.dividerAfter != undefined ? this.dividerAfter.dividerWidth/2 : 0;

        if(width == undefined)
        {
            $(this.el).width("calc(" + this.el.style.width + " - " + dividerWidths + "px)");
            return $(this.el).width();
        }

        var trueWidth = this._getInPx(width, $(this.el).parent().width());
        // trueWidth += dividerWidths;
        var widthPercent = this._getInPercent(trueWidth, $(this.el).parent().width());
        var success = true;

         if(widthPercent <= this.min && this._getInPx(this.min + "%", $(this.el).parent().width()) > this.minPx)
        {
            trueWidth = this._getInPx(this.min + "%", $(this.el).parent().width());
            success = false;
        }
        else  if(trueWidth <= this.minPx)
        {
            trueWidth = this.minPx;
            success =  false;
        }
        
        trueWidth += dividerWidths;
        widthPercent = this._getInPercent(trueWidth, $(this.el).parent().width());

        $(this.el).outerWidth("calc(" + widthPercent + "% - " + dividerWidths + "px)");

        return success;
    }

    setHeight(height)
    {
        var dividerWidths = 0;
        dividerWidths += this.dividerBefore != undefined ? this.dividerBefore.dividerWidth/2 : 0;
        dividerWidths += this.dividerAfter != undefined ? this.dividerAfter.dividerWidth/2 : 0;

        if(height == undefined)
        {
            $(this.el).height("calc(" + this.el.style.height + " - " + dividerWidths + "px)");
            return true;
        }

        var trueHeight = this._getInPx(height, $(this.el).parent().height());
        trueHeight += dividerWidths;
        var heightPercent = this._getInPercent(trueHeight, $(this.el).parent().height());

        if(heightPercent > this.min && trueHeight > this.minPx)
        {
            $(this.el).outerHeight("calc(" + heightPercent + "% - " + dividerWidths + "px)");
            return true;            
        }
        else
        {
            return false;
        }

    }
}