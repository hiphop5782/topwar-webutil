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
const specialEffectRateList = {
    pistol: {storm:0.5, surge:0.5, awareness:1.5, searing:0.63, breaking:0.63, impact:0.63, magnetic:0.63},
    backarmor: {steel:0.5, unbreakable:0.5, hologram:1.5, flammable:0.63, heavyblow:0.63, debilitate:0.63, magnetize:0.63},
    addon: {awareness:2.5, searing:0.63, breaking:0.63, impact:0.63, magnetic:0.63},
    headset: {hologram:2.5, flammable:0.63, heavyblow:0.63, debilitate:0.63, magnetize:0.63},
    gps: {awareness:2.5, searing:0.63, breaking:0.63, impact:0.63, magnetic:0.63},
    boots: {hologram:2.5, flammable:0.63, heavyblow:0.63, debilitate:0.63, magnetize:0.63},
};
const colorList = {
    green: "#07EDA8",
    blue: "#39AEFE",
    purple: "#EB98FE",
    gold: "#FDBE61",
};
const gearNames = {
    pistol: '돌격 권총',
    backarmor: '택티컬 아머',
    addon: '시야 확장기',
    headset: '레이시온 헤드셋',
    gps: '위치 추적기',
    boots: '파워 부츠'
};
const specialEffectNames = {
    storm:"폭발의 허리케인",
    surge:"전군 돌격",
    steel:"강철의 흐름",
    unbreakable:"불굴",
    awareness:"전장 통찰",
    searing:"점화",
    breaking:"취약",
    impact:"쇠약",
    magnetic:"자기장",
    hologram:"스텔스 홀로그램",
    flammable:"인화",
    heavyblow:"헤비 스매시",
    debilitate:"진동",
    magnetize:"자석화"
};
const gearOptions = {
    pistol: [
        { title: '육군 공격력 증가', min: 0.01, max: 30.00 },
        { title: '해군 공격력 증가', min: 0.01, max: 30.00 },
        { title: '공군 공격력 증가', min: 0.01, max: 30.00 },
        { title: '육군 데미지 증가', min: 0.01, max: 6.00 },
        { title: '해군 데미지 증가', min: 0.01, max: 6.00 },
        { title: '공군 데미지 증가', min: 0.01, max: 6.00 },
    ],
    backarmor: [
        { title: '육군 생명력 증가', min: 0.01, max: 30.00 },
        { title: '해군 생명력 증가', min: 0.01, max: 30.00 },
        { title: '공군 생명력 증가', min: 0.01, max: 30.00 },
        { title: '육군 방어도 증가', min: 0.01, max: 3.00 },
        { title: '해군 방어도 증가', min: 0.01, max: 3.00 },
        { title: '공군 방어도 증가', min: 0.01, max: 3.00 },
    ],
    addon: [
        { title: '육군 공격력 증가', min: 0.01, max: 30.00 },
        { title: '해군 공격력 증가', min: 0.01, max: 30.00 },
        { title: '공군 공격력 증가', min: 0.01, max: 30.00 },
        { title: '육군 데미지 증가', min: 0.01, max: 6.00 },
        { title: '해군 데미지 증가', min: 0.01, max: 6.00 },
        { title: '공군 데미지 증가', min: 0.01, max: 6.00 },
    ],
    headset: [
        { title: '육군 생명력 증가', min: 0.01, max: 30.00 },
        { title: '해군 생명력 증가', min: 0.01, max: 30.00 },
        { title: '공군 생명력 증가', min: 0.01, max: 30.00 },
        { title: '육군 데미지 감면', min: 0.01, max: 6.00 },
        { title: '해군 데미지 감면', min: 0.01, max: 6.00 },
        { title: '공군 데미지 감면', min: 0.01, max: 6.00 },
    ],
    gps: [
        { title: '육군 공격력 증가', min: 0.01, max: 30.00 },
        { title: '해군 공격력 증가', min: 0.01, max: 30.00 },
        { title: '공군 공격력 증가', min: 0.01, max: 30.00 },
        { title: '육군 데미지 증가', min: 0.01, max: 6.00 },
        { title: '해군 데미지 증가', min: 0.01, max: 6.00 },
        { title: '공군 데미지 증가', min: 0.01, max: 6.00 },
    ],
    boots: [
        { title: '육군 생명력 증가', min: 0.01, max: 30.00 },
        { title: '해군 생명력 증가', min: 0.01, max: 30.00 },
        { title: '공군 생명력 증가', min: 0.01, max: 30.00 },
        { title: '육군 데미지 감면', min: 0.01, max: 6.00 },
        { title: '해군 데미지 감면', min: 0.01, max: 6.00 },
        { title: '공군 데미지 감면', min: 0.01, max: 6.00 },
    ]
};

