class Pane
{
    constructor(min = 5, el)
    {
        this.min = min;
        this.minPx = 100;
        this.el = el;
        this.dividerBefore = undefined;
        this.dividerAfter = undefined;
    }

    //Works with plain numbers (assume pixels)
    //With pixels (10px)
    //With percent (40%)
    _getInPercent(measurement, parentMeasure)
    {
        var sizePercent = undefined;

        if(typeof measurement == "number")
        {
            var sizePx = measurement;
        }
        else if(measurement.substring(measurement.length - 1) == "%")
        {
            sizePercent = parseFloat(measurement.substring(0, measurement.length - 1));
        }
        else if(measurement.substring(measurement.length - 2) == "px")
        {
            var sizePx = parseFloat(measurement.substring(0, measurement.length - 2));
        }

        if(sizePercent == undefined)
        {
            sizePercent = sizePx / parentMeasure * 100;
        }

        return sizePercent;
    }

    _getInPx(measurement, parentMeasure)
    {
        var sizePx = undefined;
        
        if(typeof measurement == "number")
        {
            sizePx = measurement;
        }
        else if(measurement.substring(measurement.length - 1) == "%")
        {
            var sizePercent = parseFloat(measurement.substring(0, measurement.length - 1));
        }
        else if(measurement.substring(measurement.length - 2) == "px")
        {
            sizePx = parseFloat(measurement.substring(0, measurement.length - 2));
        }

        if(sizePx == undefined)
        {
            sizePx = sizePercent * parentMeasure / 100;
        }

        return sizePx;
    }

    setWidth(width)
    {
        var dividerWidths = 0;
        dividerWidths += this.dividerBefore != undefined ? this.dividerBefore.dividerWidth/2 : 0;
        dividerWidths += this.dividerAfter != undefined ? this.dividerAfter.dividerWidth/2 : 0;

        if(width == undefined)
        {
            $(this.el).width("calc(" + this.el.style.width + " - " + dividerWidths + "px)");
            return true;
        }

        var trueWidth = this._getInPx(width, $(this.el).parent().width());
        trueWidth += dividerWidths;
        var widthPercent = this._getInPercent(trueWidth, $(this.el).parent().width());

        if(widthPercent > this.min)
        {
            $(this.el).outerWidth("calc(" + widthPercent + "% - " + dividerWidths + "px)");
            return true;            
        }
        else
        {
            return false;
        }
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

        if(heightPercent > this.min)
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