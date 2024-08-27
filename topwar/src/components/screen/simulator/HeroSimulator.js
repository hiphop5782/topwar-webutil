// import HeroListJson from "@src/assets/json/hero.json";
// import TargetListJson from '@src/assets/json/target.json';
import HeroListJson from "@src/assets/json/hero-skill.json";

import "./HeroSimulator.css";
import { useCallback, useEffect, useState } from "react";

function HeroSimulator() {
    const [heroList, setHeroList] = useState(HeroListJson);
    const [firstHero, setFirstHero] = useState(null);
    const [secondHero, setSecondHero] = useState(null);
    const [thirdHero, setThirdHero] = useState(null);
    const [skillLevel, setSkillLevel] = useState(0);

    //영웅 선택
    const selectFirstHero = e=>{
        setFirstHero(e.target.value === "" ? null : JSON.parse(e.target.value));
    };
    const selectSecondHero = e=>{
        setSecondHero(e.target.value === "" ? null : JSON.parse(e.target.value));
    };
    const selectThirdHero = e=>{
        setThirdHero(e.target.value === "" ? null : JSON.parse(e.target.value));
    };

    const converter = {
        atk:"공격",
        vit:"생명",
        dmg:"데증",
        red:"데감",
        def:"방어"
    };

    const slotBackup = [
        {no:1, values:{atk:0, vit:0, dmg:0, red:0, def:0}},
        {no:2, values:{atk:0, vit:0, dmg:0, red:0, def:0}},
        {no:3, values:{atk:0, vit:0, dmg:0, red:0, def:0}},
        {no:4, values:{atk:0, vit:0, dmg:0, red:0, def:0}},
        {no:5, values:{atk:0, vit:0, dmg:0, red:0, def:0}},
        {no:6, values:{atk:0, vit:0, dmg:0, red:0, def:0}},
        {no:7, values:{atk:0, vit:0, dmg:0, red:0, def:0}},
        {no:8, values:{atk:0, vit:0, dmg:0, red:0, def:0}},
        {no:9, values:{atk:0, vit:0, dmg:0, red:0, def:0}}
    ];

    const [slotList, setSlotList] = useState([...slotBackup]);
    const [targetSlotList, setTargetSlotList] = useState([...slotBackup]);

    //효과 계산
    useEffect(()=>{
        clearSlot();
        if(firstHero === null && secondHero === null && thirdHero === null) {
            return;
        }
        calculateAttack();
        calculateHp();
        calculateDmgIncrease();
        calculateDmgDecrease();
        //calculateSkill()
    }, [firstHero, secondHero, thirdHero]);

    //각종 계산
    const clearSlot = ()=>{
        setSlotList(prev=>[...slotBackup]);
    };
    const calculateAttack = ()=>{
        setSlotList(prev=>prev.map((slot, index)=>{
            let atk = 0;
            if(firstHero !== null) {
                atk += firstHero.atk.all;
                atk += firstHero.atk.slot[index];
            }
            if(secondHero !== null) {
                atk += secondHero.atk.all;
                atk += secondHero.atk.slot[index];
            }
            if(thirdHero !== null) {
                atk += thirdHero.atk.all;
                atk += thirdHero.atk.slot[index];
            }
            const newSlot = {...slot};
            newSlot.values.atk = parseFloat(atk.toFixed(2));
            return newSlot;
        }));
    };
    const calculateHp = ()=>{
        setSlotList(prev=>prev.map((slot, index)=>{
            let vit = 0;
            if(firstHero !== null) {
                vit += firstHero.vit.all;
                vit += firstHero.vit.slot[index];
            }
            if(secondHero !== null) {
                vit += secondHero.vit.all;
                vit += secondHero.vit.slot[index];
            }
            if(thirdHero !== null) {
                vit += thirdHero.vit.all;
                vit += thirdHero.vit.slot[index];
            }
            const newSlot = {...slot};
            newSlot.values.vit = parseFloat(vit.toFixed(2));
            return newSlot;
        }));
    };
    const calculateDmgIncrease = ()=>{};
    const calculateDmgDecrease = ()=>{};
    
    //이펙트 초기화
    const clearEffect = useCallback(()=>{}, []);

    return (
        <>
            <div className="row">
                <div className="col-12">
                    <h1>영웅 시뮬레이터</h1>
                    <p>영웅 정보를 슬롯별로 확인</p>
                </div>
            </div>

            <hr />

            <div className="row mt-2 text-center">
                <div className="col-6">
                    <h2>슬롯 상태</h2>
                    <div className="row mt-2">
                        <div className="col">
                            <select className="form-select" onChange={selectFirstHero}>
                                <option value="">선택하세요</option>
                                {heroList.map((hero, index) => (
                                    <option key={index} value={JSON.stringify(hero)}>{hero.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col">
                            <select className="form-select" onChange={selectSecondHero}>
                                <option value="">선택하세요</option>
                                {heroList.map((hero, index) => (
                                    <option key={index} value={JSON.stringify(hero)}>{hero.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col">
                            <select className="form-select" onChange={selectThirdHero}>
                                <option value="">선택하세요</option>
                                {heroList.map((hero, index) => (
                                    <option key={index} value={JSON.stringify(hero)}>{hero.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <h2>슬롯 상태</h2>
                    <div className="slot-list-wrapper">
                    {slotList.map((slot, index)=>(
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