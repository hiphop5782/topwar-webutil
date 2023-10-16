import JobDataJson from "@src/assets/json/job.json";
import "./JobInformation.css"

function JobInformation() {
    console.log(JobDataJson);

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
                        <input className="form-check-input" type="radio" name="job" id="radio1" value="option1" defaultChecked/>
                        <label className="form-check-label" htmlFor="radio1">
                            전투 정예 <span className="text-muted">(Combat Elite)</span>
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="job" id="radio2" value="option2"/>
                        <label className="form-check-label" htmlFor="radio2">
                            기계 전문가 <span className="text-muted">(Mechanic Master)</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-6">
                    <div className="row">
                        {JobDataJson.map(r=>(
                            <div className="col-12" key={r.row}>
                                <div className="row-inner">
                                    <span className="title">{r.row} 행</span>
                                    {r.items.map(c=>(
                                        <div key={c.col}>
                                            {c.col} {c.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>

    );
}

export default JobInformation;