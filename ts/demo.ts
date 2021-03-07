import { ready, newInstance } from "@jsplumb/browser-ui"
import { Connection, EVENT_CLICK } from "@jsplumb/core"

ready(() => {

    const canvas = document.getElementById("canvas")

    const instance = newInstance({
        connector: "Straight",
        paintStyle: { strokeWidth: 3, stroke: "#ffa500", "dashstyle": "2 4" },
        endpoint: { type:"Dot", options:{ radius: 5 } },
        endpointStyle: { fill: "#ffa500" },
        container: canvas,
        listStyle:{
            endpoint:{type:"Rectangle", options:{ width:30, height:30 }}
        }
    });

    // get the two elements that contain a list inside them
    const list1El = document.querySelector("#list-one"),
        list2El = document.querySelector("#list-two"),
        list1Ul = list1El.querySelector("ul"),
        list2Ul = list2El.querySelector("ul");

    instance.manage(list1El);
    instance.manage(list2El);

    // get uls
    const lists = document.querySelectorAll("ul");

    // suspend drawing and initialise.
    instance.batch(function () {

        const selectedSources = [], selectedTargets = [];

        for (let l = 0; l < lists.length; l++) {

            const isSource = lists[l].getAttribute("source") != null,
                isTarget = lists[l].getAttribute("target") != null

            // configure items
            const items = lists[l].querySelectorAll("li")
            for (let i = 0; i < items.length; i++) {

                if (isSource) {
                    instance.makeSource(items[i], {
                        allowLoopback: false,
                        anchor: ["Left", "Right" ]
                    });

                    if (Math.random() < 0.2) {
                        selectedSources.push(items[i]);
                    }
                }

                if (isTarget) {
                    instance.makeTarget(items[i], {
                        anchor: ["Left", "Right" ]
                    });
                    if (Math.random() < 0.2) {
                        selectedTargets.push(items[i]);
                    }
                }
            }
        }

        const connCount = Math.min(selectedSources.length, selectedTargets.length);
        for (let i = 0; i < connCount; i++) {
            instance.connect({source:selectedSources[i], target:selectedTargets[i]});
        }
    });

    // configure list1Ul manually, as it does not have a `jtk-scrollable-list` attribute, whereas list2Ul does, and is therefore
    // configured automatically.
    instance.addList(list1Ul, {
        endpoint:{type:"Rectangle", options:{width:20, height:20}}
    });


    instance.bind(EVENT_CLICK, (c:Connection) => { instance.deleteConnection(c) })

    instance.on(document as any, "change", "[type='checkbox']", (e:Event) => {
        instance[(e.srcElement as any).checked ? "addList" : "removeList"]((e.srcElement as any).value === "list1" ? list1Ul : list2Ul);
    });
});
