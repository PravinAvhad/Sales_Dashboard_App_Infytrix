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
import "./todaysales.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TodaySales = () => {
    const [categorized, setCategorized] = useState("Product");
    const paginationPageSize = 5;
    const paginationPageSizeSelector = [5, 10, 20];

    // AG GRID Table
    const new_date = new Date();
    const padToTwoDigits = (num) => (num < 10 ? `0${num}` : num);

    const [currentDate, setCurrentDate] = useState(
        `${new_date.getFullYear()}-${padToTwoDigits(new_date.getMonth() + 1)}-${padToTwoDigits(new_date.getDate())}`);

    const [columnDefs, setColumnDefs] = useState([
        { headerName: 'Product Name', field: 'productName', sortable: true, filter: true, flex: 1 },
        { headerName: 'Category', field: 'category', sortable: true, filter: true, flex: 1 },
        { headerName: 'Quantity Sold', field: 'quantitySold', sortable: true, flex: 1 },
        { headerName: 'Sales Amount', field: 'price', sortable: true, flex: 1 }
    ]);

    const [rowData, setRowData] = useState(
        salesData.filter((p) => p.soldDate === currentDate)
    );

    // Graph
    const [xAxisdata, setXAxisdata] = useState([]);
    const [yAxisdata, setYAxisdata] = useState([]);
    const productData = {
        labels: xAxisdata,
        datasets: [
            {
                label: `Sales in Quantity`,
                data: yAxisdata,
                backgroundColor: 'rgb(135, 206, 235)',
            }
        ]
    };

    useEffect(() => {
        const loadgraphdata = () => {
            if (categorized === "Product" && rowData.length > 0) {
                setXAxisdata(rowData.map((p) => p.productName));
                setYAxisdata(rowData.map((p) => p.quantitySold));
            }
            else if (categorized === "Category" && rowData.length > 0) {
                const categoryData = rowData.reduce((acc, current) => {
                    const category = current.category;
                    if (!acc[category]) {
                        acc[category] = {
                            categoryName: category,
                            totalQuantitySold: 0
                        };
                    }
                    acc[category].totalQuantitySold += current.quantitySold;
                    return acc;
                }, {});

                const xAxisCategories = Object.keys(categoryData);
                const yAxisQuantities = Object.values(categoryData).map((data) => data.totalQuantitySold);

                setXAxisdata(xAxisCategories);
                setYAxisdata(yAxisQuantities);
            }
        }
        loadgraphdata();
    }, [categorized, rowData]);

    return (
        <>
            {
                rowData.length > 0 ? (
                    <div className="container">

                        <div className="section1">
                            <div className="subsection">
                                <label> Categorized By : </label>
                                <select
                                    value={categorized}
                                    onChange={(e) => setCategorized(e.target.value)} >
                                    <option value="Product">Product</option>
                                    <option value="Category">Category</option>
                                </select>
                            </div>
                        </div>

                        <div className="section2">
                            <h2 className='graphname'>{categorized === "Product" ? `Product-Level Graph` : `Category-Level Graph`}</h2>
                            <div className="graph">
                                <Bar data={productData} />
                            </div>
                        </div>

                        <div className="section3">
                            <div className="ag-theme-quartz table" style={{ height: 310 }}>
                                <AgGridReact columnDefs={columnDefs} rowData={rowData} pagination={true} paginationPageSize={paginationPageSize} paginationPageSizeSelector={paginationPageSizeSelector}
                                />
                            </div>
                        </div>
                    </div >
                ) : (
                    <div className="nodata">No Data Available</div>
                )
            }
        </>
    )
}

export default TodaySales