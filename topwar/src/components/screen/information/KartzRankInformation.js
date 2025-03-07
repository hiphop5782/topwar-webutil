import KartzRankerList from "@src/assets/json/kartz/2025-02-24.json";

import { Chart as ChartJS, ArcElement, Tooltip, Legend, plugins } from 'chart.js';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pie } from 'react-chartjs-2';

// Chart.js 요소 등록 (ArcElement 필수!)
ChartJS.register(ArcElement, Tooltip, Legend);

const provideDates = [
    '2025-02-24',
];

const chartBackgroundColors = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b',
    '#e377c2', '#7f7f7f', '#bcbd22', '#17becf', '#aec7e8', '#ffbb78',
    '#98df8a', '#ff9896', '#c5b0d5', '#c49c94', '#f7b6d2', '#c7c7c7',
    '#dbdb8d', '#9edae5'
];

const KartzRankInformation = () => {

    const [provideDate, setProvideDate] = useState(provideDates[0]);
    const [jsonData, setJsonData] = useState(null);

    const chartRef = useRef(null);
    const [chartHeight, setChartHeight] = useState("300px");

    const rendered = useRef(false);
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            animationScale: true,
            animationRotate: true,
            onComplete: function(){
                if(!chartRef.current) return;
                if(rendered.current) return;

                const canvas = chartRef.current.querySelector("canvas");
                if(canvas !== null) {
                    setChartHeight(canvas.height+"px");
                    rendered.current = true;
                }
            },
        },
        plugins: {
            legend: {
                display: false,
                position: "left",
                labels: {
                    filter: (legendItem, chartData) => legendItem.index < 5,
                }
            }
        }
    };

    const [total, setTotal] = useState(0);

    useEffect(()=>{
        if(!provideDate) return;

        const jsonFiles = require.context("../../../assets/json/kartz", false, /\.json$/);
        const jsonFileData = jsonFiles(`./${provideDate}.json`);
        setJsonData(jsonFileData);


    }, [provideDate]);

    const [countList, setCountList] = useState([]);

    useEffect(()=>{
        if(jsonData == null) return;

        const countObject = {};
        const accObject = {};
        let total = 0;
        jsonData.forEach(data=>{
            if(!countObject[data.server]) {
                countObject[data.server] = 1;
                accObject[data.server] = data.stage;
            }
            else {
                countObject[data.server]++;
                accObject[data.server] += data.stage;
            }
            total += data.stage;
        });
        setTotal(total);
        const average = total / 500;

        const weightObject = {};
        jsonData.forEach(data=>{
            if(!weightObject[data.server]) {
                weightObject[data.server] = Math.pow(Math.max(data.stage - average, 0), 2);
            }
            else {
                weightObject[data.server] += Math.pow(Math.max(data.stage - average, 0), 2);
            }
        });

        const serverData = Object.entries(countObject).map(([key,value]) => ({
            server:Number(key),
            count:value,
            average:accObject[key] / value,
            point: weightObject[key],
        }));
        
        setCountList(serverData.sort((a, b)=>b.count - a.count));
    }, [jsonData]);

    const chartData = useMemo(()=>{
        if(countList === null || countList.length === 0) return null;
        const obj = {
            labels:[],
            datasets:[
                {
                    data:[],
                    backgroundColor:chartBackgroundColors
                }
            ]
        };
        countList.forEach(data=>{
            if(data.count <= 5) return true;
            obj.labels.push(String(data.server));
            obj.datasets[0].data.push(data.count);
        });
        return obj;
    }, [countList]);

    const numberWithCommas = useCallback((x)=>{
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }, []);

    const getBackgroundColor = useCallback((index)=>{
        switch(index+1) {
            case 1: return "#FFD700";
            case 2: return "#C0C0C0";
            case 3: return "#CD7F32";
            default: return "";
        }
    }, []);
    const getForegroundColor = useCallback((index)=>{
        switch(index+1) {
            //case 1: return "#8B7500";
            //case 2: return "#6E6E6E";
            //case 3: return "#5A3A22";
            default: return "";
        }
    }, []);

    const [sort, setSort] = useState("count");
    const sortByCount = useCallback(()=>{
        const copy = [...countList];
        setCountList(copy.sort((a,b)=>b.count-a.count));
        setSort("count");
    }, [countList]);
    const sortByAverage = useCallback(()=>{
        const copy = [...countList];
        setCountList(copy.sort((a,b)=>b.average-a.average));
        setSort("average");
    }, [countList]);
    const sortByPoint = useCallback(()=>{
        const copy = [...countList];
        setCountList(copy.sort((a,b)=>b.point-a.point));
        setSort("point");
    }, [countList]);
    const expandTable = useCallback(()=>{
        setChartHeight("auto");
    }, [chartHeight]);

    return (<>
        <h1>
            카르츠 분석
            <select className="form-select w-auto d-inline-block ms-2">
                {provideDates.map(d=>(<option key={d}>{d}</option>))}
            </select>
        </h1>
        <div className="text-muted">차트에는 랭커가 <span className="text-danger fw-bold">5</span>명 이상인 서버만 표시됩니다</div>
        <div className="text-muted">랭커는 카르츠 <span className="text-danger fw-bold">1~500</span>등을 기록한 유저를 말합니다</div>
        <div className="text-muted">랭커는 평균 <span className="text-danger fw-bold">{(total / 500).toFixed(2)}</span>스테이지까지 도전했습니다</div>
        <hr />
        <div className="row mt-4">
            <div className="col-sm-6">
                <div ref={chartRef}>
                    {chartData !== null && <Pie data={chartData} options={chartOptions} height={300}/>}
                </div>
            </div>
            <div className="col-sm-6" style={{height:`${chartHeight}`, overflowY:"auto"}}>
                <table className="table table-striped">
                    <thead style={{position:"sticky", top:0, zIndex:99}}>
                        <tr>
                            <th className="text-center">Rank</th>
                            <th className="text-center">Server</th>
                            <th className="text-center" onClick={sortByCount}>
                                {sort === "count" ? (
                                    <span className="text-primary">Count↓</span>
                                ):(
                                    <span>Count</span>
                                )}
                            </th>
                            <th className="text-center" onClick={sortByAverage}>
                                {sort === "average" ? (
                                    <span className="text-primary">Avg↓</span>
                                ):(
                                    <span>Avg</span>
                                )}
                            </th>
                            <th className="text-end" onClick={sortByPoint}>
                                {sort === "point" ? (
                                    <span className="text-primary">*Point↓</span>
                                ):(
                                    <span>*Point</span>
                                )}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {countList.map((obj,index)=>(    
                        <tr key={obj.server}>
                            <td className="text-center" style={{backgroundColor:getBackgroundColor(index), color:getForegroundColor(index)}}>
                                <b>{index+1}</b>
                            </td>
                            <td className="text-center" style={{backgroundColor:getBackgroundColor(index), color:getForegroundColor(index)}}>
                                <b>{obj.server}</b>
                            </td>
                            <td className="text-center" style={{backgroundColor:getBackgroundColor(index), color:getForegroundColor(index)}}>
                                {numberWithCommas(obj.count)}
                            </td>
                            <td className="text-center" style={{backgroundColor:getBackgroundColor(index), color:getForegroundColor(index)}}>
                                {obj.average.toFixed(2)}
                            </td>
                            <td className="text-end" style={{backgroundColor:getBackgroundColor(index), color:getForegroundColor(index)}}>
                                {numberWithCommas(parseFloat(obj.point.toFixed(2)))}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="text-end text-danger">
                {chartHeight === "auto" ? (
                <span role="button" onClick={e=>setChartHeight(chartRef.current.querySelector("canvas").height+"px")}>↑접기↑</span>
                ) : (
                <span role="button" onClick={e=>setChartHeight("auto")}>↓펼치기↓</span>
                )}
            </div>
        </div>
        <hr/>
        <div className="text-muted">Avg는 서버의 랭커 평균 도전 스테이지입니다</div>
        <div className="text-muted">*Point는 랭커 평균 스테이지보다 많이 클리어한 유저에게 부여한 가중치 합계입니다.</div>
        <div className="text-muted">*Point = <b>( | 유저의 클리어 스테이지 - 랭커 평균 | )²</b> </div>
    </>)
};

export default KartzRankInformation;