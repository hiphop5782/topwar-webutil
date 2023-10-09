import baseTypeJson from "@src/assets/json/base-type.json";
import baseListJson from "@src/assets/json/base.json";
import "./BaseInformation.css";
import { useCallback, useState } from "react";

function BaseInformation() {
    const [baseTypes, setBaseTypes] = useState(baseTypeJson);
    const [baseList, setBaseList] = useState(baseListJson);

    const clickBadge = useCallback((index, active) => {
        const copy = [...baseTypes];
        copy[index].active = !active;
        setBaseTypes([...copy]);
    }, []);

    const getBadgeStyle = useCallback((baseTypes) => {
        if (baseTypes.active) {
            return `badge border border-${baseTypes.color} bg-${baseTypes.color} me-1`;
        }
        else {
            return `badge border border-${baseTypes.color} text-${baseTypes.color} me-1`
        }
    }, []);

    return (
        <>
            <div className="row">
                <div className="col">
                    <h1>기지 정보</h1>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    {
                        baseTypes.map((t, i) => (
                            <span className={getBadgeStyle(t)} key={t.no}
                                onClick={e => clickBadge(i, t.active)}>{t.value}</span>
                        ))
                    }
                </div>
            </div>
            <hr />
            <div className="row mb-4">
                <div className="col">
                    총 <span className="text-info">{baseList.length}</span>개의 기지가 등록되어 있습니다.
                </div>
            </div>
            <div className="row">
                {baseList.map(b => (
                    <div key={b.no} style={{width:200}}>
                        <div className="card mb-3">
                            <h5 className="card-header text-truncate">{b.name}</h5>
                            <img src={`${process.env.PUBLIC_URL}/images/base/${b.no}.png`} height={200}/>
                            <div className="card-body">
                                <p className="card-text"></p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default BaseInformation;