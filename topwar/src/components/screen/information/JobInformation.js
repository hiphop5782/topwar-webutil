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
                            return {...colItem, choice:!c.choice};
                        }
                        return colItem;
                    })
                };
            }
            return rowItem;
        }));
    };

    //시간 더하기
    const plusTime = (a, b)=>{
        const arr = a.match(/\d+/g);
        const brr = b.match(/\d+/g);
        const crr = arr.map((a,i)=>parseInt(a)+parseInt(brr[i]));
        const size = [0, 24, 60, 60];
        for(let i=crr.length-1; i > 0; i--) {
            const div = parseInt(crr[i] / size[i]);
            const mod = parseInt(crr[i] % size[i]);
            crr[i] = mod;
            crr[i-1] += div;
        }
        return `${crr[0]}일 ${crr[1]}시간 ${crr[2]}분 ${crr[3]}초`;
    };

    //업그레이드 체크 이벤트
    const checkUpgrades = (dis, upgrade, checked)=>{
        setDisplay(prev=>prev.map(p=>{
            if(p.row === dis.row && p.col === dis.col) {
                return {
                    ...p, 
                    upgrades:p.upgrades.map(u=>{
                        if(u.level == upgrade.level) {
                            return {
                                ...u, 
                                choice:checked,
                            };
                        }
                        return {...u};
                    })
                };
            }
            return p;
        }));
        
        setDisplay(prev=>prev.map(p=>{
            if(p.row === dis.row && p.col === dis.col) {
                return {
                    ...p, 
                    allCheck:p.upgrades.reduce((sum,n) => {
                        return sum && (n.level ===upgrade.level ? checked : n.choice);
                    }, true),
                    subtotal:p.upgrades.reduce((sum, cur)=>{
                        if(cur.choice) {
                            return {
                                oil:sum.oil + cur.oil,
                                food:sum.food + cur.food,
                                item:sum.item + cur.item,
                                time:plusTime(sum.time, cur.time)
                            };
                        }
                        return {...sum};
                    }, {
                        oil:0, food:0, item:0, time:"0일 0시간 0분 0초"
                    })
                };
            }
            return p;
        }));
    };

    //전체선택
    const allCheck = (d, checked)=>{
        setDisplay(prev=>prev.map(display=>{
            if(display.row === d.row && display.col === d.col) {
                return {
                    ...display, 
                    allCheck: checked,
                    upgrades:display.upgrades.map(u=>{
                        return {...u, choice:checked};
                    })
                };
            }
            return display;
        }));
        setDisplay(prev=>prev.map(p=>{
            if(p.row === d.row && p.col === d.col) {
                return {
                    ...p, 
                    subtotal:p.upgrades.reduce((sum, cur)=>{
                        if(cur.choice) {
                            return {
                                oil:sum.oil + cur.oil,
                                food:sum.food + cur.food,
                                item:sum.item + cur.item,
                                time:plusTime(sum.time, cur.time)
                            };
                        }
                        return {...sum};
                    }, {
                        oil:0, food:0, item:0, time:"0일 0시간 0분 0초"
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
                                <thead className="text-end">
                                    <tr>
                                        <th className="text-center"><input type="checkbox" checked={d.allCheck} onChange={e=>allCheck(d, e.target.checked)}/></th>
                                        <th className="text-center">레벨</th>
                                        <th>석유</th>
                                        <th>식량</th>
                                        <th>시간</th>
                                    </tr>
                                </thead>
                                <tbody className="text-end">
                                    {d.upgrades.map((item, index)=>(
                                        <tr key={index}>
                                            <td className="text-center">
                                                <input type="checkbox" checked={item.choice} onChange={e=>checkUpgrades(d, item, e.target.checked)}/>
                                            </td>
                                            <td className="text-center">{item.level}</td>
                                            <td>{numberFormat(item.oil)}</td>
                                            <td>{numberFormat(item.food)}</td>
                                            <td>{item.time}</td>
                                        </tr>
                                    ))}
                                    {!d.subtotal === false? 
                                        <tr>
                                            <td colSpan={2} className="text-center">합계</td>
                                            <td>{numberFormat(d.subtotal.oil)}</td>
                                            <td>{numberFormat(d.subtotal.food)}</td>
                                            <td>{d.subtotal.time}</td>
                                        </tr>
                                    : false}
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