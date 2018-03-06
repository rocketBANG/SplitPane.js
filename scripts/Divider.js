/**
 * Class in control of the divider inbetween panes
 * Handles the resizing of panes before and after when divider is dragged
 */
class Divider {
    /**
     * Creates a new divider
     * @param {number} dividerEl The DOM element of the divider
     * @param {*} beforeEl The DOM element of the pane before
     * @param {*} afterEl The DOM element of the pane after
     * @param {number} width The that the divider should be
     */
    constructor(dividerEl, beforeEl, afterEl, width = 10) {
        this.dividerWidth = width;
        this._moving = false;

        this.dividerEl = dividerEl;
        this.beforeEl = beforeEl;
        this.afterEl = afterEl;

        if (this.beforeEl != undefined) {
            this.beforeEl.pane.dividerAfter = this;
        }
        if (this.afterEl != undefined) {
            this.afterEl.pane.dividerBefore = this;
        }


        this.dividerEl.addEventListener("mousedown", this.mouseDown.bind(this));
        document.addEventListener("mousemove", this.documentMouseMove.bind(this));
        this.layout();
    }

    mouseDown(e) {
        this._moving = true;

        this.measureDimensions();

        document.addEventListener("mouseup", this.stopMove.bind(this));

        e.preventDefault();
    }

    documentMouseMove(e) {
        if (this._moving) {
            this.dragDivider(e);
        }
    }

    stopMove() {
        this._moving = false;
        document.removeEventListener("mouseup", this.stopMove.bind(this));
    }

    resize(size, target) {
        target.pane.resize(size + this.getElSize(target));
    }

    moveBack(size) {
        this.resize(size, this.beforeEl);
    }

    moveForward(size) {
        this.resize(size, this.afterEl);
    }

    avaliableBefore() {
        return this.getElSize(this.beforeEl) - this.beforeEl.pane.getMinSize();
    }

    avaliableAfter() {
        return this.getElSize(this.afterEl) - this.afterEl.pane.getMinSize();
    }

    dragDivider(e) {
        var beforeElSize = this.getMousePos(e) - this.getOffset(this.beforeEl);

        this.resizeWithProposals(beforeElSize, this._maxSize - beforeElSize);
    }

    resizeWithProposals(beforePropose, afterPropose, calls = 0) {
        if (calls > 2) {
            return;
        }
        var fitBefore = beforePropose >= this.beforeEl.pane.getMinSize();
        var fitAfter = afterPropose >= this.afterEl.pane.getMinSize();
        if (fitBefore && fitAfter) {
            var beforeDislay = [];
            this.beforeEl.parentNode.childNodes.forEach((sibling, i) => {
                if(sibling.nodeName === "DIV" && sibling !== this.beforeEl) {
                    beforeDislay[i] = sibling.style.display;
                    sibling.style.display = "none";
                }
            });

            this.beforeEl.pane.resize(beforePropose);
            this.afterEl.pane.resize(afterPropose);
            this.beforeEl.parentNode.childNodes.forEach((sibling, i) => {
                if(sibling.nodeName === "DIV" && sibling !== this.beforeEl) {
                    sibling.style.display = beforeDislay[i];
                }
            });
        }
        else if (!fitBefore && fitAfter) {
            this.resizeWithProposals(this.beforeEl.pane.getMinSize(), this._maxSize - this.beforeEl.pane.getMinSize(), calls + 1);
        }
        else if (fitBefore && !fitAfter) {
            this.resizeWithProposals(this._maxSize - this.afterEl.pane.getMinSize(), this.afterEl.pane.getMinSize(), calls + 1);
        }
    }

    measureDimensions() {
        this._maxSize = this.getElSize(this.beforeEl) + this.getElSize(this.afterEl);
    }
}

class DividerVertical extends Divider {
    layout() {
        this.dividerEl.style.cursor = "ew-resize";
        this.dividerEl.style.flex = "none";
        this.dividerEl.style.height = "100%";
        this.dividerEl.style.width = this.dividerWidth;
    }

    getElSize(el) {
        return el.offsetWidth;
    }

    getOffset(el) {
        return el.getBoundingClientRect().left + document.body.scrollLeft;
    }

    getMousePos(e) {
        return e.clientX;
    }
}

class DividerHorizontal extends Divider {
    layout() {
        this.dividerEl.style.cursor = "ns-resize";
        this.dividerEl.style.flex = "none";
        this.dividerEl.style.width = "100%";
        this.dividerEl.style.height = this.dividerWidth;
    }

    getElSize(el) {
        return el.offsetHeight;
    }

    getOffset(el) {
        return el.getBoundingClientRect().top + document.body.scrollTop;
    }

    getMousePos(e) {
        return e.clientY;
    }
}
