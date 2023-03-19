import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';

import { TreeTable, TreeTableExpandedKeysType } from 'primereact/treetable';
import { Column } from 'primereact/column';
import TreeNode from 'primereact/treenode';
import { NodeService, getMonthlyPayment } from './service/NodeService';

export interface iLoanParams {
    calendarValue: Date;
    amountValue: number;
    taxValue: number;
    yearsValue: number;
}

const getEndDate = (date: Date, years: number): string => {
    const initialDate: Date = new Date(date);
    initialDate.setFullYear(initialDate.getFullYear() + years);
    return initialDate.getDate() + "/" + (initialDate.getMonth() + 1) + "/" + initialDate.getFullYear();
}

const FormLayoutDemo = () => {
    const [calendarValue, setCalendarValue] = useState(new Date());
    const [amountValue, setAmountValue] = useState(144000);
    const [taxValue, setTaxValue] = useState(1.25);
    const [yearsValue, setYearsValue] = useState(30);

    const defaultParams = {
        calendarValue: new Date(),
        amountValue: 144000,
        taxValue: 1.25,
        yearsValue: 30
    };
    const [paramsValue, setParamsValue] = useState(defaultParams);
    const [nodes, setNodes] = useState<TreeNode[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<TreeTableExpandedKeysType | undefined>(undefined);

    const columns: any[] = [
        { field: 'month', header: 'Mes', expander: true},
        { field: 'pay', header: 'Cuota' },
        { field: 'interest', header: 'Interés' },
        { field: 'principal', header: 'Amortizado' },
        { field: 'endBalance', header: 'Saldo final' }
    ];

    const getCuotasNumber = () => {
        return yearsValue * 12;
    }
 
    const toggleFirstRow = () => {
        let _expandedKeys = { ...expandedKeys };
        if (_expandedKeys['0']) delete _expandedKeys['0'];
        else _expandedKeys['0'] = true;
        setExpandedKeys(_expandedKeys);
    };

    const updateData = () => {
        setParamsValue({
            calendarValue,
            amountValue,
            taxValue,
            yearsValue
        });
        const data = NodeService.getTreeTableNodesData(paramsValue);
        setNodes(data);
        toggleFirstRow();
    }
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Loan Calculator</h5>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="amount">Importe</label>
                            <InputNumber id="amount" suffix=" €" value={amountValue} onValueChange={(e) => setAmountValue(e.value as number)} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="tax">Tasa de interés</label>
                            <InputNumber showButtons suffix=" %" inputId="tax" minFractionDigits={2} maxFractionDigits={5} step={0.01} value={taxValue} onValueChange={(e) => setTaxValue(e.value as number)} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="years">Años</label>
                            <InputNumber value={yearsValue} onValueChange={(e) => setYearsValue(e.value as number)} showButtons step={5} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="initialDate">Fecha de inicio</label>
                            <Calendar showIcon showButtonBar dateFormat="dd/mm/yy" value={calendarValue} onChange={(e) => setCalendarValue(e.value as Date)}></Calendar>
                        </div>
                    </div>
                    <Button label="Tabla de amortización" onClick={(e) => updateData()} />
                    <div className="col-12 md:col-6 flex flex-column md:flex-column">
                        <span>Pago mensual: {getMonthlyPayment(amountValue, taxValue, yearsValue).toLocaleString(undefined, {maximumFractionDigits:2})} </span>
                        <span>Número de cuotas: {getCuotasNumber()} </span>
                        <span>Fecha de fin: {getEndDate(calendarValue, yearsValue)} </span>
                    </div>
                </div>
                <div className="card">
                    <TreeTable scrollable scrollHeight="300px" value={nodes} expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)} tableStyle={{ minWidth: '50rem' }}>
                        {columns.map((col, i) => (
                            <Column hidden={col.hidden} key={col.field} field={col.field} header={col.header} expander={col.expander} />
                        ))}
                    </TreeTable>
                </div>
            </div>
        </div>
    );
};

export default FormLayoutDemo;