const TitanResearchSimulator = () => {
    const [parts, setParts] = useState('pistol');
    const [catalyst, setCatalyst] = useState(null);
    const [count, setCount] = useState(1);
    const changeCount = useCallback((e) => {
        const value = parseInt(e.target.value);
        if (value !== NaN && value >= 1 && value <= 100) {
            setCount(value);
        }
    }, [count]);

    const successRates = useMemo(() => {
        return successRateList[catalyst || "none"];
    }, [catalyst]);
    
    const [titanResult, setTitanResult] = useState([
        // {no:1, type:'backarmor', grade:'green', options:[ {no:1, title:'해군 방어도 증가', value:0.23} ] }
        // ,{no:2, type:'backarmor', grade:'blue', options:[ {no:1, title:'해군 방어도 증가', value:0.23} ] }
        // ,{no:3, type:'backarmor', grade:'purple', options:[ {no:1, title:'해군 방어도 증가', value:0.23} ] }
        // ,{no:4, type:'backarmor', grade:'gold', options:[ {no:1, title:'해군 방어도 증가', value:0.23} ] }
        // ,{no:5, type:'backarmor', grade:'green', options:[ {no:1, title:'해군 방어도 증가', value:0.23} ] }
        // ,{no:6, type:'backarmor', grade:'blue', options:[ {no:1, title:'해군 방어도 증가', value:0.23} ] }
        // ,{no:7, type:'backarmor', grade:'purple', options:[ {no:1, title:'해군 방어도 증가', value:0.23} ] }
        // ,{no:8, type:'backarmor', grade:'gold', options:[ {no:1, title:'해군 방어도 증가', value:0.23} ] }
    ]);
    const statistics = useMemo(()=>{
        if(titanResult.length === 0) return "";
        
    }, [titanResult]);
    
    const gaussianRandomValue = useCallback((min, max, mean = (min + max) / 2, stdDev = (max - min) / 6)=> {
        let value;
        do {
            let u = 0, v = 0;
            while (u === 0) u = Math.random();  // 0 방지
            while (v === 0) v = Math.random();

            // Box-Muller 변환으로 정규분포 난수 생성
            const standardNormal = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
            value = standardNormal * stdDev + mean;
        } while (value < min || value > max);  // 범위 내 값이 나올 때까지 반복

        return parseFloat(value.toFixed(2));
    }, []);
    const gaussianRandomDecimalValue = useCallback((min, max, mean = (min + max) / 2, stdDev = (max - min) / 6)=> {
        let value;
        do {
            let u = 0, v = 0;
            while (u === 0) u = Math.random();  // 0 방지
            while (v === 0) v = Math.random();

            // Box-Muller 변환으로 정규분포 난수 생성
            const standardNormal = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
            value = standardNormal * stdDev + mean;
        } while (value < min || value > max);  // 범위 내 값이 나올 때까지 반복

        return Math.floor(value);
    }, []);
    const getWeightedRandomDecimalValue = useCallback((items, weight)=>{
        const value = Math.random();
        let acc = 0;
        for(let i=0; i < items.length; i++) {
            acc += weight[i];
            if(value < acc) return items[i];
        }
    }, []);
    const getRandomInArray = useCallback((array) => {
        if (array.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }, []);
    const getRandomValue = useCallback((begin, end) => {
        const range = end - begin;
        return parseFloat((Math.random() * range + begin).toFixed(2));
    }, []);
    const getRandomDecimalValue = useCallback((begin, end) => {
        const range = end - begin + 1;
        return Math.floor(Math.random() * range) + begin;
    }, []);

    const createRandomTitanGearOptions = useCallback(() => {
        const options = gearOptions[parts];
        //const optionsCount = getRandomDecimalValue(1, 3);
        const optionsCount = getWeightedRandomDecimalValue([1,2,3], [0.4, 0.4, 0.2]);

        const result = [];
        for (let i = 0; i < optionsCount; i++) {
            const selectedOption = getRandomInArray(options);
            //const selectedValue = getRandomValue(selectedOption.min, selectedOption.max);
            const selectedValue = gaussianRandomValue(selectedOption.min, selectedOption.max);
            
            result.push({ title: selectedOption.title, value: selectedValue });
        }
        return result;
    }, [parts]);
    const createRandomTitanGrade = useCallback(() => {
        const value = Math.random() * 100;
        let acc = successRates.gold;
        if (value < acc) return "gold";
        acc += successRates.purple;
        if (value < acc) return "purple";
        acc += successRates.blue;
        if (value < acc) return "blue";
        return "green";
    }, [successRates]);
    const createSpecialEffect = useCallback(()=>{
        const value = Math.random() * 100;
        let acc = 0;
        const rateList = specialEffectRateList[parts];
        const keys = Object.keys(rateList);
        
        for(let i=0; i < keys.length; i++) {
            acc += rateList[keys[i]];
            if(value < acc) {
                return keys[i];
            }
        }
        return null;
    }, [parts]);
    const createRandomTitanGear = useCallback((idx) => {
        const gear = { no: idx + 1 };
        gear.type = parts;
        gear.grade = createRandomTitanGrade();
        gear.options = createRandomTitanGearOptions();
        gear.specialEffect = gear.grade === 'gold' ? createSpecialEffect() : null;
        //console.log(gear);
        return gear;
    }, [parts, successRates]);

    const createRandomTitanGears = useCallback(() => {
        const result = [];
        for (let i = 0; i < count; i++) {
            result.push(createRandomTitanGear(i));
        }
        setTitanResult(result);
    }, [parts, count, successRates]);


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
                {Object.keys(successRates).map(key => (
                    <div className="progress position-relative mb-1 bg-secondary" key={key}>
                        <div className="progress-bar" role="progressbar" style={{ width: successRates[key] + "%", backgroundColor: colorList[key] }} aria-valuemin="0" aria-valuemax="100"></div>
                        <span className="position-absolute top-50 start-50 translate-middle fw-bold text-white">{successRates[key]}%</span>
                    </div>
                ))}
            </div>
        </div>
        <hr />
        <div className="row">
            <div className="col-sm-4">
                <div className="input-group">
                    <input className="form-control" placeholder="제작 횟수" value={count} onChange={changeCount} />
                    <button className="btn btn-primary" onClick={createRandomTitanGears}>제작하기</button>
                </div>
            </div>
        </div>
        <hr />
        <div className="row">
        {titanResult.map(gear => (
            <div className="col-xxl-2 col-xl-3 col-lg-4 col-sm-6" key={gear.no}>
                <div className="card mb-3 bg-dark text-light flex-row flex-sm-column">
                    <div className="card-img-top p-2 position-relative">
                        <img src={`${process.env.PUBLIC_URL}/images/titan/${gear.type}-${gear.grade}.png`} width={'100%'} />
                        {gear.specialEffect !== null && (
                        <div className="position-absolute" style={{top:'5%', left:'5%', width:'35%', height:'35%'}}>
                            <img src={`${process.env.PUBLIC_URL}/images/titan/${gear.specialEffect}.png`} width={'100%'} />
                        </div>
                        )}
                    </div>
                    <div className="card-body" style={{minWidth:'70%'}}>
                        <h5 className="card-title" style={{ color: colorList[gear.grade] }}>{gearNames[gear.type]}</h5>
                        {gear.options.map((option, _) => (
                            <div className="card-text row mb-1" key={_}>
                                <span className="col-8 text-begin text-truncate">{option.title}</span>
                                <span className="col-4 text-end text-truncate">{option.value}%</span>
                            </div>
                        ))}
                        {gear.specialEffect !== null && (<>
                            <hr/>
                            <div className="fw-bold text-info">{specialEffectNames[gear.specialEffect]}</div>
                        </>)}
                    </div>
                    
                </div>
            </div>
        ))}
        </div>
    </>);
};

export default TitanResearchSimulator;