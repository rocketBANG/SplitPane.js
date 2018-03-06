class Pane {
    constructor(min = 5, el, weight = 1, minPx = 100) {
        this.min = min;
        this.minPx = minPx;
        this.el = el;
        this.dividerBefore = undefined;
        this.dividerAfter = undefined;
        this.weight = weight;
        this.resizeTO = undefined;
        /** @type {Function} */
        this.resizeCallback = undefined;

        window.addEventListener("resize", function () {
            this.layout()
        }.bind(this));
    }

    /**
     * Adjusts Pane size to be above the minimum pixels  
     * Called when layout size changes  
     * Tries to keep Pane size above it's minimum pixels  
     * (layout resize won't change the minimum % size)        
     */
    layout() {
        if (this._getSize() < this.minPx) {
            this.adjustSize(this.minPx);
        }
    }

    /**
     * Sets a callback function to be called when the Pane resizes
     * @param {Function} callback - Function to be called when the Pane resizes
     */
    setOnResize(callback) {
        this.resizeCallback = callback;
    }

    /**
     * Returns a measurement (measured in percent or pixels) in percent relative to parent
     * @param {*} measurement The measurement to change (number for pixels, string with % at the end for percent)
     * @param {number} parentMeasure The parent measurment used to calculate relative percentage
     */
    _getInPercent(measurement, parentMeasure) {
        if (typeof measurement == "number") {
            var sizePx = measurement;
            return measurement / parentMeasure * 100;
        }
        else if (measurement.substring(measurement.length - 1) == "%") {
            var sizePercent = parseFloat(measurement.substring(0, measurement.length - 1));
            return sizePercent;
        }
        else {
            var sizePx = parseFloat(measurement);
            return measurement / parentMeasure * 100;
        }
    }

    /**
     * Returns the measurement (measured in percent or pixels) in pixels
     * @param {*} measurement The measurement to change (string with % at the end for percent, number for pixels)
     * @param {number} parentMeasure The parent measurment used to calculate actual size from percentage
     */
    _getInPx(measurement, parentMeasure) {
        if (typeof measurement == "number") {
            return measurement;
        }
        else if (measurement.substring(measurement.length - 1) == "%") {
            var sizePercent = parseFloat(measurement.substring(0, measurement.length - 1));
            return sizePercent * parentMeasure / 100;
        }
        else {
            return parseFloat(measurement);
        }
    }

    /**
     * Tries to resize the adjacent panes with the given sizes  
     * If the first proposal does not work, it makes a new proposal using all the avaliable space
     * in one Pane, and then proposes to shrink the other Pane by the remaining space
     * @param {number} beforePropose The proposed amount to shrink the Pane before (in pixels)
     * @param {number} afterPropose The proposed amount to shrink the Pane after (in pixels)
     * @param {number} calls How many attempts has been tried (stops after 2)
     */
    _resizeWithProposals(beforePropose, afterPropose, calls = 0) {
        if (calls > 1) {
            return false;
        }

        var fitAfter = this.dividerAfter == undefined ? true : this.dividerAfter.avaliableAfter() + afterPropose >= 0;
        var fitBefore = this.dividerBefore == undefined ? true : this.dividerBefore.avaliableBefore() + beforePropose >= 0;

        if (fitBefore && fitAfter) {
            if (this.dividerBefore != undefined) {
                this.dividerBefore.moveBack(beforePropose);
            }
            if (this.dividerAfter != undefined) {
                this.dividerAfter.moveForward(afterPropose);
            }
            return true;
        }
        else if (!fitBefore && fitAfter) {
            return this._resizeWithProposals(this.dividerBefore.avaliableBefore(), beforePropose + afterPropose - this.dividerBefore.avaliableBefore(), calls + 1);
        }
        else if (fitBefore && !fitAfter) {
            return this._resizeWithProposals(beforePropose + afterPropose - this.dividerAfter.avaliableAfter(), this.dividerAfter.avaliableAfter(), calls + 1);
        }
    }

    /**
     * Attempts to adjust the size of the Pane to the given size by shrinking/growing the adjacent Panes  
     * Does not resize if adjacent Panes would go below the minimum size
     * @param {*} size Target size in pixels (number) or percent (string closed with %) 
     */
    adjustSize(size) {
        var sizePx = this._getInPx(size, this._getParentSize());
        var sizeDif = this._getSize() - sizePx;

        if (this.dividerBefore != undefined && this.dividerAfter != undefined) {
            sizeDif = sizeDif / 2;
        }
        if (this._resizeWithProposals(sizeDif, sizeDif)) {            
            this.resize(size);
        }

    }

    /**
     * Gets the minimum size in pixels 
     * (the larger of the minimum pixels or minimum percent at parent's current size)
     * @return {number} minimum size in pixels
     */
    getMinSize() {
        var smallestPercent = this._getInPx(this.min + "%", this._getParentSize());
        var smallestPx = smallestPercent > this.minPx ? smallestPercent : this.minPx;
        return smallestPx;
    }

    /**
     * Sets the size of the pane
     * @param {number} size - The size in pixels (number) or Percent (string with % at the end)
     */
    resize(size) {
        var dividerWidths = 0;
        dividerWidths += this.dividerBefore != undefined ? this.dividerBefore.dividerWidth / 2 : 0;
        dividerWidths += this.dividerAfter != undefined ? this.dividerAfter.dividerWidth / 2 : 0;

        if (size == undefined) {
            this._setSize("calc(" + this._getSizeCSS() + " - " + dividerWidths + "px)");
            if (this.resizeCallback !== undefined) {
                this.resizeCallback(this._getSize());
            }
            return;
        }

        var trueSize = this._getInPx(size, this._getParentSize());
        trueSize += dividerWidths;
        var sizePercent = this._getInPercent(trueSize, this._getParentSize());

        this._setSize("calc(" + sizePercent + "% - " + dividerWidths + "px)");
        if (this.resizeCallback !== undefined) {
            this.resizeCallback(this._getSize());
        }
    }
}

class PaneHorizontal extends Pane {
    /**
     * @return {number} The width of the Pane in pixels
     */
    _getSize() {
        return this.el.offsetWidth;
    }

    /**
     * @return {number} The width of the Pane's parent element in pixels
     */
    _getParentSize() {
        return this.el.parentNode.offsetWidth;
    }

    /**
     * Sets the width of the element
     * @param {*} size Width in pixels (number) or percent (string ended with %)
     */
    _setSize(size) {
        this.el.style.width = size;
    }

    /**
     * @return {string} The actual css style of the element
     */
    _getSizeCSS() {
        return this.el.style.width;
    }
}

class PaneVertical extends Pane {
    /**
    * @return {number} The height of the Pane in pixels
    */
    _getSize() {
        return this.el.offsetHeight;
    }

    /**
     * @return {number} The height of the Pane's parent element in pixels
     */
    _getParentSize() {
        return this.el.parentNode.offsetHeight;
    }

    /**
     * Sets the height of the element
     * @param {*} size Width in pixels (number) or percent (string ended with %)
     */
    _setSize(size) {
        this.el.style.height = size;
    }

    /**
     * @return {string} The actual css style of the element
     */
    _getSizeCSS() {
        return this.el.style.height;
    }
}
