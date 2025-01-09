import "./TitanResearchSimulator.css";
import { useCallback, useMemo, useState } from "react";

const partsList = ['pistol', 'backarmor', 'addon', 'headset', 'gps', 'boots'];
const catalystList = ['top', 'advanced', 'mid'];
const successRateList = {
    top: { green: 0.0, blue: 0.0, purple: 0.0, gold: 100.0 },
    advanced: { green: 0.0, blue: 0.0, purple: 85.0, gold: 15.0 },
    mid: { green: 0.0, blue: 80.0, purple: 15.0, gold: 5.0 },
    none: { green: 55.0, blue: 35.0, purple: 9.5, gold: 0.5 }
};
const colorList = {
    green:"#07EDA8",
    blue:"#39AEFE",
    purple:"#EB98FE",
    gold:"#FDBE61",
}

const TitanResearchSimulator = () => {

    const [parts, setParts] = useState('pistol');
    const [catalyst, setCatalyst] = useState(null);

    const successRates = useMemo(()=>{
        return successRateList[catalyst || "none"];
    }, [catalyst]);


    return (<>
        <h1>타이탄 제작</h1>
        <hr />
        <div className="row">
            <div className="col-sm-6">
                <div className="d-flex align-items-center flex-wrap">
                    <span className="fs-3 me-4">제작부위</span>
                    <span>
                        <span className="pointer-field">
                            {partsList.map(part => (<img key={part} src={`${process.env.PUBLIC_URL}/images/titan/titan-item-${part}.png`} onClick={e => setParts(part)} className={`catalyst-img${parts === part ? ' active' : ''}`} />))}
                        </span>
                    </span>
                </div>
                <div className="d-flex align-items-center flex-wrap">
                    <span className="fs-3 me-4">촉매제</span>
                    <span>
                        <span className="pointer-field">
                            {catalystList.map(tier => (<img key={tier} src={`${process.env.PUBLIC_URL}/images/titan/titan-catalyst-${tier}.png`} onClick={e => setCatalyst(tier)} className={`catalyst-img${catalyst === tier ? ' active' : ''}`} />))}
                        </span>
                        <span className="ms-4 pointer-field text-danger" onClick={e => setCatalyst(null)}>
                            취소
                        </span>
                    </span>
                </div>
            </div>
            <div className="col-sm-6">
                {Object.keys(successRates).map(key=>(
                    <div className="progress position-relative mb-1 bg-secondary" key={key}>
                        <div className="progress-bar" role="progressbar" style={{width:successRates[key]+"%", backgroundColor:colorList[key]}} aria-valuemin="0" aria-valuemax="100"></div>
                        <span className="position-absolute top-50 start-50 translate-middle fw-bold text-white">{successRates[key]}%</span>
                    </div>
                ))}
            </div>
        </div>
    </>);
};

export default TitanResearchSimulator;