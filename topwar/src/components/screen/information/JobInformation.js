import JobDataJson from "@src/assets/json/job.json";
import "./JobInformation.css"
import { useCallback, useEffect, useState } from "react";

function JobInformation() {
    const [job, setJob] = useState("CL");
    const [jobData, setJobData] = useState(JobDataJson);
    const [display, setDisplay] = useState([]);
    const numberFormat = useCallback(n=>{
        return Intl.NumberFormat('en-US', {
            notation: "compact",
            maximumFractionDigits: 2
        }).format(n);
    }, []);

    useEffect(()=>{
        setDisplay([]);
        setJobData(JobDataJson);
    }, [job])

    //항목 체크 이벤트
    const checkItem = (r, c) => {
        setDisplay(prev=> c.choice ? 
            prev.filter(p=>p.col !== c.col) : prev.concat({...c, row:r.row})
        );
        setJobData(prev=>prev.map(rowItem=>{
            if(rowItem.row === r.row) {
                return {
                    ...rowItem, 
                    items:rowItem.items.map(colItem=>{
                        if(colItem.col === c.col) {
                            return {...colItem, choice:!colItem.choice};
                        }
                        return colItem;
                    })
                };
            }
            return rowItem;
        }));
    };

    const checkUpgrades = (dis, item, checked)=>{
        setDisplay(prev=>prev.map(p=>{
            if(p.row === dis.row && p.col === dis.col) {
                return {
                    ...p, 
                    upgrades:p.upgrades.map(u=>{
                        return {
                            ...u, 
                            choice:checked
                        };
                    })
                };
            }
            return p;
        }));
    };

    return (
        <>
            <div className="row">
                <div className="col-12">
                    <h1>전문 직업 강화</h1>
                </div>
            </div>
            <hr />
            <div className="row mt-4">
                <div className="col-12">
                직업을 선택하세요
                </div>
                <div className="col-12 mt-2">
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="job" id="radio1" value="CL" defaultChecked onChange={e=>setJob(e.target.value)}/>
                        <label className="form-check-label" htmlFor="radio1">
                            전투 정예 <span className="text-muted">(Combat Elite)</span>
                        </label>
                    </div>
                    {/* <div className="form-check">
                        <input className="form-check-input" type="radio" name="job" id="radio2" value="MM" onChange={e=>setJob(e.target.value)}/>
                        <label className="form-check-label" htmlFor="radio2">
                            기계 전문가 <span className="text-muted">(Mechanic Master)</span>
                        </label>
                    </div> */}
                </div>
            </div>

            <div className="row mt-4">
                
                {/* 스킬트리 */}
                <div className="col-sm-4">
                    <div className="row">
                        {jobData.map(r=>(
                            <div className="col-12" key={r.row}>
                                <div className="row-inner">
                                    <span className="title">{r.row} 행</span>
                                    {r.items.map(c=>(
                                        <div key={c.col} className="col-4">
                                            <label className={`col-inner ${c.choice ? 'active' : false}`} onClick={e=>checkItem(r, c)}>
                                                {/* <span className="title">{c.col} 열</span> */}
                                                <div className="content">
                                                    <img src={`${process.env.PUBLIC_URL}/images/job/${job}-${r.row}-${c.col}.png`}/>
                                                </div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 스킬상세 */}
                <div className="col-sm-8">
                    {display.length > 0 ? 
                        display.map((d, i)=>
                        <div className="box p-3" key={i}>
                            
                            <h3>
                                <img src={`${process.env.PUBLIC_URL}/images/job/${job}-${d.row}-${d.col}.png`} width={50} height={50}/>
                                &nbsp;&nbsp;
                                {d.name}
                            </h3>

                            <table className="table table-striped">
                                <thead className="text-center">
                                    <tr>
                                        <th></th>
                                        <th>레벨</th>
                                        <th>석유</th>
                                        <th>식량</th>
                                        <th>시간</th>
                                    </tr>
                                </thead>
                                <tbody className="text-end">
                                    {d.upgrades.map((item, index)=>(
                                        <tr key={index}>
                                            <td>
                                                <input type="checkbox" defaultChecked={item.choice} onChange={e=>checkUpgrades(d, item, e.target.checked)}/>
                                            </td>
                                            <td className="text-center">{item.level}</td>
                                            <td>{numberFormat(item.oil)}</td>
                                            <td>{numberFormat(item.food)}</td>
                                            <td>{item.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div> )
                    : false}
                </div>
            </div>
        </>

    );
}

export default JobInformation;