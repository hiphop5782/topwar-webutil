import "./FormationPerk.css";
import FormationPerkJson from "@src/assets/json/formation-perk.json";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DataSet } from "vis-data";
import { Network } from "vis-network";
import { cloneDeep } from "lodash";

import { RiResetLeftFill } from "react-icons/ri";

const FormationPerk = () => {
    const containerRef = useRef(null);
    const [offset, setOffset] = useState(100);
    const [json, setJson] = useState(FormationPerkJson);
    const [nodes, setNodes] = useState(null);
    const [edges, setEdges] = useState(null);
    const [oneTouch, setOneTouch] = useState(true);

    useEffect(() => {
        // 네트워크 데이터를 정의합니다
        if (nodes === null || edges === null) {
            setNodes(new DataSet(json.nodes.map(node => {
                const id = node.id;
                const depth = parseInt(id / 10);
                const position = parseInt(id % 10);
                return {
                    id: node.id,
                    x: offset * position,
                    y: offset * depth,
                    fixed: { x: true, y: true },
                    shape: "image",
                    size: 30,
                    image: `${process.env.PUBLIC_URL}/images/formation/perk/${node.id}-${node.level.current}.png`
                };
            })));

            setEdges(new DataSet(json.edges));
        }
        else {
            const updates = json.nodes.map(node=>{
                const connectedEdges = edges.get({
                    filter:edge=> (node.level.current > 0 && edge.to === node.id)
                });
                const targetEdges = connectedEdges.map(edge=>({
                    id: edge.id,
                    color: "#81ecec"
                }));
                edges.update(targetEdges);

                return {
                    id : node.id, 
                    image: `${process.env.PUBLIC_URL}/images/formation/perk/${node.id}-${node.level.current}.png`
                }
            });
            nodes.update(updates);

            
        }
    }, [json]);

    useEffect(() => {
        const options = {
            layout: {
                // hierarchical:{
                //     direction:'UD',
                //     sortMethod:'directed'
                // },
            },
            nodes: {
                shape: 'dot',
                size: 15
            },
            edges: {
                color: '#dfe6e9',
                width: 2
            },
            physics: {
                enabled: false
            },
            manipulation: {
                enabled: false,
            },
            interaction: {
                hover: false,
                zoomView: true,
            },
        };

        // 네트워크 초기화
        const network = new Network(containerRef.current, { nodes, edges }, options);
        network.moveTo({ scale: 1.5, position: { x: offset * 2, y: offset * 1 } });

        //선행조건 (interaction - hover=true)
        //network.on("hoverNode", (event) => {});
        network.on("click", event => {
            if (event.nodes.length > 0) {
                const nodeId = event.nodes[0];
                handleNodeClick(nodeId);
            }
        });

        return () => {
            network.destroy();  // 컴포넌트 언마운트 시 네트워크 리소스를 정리합니다
        };
    }, [nodes, oneTouch, edges]);

    const handleNodeClick = (nodeId, full = false) => {
        if (!nodes || !edges) return;

        // [1] 클릭한 지점의 current level이 0인 경우 해당 노드까지 모두 활성화하도록 구현
        if(oneTouch === true) {
            setJson((prevJson) => {
                const updatedJson = cloneDeep(prevJson);
                updatedJson.nodes = updatedJson.nodes.map((node) => {
                    if (node.id === nodeId) {
                        if (node.level.current === node.level.max) return node;
    
                        const connectedUpperEdges = edges.get({
                            filter: (edge) => edge.to === nodeId,
                        });
                        if (connectedUpperEdges.length > 0) {
                            connectedUpperEdges.forEach(edge => handleNodeClick(edge.from, true));
                        }
                        return {
                            ...node,
                            level: {
                                ...node.level,
                                current: full === true ? node.level.max : node.level.current + 1
                            },
                        };
                    }
                    return node;
                });
                return updatedJson;
            });
        }
        else {
            // [2] 게임과 동일하게 한 개씩 클릭하여 시뮬레이션 하도록 구현
            const connectedUpperEdges = edges.get({
                filter: (edge) => edge.to === nodeId,
            });
            setJson((prevJson) => {
                const condition = connectedUpperEdges.every((edge) => {
                    const targets = prevJson.nodes.filter((node) => node.id === edge.from);
                    return targets.every((target) => target.level.current === target.level.max);
                });
    
                if (!condition) return prevJson;
    
                const updatedJson = cloneDeep(prevJson);
                updatedJson.nodes = updatedJson.nodes.map((node) => {
                    if (node.id === nodeId) {
                        return {
                            ...node,
                            level: {
                                ...node.level,
                                current: Math.min(node.level.current + 1, node.level.max),
                            },
                        };
                    }
                    return node;
                });
                return updatedJson;
            });
        }
    
    };

    const numberWithCommas = useCallback((x)=>{
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }, []);

    const clearPoint = useCallback(() => {
        setJson(FormationPerkJson);
    }, [json]);

    //calculate total perk point
    const totalPoint = useMemo(() => {
        const value = json.nodes.reduce((p, n) => p + (n.level.current * n.level.point), 0);
        return numberWithCommas(value);
    }, [json.nodes]);

    return (<>
        <h1>군진 특성(Formation Perk)</h1>
        <hr />
        <div className="form-check">
            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" 
                onChange={e=>setOneTouch(true)} checked={oneTouch === true}/>
            <label className="form-check-label" htmlFor="flexRadioDefault1">
                원터치 모드(원하는 곳을 클릭하면 해당 지점까지 한번에 습득)
            </label>
        </div>
        <div className="form-check">
            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" 
                onChange={e=>setOneTouch(false)} checked={oneTouch === false}/>
            <label className="form-check-label" htmlFor="flexRadioDefault2">
                인게임 모드(실제 게임과 동일하게 하나씩 클릭하여 습득)
            </label>
        </div>
        <hr/>
        <h2>
            사용한 포인트 : {totalPoint} pt
            <RiResetLeftFill onClick={clearPoint} className="text-danger fs-bold ms-2" />
        </h2>
        <div ref={containerRef} id="graph-viewer" style={{backgroundImage:`url(${process.env.PUBLIC_URL}/images/formation/perk/background.png)`}}></div>
    </>);
};

export default FormationPerk;