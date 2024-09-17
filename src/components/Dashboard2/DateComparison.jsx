import React, { useEffect, useState } from 'react'
import salesData from '../../data/salesData';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from 'react-chartjs-2';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./datecomparison.css"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DateComparison = () => {
    const [categorized, setCategorized] = useState("Product");
    const [firstDate, setFirstDate] = useState('');
    const [secondDate, setSecondDate] = useState('');
    const paginationPageSize = 5;
    const paginationPageSizeSelector = [5, 10, 20];

    // AG GRID Table
    const columnDefs = [
        { headerName: 'Product Name', field: 'productName', sortable: true, filter: true, flex: 1 },
        { headerName: 'Category', field: 'category', sortable: true, filter: true, flex: 1 },
        { headerName: 'Date 1 Sales Amount', field: 'date1Price', sortable: true, flex: 1 },
        { headerName: 'Date 2 Sales Amount', field: 'date2Price', sortable: true, flex: 1 },
        { headerName: 'Difference', field: 'priceDifference', sortable: true, flex: 1 }
    ];

    const [rowData, setRowData] = useState([]);
    console.log("RowData : ", rowData);

    // Function to compare sales between two selected Dates
    const handleCompare = (e) => {
        e.preventDefault();
        let salesdata = salesData.filter((p) => p.soldDate === firstDate || p.soldDate === secondDate);

        const formattedData = salesdata.reduce((acc, item) => {
            const { productName, category, soldDate, price, quantitySold } = item;

            const existingProduct = acc.find(p => p.productName === productName && p.category === category);

            if (existingProduct) {
                if (soldDate === firstDate) {
                    existingProduct.date1Price = price * quantitySold;
                    existingProduct.date1QuantitySold = (existingProduct.date1QuantitySold || 0) + quantitySold;
                }
                if (soldDate === secondDate) {
                    existingProduct.date2Price = price * quantitySold;
                    existingProduct.date2QuantitySold = (existingProduct.date2QuantitySold || 0) + quantitySold;
                }

                if (existingProduct.date1Price !== undefined && existingProduct.date2Price !== undefined) {
                    existingProduct.priceDifference = existingProduct.date2Price - existingProduct.date1Price;
                }
            } else {
                const newProduct = {
                    productName,
                    category,
                    date1Price: soldDate === firstDate ? price * quantitySold : 0,
                    date2Price: soldDate === secondDate ? price * quantitySold : 0,
                    date1QuantitySold: soldDate === firstDate ? quantitySold : 0,
                    date2QuantitySold: soldDate === secondDate ? quantitySold : 0,
                    priceDifference: undefined,
                };

                if (newProduct.date1Price !== 0 && newProduct.date2Price !== 0) {
                    newProduct.priceDifference = newProduct.date2Price - newProduct.date1Price;
                }

                acc.push(newProduct);
            }

            return acc;
        }, []);

        formattedData.forEach(product => {
            if (product.date1Price === 0 || product.date2Price === 0) {
                product.priceDifference = (product.date2Price || 0) - (product.date1Price || 0);
            }
        });

        setRowData(formattedData);
        setXAxisdata(formattedData.map((p) => p.productName));
        setYAxisdata1(formattedData.map((p) => p.date1QuantitySold));
        setYAxisdata2(formattedData.map((p) => p.date2QuantitySold));
    };

    // Graph
    const [xAxisdata, setXAxisdata] = useState([]);
    const [yAxisdata1, setYAxisdata1] = useState([]);
    const [yAxisdata2, setYAxisdata2] = useState([]);

    const productData = {
        labels: xAxisdata,
        datasets: [
            {
                label: `${firstDate} Sales in Quantity`,
                data: yAxisdata1,
                backgroundColor: 'rgb(135, 206, 235)',
            },
            {
                label: `${secondDate} Sales in Quantity`,
                data: yAxisdata2,
                backgroundColor: 'rgb(255, 99, 71)',
            }
        ]
    };

    useEffect(() => {
        const loadgraphdata = () => {
            if (categorized === "Product" && rowData.length > 0) {
                setXAxisdata(rowData.map((p) => p.productName));
                setYAxisdata1(rowData.map((p) => p.date1QuantitySold));
                setYAxisdata2(rowData.map((p) => p.date2QuantitySold));
            }
            else if (categorized === "Category" && rowData.length > 0) {
                const categoryData = rowData.reduce((acc, current) => {
                    const { category, date1QuantitySold, date2QuantitySold } = current;

                    if (!acc[category]) {
                        acc[category] = {
                            categoryName: category,
                            totalDate1QuantitySold: 0,
                            totalDate2QuantitySold: 0,
                        };
                    }

                    acc[category].totalDate1QuantitySold += date1QuantitySold || 0;
                    acc[category].totalDate2QuantitySold += date2QuantitySold || 0;

                    return acc;
                }, {});

                const xAxisCategories = Object.keys(categoryData);
                const yAxisQuantities1 = Object.values(categoryData).map((data) => data.totalDate1QuantitySold);
                const yAxisQuantities2 = Object.values(categoryData).map((data) => data.totalDate2QuantitySold);

                setXAxisdata(xAxisCategories);
                setYAxisdata1(yAxisQuantities1);
                setYAxisdata2(yAxisQuantities2);
            }
        }
        loadgraphdata();
    }, [categorized, rowData]);

    return (
        <div className="container">

            <div className="section1">
                <div className="subsection1">
                    <label> Categorized By : </label>
                    <select
                        value={categorized}
                        onChange={(e) => setCategorized(e.target.value)} >
                        <option value="Product">Product</option>
                        <option value="Category">Category</option>
                    </select>
                </div>
                <div className="subsection2">
                    <form onSubmit={handleCompare} className='form'>
                        <div className="datesection">
                            <div>
                                <label>Date 1 : </label>
                                <input
                                    type="date"
                                    value={firstDate}
                                    onChange={(e) => setFirstDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Date 2 : </label>
                                <input
                                    type="date"
                                    value={secondDate}
                                    onChange={(e) => setSecondDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <button type="submit" disabled={!firstDate || !secondDate ? true : false}>Compare</button>
                        </div>
                    </form>
                </div>
            </div>

            {rowData.length > 0 && (
                <div className="section2">
                    <h2 className='graphname'>{categorized === "Product" ? `Product-Level Graph` : `Category-Level Graph`}</h2>
                    <div className="graph">
                        <Bar data={productData} />
                    </div>
                </div>)}

            {rowData.length > 0 && (<div className="section3">
                <div className="ag-theme-quartz table" style={{ height: 310 }}>
                    <AgGridReact columnDefs={columnDefs} rowData={rowData} pagination={true} paginationPageSize={paginationPageSize} paginationPageSizeSelector={paginationPageSizeSelector} />
                </div>
            </div>)}

            {rowData.length <= 0 && (
                <div className="section4">
                    <h1>Please Select Dates & Click on Compare Button</h1>
                </div>
            )}

        </div>
    )
}

export default DateComparison