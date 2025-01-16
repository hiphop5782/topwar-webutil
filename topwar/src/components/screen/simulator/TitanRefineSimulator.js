import colorList from "@src/assets/json/titan/titan-colors.json";
import partsList from "@src/assets/json/titan/titan-parts-types.json";
import gearNames from "@src/assets/json/titan/titan-gear-names.json";
import gearOptionList from "@src/assets/json/titan/titan-gear-options.json";
import { useCallback, useEffect, useState } from "react";

const TitanRefineSimulator = () => {
    const [parts, setParts] = useState('pistol');
    const [gearOptions, setGearOptions] = useState([
        {title:'해군 데미지 증가', value:2.5},
        {title:'공군 데미지 증가', value:3.1},
        {title:'육군 데미지 증가', value:2.4}
    ]);
    const [materialOption, setMaterialOption] = useState({title:'해군 데미지 증가', value:2.5});

    //파츠가 변경되면 기어옵션을 변경
    useEffect(()=>{
        if(!parts) return;
        
        //setGearOptions(gearOptionList[parts][0])
    }, [parts]);
    
    const addGearOptions = useCallback((e)=>{
        const option = gearOptionList[parts][0];
        const mean = (option.min + option.max) / 2;
        setGearOptions(prev=>{
            if(prev.length === 3) return prev;
            return [...prev, {title:option.title, value:parseFloat(mean.toFixed(2))}]
        });
    }, [gearOptions]);
    const removeGearOptions = useCallback((e)=>{
        setGearOptions(prev=>{
            if(prev.length === 1) return prev;
            return prev.filter((opt, idx)=>idx < prev.length-1)
        });
    }, [gearOptions]);

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
                <div className="row">
                    <div className="col-lg-6">
                        <div className="card mb-3 bg-dark text-light flex-row flex-lg-column">
                            <div className="card-img-top p-2 position-relative">
                                <img src={`${process.env.PUBLIC_URL}/images/titan/${parts}-gold.png`} width={'100%'} />
                            </div>
                            <div className="card-body" style={{ minWidth: '70%' }}>
                                <h5 className="card-title" style={{ color: colorList['gold'] }}>{gearNames[parts]}</h5>
                                {gearOptions.map((opt, idx)=>(
                                <div className="card-text row mb-1" key={idx}>
                                    <span className="col-8 text-begin text-truncate">{opt.title}</span>
                                    <span className="col-4 text-end text-truncate">{opt.value}%</span>
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
                <div className="row">
                    <div className="col-lg-6">
                        <div className="card mb-3 bg-dark text-light flex-row flex-lg-column">
                            <div className="card-img-top p-2 position-relative">
                                <img src={`${process.env.PUBLIC_URL}/images/titan/${parts}-gold.png`} width={'100%'} />
                            </div>
                            <div className="card-body" style={{ minWidth: '70%' }}>
                                <h5 className="card-title" style={{ color: colorList['gold'] }}>{gearNames[parts]}</h5>
                                <div className="card-text row mb-1">
                                    <span className="col-8 text-begin text-truncate">{materialOption.title}</span>
                                    <span className="col-4 text-end text-truncate">{materialOption.value}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </>);
};

export default TitanRefineSimulator;