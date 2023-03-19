import { iLoanParams } from "..";

export const getMonthlyPayment = (amount: number, tax: number, years: number) => {
    const capital: number = amount;
    tax = tax / 100 / 12;
    const npay: number = years * 12;

    return capital / ((1 - (1 + tax) ** -npay) / tax);
}
const getStringMonth = (month: number) => {
    const stringMonth = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return stringMonth[month];
}
export const NodeService = {
    getTreeTableNodesData(params: iLoanParams) {
        if(!params) return [];
        const monthlyPay = getMonthlyPayment(params.amountValue, params.taxValue, params.yearsValue);

        const npay: number = params.yearsValue * 12;
        const capital: number = params.amountValue;
        const tax: number = params.taxValue;
        let balance: number = capital;
        const payDate: Date = new Date(params.calendarValue);
        const payDateYear: Date = new Date(params.calendarValue);
        const initialYear = payDateYear.getFullYear();

        const data = [];

        for (let year = 0; year < params.yearsValue; year++) {
            const children = [];
            const initialMonth = year === 0 ? payDate.getMonth(): 1;
            for (let m = initialMonth; m < 11; m++) {
                const interest = (balance * (tax / 100 / 12));
                const principal = monthlyPay - interest;
                const endBalance = balance - principal;

                payDate.setMonth(payDate.getMonth() + 1);
                children.push({
                    key: year + '-' + m,
                    data: {
                        date: payDate.toLocaleDateString(),
                        month: getStringMonth(payDate.getMonth()),
                        pay: monthlyPay.toLocaleString(undefined, {maximumFractionDigits:2}),
                        interest: interest.toLocaleString(undefined, {maximumFractionDigits:2}),
                        principal: principal.toLocaleString(undefined, {maximumFractionDigits:2}),
                        endBalance: endBalance.toLocaleString(undefined, {maximumFractionDigits:2})
                    }
                });
                balance = endBalance;
            }
            data.push({
                key: String(year),
                data: {
                    date: payDate.toLocaleDateString(),
                    month: payDate.getFullYear(),
                    pay: '',
                    interest: '',
                    principal: '',
                    endBalance: ''
                },
                children
            });
        }
        return data;
    },
    getTreeTableNodes(params: iLoanParams) {
        return Promise.resolve(this.getTreeTableNodesData(params));
    }
};