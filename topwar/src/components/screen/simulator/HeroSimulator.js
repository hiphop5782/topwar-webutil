import HeroListJson from "@src/assets/json/hero.json";
import TargetListJson from '@src/assets/json/target.json';

import "./HeroSimulator.css";
import { useCallback, useEffect, useState } from "react";

function HeroSimulator() {
    const [heroList, setHeroList] = useState(HeroListJson);
    const [hero, setHero] = useState(null);
    const selectHero = useCallback(e=> {
        setHero(!e.target.value ? null : JSON.parse(e.target.value));
    }, []);
    const [skillLevel, setSkillLevel] = useState(0);

    const converter = {
        atk:"공격",
        vit:"생명",
        dmg:"데증",
        red:"데감",
        def:"방어"
    };

    const [mySlotList, setMySlotList] = useState([
        {no:1, values:{atk:0, vit:0, dmg:0, red:0, def:0}},
        {no:2, values:{atk:0, vit:0, dmg:0, red:0, def:0}},
        {no:3, values:{atk:0, vit:0, dmg:0, red:0, def:0}},
        {no:4, values:{atk:0, vit:0, dmg:0, red:0, def:0}},
        {no:5, values:{atk:0, vit:0, dmg:0, red:0, def:0}},
        {no:6, values:{atk:0, vit:0, dmg:0, red:0, def:0}},
        {no:7, values:{atk:0, vit:0, dmg:0, red:0, def:0}},
        {no:8, values:{atk:0, vit:0, dmg:0, red:0, def:0}},
        {no:9, values:{atk:0, vit:0, dmg:0, red:0, def:0}}
    ]);
    const [targetSlotList, setTargetSlotList] = useState([
        {no:1, values:{atk:0, vit:0, dmg:0, red:0, def:0}},
        {no:2, values:{atk:0, vit:0, dmg:0, red:0, def:0}},
        {no:3, values:{atk:0, vit:0, dmg:0, red:0, def:0}},
        {no:4, values:{atk:0, vit:0, dmg:0, red:0, def:0}},
        {no:5, values:{atk:0, vit:0, dmg:0, red:0, def:0}},
        {no:6, values:{atk:0, vit:0, dmg:0, red:0, def:0}},
        {no:7, values:{atk:0, vit:0, dmg:0, red:0, def:0}},
        {no:8, values:{atk:0, vit:0, dmg:0, red:0, def:0}},
        {no:9, values:{atk:0, vit:0, dmg:0, red:0, def:0}}
    ]);

    //효과 계산
    useEffect(()=>{
        if(hero == null) {
            clearEffect();
            return;
        }
        calculateInternalEffect();
        calculateReadyEffect();
        calculateActiveEffect();
        calculatePassiveEffect();
    }, [hero, skillLevel]);
    const calculateInternalEffect = useCallback(()=>{}, []);
    const calculateReadyEffect = useCallback(()=>{
        
    }, []);
    const calculateActiveEffect = useCallback(()=>{}, []);
    const calculatePassiveEffect = useCallback(()=>{}, []);
    
    //이펙트 초기화
    const clearEffect = useCallback(()=>{

    }, []);

    //하이라이트 기능
    const highlight = useCallback(str=>{
        const str2 = highlightNumber(str);
        const str3 = highlightSkill(str2);
        return str3;
    }, []);
    const highlightNumber = useCallback(str=>{
        return str.replace(/(\d+(\.\d+)?)/g, "<span class='highlight-number'>$1</span>");
    }, []);
    const highlightSkill = useCallback(str=>{
        return str.replace(/(\[[가-힣\s]+\])/g, "<span class='highlight-skill'>$1</span>")
    }, []);

    return (
        <>
            <div className="row">
                <div className="col-12">
                    <h1>영웅 시뮬레이터</h1>
                    <p>영웅 정보를 슬롯별로 확인</p>
                </div>
            </div>

            <hr />

            <div className="row mt-2">
                <label className="col-md-3 col-form-label">
                    영웅 선택
                </label>
                <div className="col-md-9">
                    <select className="form-select" onChange={selectHero}>
                        <option value="">선택하세요</option>
                        {heroList.map((hero, index) => (
                            <option key={index} value={JSON.stringify(hero)}>{hero.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {hero !== null && 
            <div className="row mt-2">
                <div className="offset-3 col-1">
                    <label><input type="radio" name="skill" checked={skillLevel == 0} onChange={e=>setSkillLevel(0)}/> 0</label>
                </div>
                <div className="col-1">
                    <label><input type="radio" name="skill" checked={skillLevel == 3} onChange={e=>setSkillLevel(3)}/> 3</label>
                </div>
                <div className="col-1">
                    <label><input type="radio" name="skill" checked={skillLevel == 5} onChange={e=>setSkillLevel(5)}/> 5</label>
                </div>
                <div className="col-1">
                    <label><input type="radio" name="skill" checked={skillLevel == 7} onChange={e=>setSkillLevel(7)}/> 7</label>
                </div>
            </div>}

            <hr/>
            {hero !== null && 
            <div className="row">
                {hero.skill.internal && <div className="col-12"><span className="badge bg-secondary">내정</span><span className="ms-1" dangerouslySetInnerHTML={{__html:highlight(hero.skill.internal)}}></span></div>}
                {hero.skill.ready && <div className="col-12"><span className="badge bg-primary">준비</span><span className="ms-1" dangerouslySetInnerHTML={{__html:highlight(hero.skill.ready)}}></span></div>}
                {hero.skill.active && <div className="col-12"><span className="badge bg-success">액티브</span><span className="ms-1" dangerouslySetInnerHTML={{__html:highlight(hero.skill.active)}}></span></div>}
                {hero.skill.passive && <div className="col-12"><span className="badge bg-info">패시브</span><span className="ms-1" dangerouslySetInnerHTML={{__html:highlight(hero.skill.passive)}}></span></div>}
                {hero.skill.level3 && <div className="col-12"><span className="badge bg-warning">3레벨</span><span className="ms-1" dangerouslySetInnerHTML={{__html:highlight(hero.skill.level3)}}></span></div>}
                {hero.skill.level5 && <div className="col-12"><span className="badge bg-warning">5레벨</span><span className="ms-1" dangerouslySetInnerHTML={{__html:highlight(hero.skill.level5)}}></span></div>}
                {hero.skill.level7 && <div className="col-12"><span className="badge bg-danger">7레벨</span><span className="ms-1" dangerouslySetInnerHTML={{__html:highlight(hero.skill.level7)}}></span></div>}
            </div>}

            <div className="row mt-2 text-center">
                <div className="col-6">
                    <h2>나</h2>
                    <div className="slot-list-wrapper">
                    {mySlotList.map((slot, index)=>(
                    <div className="slot-wrapper" key={slot.no}>
                        <div className="slot-status">
                            {Object.keys(slot.values).map((key)=>(
                                <div key={key} className="d-flex">
                                    <div className="col-6">{converter[key]}</div>
                                    <div className="col-6">{slot.values[key]}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    ))}
                    </div>
                </div>
                <div className="col-6">
                    <h2 className="text-center">상대</h2>
                    <div className="slot-list-wrapper">
                    {targetSlotList.map((slot, index)=>(
                    <div className="slot-wrapper" key={slot.no}>
                        <div className="slot-status">
                            {Object.keys(slot.values).map((key)=>(
                                <div key={key} className="d-flex">
                                    <div className="col-6">{converter[key]}</div>
                                    <div className="col-6">{slot.values[key]}</div>
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

export default HeroSimulator;