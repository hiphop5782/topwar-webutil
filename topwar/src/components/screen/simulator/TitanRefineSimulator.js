import colorList from "@src/assets/json/titan/titan-colors.json";
import partsList from "@src/assets/json/titan/titan-parts-types.json";
import gearNames from "@src/assets/json/titan/titan-gear-names.json";
import gearOptionList from "@src/assets/json/titan/titan-gear-options.json";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa"
import { FaXmark } from "react-icons/fa6";

import "./TitanRefineSimulator.css";
import "animate.css";

const TitanRefineSimulator = () => {
    const [parts, setParts] = useState('pistol');
    const [gearOptions, setGearOptions] = useState([]);
    const [materialOption, setMaterialOption] = useState({ title: '육군 데미지 증가', value: 2.5 });

    const [editingOption, setEditingOption] = useState({title:'', value:0.0});
    const [editingMaterialOption, setEditingMaterialOption] = useState({title:'', value:0.0});

    //파츠가 변경되면 기어옵션을 변경
    useEffect(() => {
        if (!parts) return;

        //console.log(gearOptionList[parts][3]);
        const option = gearOptionList[parts][3];
        const mean = parseFloat(parseFloat((option.min + option.max) / 2).toFixed(2));
        setGearOptions([{
            title:option.title,
            value: mean
        }]);

        setMaterialOption({title:option.title, value:mean});
    }, [parts]);

    const addGearOptions = useCallback((e) => {
        const option = gearOptionList[parts][3];
        const mean = parseFloat(parseFloat((option.min + option.max) / 2).toFixed(2));
        setGearOptions(prev => {
            if (prev.length === 3) return prev;
            return [...prev, { title: option.title, value: mean }]
        });
    }, [gearOptions]);
    const removeGearOptions = useCallback((e) => {
        setGearOptions(prev => {
            if (prev.length === 1) return prev;
            return prev.filter((opt, idx) => idx < prev.length - 1)
        });
    }, [gearOptions]);

    const changeGearOption = useCallback((opt, idx) => {
        setGearOptions(prev => prev.map((option, index) => {
            if (index === idx) {
                const obj = { ...option, edit: true };
                setEditingOption(obj)
                return obj;
            }
            return {...option, edit:false};
        }));
    }, [editingOption, gearOptions]);

    const confirmChangeGearOption = useCallback((opt, idx)=>{
        setGearOptions(prev => prev.map((option, index) => {
            if (index === idx) {
                return {...editingOption, edit:false};
            }
            return {...option};
        }));
    }, [editingOption, gearOptions]);
    const cancelChangeGearOption = useCallback((opt, idx)=>{
        setGearOptions(prev => prev.map((option, index) => {
            if (index === idx) {
                return { ...option, edit: false };
            }
            return option;
        }));
    }, [gearOptions]);
    
    const changeEditingOptionTitle = useCallback(e=>{
        setEditingOption(prev=>({
            ...editingOption,
            title:e.target.value
        }));
    }, [editingOption]);
    const changeEditingOptionValue = useCallback(e=>{
        const value = e.target.value;
        if(isNaN(value)) return;

        setEditingOption(prev=>({
            ...editingOption,
            value:parseFloat(parseFloat(value).toFixed(2))
        }));
    }, [editingOption]);

    const changeMaterialOption = useCallback(()=>{
        setMaterialOption(prev=>({...prev, edit:true}));
        setEditingMaterialOption({...materialOption});
    }, [materialOption]);
    const changeEditingMaterialOptionTitle = useCallback((e)=>{
        const title = e.target.value;
        const option = gearOptionList[parts].filter(opt=>opt.title === title)[0];
        //console.log("parts", parts, "title", title, "option", gearOptionList[parts]);
        const mean = parseFloat(parseFloat((option.min + option.max) / 2).toFixed(2));
        setEditingMaterialOption(prev=>({title:title, value:mean}));
    }, [editingMaterialOption, parts]);
    const changeEditingMaterialOptionValue = useCallback((e)=>{
        setEditingMaterialOption(prev=>({...prev, value:e.target.value}));
    }, [editingMaterialOption]);
    const confirmChangeMaterialOption = useCallback(()=>{
        setMaterialOption(prev=>({...editingMaterialOption, edit:false}));
        setEditingMaterialOption({title:'', value:0.0});
    }, [materialOption, editingMaterialOption]);
    const cancelChangeMaterialOption = useCallback(()=>{
        setMaterialOption(prev=>({...prev, edit:false}));
        setEditingMaterialOption({title:'', value:0.0});
    }, [materialOption, editingMaterialOption]);


    const editing = useMemo(()=>{
        return gearOptions.reduce((p, n) => {
            return p || (n?.edit === true);
        }, false) || materialOption.edit;
    }, [gearOptions, materialOption]);

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

    const combineOptions = useCallback((prevOption, newOption)=>{
        if(prevOption.title !== newOption.title) {
            return {...newOption};
        }

        if(prevOption.value < newOption.value) {
            return {...newOption};
        }

        const refineValue = prevOption.value + gaussianRandomValue(newOption.value / 10 , newOption.value / 4);//10~25%로 임의지정
        //console.log("parts", parts);
        //console.log("maxValue", gearOptionList[parts].filter(opt=>opt.title === newOption.title));
        const maxValue = gearOptionList[parts].filter(opt=>opt.title === newOption.title)[0].max;
        
        return {...prevOption, value:Math.min(refineValue, maxValue), max : refineValue >= maxValue};
    }, [parts]);


    const refining = useRef(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [animation, setAnimation] = useState(true);
    const refine = useCallback(()=>{
        refining.current = true;

        const copy = [...gearOptions];
        //재련할 옵션과 같으면서 max가 아닌 index 찾기
        const indexList = copy.map((opt, idx)=>(opt?.title === materialOption.title && opt?.max === true) ? -1 : idx).filter(idx=>idx!==-1);

        //없으면 중지
        if(copy.length === 3 && indexList.length === 0) return;

        //없는 index 보충
        if(copy.length < 3) {
            indexList.push(copy.length);    
        }
        
        const index = indexList[Math.floor(Math.random() * indexList.length)];
        
        if(copy[index] === undefined) {//신규
            copy[index] = materialOption;
        }
        else {
            const option = copy[index];
    
            //옵션이름이 다르면 덮어쓰기, 같으면 수치비교 후 합성
            const refineOption = combineOptions(option, materialOption);
            copy[index] = refineOption;
        }

        setGearOptions(copy);
        setSelectedIndex(index);
        refining.current = false;
    }, [parts, gearOptions, materialOption, animation]);


    

    return (<>
        <h1>타이탄 재련</h1>
        <hr />
        <div className="row">
            <div className="col">
                <div className="d-flex align-items-center flex-wrap">
                    <span className="fs-3 me-4">제작부위</span>
                    <span>
                        <span className="pointer-field">
                            {partsList.map(part => (<img key={part} src={`${process.env.PUBLIC_URL}/images/titan/titan-item-${part}.png`} onClick={e => setParts(part)} className={`catalyst-img${parts === part ? ' active' : ''}`} />))}
                        </span>
                    </span>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-sm-6">
                <h2>
                    <span className="me-2">타이탄 설정</span>
                    <span role="button" className="text-primary fs-6" onClick={addGearOptions}>옵션추가</span>
                    <span role="button" className="text-danger fs-6 ms-2" onClick={removeGearOptions}>옵션제거</span>
                </h2>
                <div className="text-muted">*옵션 클릭 시 변경 가능</div>
                <div className="row">
                    <div className="col">
                        <div className="card mb-3 bg-dark text-light flex-row">
                            <div className="card-img-top p-2 position-relative">
                                <img src={`${process.env.PUBLIC_URL}/images/titan/${parts}-gold.png`} width={'100%'} />
                            </div>
                            <div className="card-body" style={{ minWidth: '70%' }}>
                                <h5 className="card-title" style={{ color: colorList['gold'] }}>{gearNames[parts]}</h5>
                                {gearOptions.map((opt, idx) => (
                                    <div className={`${selectedIndex===idx?'select-effect ':''}card-text row mb-1`} key={idx}>
                                        {opt?.edit === true ? (<>
                                            <div className="input-group">
                                                <select className="form control form-control-sm col-8" onChange={changeEditingOptionTitle} value={editingOption.title}>
                                                    {gearOptionList[parts].map((option, i)=>(
                                                        <option key={i}>{option.title}</option>
                                                    ))}
                                                </select>
                                                <input type="number" className="form-control form-control-sm col-4 text-end" value={editingOption.value} 
                                                            onChange={changeEditingOptionValue} min={0} step={0.01}/>
                                                <span className="ms-1">%</span>
                                            </div>
                                            <div className="text-end">
                                                <FaCheck className="text-success fs-6" onClick={e=>confirmChangeGearOption(opt, idx)}/>
                                                <FaXmark className="text-danger ms-2 fs-6" onClick={e=>cancelChangeGearOption(opt, idx)}/>
                                            </div>
                                        </>) : (<>
                                            <span className="col-8 text-begin text-truncate" role="button" onClick={e => changeGearOption(opt, idx)}>{opt.title}</span>
                                            <span className="col-4 text-end text-truncate" role="button" onClick={e => changeGearOption(opt, idx)}>{opt.value.toFixed(2)}%</span>
                                        </>)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-sm-6">
                <h2>
                    <span className="me-2">재료 설정</span>
                </h2>
                <div className="text-muted">*옵션 클릭 시 변경 가능</div>
                <div className="row">
                    <div className="col">
                        <div className="card mb-3 bg-dark text-light flex-row">
                            <div className="card-img-top p-2 position-relative">
                                <img src={`${process.env.PUBLIC_URL}/images/titan/${parts}-gold.png`} width={'100%'} />
                            </div>
                            <div className="card-body" style={{ minWidth: '70%' }}>
                                <h5 className="card-title" style={{ color: colorList['gold'] }}>{gearNames[parts]}</h5>
                                <div className="card-text row mb-1">
                                    {materialOption.edit === true ? (<>
                                    <div className="input-group">
                                        <select className="form control form-control-sm col-8" onChange={changeEditingMaterialOptionTitle} value={editingMaterialOption.title}>
                                            {gearOptionList[parts].map(option=>(
                                                <option>{option.title}</option>
                                            ))}
                                        </select>
                                        <input type="number" className="form-control form-control-sm col-4 text-end" value={editingMaterialOption.value} 
                                                    onChange={changeEditingMaterialOptionValue} min={0} step={0.01}/>
                                        <span className="ms-1">%</span>
                                    </div>
                                    <div className="text-end">
                                        <FaCheck className="text-success fs-6" onClick={confirmChangeMaterialOption}/>
                                        <FaXmark className="text-danger ms-2 fs-6" onClick={cancelChangeMaterialOption}/>
                                    </div>
                                    </>) : (<>
                                    <span className="col-8 text-begin text-truncate" onClick={changeMaterialOption}>{materialOption.title}</span>
                                    <span className="col-4 text-end text-truncate" onClick={changeMaterialOption}>{materialOption.value}%</span>
                                    </>)}
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="row">
            <div className="col">
                <button type="button" className="btn btn-primary btn-lg w-100" onClick={refine} disabled={editing === true && refining.current === false}>재련</button>
            </div>
        </div>

    </>);
};

export default TitanRefineSimulator;