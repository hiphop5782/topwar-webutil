import "./FormationPerk.css";
import FormationPerkJson from "@src/assets/json/formation-perk.json";
import { useCallback, useEffect, useRef, useState } from "react";

import { DataSet, Network } from "vis-network/standalone";


const FormationPerk = () => {
    const containerRef = useRef(null);
    const [offset, setOffset] = useState(100);
    const [json, setJson] = useState(FormationPerkJson);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    useEffect(() => {
        // 네트워크 데이터를 정의합니다
        if(nodes.length === 0) {
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
            console.log("effect = ", json.nodes[0]);
            json.nodes.forEach(node=>{
                nodes.update({
                    id : node.id, 
                    image: `${process.env.PUBLIC_URL}/images/formation/perk/${node.id}-${node.level.current}.png`
                });
            });
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
                color: '#000000',
                width: 2
            },
            physics: {
                enabled: false
            },
            manipulation: {
                enabled: false,
            },
            interaction: {
                hover: true,
                zoomView: true,
            },
        };

        // 네트워크 초기화
        const network = new Network(containerRef.current, { nodes, edges }, options);
        network.moveTo({ scale: 1.5, position: { x: offset * 2, y: offset * 1 } });

        network.on("hoverNode", (event) => {//선행조건 (interaction - hover=true)
            
        });
        network.on("click", clieckNodeHandler);

        return () => {
            network.destroy();  // 컴포넌트 언마운트 시 네트워크 리소스를 정리합니다
        };
    }, [nodes, edges]);

    const clieckNodeHandler = useCallback((event) => {
        if (event.nodes.length > 0) {
            const nodeId = event.nodes[0];
            const node = nodes.get(nodeId);

            const connectedUpperEdges = edges.get({
                filter:(edge)=>{
                    return edge.to === nodeId;
                }
            });
            
            const condition = connectedUpperEdges.every(edge=>{
                const targets = json.nodes.filter(node=>node.id === edge.from);
                return targets.every(target=>target.level.current === target.level.max);
            });
            if(condition === false) return;

            console.log("handler = ", json.nodes[0]);

            setJson({
                ...json, 
                nodes:json.nodes.map(node=>{
                    if(node.id === nodeId) {
                        return {
                            ...node, 
                            level:{
                                ...node.level,
                                current:node.level.current < node.level.max ? node.level.current + 1 : node.level.max
                            }
                        };
                    }
                    return {...node};
                })
            })
        }
    }, [json, nodes]);

    return (<>
        <h1>Formation Perk</h1>
        <div ref={containerRef} id="graph-viewer"></div>
    </>);
};

export default FormationPerk;