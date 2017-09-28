import { Dialog } from '@syncfusion/ej2-popups';
import { remove, createElement, Browser } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
var DialogEditRender = (function () {
    function DialogEditRender(parent, serviceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.parent.on(events.dialogDestroy, this.destroy, this);
        this.parent.on(events.destroy, this.destroy, this);
    }
    DialogEditRender.prototype.setLocaleObj = function () {
        this.l10n = this.serviceLocator.getService('localization');
    };
    DialogEditRender.prototype.addNew = function (elements, args) {
        this.isEdit = false;
        this.createDialog(elements, args);
    };
    DialogEditRender.prototype.update = function (elements, args) {
        this.isEdit = true;
        this.createDialog(elements, args);
    };
    DialogEditRender.prototype.createDialog = function (elements, args) {
        var gObj = this.parent;
        this.dialog = createElement('div', { id: gObj.element.id + '_dialogEdit_wrapper' });
        gObj.element.appendChild(this.dialog);
        this.setLocaleObj();
        this.dialogObj = new Dialog({
            header: this.isEdit ? this.l10n.getConstant('EditFormTitle') + args.primaryKeyValue[0] :
                this.l10n.getConstant('AddFormTitle'), isModal: true, visible: true,
            content: this.getEditElement(elements), showCloseIcon: true, allowDragging: true, close: this.destroy.bind(this),
            closeOnEscape: true, width: '330px', target: gObj.element, animationSettings: { effect: 'None' },
            buttons: [{
                    click: this.btnClick.bind(this),
                    buttonModel: { content: this.l10n.getConstant('SaveButton'), cssClass: 'e-primary', isPrimary: true }
                },
                { click: this.btnClick.bind(this), buttonModel: { cssClass: 'e-flat', content: this.l10n.getConstant('CancelButton') } }]
        });
        this.dialogObj.appendTo(this.dialog);
    };
    DialogEditRender.prototype.btnClick = function (e) {
        if (this.l10n.getConstant('CancelButton').toLowerCase() === e.target.innerText.toLowerCase()) {
            this.parent.closeEdit();
            this.destroy();
        }
        else {
            this.parent.endEdit();
        }
    };
    DialogEditRender.prototype.destroy = function (args) {
        this.parent.notify(events.destroyForm, {});
        this.parent.isEdit = false;
        this.parent.notify(events.toolbarRefresh, {});
        if (this.dialog && !this.dialogObj.isDestroyed) {
            this.dialogObj.destroy();
            remove(this.dialog);
        }
    };
    DialogEditRender.prototype.getEditElement = function (elements) {
        var gObj = this.parent;
        var div = createElement('div', { className: this.isEdit ? 'e-editedrow' : 'e-insertedrow' });
        var form = createElement('form', { id: gObj.element.id + 'EditForm', className: 'e-gridform' });
        var table = createElement('table', { className: 'e-table', attrs: { cellspacing: '6px' } });
        var tbody = createElement('tbody');
        var cols = gObj.columns;
        for (var i = 0; i < cols.length; i++) {
            if (!cols[i].visible) {
                continue;
            }
            var tr = createElement('tr');
            var dataCell = createElement('td', { className: 'e-rowcell', attrs: { style: 'text-align:left;width:190px' } });
            var label = createElement('label', { innerHTML: cols[i].field });
            elements[cols[i].uid].classList.remove('e-input');
            if (cols[i].editType === 'booleanedit') {
                var elem = dataCell.appendChild(elements[cols[i].uid]);
                var lbl = createElement('label', { className: 'e-noselect', attrs: { for: elem.id, style: Browser.isDevice ? '' : 'vertical-align: top;' } });
                lbl.innerHTML = cols[i].headerText;
                dataCell.appendChild(elem);
                dataCell.appendChild(lbl);
            }
            else {
                dataCell.appendChild(elements[cols[i].uid]);
            }
            tr.appendChild(dataCell);
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        form.appendChild(table);
        div.appendChild(form);
        return div;
    };
    return DialogEditRender;
}());
export { DialogEditRender };
