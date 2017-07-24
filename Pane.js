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
        this.resizeTO = undefined;

        $(window).resize(function() 
        {
            clearTimeout(this.resizeTO);
            this.resizeTO = setTimeout(this.tryResize(), 500); //Timeouts so that it happens after the window resizing has 'settled down'
        }.bind(this));
    }

    tryResize()
    {
        if(this.getSize() < this.minPx)
        {
            this.adjustSize(this.minPx);
        }
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

    resizeWithProposals(beforePropose, afterPropose, calls = 0)
    {
        if(calls > 2)
        {
            return false;
        }

        var fitAfter = this.dividerAfter == undefined ? true : this.dividerAfter.avaliableAfter() + afterPropose >= 0;
        var fitBefore = this.dividerBefore == undefined ? true : this.dividerBefore.avaliableBefore() + beforePropose >= 0;

        if(fitBefore && fitAfter)
        {
            if(this.dividerBefore != undefined)
            {
                this.dividerBefore.moveBack(beforePropose);
            }
            if(this.dividerAfter != undefined)
            {
                this.dividerAfter.moveForward(afterPropose);
            }
            return true;
        }
        else if(!fitBefore && fitAfter)
        {
            return this.resizeWithProposals(this.dividerBefore.avaliableBefore(), beforePropose + afterPropose - this.dividerBefore.avaliableBefore(), calls + 1);
        }
        else if(fitBefore && !fitAfter)
        {
            return this.resizeWithProposals(beforePropose + afterPropose - this.dividerAfter.avaliableAfter(), this.dividerAfter.avaliableAfter(), calls + 1);
        }
    }

    adjustSize(size)
    {
        var sizePx = this._getInPx(size, this.getParentSize());

        var sizeDif = this.getSize() - sizePx;

        if(this.dividerBefore != undefined && this.dividerAfter != undefined)
        {
            sizeDif = sizeDif / 2;
        }

        $(this.el).css("display", "none");
        if(this.resizeWithProposals(sizeDif, sizeDif))
        {
            this.resize(size);
        }
        $(this.el).css("display", "flex");
    }

    getMinSize()
    {
        var smallestPercent = this._getInPx(this.min + "%", this.getParentSize());
        var smallestPx = smallestPercent > this.minPx ? smallestPercent : this.minPx;
        return smallestPx;
    }

    /**
     * Sets the size(width/height) of the pane
     * @param {number} size - The size in pixels (number) or Percent (string with % at the end)
     * @return {bool}
     */
    resize(size)
    {
        var dividerWidths = 0;
        dividerWidths += this.dividerBefore != undefined ? this.dividerBefore.dividerWidth/2 : 0;
        dividerWidths += this.dividerAfter != undefined ? this.dividerAfter.dividerWidth/2 : 0;

        if(size == undefined)
        {
            this.setSize("calc(" + this.getSizeCSS() + " - " + dividerWidths + "px)");
            return;
        }

        var trueSize = this._getInPx(size, this.getParentSize());
        trueSize += dividerWidths;
        var sizePercent = this._getInPercent(trueSize, this.getParentSize());

        this.setSize("calc(" + sizePercent + "% - " + dividerWidths + "px)");
    }
}

class PaneHorizontal extends Pane
{
    getSize()
    {
        return $(this.el).width();
    }

    getParentSize()
    {
        return $(this.el).parent().width();
    }

    setSize(size)
    {
        $(this.el).width(size);
    }

    getSizeCSS()
    {
        return this.el.style.width;
    }
}

class PaneVertical extends Pane
{
    getSize()
    {
        return $(this.el).height();
    }

    getParentSize()
    {
        return $(this.el).parent().height();
    }

    setSize(size)
    {
        $(this.el).height(size);
    }

    getSizeCSS()
    {
        return this.el.style.height;
    }
}