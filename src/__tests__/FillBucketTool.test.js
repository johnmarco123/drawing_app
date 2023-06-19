import { FillBucketTool } from "../FillBucketTool"

test("Should Pass", () => {
    let pixels = [];
    let color = [0, 0, 0, 255];
    for(let i = 0; i < 3581424; i++) {
        pixels.push(color);
    }

    let b = new FillBucketTool();
    // let start = performance.now()
    // let time = performance.now() - start; 
    // console.log(time)
    // expect(time).toBeLessThan(2000);
})
